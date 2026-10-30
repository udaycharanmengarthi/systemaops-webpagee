// src/services/payments.service.js
//
// Persistence + email-delivery state machine for consultation payments.
//
// Concurrency model (works across concurrent deliveries AND multiple app
// instances, because every decision is a single conditional DB update):
//
//   1. recordPayment()  — insert-or-ignore on the UNIQUE session id, then
//                         merge payment facts. Duplicates collapse.
//   2. claimEmail()     — ONE compare-and-set update. Only the caller whose
//                         update modified exactly 1 row may send.
//   3. markEmailSent()  — written ONLY after the provider confirms success.
//   4. markEmailFailed()— records the failure so Stripe's retry can re-claim.
//
// Delivery semantics: AT-LEAST-ONCE. See docs/stripe-payments.md.

import crypto from "node:crypto";

import StripePayment, { EMAIL_LEASE_MS } from "../models/StripePayment.js";
import StripeWebhookEvent, {
  WEBHOOK_EVENT_LEASE_MS,
} from "../models/StripeWebhookEvent.js";
import { sendAdminEmail } from "./mail.service.js";
import {
  PAYMENTS_NOT_CONFIGURED_MESSAGE,
} from "../config/payments.js";

/* Keep stored diagnostics short and free of PII. */
export const sanitizeError = (value, fallback = "unknown_error") => {
  const text = typeof value === "string" ? value : "";
  const cleaned = text
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return fallback;
  return cleaned.slice(0, 200);
};

const eventKey = (eventId) =>
  typeof eventId === "string" && eventId ? eventId.slice(0, 255) : null;

/**
 * Claim exclusive processing of one Stripe event id.
 *
 * Returns:
 *   { decision: "claimed", claimId }       — this caller owns processing
 *   { decision: "duplicate", status }      — already processed/ignored
 *   { decision: "in_progress" }            — another live worker owns it
 *   { decision: "missing_id" }             — invalid verified event
 *
 * Failed or stale claims are reclaimable, so Stripe retries are never lost.
 */
export const claimWebhookEvent = async ({
  eventId,
  eventType,
  sessionId = null,
  now = new Date(),
}) => {
  const id = eventKey(eventId);
  if (!id) return { decision: "missing_id" };

  const claimId = crypto.randomUUID();
  const leaseExpiresAt = new Date(now.getTime() + WEBHOOK_EVENT_LEASE_MS);
  const base = {
    event_id: id,
    event_type: typeof eventType === "string" ? eventType.slice(0, 120) : "unknown",
    stripe_session_id: typeof sessionId === "string" ? sessionId.slice(0, 255) : null,
    status: "processing",
    claim_id: claimId,
    attempts: 1,
    lease_expires_at: leaseExpiresAt,
    last_error: null,
  };

  try {
    await StripeWebhookEvent.create(base);
    return { decision: "claimed", claimId };
  } catch (error) {
    if (!error || error.code !== 11000) throw error;
  }

  const existing = await StripeWebhookEvent.findOne({ event_id: id }).lean();
  if (!existing) {
    /* Extremely unlikely (deleted between insert and read): let Stripe
       retry rather than processing without a ledger row. */
    return { decision: "in_progress" };
  }

  if (existing.status === "processed" || existing.status === "ignored") {
    return { decision: "duplicate", status: existing.status };
  }

  if (
    existing.status === "processing" &&
    existing.lease_expires_at &&
    existing.lease_expires_at > now
  ) {
    return { decision: "in_progress" };
  }

  const claimed = await StripeWebhookEvent.findOneAndUpdate(
    {
      event_id: id,
      $or: [
        { status: "failed" },
        {
          status: "processing",
          $or: [
            { lease_expires_at: null },
            { lease_expires_at: { $lt: now } },
          ],
        },
      ],
    },
    {
      $set: {
        status: "processing",
        claim_id: claimId,
        lease_expires_at: leaseExpiresAt,
        last_error: null,
      },
      $inc: { attempts: 1 },
    },
    { new: true }
  );

  if (claimed) return { decision: "claimed", claimId };
  return { decision: "in_progress" };
};

/** Record the terminal state of an event claim. Stale claims are ignored. */
export const markWebhookEvent = async ({
  eventId,
  claimId,
  status,
  error = null,
}) => {
  const id = eventKey(eventId);
  if (!id || !claimId) return null;

  const allowed = ["processed", "ignored", "failed"];
  if (!allowed.includes(status)) {
    throw new Error("Invalid webhook event status");
  }

  return StripeWebhookEvent.findOneAndUpdate(
    { event_id: id, claim_id: claimId },
    {
      $set: {
        status,
        lease_expires_at: null,
        last_error:
          status === "failed" ? sanitizeError(error, "webhook_failed") : null,
      },
    },
    { new: true }
  );
};

