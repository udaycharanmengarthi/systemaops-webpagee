/* Consultation payment suite (Stripe Checkout + verified webhook).
 *
 * REAL code under test: the Express app, the payments controller, the
 * persistence service and the mail service.
 *
 * REAL Stripe signature verification: payloads are signed with
 * stripe.webhooks.generateTestHeaderString and verified by
 * stripe.webhooks.constructEvent inside the app.
 *
 * NO network, NO secrets:
 *   - checkout.sessions.create is stubbed on the client instance
 *     (the only outbound call the integration makes);
 *   - email goes to the local fake Resend endpoint (RESEND_BASE_URL).
 *
 * Run inside the backend container (MongoDB is internal only):
 *   docker compose run --rm -v "${PWD}/Server/tests:/app/tests:ro" \
 *     backend node --test tests/
 */
import assert from "node:assert/strict";
import test from "node:test";
import mongoose from "mongoose";

import { startFakeProvider } from "./support/fakeResend.js";
import { startTestServer, post } from "./support/testServer.js";
import StripePayment from "../src/models/StripePayment.js";
import {
  getStripeClient,
  resetStripeClient,
  getPaymentsConfig,
} from "../src/config/payments.js";

const TEST_SECRET_KEY = "sk_test_0000000000000000000000payments";
const TEST_WEBHOOK_SECRET = "whsec_0000000000000000000000000000test";
const TEST_PRICE_ID = "price_00000000000000consultation";
const TEST_FRONTEND_URL = "http://localhost:5173";

const ctx = { api: null, provider: null, sessionIds: [] };

/* ── helpers ─────────────────────────────────────────────────────────────── */

let sessionCounter = 0;
const uniqueSessionId = () => {
  sessionCounter += 1;
  return `cs_test_${Date.now()}_${sessionCounter}`;
};

const buildSession = (overrides = {}) => ({
  id: uniqueSessionId(),
  object: "checkout.session",
  payment_status: "paid",
  amount_total: 24900,
  currency: "usd",
  payment_intent: "pi_test_1234567890",
  customer_details: { email: `payer-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@systemaops.test` },
  ...overrides,
});

const buildEvent = (type, session) => ({
  id: `evt_test_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  object: "event",
  type,
  api_version: "2026-09-30.endive",
  created: Math.floor(Date.now() / 1000),
  livemode: false,
  pending_webhooks: 0,
  request: { id: null, idempotency_key: null },
  data: { object: session },
});

/** Sign a payload exactly like Stripe does and POST it to the webhook. */
async function deliverEvent(event, { secret = TEST_WEBHOOK_SECRET, mutate = null } = {}) {
  const stripe = getStripeClient();
  const payload = JSON.stringify(event);
  const header = stripe.webhooks.generateTestHeaderString({
    payload,
    secret,
  });
  const body = mutate ? mutate(payload) : payload;

  const response = await fetch(`${ctx.api.baseUrl}/api/payments/webhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "stripe-signature": header,
    },
    body,
  });
  let payloadJson = null;
  try {
    payloadJson = await response.json();
  } catch {
    payloadJson = null;
  }
  return { status: response.status, payload: payloadJson };
}

const emailCount = () => ctx.provider.received.length;

const rowFor = (sessionId) =>
  StripePayment.findOne({ stripe_session_id: sessionId }).lean();

const remember = (sessionId) => {
  ctx.sessionIds.push(sessionId);
  return sessionId;
};

/* Stub the single outbound Stripe call. No network is ever used. */
const stubCheckoutCreate = (impl) => {
  const stripe = getStripeClient();
  stripe.checkout.sessions.create = impl;
};

/* ── lifecycle ───────────────────────────────────────────────────────────── */

