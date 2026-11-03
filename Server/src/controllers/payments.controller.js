// src/controllers/payments.controller.js
//
// Public endpoints:
//   GET  /api/payments/offer — the server-configured Price for display.
//   POST /api/payments/create-checkout-session — returns a Stripe Checkout
//     URL for ONE linked consultation and ONE server-configured line item.
//   GET  /api/payments/session/:sessionId — read-only normalized status for
//     the success page. It never writes payment state.
//   POST /api/payments/webhook — signature-verified. The ONLY place that
//     may write payment status or trigger the confirmation email.
//
// There is no "mark as paid" and no "resend email": those would let anyone
// fake a payment.
//
// Commercial invariants:
//   * the browser never supplies a Price ID, amount, currency or quantity;
//   * checkout always contains exactly one line item, quantity 1;
//   * a session is linked to a real consultation BEFORE its URL is returned;
//   * the webhook only processes a session already stored against that
//     consultation, and re-verifies amount/currency/Price/quantity against
//     Stripe (not merely against the event payload);
//   * synthetic Stripe CLI fixtures (no app metadata / no stored link) are
//     ignored and never create orders, payments or emails.

import crypto from "node:crypto";

import Consultation from "../models/Consultation.js";
import StripePayment from "../models/StripePayment.js";
import {
  getPaymentsConfig,
  getPriceValidationIssues,
  isLiveMode,
  isPaymentsConfigured,
  offerFromPrice,
  PAYMENTS_NOT_CONFIGURED_MESSAGE,
} from "../config/payments.js";
import { getPaymentProvider } from "../services/paymentProvider.js";
import {
  claimWebhookEvent,
  deliverConfirmationEmail,
  markWebhookEvent,
  recordPayment,
} from "../services/payments.service.js";
import {
  formatMinorUnits,
  normalizeCurrency,
} from "../utils/currency.js";

const APP_METADATA = "systemaops-consultation";
const CHECKOUT_LOCK_MS = 30 * 1000;

/* Fields a client must never be allowed to influence. Ignoring them was the
   old behaviour; rejecting them makes a mis-wired client fail loudly instead
   of silently charging the server Price. */
const CLIENT_COMMERCIAL_FIELDS = [
  "price",
  "priceId",
  "price_id",
  "amount",
  "amountMinor",
  "amount_minor",
  "currency",
  "quantity",
  "line_items",
  "lineItems",
  "unit_amount",
  "unitAmount",
];

const notConfigured = (res) => {
  /* Names only — never values. This is what makes a missing staging/production
     env var diagnosable from `docker compose logs backend` instead of a
     generic 503 in the browser. */
  const { missing } = getPaymentsConfig();
  logPaymentEvent("error", "payments_not_configured", {
    missing,
    mode: isLiveMode() ? "live" : "test",
  });
  return res.status(503).json({
    success: false,
    message: PAYMENTS_NOT_CONFIGURED_MESSAGE,
  });
};

/* Structured, PII-free payment logs. Never pass an email, name, secret,
   webhook body or raw provider error into `fields`. */
const logPaymentEvent = (level, event, fields = {}) => {
  const line = { scope: "payments", event, ...fields };
  try {
    console[level](JSON.stringify(line));
  } catch {
    console[level](`payments ${event}`);
  }
};

const stripeErrorFields = (error) => ({
  errorType: (error && (error.type || error.name)) || "unknown",
  errorCode: (error && error.code) || "",
  /* Safe correlation id from Stripe; never an API key or payload. */
  requestId: (error && (error.requestId || error.raw?.requestId)) || "",
  statusCode: (error && (error.statusCode || error.raw?.statusCode)) || "",
});

const cleanField = (value, max) => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
};

const cleanObjectId = (value) => {
  const raw = cleanField(value, 64);
  return /^[a-f0-9]{24}$/i.test(raw) ? raw : null;
};

const isPlainObject = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const paymentIntentId = (session) =>
  typeof session?.payment_intent === "string"
    ? session.payment_intent
    : session?.payment_intent?.id || null;

/**
 * Retrieve the configured Stripe Price and validate it. A wrong Price ID,
 * an inactive/recurring/tiered/custom Price, a mode mismatch, or an invalid
 * fixed amount must fail closed before any Checkout Session is created.
 */
const validateConfiguredPrice = async (provider, priceId) => {
  if (typeof priceId !== "string" || !priceId.startsWith("price_")) {
    return { ok: false, reasons: ["price_id_missing"] };
  }

  let price;
  try {
    price = await provider.retrievePrice(priceId);
  } catch (error) {
    logPaymentEvent("error", "stripe_price_retrieval_failed", {
      priceId,
      mode: isLiveMode() ? "live" : "test",
      ...stripeErrorFields(error),
    });
    throw error;
  }

  const reasons = getPriceValidationIssues(price, {
    priceId,
    live: isLiveMode(),
  });
  const expected = reasons.length === 0 ? offerFromPrice(price) : null;
  const formattedAmount =
    expected && formatMinorUnits(expected.amountMinor, expected.currency);
  if (expected && !formattedAmount) {
    reasons.push("price_currency_unsupported");
  }

  return {
    ok: reasons.length === 0 && Boolean(expected) && Boolean(formattedAmount),
    price,
    expected,
    offer: expected
      ? {
          amountMinor: expected.amountMinor,
          currency: expected.currency,
          formattedAmount,
          quantity: expected.quantity,
        }
      : null,
    reasons,
  };
};