/**
 * Insert-or-ignore on the unique session id, then apply verified facts.
 *
 * Returns { payment, created }. Concurrent duplicate deliveries all read
 * the same row: `created` is true for exactly one of them, but every caller
 * still gets a usable document.
 */
export const recordPayment = async ({
  session,
  paymentStatus,
  eventId = null,
  consultationId = null,
  priceId = null,
  quantity = null,
}) => {
  const sessionId = session.id;
  const facts = {
    payment_intent_id:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id || null,
    consultation_id: consultationId || null,
    price_id: priceId || null,
    quantity: Number.isSafeInteger(quantity) ? quantity : null,
    amount_total: Number.isFinite(session.amount_total)
      ? session.amount_total
      : null,
    currency: typeof session.currency === "string" ? session.currency : null,
    customer_email:
      typeof session.customer_details?.email === "string" &&
      session.customer_details.email
        ? session.customer_details.email
        : null,
    /* Optional: Stripe omits it when the customer leaves the name blank
       on hosted Checkout. Never required. */
    customer_name:
      typeof session.customer_details?.name === "string" &&
      session.customer_details.name.trim()
        ? session.customer_details.name.trim()
        : null,
    last_event_id: eventKey(eventId),
  };

  /* Insert-or-ignore: a duplicate key means another delivery created it
     first — never an error. */
  let created = false;
  try {
    await StripePayment.create({
      stripe_session_id: sessionId,
      payment_status: paymentStatus,
      email_status: "pending",
      email_attempts: 0,
      ...facts,
    });
    created = true;
  } catch (error) {
    if (error && error.code === 11000) {
      created = false;
    } else {
      throw error;
    }
  }

  /* Merge verified payment facts. payment_status is only ever written from
     a signature-verified event by design. */
  const payment = await StripePayment.findOneAndUpdate(
    {
      stripe_session_id: sessionId,
      /* A late async-failure delivery must never downgrade a verified paid
         state. A later verified success can still promote failed -> paid. */
      ...(paymentStatus === "failed" ? { payment_status: { $ne: "paid" } } : {}),
    },
    {
      $set: {
        payment_status: paymentStatus,
        ...facts,
      },
      $setOnInsert: {},
    },
    { new: true }
  );

  return { payment, created };
};

/**
 * Atomically claim the right to send the confirmation email.
 *
 * Wins the claim when email_status is 'pending'/'failed', or when a
 * 'sending' lease has expired (crashed worker). Returns the claimed
 * document, or null when another delivery already owns it / it was sent.
 */
export const claimEmail = async ({ sessionId, now = new Date() }) => {
  const leaseExpiresAt = new Date(now.getTime() + EMAIL_LEASE_MS);

  const claimed = await StripePayment.findOneAndUpdate(
    {
      stripe_session_id: sessionId,
      $or: [
        { email_status: { $in: ["pending", "failed"] } },
        {
          email_status: "sending",
          $or: [{ email_lease_expires_at: null }, { email_lease_expires_at: { $lt: now } }],
        },
      ],
    },
    {
      $set: {
        email_status: "sending",
        email_lease_expires_at: leaseExpiresAt,
      },
      $inc: { email_attempts: 1 },
    },
    { new: true }
  );

  return claimed;
};

/** Mark delivered. ONLY ever call after the provider confirmed success. */
export const markEmailSent = async ({ sessionId, sentAt = new Date() }) =>
  StripePayment.findOneAndUpdate(
    { stripe_session_id: sessionId },
    {
      $set: {
        email_status: "sent",
        email_sent_at: sentAt,
        email_lease_expires_at: null,
        last_error: null,
      },
    },
    { new: true }
  );

/** Record a delivery failure so a retry can re-claim and resend. */
export const markEmailFailed = async ({ sessionId, error }) =>
  StripePayment.findOneAndUpdate(
    { stripe_session_id: sessionId },
    {
      $set: {
        email_status: "failed",
        email_lease_expires_at: null,
        last_error: sanitizeError(error),
      },
    },
    { new: true }
  );

/* ── Confirmation email content ──────────────────────────────────────────
   Amount, currency and reference come from the VERIFIED session only.
   Copy states what happened and the next step; it never promises a
   booking, a slot or a time (booking is out of scope). */

const formatAmount = (amountTotal, currency) => {
  if (!Number.isFinite(amountTotal) || !currency) return null;
  try {
    const amount = amountTotal / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: String(currency).toUpperCase(),
    }).format(amount);
  } catch {
    return null;
  }
};

/* Email bodies are HTML: escape anything Stripe gave us that could be
   customer-controlled (name) before it reaches the markup. */