test.before(async () => {
  /* Configure BEFORE the app/services are used. Values are obviously fake
     test-mode credentials held only in memory for this process. */
  process.env.STRIPE_SECRET_KEY = TEST_SECRET_KEY;
  process.env.STRIPE_WEBHOOK_SECRET = TEST_WEBHOOK_SECRET;
  process.env.STRIPE_PRICE_ID = TEST_PRICE_ID;
  process.env.FRONTEND_URL = TEST_FRONTEND_URL;
  process.env.RESEND_API_KEY = process.env.RESEND_API_KEY || "re_fake_test_key";
  process.env.SENDER_EMAIL = process.env.SENDER_EMAIL || "test@systemaops.test";
  process.env.NODE_ENV = "test";

  resetStripeClient();
  ctx.provider = await startFakeProvider({ status: 200 });
  process.env.RESEND_BASE_URL = ctx.provider.baseUrl;

  ctx.api = await startTestServer();
});

test.after(async () => {
  try {
    if (ctx.sessionIds.length > 0) {
      const result = await StripePayment.deleteMany({
        stripe_session_id: { $in: ctx.sessionIds },
      });
      ctx.sessionIds = [];
      console.log(`[tests] removed ${result.deletedCount} payment row(s)`);
    }
  } catch (error) {
    console.error(`[tests] cleanup failed: ${error.message}`);
  }
  if (ctx.provider) await ctx.provider.close();
  if (ctx.api) await ctx.api.stop();
});

/* ══════════════════════════════════════════════════════════════════════
   CREATE CHECKOUT SESSION
   ══════════════════════════════════════════════════════════════════════ */

test("create-checkout-session returns a Stripe Checkout URL", async () => {
  const calls = [];
  stubCheckoutCreate(async (params) => {
    calls.push(params);
    return { id: "cs_test_created", url: "https://checkout.stripe.com/c/test" };
  });

  const { status, payload } = await post(ctx.api.baseUrl, "/api/payments/create-checkout-session", {});

  assert.equal(status, 200);
  assert.equal(payload.url, "https://checkout.stripe.com/c/test");
  assert.equal(calls.length, 1);
});

test("the checkout offer returns the active server-configured one-time price", async () => {
  const stripe = getStripeClient();
  const originalRetrieve = stripe.prices.retrieve;
  let requestedPriceId;
  stripe.prices.retrieve = async (priceId) => {
    requestedPriceId = priceId;
    return { active: true, type: "one_time", unit_amount: 12500, currency: "eur" };
  };
  try {
    const response = await fetch(`${ctx.api.baseUrl}/api/payments/offer`);
    const payload = await response.json();
    assert.equal(response.status, 200);
    assert.equal(requestedPriceId, TEST_PRICE_ID);
    assert.deepEqual(payload, {
      success: true,
      price: { amountMinor: 12500, currency: "eur" },
    });
    assert.equal(response.headers.get("cache-control"), "no-store");
  } finally {
    stripe.prices.retrieve = originalRetrieve;
  }
});

test("an invalid or unavailable Stripe Price cannot be offered", async () => {
  const stripe = getStripeClient();
  const originalRetrieve = stripe.prices.retrieve;
  stripe.prices.retrieve = async () => {
    throw Object.assign(new Error("provider details must not leak"), {
      type: "StripeConnectionError",
      code: "connection_error",
    });
  };
  try {
    const response = await fetch(`${ctx.api.baseUrl}/api/payments/offer`);
    const payload = await response.json();
    assert.equal(response.status, 502);
    assert.equal(payload.success, false);
    assert.ok(!JSON.stringify(payload).includes("provider details"));
  } finally {
    stripe.prices.retrieve = originalRetrieve;
  }
});