const resolveConsultation = async (rawId) => {
  const id = cleanObjectId(rawId);
  if (!id) {
    return {
      status: 400,
      message: "A valid consultation is required before payment",
    };
  }

  const consultation = await Consultation.findById(id).lean();
  if (!consultation) {
    return { status: 404, message: "Consultation not found" };
  }

  if (consultation.paymentStatus === "paid") {
    return {
      status: 409,
      message: "This consultation has already been paid",
    };
  }

  return { consultation };
};

const expectedFromConsultation = (consultation) => {
  const priceId =
    typeof consultation?.paymentPriceId === "string"
      ? consultation.paymentPriceId
      : null;
  const amountMinor = consultation?.paymentAmountMinor;
  const currency = normalizeCurrency(consultation?.paymentCurrency);

  return {
    priceId,
    /* The snapshot is written from the validated configured Price at
       checkout creation. A later STRIPE_PRICE_ID change must not invalidate
       a legitimate in-flight session, so amount/currency are read from the
       snapshot rather than from current configuration. */
    amountMinor,
    currency: currency ? currency.toLowerCase() : null,
    quantity: consultation?.paymentQuantity,
    valid:
      Boolean(priceId) &&
      priceId.startsWith("price_") &&
      Number.isSafeInteger(amountMinor) &&
      amountMinor > 0 &&
      Boolean(currency) &&
      consultation?.paymentQuantity === 1,
  };
};

/* A Stripe object's livemode is authoritative for the account/mode that
   produced it. A test object can never satisfy a live deployment (or the
   reverse), even if a session id happens to be reused in a mock. */
const sessionModeIssues = (session) => {
  const issues = [];
  if (session?.livemode !== isLiveMode()) issues.push("session_mode_mismatch");
  if (session?.mode !== "payment") issues.push("session_not_payment_mode");
  return issues;
};

/**
 * Compare a Stripe session's ACTUAL line items with the intended offer.
 * Returns stable reason codes, never raw provider payloads.
 */
const sessionCommercialIssues = (session, expected) => {
  const issues = [];

  if (!expected?.valid || expected.quantity !== 1) {
    return ["expected_offer_invalid"];
  }

  if (!Number.isFinite(session?.amount_total)) {
    issues.push("amount_missing");
  } else if (session.amount_total !== expected.amountMinor) {
    issues.push("amount_mismatch");
  }

  if (typeof session?.currency !== "string") {
    issues.push("currency_missing");
  } else if (session.currency.toLowerCase() !== expected.currency) {
    issues.push("currency_mismatch");
  }

  const lineItems = session?.line_items?.data;
  if (!Array.isArray(lineItems)) {
    issues.push("line_items_missing");
    return issues;
  }

  if (lineItems.length !== 1) {
    issues.push("line_item_count_mismatch");
    return issues;
  }

  const item = lineItems[0];
  if (item?.quantity !== expected.quantity) {
    issues.push("quantity_mismatch");
  }

  if (Number.isFinite(item?.amount_total) && item.amount_total !== expected.amountMinor) {
    issues.push("line_amount_mismatch");
  }

  if (!item?.price) {
    issues.push("line_price_missing");
    return issues;
  }

  if (item.price.id !== expected.priceId) {
    issues.push("price_id_mismatch");
  }
  if (item.price.type !== "one_time") {
    issues.push("price_not_one_time");
  }
  if (item.price.recurring) {
    issues.push("price_recurring");
  }
  if (item.price.active === false) {
    issues.push("price_inactive");
  }
  if (
    typeof item.price.livemode === "boolean" &&
    item.price.livemode !== isLiveMode()
  ) {
    issues.push("line_price_mode_mismatch");
  }
  if (item.price.unit_amount !== expected.amountMinor) {
    issues.push("price_unit_amount_mismatch");
  }

  const itemCurrency =
    typeof item.currency === "string"
      ? item.currency
      : typeof item.price.currency === "string"
        ? item.price.currency
        : null;
  if (!itemCurrency) {
    issues.push("line_currency_missing");
  } else if (itemCurrency.toLowerCase() !== expected.currency) {
    issues.push("line_currency_mismatch");
  }

  return issues;
};

/**
 * Reuse only an OPEN session whose actual commercial terms still match the
 * current server offer. A paid/complete session is not reused (it must be
 * confirmed by the webhook). A mismatched session is never silently doubled.
 */
const findReusableSession = async ({
  provider,
  consultation,
  expected,
}) => {
  if (!consultation?.stripeSessionId) return null;

  try {
    const existing = await provider.retrieveCheckoutSession(
      consultation.stripeSessionId,
      { expand: ["line_items"] }
    );

    if (!existing || existing.id !== consultation.stripeSessionId) {
      return null;
    }

    const modeIssues = sessionModeIssues(existing);
    if (modeIssues.length > 0) {
      return { mismatch: modeIssues, session: existing };
    }

    if (existing.payment_status === "paid") {
      return { paid: true, session: existing };
    }

    if (existing.status === "complete") {
      return { complete: true, session: existing };
    }

    if (existing.status !== "open" || typeof existing.url !== "string" || !existing.url) {
      return null;
    }

    const issues = sessionCommercialIssues(existing, expected);
    if (issues.length > 0) {
      return { mismatch: issues, session: existing };
    }

    return { session: existing };
  } catch (error) {
    /* The linked session may still be open. Creating a NEW session without
       knowing its state could let the customer pay twice, so a transient
       retrieval failure fails closed. `resource_missing` is safe: the old
       session no longer exists in this account/mode. */
    if (error?.code === "resource_missing") return null;
    logPaymentEvent("error", "stripe_existing_session_retrieval_failed", {
      consultationId: String(consultation._id),
      sessionId: consultation.stripeSessionId,
      ...stripeErrorFields(error),
    });
    return { error: true };
  }
};