const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const buildConfirmationEmail = ({ session, payment }) => {
  const reference = session.id;
  const intentReference =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id || null;
  const amountLabel = formatAmount(
    payment.amount_total,
    payment.currency
  );

  /* Name is optional (Stripe allows a blank name on hosted Checkout). */
  const firstName = String(payment.customer_name || "")
    .trim()
    .split(/\s+/)[0]
    .slice(0, 60);
  const greeting = firstName ? `Hi ${firstName},` : "Hello,";
  const escapedGreeting = escapeHtml(greeting);

  const rows = [
    ["Name", payment.customer_name || "Not provided"],
    ["Amount", amountLabel || "See Stripe receipt"],
    ["Currency", (payment.currency || "—").toUpperCase()],
    ["Checkout session", reference],
  ];
  if (intentReference) rows.push(["Payment intent", intentReference]);

  const rowsHtml = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#475569;font-size:14px;">${escapeHtml(label)}</td>` +
        `<td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  const subject = `Payment received — consultation (${reference})`;

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:30px;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:700px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;">
    <div style="background:#0f172a;color:#ffffff;padding:25px;text-align:center;">
      <h2 style="margin:0;font-size:20px;">Payment received</h2>
    </div>
    <div style="padding:30px;">
      <p style="margin:0 0 16px;color:#0f172a;font-size:15px;">
        ${escapedGreeting}
      </p>
      <p style="margin:0 0 16px;color:#0f172a;font-size:15px;">
        Thank you. We have received your consultation payment.
      </p>
      <table style="border-collapse:collapse;width:100%;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px;">
        ${rowsHtml}
      </table>
      <p style="margin:20px 0 0;color:#475569;font-size:14px;line-height:1.6;">
        Next step: we will follow up by email about the consultation.
        No call or meeting time is reserved by this payment.
      </p>
      <p style="margin:16px 0 0;color:#64748b;font-size:13px;">
        Keep the session reference above for your records. Your Stripe
        receipt contains the full billing detail.
      </p>
    </div>
    <div style="text-align:center;padding:20px;background:#f8fafc;color:#64748b;font-size:13px;">
      SystemaOps
    </div>
  </div>
</body>
</html>`;

  const text = [
    "Payment received — consultation.",
    "",
    greeting,
    "",
    `Name: ${payment.customer_name || "Not provided"}`,
    `Amount: ${amountLabel || "see Stripe receipt"}`,
    `Currency: ${(payment.currency || "—").toUpperCase()}`,
    `Checkout session: ${reference}`,
    ...(intentReference ? [`Payment intent: ${intentReference}`] : []),
    "",
    "Next step: we will follow up by email about the consultation.",
    "No call or meeting time is reserved by this payment.",
  ].join("\n");

  return { subject, html, text };
};

/**
 * Attempt confirmation delivery for a paid payment.
 *
 * Returns one of:
 *   { outcome: "sent" }     — provider confirmed; email_status = 'sent'
 *   { outcome: "already" }  — somebody already delivered it
 *   { outcome: "busy" }     — another delivery holds the live lease
 *   { outcome: "failed" }   — provider failed; email_status = 'failed'
 *   { outcome: "no_email" } — verified session had no customer email
 */
export const deliverConfirmationEmail = async ({ session }) => {
  const sessionId = session.id;

  const claimed = await claimEmail({ sessionId });
  if (!claimed) {
    const current = await StripePayment.findOne({
      stripe_session_id: sessionId,
    }).lean();
    if (current?.email_status === "sent") {
      return { outcome: "already" };
    }
    /* Still 'sending' with a live lease: another delivery owns it. */
    return { outcome: "busy" };
  }

  if (!claimed.customer_email) {
    await markEmailFailed({
      sessionId,
      error: "no_customer_email",
    });
    return { outcome: "no_email" };
  }

  const { subject, html, text } = buildConfirmationEmail({
    session,
    payment: claimed,
  });

  let result;
  try {
    /* Idempotency key derived from the session id: a Stripe retry that
       re-sends after an ambiguous provider response is deduplicated by
       the email provider instead of producing a duplicate email. */
    result = await sendAdminEmail({
      to: claimed.customer_email,
      subject,
      html,
      text,
      idempotencyKey: `payment-confirmation-${sessionId}`,
    });
  } catch (error) {
    /* sendAdminEmail swallows provider errors and returns a status, so
       this is defensive only (never let it become an unhandled throw). */
    await markEmailFailed({
      sessionId,
      error: sanitizeError(error?.message, "email_exception"),
    });
    return { outcome: "failed" };
  }

  if (result && result.sent === true) {
    await markEmailSent({ sessionId });
    return { outcome: "sent" };
  }

  /* `skipped` means email is not configured: that is a delivery failure,
     not a success. Stripe will retry and the row stays 'failed'. */
  await markEmailFailed({
    sessionId,
    error: result?.skipped
      ? "email_not_configured"
      : "email_provider_error",
  });
  return { outcome: "failed" };
};

export { PAYMENTS_NOT_CONFIGURED_MESSAGE };