test("create-checkout-session uses the server-configured price and ignores client price/amount/currency", async () => {
  const calls = [];
  stubCheckoutCreate(async (params) => {
    calls.push(params);
    return { id: "cs_test_priced", url: "https://checkout.stripe.com/c/priced" };
  });

  const { status, payload } = await post(ctx.api.baseUrl, "/api/payments/create-checkout-session", {
    price: "price_attacker_free_tier",
    amount: 1,
    currency: "eur",
    quantity: 99,
    line_items: [{ price: "price_attacker", quantity: 10 }],
  });

  assert.equal(status, 200);
  assert.equal(payload.url, "https://checkout.stripe.com/c/priced");

  const params = calls[0];
  assert.equal(params.mode, "payment");
  assert.equal(params.quantity, undefined);
  assert.deepEqual(params.line_items, [
    { price: TEST_PRICE_ID, quantity: 1 },
  ]);
  assert.equal(params.success_url, `${TEST_FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`);
  assert.equal(params.cancel_url, `${TEST_FRONTEND_URL}/payment/cancel`);

  /* The client-sent price/amount/currency must not appear anywhere. */
  const serialized = JSON.stringify(params);
  assert.ok(!serialized.includes("price_attacker"));
  assert.ok(!serialized.includes("eur"));
});

test("create-checkout-session prefills only the visitor's own email", async () => {
  const calls = [];
  stubCheckoutCreate(async (params) => {
    calls.push(params);
    return { id: "cs_test_prefill", url: "https://checkout.stripe.com/c/prefill" };
  });

  const { status } = await post(ctx.api.baseUrl, "/api/payments/create-checkout-session", {
    name: "  Dana Founder  ",
    email: "Dana@SystemaOps.Test",
    amount: 1,
    currency: "eur",
  });

  assert.equal(status, 200);
  const params = calls[0];
  assert.equal(params.customer_email, "dana@systemaops.test", "email is trimmed + lowercased");
  /* `customer_name` is NOT a valid Checkout Session create parameter in the
     pinned Stripe API version. Sending it makes Stripe reject the session,
     so the name must never be forwarded. */
  assert.equal(
    Object.prototype.hasOwnProperty.call(params, "customer_name"),
    false,
    "customer_name must never be sent to Stripe"
  );
  /* Prefill must never smuggle commercial fields through. */
  assert.ok(!JSON.stringify(params).includes("eur"));
  assert.equal(params.line_items[0].price, TEST_PRICE_ID);
});

test("an invalid prefill email is dropped instead of forwarded to Stripe", async () => {
  const calls = [];
  stubCheckoutCreate(async (params) => {
    calls.push(params);
    return { id: "cs_test_badprefill", url: "https://checkout.stripe.com/c/bad" };
  });

  const { status } = await post(ctx.api.baseUrl, "/api/payments/create-checkout-session", {
    name: "Dana",
    email: "not-an-email",
  });

  assert.equal(status, 200);
  assert.equal(calls[0].customer_email, undefined);
  assert.equal(
    Object.prototype.hasOwnProperty.call(calls[0], "customer_name"),
    false
  );
});

test("create-checkout-session returns a safe generic error when Stripe fails", async () => {
  const stripeError = Object.assign(new Error("Invalid API key provided: sk_live_***"), {
    type: "StripeAuthenticationError",
    code: "api_key_invalid",
  });
  stubCheckoutCreate(async () => {
    throw stripeError;
  });

  const { status, payload } = await post(ctx.api.baseUrl, "/api/payments/create-checkout-session", {});

  assert.equal(status, 502);
  assert.equal(payload.success, false);
  const body = JSON.stringify(payload);
  assert.ok(!body.includes("sk_live"));
  assert.ok(!body.includes("Invalid API key"));
  assert.ok(!body.includes("api_key_invalid"));
  assert.match(body, /Unable to start checkout/i);
});