const acquireCheckoutLock = async ({ consultationId, token, now = new Date() }) =>
  Consultation.findOneAndUpdate(
    {
      _id: consultationId,
      paymentStatus: { $ne: "paid" },
      $or: [
        { checkoutLockUntil: null },
        { checkoutLockUntil: { $lt: now } },
      ],
    },
    {
      $set: {
        checkoutLockUntil: new Date(now.getTime() + CHECKOUT_LOCK_MS),
        checkoutLockToken: token,
      },
    },
    { new: true }
  ).lean();

const releaseCheckoutLock = async ({ consultationId, token }) => {
  try {
    await Consultation.updateOne(
      { _id: consultationId, checkoutLockToken: token },
      { $set: { checkoutLockUntil: null, checkoutLockToken: null } }
    );
  } catch {
    /* The lock expires on its own; never fail the request for this. */
  }
};

/**
 * POST /api/payments/create-checkout-session
 *
 * Body: { consultationId, email? }. The consultation id is REQUIRED and is
 * the app-owned order. The email is used only to prefill Stripe-hosted
 * Checkout. Commercial fields are rejected outright.
 */
export const createCheckoutSession = async (req, res) => {
  if (!isPaymentsConfigured()) {
    return notConfigured(res);
  }

  const body = isPlainObject(req.body) ? req.body : {};
  const suppliedCommercialFields = CLIENT_COMMERCIAL_FIELDS.filter((field) =>
    Object.prototype.hasOwnProperty.call(body, field)
  );

  if (suppliedCommercialFields.length > 0) {
    logPaymentEvent("warn", "checkout_rejected", {
      reason: "client_commercial_fields",
      fields: suppliedCommercialFields,
    });
    return res.status(400).json({
      success: false,
      message: "Checkout pricing is controlled by the server",
    });
  }

  const lockToken = crypto.randomUUID();
  let lockConsultationId = null;

  try {
    const config = getPaymentsConfig();
    const { frontendUrl, priceId, mode } = config;
    const provider = getPaymentProvider();

    logPaymentEvent("info", "checkout_started", {
      consultationId: cleanObjectId(body.consultationId) || "invalid",
      mode: mode || "unconfigured",
      priceId,
    });

    /* Validate the app-owned order first. An invalid reference must not
       consume a Stripe Price lookup or produce a misleading provider 502. */
    const resolved = await resolveConsultation(body.consultationId);
    if (resolved.status) {
      logPaymentEvent("warn", "checkout_rejected", {
        reason: "consultation_invalid",
        status: resolved.status,
      });
      return res.status(resolved.status).json({
        success: false,
        message: resolved.message,
      });
    }

    const priceCheck = await validateConfiguredPrice(provider, priceId);
    if (!priceCheck.ok) {
      logPaymentEvent("error", "checkout_rejected", {
        reason: "configured_price_invalid",
        mode,
        priceId,
        amountMinor: priceCheck.price?.unit_amount,
        currency: priceCheck.price?.currency,
        priceLivemode: priceCheck.price?.livemode,
        reasons: priceCheck.reasons,
      });
      return res.status(503).json({
        success: false,
        message: "The consultation payment offer is not ready",
      });
    }

    const expected = priceCheck.expected;
    let enquiry = resolved.consultation;

    const reusable = await findReusableSession({
      provider,
      consultation: enquiry,
      expected,
    });

    if (reusable?.paid) {
      logPaymentEvent("warn", "checkout_rejected", {
        reason: "session_already_paid",
        consultationId: String(enquiry._id),
        sessionId: enquiry.stripeSessionId,
      });
      return res.status(409).json({
        success: false,
        message: "This consultation payment is already being confirmed",
      });
    }

    if (reusable?.complete) {
      logPaymentEvent("warn", "checkout_rejected", {
        reason: "session_complete_unpaid",
        consultationId: String(enquiry._id),
        sessionId: enquiry.stripeSessionId,
      });
      return res.status(409).json({
        success: false,
        message: "This consultation payment is already being confirmed",
      });
    }

    if (reusable?.mismatch) {
      logPaymentEvent("error", "checkout_rejected", {
        reason: "existing_session_terms_mismatch",
        consultationId: String(enquiry._id),
        sessionId: enquiry.stripeSessionId,
        reasons: reusable.mismatch,
      });
      return res.status(409).json({
        success: false,
        message: "The existing checkout does not match the current offer",
      });
    }

    if (reusable?.error) {
      logPaymentEvent("error", "checkout_rejected", {
        reason: "existing_session_unverifiable",
        consultationId: String(enquiry._id),
        sessionId: enquiry.stripeSessionId,
      });
      return res.status(502).json({
        success: false,
        message: "Unable to verify the existing checkout. Please try again.",
      });
    }

    if (reusable?.session) {
      logPaymentEvent("info", "checkout_reused", {
        consultationId: String(enquiry._id),
        sessionId: reusable.session.id,
        priceId,
        amountMinor: expected.amountMinor,
        currency: expected.currency,
        quantity: expected.quantity,
      });
      return res.status(200).json({ url: reusable.session.url });
    }

    /* One creator per consultation. Concurrent duplicate clicks either
       reuse the winner's session or receive a retryable 409. */
    const locked = await acquireCheckoutLock({
      consultationId: enquiry._id,
      token: lockToken,
    });

    if (!locked) {
      const current = await Consultation.findById(enquiry._id).lean();
      const concurrent = current
        ? await findReusableSession({ provider, consultation: current, expected })
        : null;

      if (concurrent?.session) {
        logPaymentEvent("info", "checkout_reused_after_lock", {
          consultationId: String(enquiry._id),
          sessionId: concurrent.session.id,
        });
        return res.status(200).json({ url: concurrent.session.url });
      }

      if (concurrent?.error) {
        logPaymentEvent("error", "checkout_rejected", {
          reason: "existing_session_unverifiable",
          consultationId: String(enquiry._id),
        });
        return res.status(502).json({
          success: false,
          message: "Unable to verify the existing checkout. Please try again.",
        });
      }

      logPaymentEvent("warn", "checkout_duplicate", {
        reason: "checkout_lock_held",
        consultationId: String(enquiry._id),
      });
      return res.status(409).json({
        success: false,
        message: "A checkout is already being created. Please retry.",
      });
    }

    lockConsultationId = String(enquiry._id);
    enquiry = locked;

    /* Re-check inside the lock: another request may have linked a session
       between the first read and lock acquisition. */
    const afterLock = await findReusableSession({
      provider,
      consultation: enquiry,
      expected,
    });

    if (afterLock?.paid || afterLock?.complete) {
      await releaseCheckoutLock({
        consultationId: enquiry._id,
        token: lockToken,
      });
      lockConsultationId = null;
      return res.status(409).json({
        success: false,
        message: "This consultation payment is already being confirmed",
      });
    }

    if (afterLock?.mismatch) {
      await releaseCheckoutLock({
        consultationId: enquiry._id,
        token: lockToken,
      });
      lockConsultationId = null;
      return res.status(409).json({
        success: false,
        message: "The existing checkout does not match the current offer",
      });
    }

    if (afterLock?.error) {
      await releaseCheckoutLock({
        consultationId: enquiry._id,
        token: lockToken,
      });
      lockConsultationId = null;
      logPaymentEvent("error", "checkout_rejected", {
        reason: "existing_session_unverifiable",
        consultationId: String(enquiry._id),
      });
      return res.status(502).json({
        success: false,
        message: "Unable to verify the existing checkout. Please try again.",
      });
    }

    if (afterLock?.session) {
      await releaseCheckoutLock({
        consultationId: enquiry._id,
        token: lockToken,
      });
      lockConsultationId = null;
      return res.status(200).json({ url: afterLock.session.url });
    }

    /* A nonce makes the Stripe idempotency key stable across ambiguous
       retries. Rotate it only when a previous session is known to be
       unusable (expired/complete). */
    let nonce = enquiry.checkoutNonce;
    if (!nonce || enquiry.stripeSessionId) {
      nonce = crypto.randomUUID();
      const updated = await Consultation.findOneAndUpdate(
        {
          _id: enquiry._id,
          checkoutLockToken: lockToken,
          paymentStatus: { $ne: "paid" },
        },
        { $set: { checkoutNonce: nonce } },
        { new: true }
      ).lean();

      if (!updated) {
        await releaseCheckoutLock({
          consultationId: enquiry._id,
          token: lockToken,
        });
        lockConsultationId = null;
        return res.status(409).json({
          success: false,
          message: "A checkout is already being created. Please retry.",
        });
      }
      enquiry = updated;
    }

    const customerEmail = cleanField(body.email, 254).toLowerCase();
    const prefilledEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
      ? customerEmail
      : undefined;

    const cancelUrl = `${frontendUrl}/payment/cancel?consultation_id=${encodeURIComponent(
      String(enquiry._id)
    )}`;

    const params = {
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_creation: "always",
      ...(prefilledEmail ? { customer_email: prefilledEmail } : {}),
      client_reference_id: String(enquiry._id),
      /* Opaque identifiers and the validated commercial snapshot only.
         Never a name, email, message or other personal data. */
      metadata: {
        app: APP_METADATA,
        consultation_id: String(enquiry._id),
        price_id: priceId,
        quantity: String(expected.quantity),
        amount_minor: String(expected.amountMinor),
        currency: expected.currency,
        attempt: nonce,
      },
      success_url: `${frontendUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    };

    let session;
    try {
      session = await provider.createCheckoutSession(params, {
        idempotencyKey: `consultation-${enquiry._id}-${nonce}`,
      });
    } catch (error) {
      await releaseCheckoutLock({
        consultationId: enquiry._id,
        token: lockToken,
      });
      lockConsultationId = null;
      throw error;
    }

    if (!session || typeof session.url !== "string" || !session.url || !session.id) {
      await releaseCheckoutLock({
        consultationId: enquiry._id,
        token: lockToken,
      });
      lockConsultationId = null;
      logPaymentEvent("error", "checkout_failed", {
        reason: "provider_returned_no_url",
        consultationId: String(enquiry._id),
        priceId,
      });
      return res.status(502).json({
        success: false,
        message: "Unable to start checkout. Please try again.",
      });
    }

    const linked = await Consultation.findOneAndUpdate(
      {
        _id: enquiry._id,
        checkoutLockToken: lockToken,
        paymentStatus: { $ne: "paid" },
      },
      {
        $set: {
          stripeSessionId: session.id,
          paymentStatus: "pending",
          paymentPriceId: priceId,
          paymentAmountMinor: expected.amountMinor,
          paymentCurrency: expected.currency,
          paymentQuantity: expected.quantity,
          paymentStartedAt: new Date(),
          checkoutLockUntil: null,
          checkoutLockToken: null,
        },
      },
      { new: true }
    );

    if (!linked) {
      /* The lock was lost or the order became paid. Never hand the customer
         a session that is not stored against the order. */
      try {
        await provider.expireCheckoutSession(session.id);
      } catch (error) {
        logPaymentEvent("error", "checkout_expire_failed", {
          consultationId: String(enquiry._id),
          sessionId: session.id,
          ...stripeErrorFields(error),
        });
      }
      await releaseCheckoutLock({
        consultationId: enquiry._id,
        token: lockToken,
      });
      lockConsultationId = null;
      logPaymentEvent("error", "checkout_link_failed", {
        consultationId: String(enquiry._id),
        sessionId: session.id,
      });
      return res.status(409).json({
        success: false,
        message: "Unable to link the checkout to this consultation",
      });
    }

    lockConsultationId = null;
    logPaymentEvent("info", "checkout_created", {
      consultationId: String(enquiry._id),
      sessionId: session.id,
      priceId,
      amountMinor: expected.amountMinor,
      currency: expected.currency,
      quantity: expected.quantity,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    if (lockConsultationId) {
      await releaseCheckoutLock({
        consultationId: lockConsultationId,
        token: lockToken,
      });
    }
    if (error?.status === 503) return notConfigured(res);
    logPaymentEvent("error", "checkout_failed", {
      operation: "create-checkout-session",
      ...stripeErrorFields(error),
    });
    return res.status(502).json({
      success: false,
      message: "Unable to start checkout. Please try again.",
    });
  }
};

/* Public offer data comes from the same validated active one-time Stripe
   Price used to create Checkout. The browser never supplies pricing. */
export const getCheckoutOffer = async (_req, res) => {
  res.set("Cache-Control", "no-store");
  if (!isPaymentsConfigured()) return notConfigured(res);

  try {
    const { priceId } = getPaymentsConfig();
    const provider = getPaymentProvider();
    const priceCheck = await validateConfiguredPrice(provider, priceId);

    if (!priceCheck.ok) {
      logPaymentEvent("error", "offer_rejected", {
        priceId,
        amountMinor: priceCheck.price?.unit_amount,
        currency: priceCheck.price?.currency,
        reasons: priceCheck.reasons,
      });
      return res.status(503).json({
        success: false,
        message: "The consultation payment offer is not ready",
      });
    }

    return res.json({
      success: true,
      offer: priceCheck.offer,
    });
  } catch (error) {
    if (error?.status === 503) return notConfigured(res);
    logPaymentEvent("error", "offer_unavailable", {
      operation: "retrieve-consultation-price",
      ...stripeErrorFields(error),
    });
    return res.status(502).json({
      success: false,
      message: "The consultation payment offer is temporarily unavailable",
    });
  }
};

/* A Checkout Session id is a capability returned in Stripe's success URL.
   This endpoint reveals only a normalized state, never customer details.
   Stripe retrieval is authoritative for a redirect that arrives before the
   webhook; the webhook remains responsible for persistence and email. */
export const getCheckoutSessionStatus = async (req, res) => {
  res.set("Cache-Control", "no-store");
  if (!isPaymentsConfigured()) return notConfigured(res);

  const sessionId = cleanField(req.params.sessionId, 255);
  if (!/^cs_(?:(?:test|live)_)?[A-Za-z0-9_-]+$/.test(sessionId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid checkout reference" });
  }

  try {
    const stored = await StripePayment.findOne({
      stripe_session_id: sessionId,
    })
      .select("payment_status")
      .lean();
    if (
      stored?.payment_status === "paid" ||
      stored?.payment_status === "failed" ||
      stored?.payment_status === "expired"
    ) {
      return res.json({ success: true, status: stored.payment_status });
    }

    /* Stripe retrieval is authoritative only after the session's mode and
       commercial terms have been verified. A browser redirect (or a session
       created with a different Price) must never display "paid". */
    const session = await getPaymentProvider().retrieveCheckoutSession(
      sessionId,
      { expand: ["line_items"] }
    );

    const modeIssues = sessionModeIssues(session);
    if (modeIssues.length > 0) {
      logPaymentEvent("warn", "session_status_rejected", {
        sessionId,
        reasons: modeIssues,
      });
      return res
        .status(404)
        .json({ success: false, message: "Checkout session not found" });
    }

    const consultation = await Consultation.findOne({
      stripeSessionId: sessionId,
    }).lean();

    let expected;
    if (consultation) {
      expected = expectedFromConsultation(consultation);
    } else {
      /* An unlinked session has no per-consultation snapshot. Compare it
         against the current configured Price, never against its own
         payload (which would fail open). */
      const { priceId } = getPaymentsConfig();
      const priceCheck = await validateConfiguredPrice(
        getPaymentProvider(),
        priceId
      );
      if (!priceCheck.ok) {
        logPaymentEvent("error", "session_status_rejected", {
          sessionId,
          reason: "configured_price_invalid",
          reasons: priceCheck.reasons,
        });
        return res.status(503).json({
          success: false,
          message: "The consultation payment offer is not ready",
        });
      }
      expected = priceCheck.expected;
    }

    if (!expected.valid) {
      logPaymentEvent("error", "session_status_rejected", {
        sessionId,
        consultationId: consultation ? String(consultation._id) : null,
        reason: "invalid_commercial_snapshot",
      });
      return res.status(502).json({
        success: false,
        message: "Payment status is temporarily unavailable",
      });
    }

    const issues = sessionCommercialIssues(session, expected);
    if (issues.length > 0) {
      logPaymentEvent("error", "session_status_rejected", {
        sessionId,
        consultationId: consultation ? String(consultation._id) : null,
        amountMinor: session.amount_total,
        currency: session.currency,
        reasons: issues,
      });
      return res.status(502).json({
        success: false,
        message: "Payment status is temporarily unavailable",
      });
    }

    const status =
      session.payment_status === "paid"
        ? "paid"
        : session.status === "expired"
          ? "expired"
          : "pending";
    return res.json({ success: true, status });
  } catch (error) {
    if (error?.status === 503) return notConfigured(res);
    const code = error?.code;
    if (code === "resource_missing") {
      return res
        .status(404)
        .json({ success: false, message: "Checkout session not found" });
    }
    logPaymentEvent("error", "session_status_unavailable", {
      ...stripeErrorFields(error),
    });
    return res.status(502).json({
      success: false,
      message: "Payment status is temporarily unavailable",
    });
  }
};

/* Events we act on. Everything else is acknowledged and ignored. */
const HANDLED_EVENTS = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "checkout.session.expired",
]);

/**
 * Resolve the app-owned order for a session. The session id must already be
 * stored on the consultation; metadata alone is never sufficient.
 */
const findOwnedConsultation = async (session) => {
  const consultationId = cleanObjectId(session?.metadata?.consultation_id);
  if (!consultationId) return { reason: "missing_consultation_metadata" };

  if (
    session?.metadata?.app &&
    session.metadata.app !== APP_METADATA
  ) {
    return { reason: "app_marker_mismatch" };
  }

  const consultation = await Consultation.findById(consultationId).lean();
  if (!consultation) return { reason: "unknown_consultation" };

  if (consultation.stripeSessionId !== session.id) {
    return { reason: "session_not_linked_to_consultation" };
  }

  if (
    session.client_reference_id &&
    session.client_reference_id !== String(consultation._id)
  ) {
    return { reason: "client_reference_mismatch" };
  }

  const expected = expectedFromConsultation(consultation);
  if (!expected.valid) {
    return { reason: "invalid_commercial_snapshot" };
  }

  return {
    consultation,
    expected,
  };
};

const validateRetrievedMetadata = ({ verified, consultation }) => {
  const issues = [];
  const metadataId = cleanObjectId(verified?.metadata?.consultation_id);

  if (metadataId && metadataId !== String(consultation._id)) {
    issues.push("retrieved_metadata_consultation_mismatch");
  }
  if (
    verified?.metadata?.app &&
    verified.metadata.app !== APP_METADATA
  ) {
    issues.push("retrieved_app_marker_mismatch");
  }
  if (
    verified?.client_reference_id &&
    verified.client_reference_id !== String(consultation._id)
  ) {
    issues.push("retrieved_client_reference_mismatch");
  }
  if (verified?.mode !== "payment") {
    issues.push("retrieved_mode_mismatch");
  }

  return issues;
};

const syncConsultation = async ({ consultationId, paymentStatus }) => {
  const paid = paymentStatus === "paid";
  await Consultation.updateOne(
    { _id: consultationId, paymentStatus: { $ne: "paid" } },
    {
      $set: {
        paymentStatus,
        ...(paid ? { paidAt: new Date() } : {}),
      },
    }
  );
};

/**
 * Process a paid Checkout Session. Returns { status, consultationId, ... }.
 * Throws only for transient failures that should make Stripe retry.
 */
const processPaidSession = async ({ event, session, eventId }) => {
  if (session.payment_status !== "paid") {
    return { status: "ignored", reason: "payment_status_not_paid" };
  }

  const owned = await findOwnedConsultation(session);
  if (!owned.consultation) {
    return { status: "ignored", reason: owned.reason };
  }

  const provider = getPaymentProvider();
  let verified;
  try {
    verified = await provider.retrieveCheckoutSession(session.id, {
      expand: ["line_items"],
    });
  } catch (error) {
    if (error?.code === "resource_missing") {
      return { status: "ignored", reason: "stripe_session_missing" };
    }
    throw error;
  }

  if (
    !verified ||
    verified.id !== session.id ||
    verified.payment_status !== "paid" ||
    verified.status !== "complete"
  ) {
    return { status: "ignored", reason: "verified_session_not_paid" };
  }

  const modeIssues = sessionModeIssues(verified);
  if (modeIssues.length > 0) {
    logPaymentEvent("error", "webhook_rejected", {
      eventId,
      eventType: event.type,
      sessionId: session.id,
      consultationId: String(owned.consultation._id),
      reasons: modeIssues,
    });
    return { status: "ignored", reason: "verified_session_mode_mismatch" };
  }

  const metadataIssues = validateRetrievedMetadata({
    verified,
    consultation: owned.consultation,
  });
  if (metadataIssues.length > 0) {
    logPaymentEvent("error", "webhook_rejected", {
      eventId,
      eventType: event.type,
      sessionId: session.id,
      consultationId: String(owned.consultation._id),
      reasons: metadataIssues,
    });
    return { status: "ignored", reason: "retrieved_metadata_mismatch" };
  }

  const issues = sessionCommercialIssues(verified, owned.expected);
  if (issues.length > 0) {
    logPaymentEvent("error", "webhook_rejected", {
      eventId,
      eventType: event.type,
      sessionId: session.id,
      consultationId: String(owned.consultation._id),
      priceId: owned.expected.priceId,
      amountMinor: verified.amount_total,
      currency: verified.currency,
      quantity: verified.line_items?.data?.[0]?.quantity ?? null,
      reasons: issues,
    });
    return { status: "ignored", reason: "commercial_terms_mismatch" };
  }

  await recordPayment({
    session: verified,
    paymentStatus: "paid",
    eventId,
    consultationId: owned.consultation._id,
    priceId: owned.expected.priceId,
    quantity: owned.expected.quantity,
  });

  await syncConsultation({
    consultationId: owned.consultation._id,
    paymentStatus: "paid",
  });

  const email = await deliverConfirmationEmail({ session: verified });

  const emailFailed = email.outcome === "failed";
  logPaymentEvent(emailFailed ? "error" : "info", "webhook_processed", {
    eventId,
    eventType: event.type,
    sessionId: session.id,
    consultationId: String(owned.consultation._id),
    priceId: owned.expected.priceId,
    amountMinor: verified.amount_total,
    currency: verified.currency,
    quantity: owned.expected.quantity,
    paymentIntentId: paymentIntentId(verified),
    email: email.outcome,
  });

  return {
    status: emailFailed ? "failed" : "processed",
    reason: emailFailed ? "confirmation_email_failed" : null,
    consultationId: String(owned.consultation._id),
    email: email.outcome,
  };
};

const processFailedSession = async ({ event, session, eventId }) => {
  const owned = await findOwnedConsultation(session);
  if (!owned.consultation) {
    return { status: "ignored", reason: owned.reason };
  }

  /* A late failure must never contradict a verified paid session. */
  if (session.payment_status === "paid") {
    return { status: "ignored", reason: "paid_session_failure_event" };
  }

  const modeIssues = sessionModeIssues(session);
  if (modeIssues.length > 0) {
    logPaymentEvent("error", "webhook_rejected", {
      eventId,
      eventType: event.type,
      sessionId: session.id,
      consultationId: String(owned.consultation._id),
      reasons: modeIssues,
    });
    return { status: "ignored", reason: "session_mode_mismatch" };
  }

  const issues = [];
  if (
    Number.isFinite(session.amount_total) &&
    session.amount_total !== owned.expected.amountMinor
  ) {
    issues.push("amount_mismatch");
  }
  if (
    typeof session.currency === "string" &&
    session.currency.toLowerCase() !== owned.expected.currency
  ) {
    issues.push("currency_mismatch");
  }
  if (
    session.metadata?.price_id &&
    session.metadata.price_id !== owned.expected.priceId
  ) {
    issues.push("price_id_mismatch");
  }
  if (issues.length > 0) {
    logPaymentEvent("error", "webhook_rejected", {
      eventId,
      eventType: event.type,
      sessionId: session.id,
      consultationId: String(owned.consultation._id),
      reasons: issues,
    });
    return { status: "ignored", reason: "commercial_terms_mismatch" };
  }

  await recordPayment({
    session,
    paymentStatus: "failed",
    eventId,
    consultationId: owned.consultation._id,
    priceId: owned.expected.priceId,
    quantity: owned.expected.quantity,
  });

  await syncConsultation({
    consultationId: owned.consultation._id,
    paymentStatus: "failed",
  });

  logPaymentEvent("info", "webhook_processed", {
    eventId,
    eventType: event.type,
    sessionId: session.id,
    consultationId: String(owned.consultation._id),
    paymentIntentId: paymentIntentId(session),
    paymentStatus: "failed",
  });

  return {
    status: "processed",
    consultationId: String(owned.consultation._id),
  };
};

/**
 * A Checkout Session that expired before payment. No money moved and no
 * email is sent. The consultation is released so the visitor can start a
 * fresh checkout attempt. A paid state can never be downgraded.
 */
const processExpiredSession = async ({ event, session, eventId }) => {
  const owned = await findOwnedConsultation(session);
  if (!owned.consultation) {
    return { status: "ignored", reason: owned.reason };
  }

  if (session.payment_status === "paid") {
    return { status: "ignored", reason: "paid_session_expired_event" };
  }

  if (session.status !== "expired") {
    return { status: "ignored", reason: "session_not_expired" };
  }

  const modeIssues = sessionModeIssues(session);
  if (modeIssues.length > 0) {
    logPaymentEvent("error", "webhook_rejected", {
      eventId,
      eventType: event.type,
      sessionId: session.id,
      consultationId: String(owned.consultation._id),
      reasons: modeIssues,
    });
    return { status: "ignored", reason: "session_mode_mismatch" };
  }

  const issues = [];
  if (
    Number.isFinite(session.amount_total) &&
    session.amount_total !== owned.expected.amountMinor
  ) {
    issues.push("amount_mismatch");
  }
  if (
    typeof session.currency === "string" &&
    session.currency.toLowerCase() !== owned.expected.currency
  ) {
    issues.push("currency_mismatch");
  }
  if (
    session.metadata?.price_id &&
    session.metadata.price_id !== owned.expected.priceId
  ) {
    issues.push("price_id_mismatch");
  }
  if (issues.length > 0) {
    logPaymentEvent("error", "webhook_rejected", {
      eventId,
      eventType: event.type,
      sessionId: session.id,
      consultationId: String(owned.consultation._id),
      reasons: issues,
    });
    return { status: "ignored", reason: "commercial_terms_mismatch" };
  }

  await recordPayment({
    session,
    paymentStatus: "expired",
    eventId,
    consultationId: owned.consultation._id,
    priceId: owned.expected.priceId,
    quantity: owned.expected.quantity,
  });

  await syncConsultation({
    consultationId: owned.consultation._id,
    paymentStatus: "expired",
  });

  logPaymentEvent("info", "webhook_processed", {
    eventId,
    eventType: event.type,
    sessionId: session.id,
    consultationId: String(owned.consultation._id),
    paymentStatus: "expired",
  });

  return {
    status: "processed",
    consultationId: String(owned.consultation._id),
  };
};

/**
 * POST /api/payments/webhook
 *
 * Expects the RAW request body (express.raw on this route only) because
 * Stripe's signature covers the exact bytes received.
 */
export const stripeWebhook = async (req, res) => {
  if (!isPaymentsConfigured()) {
    return notConfigured(res);
  }

  const { webhookSecret } = getPaymentsConfig();
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).json({
      success: false,
      message: "Missing Stripe signature",
    });
  }

  let event;
  try {
    event = getPaymentProvider().verifyWebhook(
      req.body,
      signature,
      webhookSecret
    );
  } catch (error) {
    if (error?.status === 503) return notConfigured(res);
    logPaymentEvent("error", "webhook_signature_invalid", {
      ...stripeErrorFields(error),
    });
    return res.status(400).json({
      success: false,
      message: "Invalid Stripe signature",
    });
  }

  const eventId = typeof event.id === "string" ? event.id : null;
  const eventType = event.type;
  const session = event.data && event.data.object;

  if (!HANDLED_EVENTS.has(eventType) || !session || !session.id) {
    logPaymentEvent("info", "webhook_ignored", {
      eventId,
      eventType,
      reason: "unhandled_event_type",
    });
    return res.status(200).json({ received: true, ignored: true });
  }

  /* Test/live isolation: a test event can never mutate live state. */
  if (event.livemode !== isLiveMode()) {
    logPaymentEvent("warn", "webhook_ignored", {
      eventId,
      eventType,
      sessionId: session.id,
      reason: "livemode_mismatch",
    });
    return res.status(200).json({
      received: true,
      ignored: true,
      reason: "livemode_mismatch",
    });
  }

  const claim = await claimWebhookEvent({
    eventId,
    eventType,
    sessionId: session.id,
  });

  if (claim.decision === "missing_id") {
    logPaymentEvent("warn", "webhook_rejected", {
      eventType,
      reason: "missing_event_id",
    });
    return res.status(400).json({
      success: false,
      message: "Invalid Stripe event",
    });
  }

  if (claim.decision === "duplicate") {
    logPaymentEvent("info", "webhook_duplicate", {
      eventId,
      eventType,
      sessionId: session.id,
      previousStatus: claim.status,
    });
    return res.status(200).json({ received: true, duplicate: true });
  }

  if (claim.decision === "in_progress") {
    logPaymentEvent("info", "webhook_duplicate", {
      eventId,
      eventType,
      sessionId: session.id,
      reason: "processing_lease_held",
    });
    return res.status(200).json({
      received: true,
      duplicate: true,
      processing: true,
    });
  }

  try {
    const result =
      eventType === "checkout.session.async_payment_failed"
        ? await processFailedSession({ event, session, eventId })
        : eventType === "checkout.session.expired"
          ? await processExpiredSession({ event, session, eventId })
          : await processPaidSession({ event, session, eventId });

    await markWebhookEvent({
      eventId,
      claimId: claim.claimId,
      status: result.status,
      error: result.status === "failed" ? result.reason : null,
    });

    if (result.status === "ignored") {
      logPaymentEvent("info", "webhook_ignored", {
        eventId,
        eventType,
        sessionId: session.id,
        reason: result.reason,
      });
      return res.status(200).json({
        received: true,
        ignored: true,
        reason: result.reason,
      });
    }

    if (result.status === "failed") {
      /* Transient: answer non-2xx so Stripe retries. The retry re-claims
         (email_status 'failed') and sends exactly once. */
      return res.status(500).json({
        success: false,
        message: "Confirmation email could not be delivered",
      });
    }

    return res.status(200).json({
      received: true,
      ...(result.email ? { email: result.email } : {}),
    });
  } catch (error) {
    try {
      await markWebhookEvent({
        eventId,
        claimId: claim.claimId,
        status: "failed",
        error: error?.code || error?.type || "webhook_processing_error",
      });
    } catch {
      /* Stripe still retries because the response below is non-2xx. */
    }
    logPaymentEvent("error", "webhook_failed", {
      eventId,
      eventType,
      sessionId: session.id,
      ...stripeErrorFields(error),
    });
    return res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
};