test("unconfigured Stripe answers 503 while unrelated routes keep working", async () => {
  const previous = {
    secret: process.env.STRIPE_SECRET_KEY,
    webhook: process.env.STRIPE_WEBHOOK_SECRET,
    price: process.env.STRIPE_PRICE_ID,
    frontend: process.env.FRONTEND_URL,
  };

  /* Obvious placeholder values must count as NOT configured. */
  process.env.STRIPE_SECRET_KEY = "sk_test_REPLACE_ME";
  process.env.STRIPE_WEBHOOK_SECRET = "";
  process.env.STRIPE_PRICE_ID = "";
  process.env.FRONTEND_URL = "";
  resetStripeClient();

  const payments = await post(ctx.api.baseUrl, "/api/payments/create-checkout-session", {});
  assert.equal(payments.status, 503);
  assert.equal(payments.payload.success, false);
  assert.match(payments.payload.message, /not configured/i);

  const offer = await fetch(`${ctx.api.baseUrl}/api/payments/offer`);
  assert.equal(offer.status, 503);

  const hook = await fetch(`${ctx.api.baseUrl}/api/payments/webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "stripe-signature": "t=1,v1=deadbeef" },
    body: "{}",
  });
  assert.equal(hook.status, 503);

  /* Unrelated endpoints must be unaffected. */
  const root = await fetch(`${ctx.api.baseUrl}/`);
  assert.equal(root.status, 200);
  const health = await fetch(`${ctx.api.baseUrl}/health`);
  assert.equal(health.status, 200);
  const healthBody = await health.json();
  assert.equal(healthBody.ok, true);

  /* Restore by EXPLICIT env names (Object.assign with short keys would
     create "secret"/"webhook" instead of the real variables). */
  process.env.STRIPE_SECRET_KEY = previous.secret;
  process.env.STRIPE_WEBHOOK_SECRET = previous.webhook;
  process.env.STRIPE_PRICE_ID = previous.price;
  process.env.FRONTEND_URL = previous.frontend;
  resetStripeClient();
});

test("session status validates the reference and exposes only a normalized state", async () => {
  const stripe = getStripeClient();
  const originalRetrieve = stripe.checkout.sessions.retrieve;
  stripe.checkout.sessions.retrieve = async () => ({
    id: "cs_test_status_pending",
    mode: "payment",
    status: "open",
    payment_status: "unpaid",
    customer_details: { email: "private@example.test" },
  });
  try {
    const bad = await fetch(`${ctx.api.baseUrl}/api/payments/session/not-a-session`);
    assert.equal(bad.status, 400);

    const response = await fetch(`${ctx.api.baseUrl}/api/payments/session/cs_test_status_pending`);
    const payload = await response.json();
    assert.equal(response.status, 200);
    assert.equal(payload.status, "pending");
    assert.deepEqual(Object.keys(payload).sort(), ["status", "success"]);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.ok(!JSON.stringify(payload).includes("private@example.test"));
  } finally {
    stripe.checkout.sessions.retrieve = originalRetrieve;
  }
});

test("session status prefers verified stored payment state and handles expired sessions", async () => {
  const stripe = getStripeClient();
  const originalRetrieve = stripe.checkout.sessions.retrieve;
  const paidId = remember("cs_test_status_paid");
  await StripePayment.create({ stripe_session_id: paidId, payment_status: "paid", email_status: "sent" });
  stripe.checkout.sessions.retrieve = async () => ({
    id: "cs_live_status_expired",
    mode: "payment",
    status: "expired",
    payment_status: "unpaid",
  });
  try {
    const paid = await fetch(`${ctx.api.baseUrl}/api/payments/session/${paidId}`);
    assert.deepEqual(await paid.json(), { success: true, status: "paid" });
    const expired = await fetch(`${ctx.api.baseUrl}/api/payments/session/cs_live_status_expired`);
    assert.deepEqual(await expired.json(), { success: true, status: "expired" });
  } finally {
    stripe.checkout.sessions.retrieve = originalRetrieve;
  }
});

test("a late async failure cannot downgrade a verified paid session or resend email", async () => {
  const before = emailCount();
  const session = buildSession();
  remember(session.id);
  const paid = await deliverEvent(buildEvent("checkout.session.completed", session));
  assert.equal(paid.status, 200);

  const lateFailure = {
    ...session,
    payment_status: "unpaid",
  };
  const failed = await deliverEvent(
    buildEvent("checkout.session.async_payment_failed", lateFailure)
  );
  assert.equal(failed.status, 200);
  const row = await rowFor(session.id);
  assert.equal(row.payment_status, "paid");
  assert.equal(row.email_status, "sent");
  assert.equal(emailCount() - before, 1);
});

/* ══════════════════════════════════════════════════════════════════════
   WEBHOOK CORRECTNESS
   ══════════════════════════════════════════════════════════════════════ */

test("verified completed+paid event records the payment and sends exactly one email", async () => {
  const before = emailCount();
  const session = buildSession();
  remember(session.id);

  const { status, payload } = await deliverEvent(
    buildEvent("checkout.session.completed", session)
  );

  assert.equal(status, 200);
  assert.equal(payload.received, true);
  assert.equal(payload.email, "sent");

  assert.equal(emailCount() - before, 1);

  const row = await rowFor(session.id);
  assert.equal(row.payment_status, "paid");
  assert.equal(row.email_status, "sent");
  assert.equal(row.email_attempts, 1);
  assert.equal(row.amount_total, 24900);
  assert.equal(row.currency, "usd");
  assert.ok(row.email_sent_at instanceof Date);
  assert.ok(row.email_lease_expires_at === null);

  /* Amount/currency in the email come from the verified session, and the
     idempotency key is derived from the session id. */
  const sent = ctx.provider.received[emailCount() - 1];
  assert.match(sent.body.subject, /Payment received/i);
  assert.match(sent.body.html, /249\.00|249/);
  assert.equal(sent.idempotencyKey, `payment-confirmation-${session.id}`);
  /* No booking promise. */
  assert.ok(!/booked|scheduled for|your (call|meeting) is on/i.test(sent.body.html));
});

test("the confirmation email uses the captured customer name when available", async () => {
  const before = emailCount();
  const session = buildSession({
    customer_details: {
      name: "Dana Founder",
      email: `named-${Date.now()}@systemaops.test`,
    },
  });
  remember(session.id);

  const { status } = await deliverEvent(
    buildEvent("checkout.session.completed", session)
  );
  assert.equal(status, 200);
  assert.equal(emailCount() - before, 1);

  const sent = ctx.provider.received[emailCount() - 1];
  assert.match(sent.body.html, /Hi Dana,/);
  assert.match(sent.body.html, /Dana Founder/);

  const row = await rowFor(session.id);
  assert.equal(row.customer_name, "Dana Founder");
});

test("a customer with no name still gets a valid confirmation email", async () => {
  const before = emailCount();
  const session = buildSession({
    customer_details: { name: "   ", email: `noname-${Date.now()}@systemaops.test` },
  });
  remember(session.id);

  const { status } = await deliverEvent(
    buildEvent("checkout.session.completed", session)
  );

  assert.equal(status, 200);
  assert.equal(emailCount() - before, 1);

  const sent = ctx.provider.received[emailCount() - 1];
  assert.match(sent.body.html, /Hello,/);
  assert.match(sent.body.html, /Not provided/);

  const row = await rowFor(session.id);
  assert.equal(row.customer_name, null);
});

test("a customer name is HTML-escaped in the confirmation email", async () => {
  const before = emailCount();
  const session = buildSession({
    customer_details: {
      name: "<script>alert(1)</script>",
      email: `xss-${Date.now()}@systemaops.test`,
    },
  });
  remember(session.id);

  const { status } = await deliverEvent(
    buildEvent("checkout.session.completed", session)
  );

  assert.equal(status, 200);
  const sent = ctx.provider.received[emailCount() - 1];
  assert.ok(!sent.body.html.includes("<script>"), "name must be escaped in the HTML part");
  assert.match(sent.body.html, /&lt;script&gt;/);
  /* The text/plain alternative is never rendered as HTML, so it stays
     human-readable rather than entity-encoded. */
});

test("the same event delivered twice sequentially sends one email and returns 200 both times", async () => {
  const before = emailCount();
  const session = buildSession();
  remember(session.id);
  const event = buildEvent("checkout.session.completed", session);

  const first = await deliverEvent(event);
  const second = await deliverEvent(event);

  assert.equal(first.status, 200);
  assert.equal(second.status, 200);
  assert.equal(emailCount() - before, 1);

  const row = await rowFor(session.id);
  assert.equal(row.email_status, "sent");
  assert.equal(row.email_attempts, 1);
});

test("concurrent deliveries of the same event send exactly one email", async () => {
  const before = emailCount();
  const session = buildSession();
  remember(session.id);
  const event = buildEvent("checkout.session.completed", session);

  const results = await Promise.all([
    deliverEvent(event),
    deliverEvent(event),
    deliverEvent(event),
    deliverEvent(event),
    deliverEvent(event),
  ]);

  for (const result of results) {
    assert.equal(result.status, 200);
  }

  assert.equal(emailCount() - before, 1, "exactly one email for concurrent deliveries");

  const row = await rowFor(session.id);
  assert.equal(row.payment_status, "paid");
  assert.equal(row.email_status, "sent");
});

test("state survives a restart: reconnecting and redelivering sends nothing new", async () => {
  const before = emailCount();
  const session = buildSession();
  remember(session.id);
  const event = buildEvent("checkout.session.completed", session);

  const first = await deliverEvent(event);
  assert.equal(first.status, 200);
  assert.equal(emailCount() - before, 1);

  /* Simulate a process restart: drop the DB connection and the memoized
     Stripe client, then reconnect and redeliver the same event. */
  await mongoose.disconnect();
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
  resetStripeClient();
  ctx.provider.setStatus(200);

  const second = await deliverEvent(event);
  assert.equal(second.status, 200);
  assert.equal(emailCount() - before, 1, "no second email after restart");

  const row = await rowFor(session.id);
  assert.equal(row.email_status, "sent");
});

test("missing signature is rejected with 400 and writes nothing", async () => {
  const before = emailCount();
  const session = buildSession();
  remember(session.id);

  const response = await fetch(`${ctx.api.baseUrl}/api/payments/webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildEvent("checkout.session.completed", session)),
  });

  assert.equal(response.status, 400);
  assert.equal(emailCount() - before, 0);
  assert.equal(await rowFor(session.id), null);
});

test("a tampered body is rejected with 400 and sends nothing", async () => {
  const before = emailCount();
  const session = buildSession();
  remember(session.id);
  const event = buildEvent("checkout.session.completed", session);

  /* Signed for one amount, delivered with another. */
  const result = await deliverEvent(event, {
    mutate: (payload) =>
      payload.replace('"amount_total":24900', '"amount_total":100'),
  });

  assert.equal(result.status, 400);
  assert.equal(emailCount() - before, 0);
  assert.equal(await rowFor(session.id), null);
});

test("a payload signed with the wrong secret is rejected with 400", async () => {
  const before = emailCount();
  const session = buildSession();
  remember(session.id);

  const result = await deliverEvent(buildEvent("checkout.session.completed", session), {
    secret: "whsec_completelyDifferentSecretValue",
  });

  assert.equal(result.status, 400);
  assert.equal(emailCount() - before, 0);
  assert.equal(await rowFor(session.id), null);
});

test("completed with payment_status unpaid records nothing and sends no email", async () => {
  const before = emailCount();
  const session = buildSession({ payment_status: "unpaid" });
  remember(session.id);

  const { status } = await deliverEvent(
    buildEvent("checkout.session.completed", session)
  );

  assert.equal(status, 200);
  assert.equal(emailCount() - before, 0);
  assert.equal(await rowFor(session.id), null);
});

test("async_payment_succeeded sends one email; async_payment_failed sends none and marks failed", async () => {
  const before = emailCount();

  const succeeded = buildSession();
  remember(succeeded.id);
  const ok = await deliverEvent(
    buildEvent("checkout.session.async_payment_succeeded", succeeded)
  );
  assert.equal(ok.status, 200);
  assert.equal(emailCount() - before, 1);
  const okRow = await rowFor(succeeded.id);
  assert.equal(okRow.payment_status, "paid");
  assert.equal(okRow.email_status, "sent");

  const failed = buildSession({ payment_status: "unpaid" });
  remember(failed.id);
  const bad = await deliverEvent(
    buildEvent("checkout.session.async_payment_failed", failed)
  );
  assert.equal(bad.status, 200);
  assert.equal(emailCount() - before, 1, "no email for a failed payment");

  const failedRow = await rowFor(failed.id);
  assert.equal(failedRow.payment_status, "failed");
  assert.equal(failedRow.email_status, "pending");
});

test("an unrelated event type is acknowledged and ignored", async () => {
  const before = emailCount();
  const session = buildSession();
  remember(session.id);

  const { status, payload } = await deliverEvent(
    buildEvent("customer.created", session)
  );

  assert.equal(status, 200);
  assert.equal(payload.ignored, true);
  assert.equal(emailCount() - before, 0);
  assert.equal(await rowFor(session.id), null);
});

test("the raw request body reaches the webhook unmodified through the real middleware order", async () => {
  /* The signature is computed over an EXACT byte string; if any parser
     re-serialized it, verification would fail. Asserting a valid 200 for a
     compact payload proves the raw bytes survived CORS + rate limiting +
     the global express.json() registered AFTER this route. */
  const before = emailCount();
  const session = buildSession();
  remember(session.id);
  const event = buildEvent("checkout.session.completed", session);

  const stripe = getStripeClient();
  const payload = JSON.stringify(event);
  const header = stripe.webhooks.generateTestHeaderString({
    payload,
    secret: TEST_WEBHOOK_SECRET,
  });

  const response = await fetch(`${ctx.api.baseUrl}/api/payments/webhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "stripe-signature": header,
      "X-Forwarded-For": "203.0.113.77",
    },
    body: payload,
  });

  assert.equal(response.status, 200);
  assert.equal(emailCount() - before, 1);
});

/* ══════════════════════════════════════════════════════════════════════
   EMAIL FAILURE AND RETRY
   ══════════════════════════════════════════════════════════════════════ */

test("email failure answers non-2xx, marks failed, increments attempts, keeps payment paid", async () => {
  const before = emailCount();
  const session = buildSession();
  remember(session.id);

  ctx.provider.setStatus(500);
  try {
    const { status } = await deliverEvent(
      buildEvent("checkout.session.completed", session)
    );
    assert.ok(status >= 500, `expected non-2xx, got ${status}`);
  } finally {
    ctx.provider.setStatus(200);
  }

  const row = await rowFor(session.id);
  assert.equal(row.payment_status, "paid");
  assert.equal(row.email_status, "failed");
  assert.ok(row.email_attempts >= 1);
  assert.ok(row.last_error && row.last_error.length <= 200);
  assert.equal(row.email_sent_at, null);
});

test("a Stripe retry after an email failure sends exactly one email", async () => {
  const session = buildSession();
  remember(session.id);
  const event = buildEvent("checkout.session.completed", session);

  ctx.provider.setStatus(500);
  try {
    const failed = await deliverEvent(event);
    assert.ok(failed.status >= 500);
  } finally {
    ctx.provider.setStatus(200);
  }

  const beforeRetry = emailCount();
  const retry = await deliverEvent(event);

  assert.equal(retry.status, 200);
  assert.equal(emailCount() - beforeRetry, 1, "retry delivers exactly one email");

  const row = await rowFor(session.id);
  assert.equal(row.email_status, "sent");
  assert.ok(row.email_attempts >= 2);

  /* One more delivery after success must send nothing. */
  const beforeFinal = emailCount();
  const final = await deliverEvent(event);
  assert.equal(final.status, 200);
  assert.equal(emailCount() - beforeFinal, 0, "no email once already sent");
});

test("a stale sending lease is reclaimed by a later delivery", async () => {
  const session = buildSession();
  remember(session.id);

  /* Simulate a crashed worker: claimed ('sending') but the lease expired. */
  await StripePayment.create({
    stripe_session_id: session.id,
    payment_status: "paid",
    amount_total: 24900,
    currency: "usd",
    customer_email: `lease-${Date.now()}@systemaops.test`,
    email_status: "sending",
    email_attempts: 1,
    email_lease_expires_at: new Date(Date.now() - 60 * 1000),
  });

  const before = emailCount();
  const { status } = await deliverEvent(
    buildEvent("checkout.session.completed", session)
  );

  assert.equal(status, 200);
  assert.equal(emailCount() - before, 1, "expired lease is reclaimed and delivered");

  const row = await rowFor(session.id);
  assert.equal(row.email_status, "sent");
  assert.ok(row.email_attempts >= 2);
});

/* ══════════════════════════════════════════════════════════════════════
   SECURITY
   ══════════════════════════════════════════════════════════════════════ */

test("no unauthenticated request can mark a payment paid or trigger the email", async () => {
  const before = emailCount();
  const session = buildSession();
  remember(session.id);

  const attempts = [
    { method: "POST", path: "/api/payments/webhook", body: JSON.stringify(buildEvent("checkout.session.completed", session)) },
    { method: "PUT", path: "/api/payments/create-checkout-session", body: JSON.stringify({}) },
    { method: "PATCH", path: "/api/payments/webhook", body: JSON.stringify({}) },
    { method: "POST", path: "/api/payments/mark-paid", body: JSON.stringify({ stripe_session_id: session.id }) },
    { method: "POST", path: "/api/payments/resend-email", body: JSON.stringify({ stripe_session_id: session.id }) },
    { method: "GET", path: "/api/payments/webhook", body: undefined },
    { method: "POST", path: "/api/payments", body: JSON.stringify({}) },
  ];

  for (const attempt of attempts) {
    const response = await fetch(`${ctx.api.baseUrl}${attempt.path}`, {
      method: attempt.method,
      headers: { "Content-Type": "application/json" },
      body: attempt.body,
    });
    assert.ok(
      response.status >= 400,
      `${attempt.method} ${attempt.path} should not succeed (got ${response.status})`
    );
  }

  assert.equal(emailCount() - before, 0, "no confirmation email from unauthenticated traffic");
  assert.equal(await rowFor(session.id), null, "no payment row created without a verified webhook");
});

test("responses and errors never leak secrets or webhook payloads", async () => {
  const session = buildSession();
  remember(session.id);

  /* Force a provider failure path and inspect the response body. */
  const result = await deliverEvent(
    buildEvent("checkout.session.completed", session),
    { secret: "whsec_wrongSecretForLeakCheck" }
  );
  const body = JSON.stringify(result.payload);

  assert.equal(result.status, 400);
  for (const secret of [TEST_SECRET_KEY, TEST_WEBHOOK_SECRET, TEST_PRICE_ID]) {
    assert.ok(!body.includes(secret), "response must not echo a secret");
  }
  assert.ok(!body.includes(session.customer_details.email), "response must not echo customer email");
  assert.ok(!/payload|signature=|stripe-signature/i.test(body));
});

test("the config module reports key names only, never values", () => {
  const config = getPaymentsConfig();
  assert.equal(config.configured, true);
  assert.ok(Array.isArray(config.missing));
  const rendered = JSON.stringify(config.missing);
  assert.ok(!rendered.includes(TEST_SECRET_KEY));
  assert.ok(!rendered.includes(TEST_WEBHOOK_SECRET));
});
