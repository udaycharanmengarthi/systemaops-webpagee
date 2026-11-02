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
 *   - Stripe Price/Session calls are stubbed on the client instance;
 *   - email goes to the local fake Resend endpoint (RESEND_BASE_URL).
 *
 * The configured Stripe Price is the source of truth for amount and
 * currency. Tests use EUR 50000 as a fixture, but validation and formatting
 * are exercised with INR, USD, EUR, zero-decimal (JPY) and three-decimal
 * (KWD) Prices. Quantity is always exactly 1.
 *
 * Run from Server/ with MongoDB available:
 *   node --env-file=.env --test tests/payments.test.js
 */
import assert from "node:assert/strict";
import test from "node:test";

import { startFakeProvider } from "./support/fakeResend.js";
import {
  startTestServer,
  post,
  clientHeaders,
} from "./support/testServer.js";
import Consultation from "../src/models/Consultation.js";
import StripePayment from "../src/models/StripePayment.js";
import StripeWebhookEvent from "../src/models/StripeWebhookEvent.js";
import {
  describePaymentsConfig,
  getPaymentsConfig,
  getPriceValidationIssues,
  getStripeClient,
  modeForStripeSecretKey,
  offerFromPrice,
  resetStripeClient,
} from "../src/config/payments.js";
import { formatMinorUnits } from "../src/utils/currency.js";
import { deliverConfirmationEmail } from "../src/services/payments.service.js";

const TEST_SECRET_KEY = "test_secret_key_placeholder";
const TEST_LIVE_KEY = "live_secret_key_placeholder";
const TEST_WEBHOOK_SECRET = "test_webhook_secret_placeholder";
const TEST_PRICE_ID = "price_test_placeholder";
const TEST_FRONTEND_URL = "http://localhost:5173";
const PRICE_AMOUNT = 50000;
const PRICE_CURRENCY = "eur";

const ctx = {
  api: null,
  provider: null,
  sessionIds: [],
  consultationIds: [],
  eventIds: [],
};

/* ── fixtures ───────────────────────────────────────────────────────────── */

let sessionCounter = 0;
const uniqueSessionId = () => {
  sessionCounter += 1;
  return `cs_test_pay_${Date.now()}_${sessionCounter}`;
};

const uniqueEventId = () =>
  `evt_test_pay_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const testEmail = (tag) =>
  `${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@systemaops.test`;

const makePrice = (overrides = {}) => ({
  id: TEST_PRICE_ID,
  object: "price",
  active: true,
  type: "one_time",
  recurring: null,
  livemode: false,
  currency: PRICE_CURRENCY,
  unit_amount: PRICE_AMOUNT,
  product: "prod_test_consultation",
  ...overrides,
});

const makeLineItem = (overrides = {}) => ({
  id: `li_test_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  object: "item",
  quantity: 1,
  amount_total: PRICE_AMOUNT,
  currency: PRICE_CURRENCY,
  price: makePrice(),
  ...overrides,
});

const makeSession = ({
  consultationId = null,
  id = uniqueSessionId(),
  ...overrides
} = {}) => {
  const metadata = consultationId
    ? {
        app: "systemaops-consultation",
        consultation_id: String(consultationId),
        price_id: TEST_PRICE_ID,
        quantity: "1",
        amount_minor: String(PRICE_AMOUNT),
        currency: PRICE_CURRENCY,
        attempt: "test-attempt",
      }
    : {};

  return {
    id,
    object: "checkout.session",
    livemode: false,
    mode: "payment",
    status: "complete",
    payment_status: "paid",
    amount_total: PRICE_AMOUNT,
    currency: PRICE_CURRENCY,
    payment_intent: `pi_test_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    client_reference_id: consultationId ? String(consultationId) : null,
    metadata,
    customer_details: {
      email: testEmail("payer"),
      name: "Dana Founder",
    },
    line_items: { object: "list", data: [makeLineItem()] },
    ...overrides,
  };
};

const makeEvent = (type, session, overrides = {}) => ({
  id: uniqueEventId(),
  object: "event",
  type,
  api_version: "2026-09-30.endive",
  created: Math.floor(Date.now() / 1000),
  livemode: false,
  pending_webhooks: 0,
  request: { id: null, idempotency_key: null },
  data: { object: session },
  ...overrides,
});

const createConsultation = async (overrides = {}) => {
  const doc = await Consultation.create({
    name: "Payment Tester",
    email: testEmail("consultation"),
    company: "",
    areaOfInterest: "ai-automation",
    message: "Testing the consultation payment lifecycle.",
    privacyAccepted: true,
    ...overrides,
  });
  ctx.consultationIds.push(doc._id);
  return doc;
};

const rememberSession = (sessionId) => {
  ctx.sessionIds.push(sessionId);
  return sessionId;
};

const linkSession = async (
  consultation,
  session,
  { paymentStatus = "pending", ...overrides } = {}
) => {
  await Consultation.updateOne(
    { _id: consultation._id },
    {
      $set: {
        stripeSessionId: session.id,
        paymentStatus,
        paymentPriceId: TEST_PRICE_ID,
        paymentAmountMinor: PRICE_AMOUNT,
        paymentCurrency: PRICE_CURRENCY,
        paymentQuantity: 1,
        paymentStartedAt: new Date(),
        ...overrides,
      },
    }
  );
};

const rowFor = (sessionId) =>
  StripePayment.findOne({ stripe_session_id: sessionId }).lean();

const consultationFor = (id) => Consultation.findById(id).lean();

const emailCount = () => ctx.provider.received.length;

const stubPriceRetrieve = (impl) => {
  getStripeClient().prices.retrieve = impl;
};

const stubSessionRetrieve = (impl) => {
  getStripeClient().checkout.sessions.retrieve = impl;
};

const stubCheckoutCreate = (impl) => {
  getStripeClient().checkout.sessions.create = impl;
};

/* Point STRIPE_PRICE_ID at a fixture Price for one test. Returns a restore
   function so the default configuration cannot leak into later tests. */
const configurePrice = (price, priceId = price?.id || TEST_PRICE_ID) => {
  const previous = process.env.STRIPE_PRICE_ID;
  process.env.STRIPE_PRICE_ID = priceId;
  stubPriceRetrieve(async (requested) => {
    assert.equal(requested, priceId);
    return price;
  });
  return () => {
    process.env.STRIPE_PRICE_ID = previous;
    stubPriceRetrieve(async (requested) => {
      assert.equal(requested, previous);
      return makePrice();
    });
  };
};

const missingSession = () =>
  Object.assign(new Error("No such checkout session"), {
    type: "StripeInvalidRequestError",
    code: "resource_missing",
  });

/** Sign a payload exactly like Stripe does and POST it to the webhook. */
async function deliverEvent(
  event,
  { secret = TEST_WEBHOOK_SECRET, mutate = null } = {}
) {
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

  ctx.eventIds.push(event.id);
  return { status: response.status, payload: payloadJson };
}

/* ── lifecycle ───────────────────────────────────────────────────────────── */

test.before(async () => {
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

test.beforeEach(() => {
  resetStripeClient();
  stubPriceRetrieve(async (priceId) => {
    assert.equal(priceId, TEST_PRICE_ID);
    return makePrice();
  });
  stubCheckoutCreate(async () => {
    const id = rememberSession(uniqueSessionId());
    return {
      id,
      object: "checkout.session",
      url: `https://checkout.stripe.com/c/pay/${id}`,
      status: "open",
      payment_status: "unpaid",
      livemode: false,
      mode: "payment",
      amount_total: PRICE_AMOUNT,
      currency: PRICE_CURRENCY,
    };
  });
  stubSessionRetrieve(async () => {
    throw missingSession();
  });
});

test.after(async () => {
  try {
    if (ctx.sessionIds.length > 0) {
      await StripePayment.deleteMany({
        stripe_session_id: { $in: ctx.sessionIds },
      });
    }
    if (ctx.consultationIds.length > 0) {
      await Consultation.deleteMany({ _id: { $in: ctx.consultationIds } });
    }
    if (ctx.eventIds.length > 0) {
      await StripeWebhookEvent.deleteMany({ event_id: { $in: ctx.eventIds } });
    }
  } catch (error) {
    console.error(`[tests] cleanup failed: ${error.message}`);
  }
  if (ctx.provider) await ctx.provider.close();
  if (ctx.api) await ctx.api.stop();
});

/* ══════════════════════════════════════════════════════════════════════
   CONFIGURATION INVARIANTS
   ══════════════════════════════════════════════════════════════════════ */

test("Stripe mode is derived only from the secret key prefix", () => {
  assert.equal(modeForStripeSecretKey(TEST_SECRET_KEY), "test");
  assert.equal(modeForStripeSecretKey(TEST_LIVE_KEY), "live");
  assert.equal(modeForStripeSecretKey("rk_test_abc"), "test");
  assert.equal(modeForStripeSecretKey("rk_live_abc"), "live");
  assert.equal(modeForStripeSecretKey("pk_test_public"), null);
  assert.equal(modeForStripeSecretKey(""), null);
  assert.equal(modeForStripeSecretKey(undefined), null);
});

test("the configured Price is the only source of amount and currency", () => {
  const cases = [
    { currency: "eur", unitAmount: 50000 },
    { currency: "inr", unitAmount: 100 },
    { currency: "usd", unitAmount: 2499 },
    { currency: "jpy", unitAmount: 1000 },
    { currency: "kwd", unitAmount: 123456 },
  ];

  for (const { currency, unitAmount } of cases) {
    const price = makePrice({ currency, unit_amount: unitAmount });
    assert.deepEqual(
      getPriceValidationIssues(price, { priceId: price.id, live: false }),
      [],
      `${currency} ${unitAmount} must be accepted`
    );
    assert.deepEqual(offerFromPrice(price), {
      priceId: price.id,
      amountMinor: unitAmount,
      currency,
      quantity: 1,
      valid: true,
    });
  }
});

test("currency formatting respects each currency's minor-unit exponent", () => {
  assert.equal(formatMinorUnits(50000, "eur"), "EUR 500.00");
  assert.equal(formatMinorUnits(100, "inr"), "INR 1.00");
  assert.equal(formatMinorUnits(2499, "usd"), "USD 24.99");
  /* Zero-decimal: 1000 JPY is 1,000 yen, never 10.00. */
  assert.equal(formatMinorUnits(1000, "jpy"), "JPY 1,000");
  /* Three-decimal: 123456 KWD is 123.456 dinars. */
  assert.equal(formatMinorUnits(123456, "kwd"), "KWD 123.456");
  assert.equal(formatMinorUnits(0, "usd"), "USD 0.00");
  assert.equal(formatMinorUnits(-1, "usd"), null);
  assert.equal(formatMinorUnits(1.5, "usd"), null);
  assert.equal(formatMinorUnits(100, "abc"), null);
  assert.equal(formatMinorUnits(100, "us"), null);
});

test("Price validation rejects missing, non-fixed and malformed Prices", () => {
  const cases = [
    ["missing", null, "price_missing"],
    ["inactive", makePrice({ active: false }), "price_inactive"],
    [
      "recurring type",
      makePrice({ type: "recurring", recurring: { interval: "month" } }),
      "price_recurring",
    ],
    [
      "recurring metadata",
      makePrice({ recurring: { interval: "year" } }),
      "price_recurring",
    ],
    ["wrong mode", makePrice({ livemode: true }), "price_mode_mismatch"],
    [
      "tiered billing scheme",
      makePrice({ billing_scheme: "tiered" }),
      "price_billing_scheme_unsupported",
    ],
    [
      "tiered price",
      makePrice({ tiers: [{ up_to: 1, unit_amount: 100 }] }),
      "price_tiered_unsupported",
    ],
    [
      "tiered mode",
      makePrice({ tiers_mode: "graduated" }),
      "price_tiered_unsupported",
    ],
    [
      "customer-chosen amount",
      makePrice({ custom_unit_amount: { preset: 1000 } }),
      "price_custom_amount_unsupported",
    ],
    [
      "quantity transform",
      makePrice({ transform_quantity: { divide_by: 2, round: "up" } }),
      "price_quantity_transform_unsupported",
    ],
    [
      "multi-currency options",
      makePrice({ currency_options: { usd: { unit_amount: 100 } } }),
      "price_multi_currency_unsupported",
    ],
    ["zero amount", makePrice({ unit_amount: 0 }), "price_amount_invalid"],
    ["negative amount", makePrice({ unit_amount: -100 }), "price_amount_invalid"],
    ["fractional amount", makePrice({ unit_amount: 10.5 }), "price_amount_invalid"],
    ["missing amount", makePrice({ unit_amount: null }), "price_amount_invalid"],
    ["malformed currency", makePrice({ currency: "us" }), "price_currency_invalid"],
    ["unknown currency", makePrice({ currency: "abc" }), "price_currency_unsupported"],
    ["missing currency", makePrice({ currency: null }), "price_currency_invalid"],
  ];

  for (const [label, price, reason] of cases) {
    const issues = getPriceValidationIssues(price, {
      priceId: TEST_PRICE_ID,
      live: false,
    });
    assert.ok(issues.includes(reason), `${label}: expected ${reason}, got ${issues}`);
  }
});

test("Price validation rejects a Price that is not the configured id", () => {
  assert.ok(
    getPriceValidationIssues(makePrice({ id: "price_other" }), {
      priceId: TEST_PRICE_ID,
      live: false,
    }).includes("price_id_mismatch")
  );
});

test("the startup summary reports mode/flags but never a secret", () => {
  const summary = describePaymentsConfig();
  assert.equal(summary.configured, true);
  assert.equal(summary.mode, "test");
  assert.equal(summary.priceConfigured, true);
  assert.equal(summary.offerValid, undefined);

  const rendered = JSON.stringify(summary);
  assert.ok(!rendered.includes(TEST_SECRET_KEY));
  assert.ok(!rendered.includes(TEST_WEBHOOK_SECRET));
  assert.ok(!rendered.includes(TEST_PRICE_ID));

  const config = getPaymentsConfig();
  assert.equal(config.live, false);
  assert.deepEqual(config.missing, []);
});

/* ══════════════════════════════════════════════════════════════════════
   PUBLIC OFFER
   ══════════════════════════════════════════════════════════════════════ */

test("the offer endpoint returns the configured Price with no-store", async () => {
  const response = await fetch(`${ctx.api.baseUrl}/api/payments/offer`, {
    headers: clientHeaders(),
  });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(payload, {
    success: true,
    offer: {
      amountMinor: PRICE_AMOUNT,
      currency: PRICE_CURRENCY,
      formattedAmount: "EUR 500.00",
      quantity: 1,
    },
  });
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.ok(!JSON.stringify(payload).includes(TEST_PRICE_ID));
});

test("the offer follows the configured Price for INR, USD, EUR, JPY and KWD", async () => {
  const cases = [
    {
      priceId: "price_dynamic_inr",
      price: makePrice({
        id: "price_dynamic_inr",
        currency: "inr",
        unit_amount: 100,
      }),
      offer: {
        amountMinor: 100,
        currency: "inr",
        formattedAmount: "INR 1.00",
        quantity: 1,
      },
    },
    {
      priceId: "price_dynamic_usd",
      price: makePrice({
        id: "price_dynamic_usd",
        currency: "usd",
        unit_amount: 2499,
      }),
      offer: {
        amountMinor: 2499,
        currency: "usd",
        formattedAmount: "USD 24.99",
        quantity: 1,
      },
    },
    {
      priceId: "price_dynamic_eur",
      price: makePrice({
        id: "price_dynamic_eur",
        currency: "eur",
        unit_amount: 75000,
      }),
      offer: {
        amountMinor: 75000,
        currency: "eur",
        formattedAmount: "EUR 750.00",
        quantity: 1,
      },
    },
    {
      priceId: "price_dynamic_jpy",
      price: makePrice({
        id: "price_dynamic_jpy",
        currency: "jpy",
        unit_amount: 1000,
      }),
      offer: {
        amountMinor: 1000,
        currency: "jpy",
        formattedAmount: "JPY 1,000",
        quantity: 1,
      },
    },
    {
      priceId: "price_dynamic_kwd",
      price: makePrice({
        id: "price_dynamic_kwd",
        currency: "kwd",
        unit_amount: 123456,
      }),
      offer: {
        amountMinor: 123456,
        currency: "kwd",
        formattedAmount: "KWD 123.456",
        quantity: 1,
      },
    },
  ];

  for (const { priceId, price, offer } of cases) {
    const restore = configurePrice(price, priceId);
    try {
      const response = await fetch(`${ctx.api.baseUrl}/api/payments/offer`, {
        headers: clientHeaders(),
      });
      const payload = await response.json();

      assert.equal(response.status, 200, priceId);
      assert.deepEqual(payload, { success: true, offer }, priceId);
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.ok(!JSON.stringify(payload).includes(priceId));
    } finally {
      restore();
    }
  }
});

test("an invalid Price cannot be offered", async () => {
  const invalidPrices = [
    makePrice({ active: false }),
    makePrice({ type: "recurring", recurring: { interval: "month" } }),
    makePrice({ livemode: true }),
    makePrice({ billing_scheme: "tiered" }),
    makePrice({ tiers: [{ up_to: 1, unit_amount: 100 }] }),
    makePrice({ custom_unit_amount: { preset: 1000 } }),
    makePrice({ unit_amount: 0 }),
    makePrice({ unit_amount: -100 }),
    makePrice({ currency: "abc" }),
    makePrice({ id: "price_not_the_configured_one" }),
  ];

  for (const price of invalidPrices) {
    const priceId = TEST_PRICE_ID;
    const restore = configurePrice(price, priceId);
    try {
      const response = await fetch(`${ctx.api.baseUrl}/api/payments/offer`, {
        headers: clientHeaders(),
      });
      const payload = await response.json();

      assert.equal(response.status, 503);
      assert.equal(payload.success, false);
      const body = JSON.stringify(payload);
      assert.ok(!body.includes("amountMinor"));
      assert.ok(!body.includes("currency"));
    } finally {
      restore();
    }
  }
});

test("a provider failure cannot leak details through the offer endpoint", async () => {
  stubPriceRetrieve(async () => {
    throw Object.assign(new Error("provider details must not leak"), {
      type: "StripeConnectionError",
      code: "connection_error",
    });
  });

  const response = await fetch(`${ctx.api.baseUrl}/api/payments/offer`, {
    headers: clientHeaders(),
  });
  const payload = await response.json();

  assert.equal(response.status, 502);
  assert.equal(payload.success, false);
  assert.ok(!JSON.stringify(payload).includes("provider details"));
});

/* ══════════════════════════════════════════════════════════════════════
   CREATE CHECKOUT SESSION
   ══════════════════════════════════════════════════════════════════════ */

test("checkout requires a real consultation and never creates an unlinked session", async () => {
  const calls = [];
  stubCheckoutCreate(async (params) => {
    calls.push(params);
    return { id: uniqueSessionId(), url: "https://checkout.stripe.com/c/pay/x" };
  });

  const missing = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    {}
  );
  assert.equal(missing.status, 400);

  const malformed = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { consultationId: "not-an-id" }
  );
  assert.equal(malformed.status, 400);

  const unknown = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { consultationId: "000000000000000000000000" }
  );
  assert.equal(unknown.status, 404);

  assert.equal(calls.length, 0);
});

test("checkout creates ONE line item at the server Price, quantity 1", async () => {
  const calls = [];
  stubCheckoutCreate(async (params) => {
    calls.push(params);
    return {
      id: rememberSession(uniqueSessionId()),
      url: "https://checkout.stripe.com/c/pay/approved",
    };
  });

  const enquiry = await createConsultation();

  const { status, payload } = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    {
      consultationId: String(enquiry._id),
      name: "  Dana Founder  ",
      email: "Dana@SystemaOps.Test",
    }
  );

  assert.equal(status, 200);
  assert.equal(payload.url, "https://checkout.stripe.com/c/pay/approved");
  assert.equal(calls.length, 1);

  const params = calls[0];
  assert.equal(params.mode, "payment");
  assert.deepEqual(params.line_items, [
    { price: TEST_PRICE_ID, quantity: 1 },
  ]);
  assert.equal(params.quantity, undefined);
  assert.equal(params.customer_email, "dana@systemaops.test");
  assert.equal(
    Object.prototype.hasOwnProperty.call(params, "customer_name"),
    false,
    "customer_name must never be sent to Stripe"
  );

  assert.equal(params.metadata.app, "systemaops-consultation");
  assert.equal(params.metadata.consultation_id, String(enquiry._id));
  assert.equal(params.metadata.price_id, TEST_PRICE_ID);
  assert.equal(params.metadata.quantity, "1");
  assert.equal(params.metadata.amount_minor, String(PRICE_AMOUNT));
  assert.equal(params.metadata.currency, PRICE_CURRENCY);

  const metadataBlob = JSON.stringify(params.metadata).toLowerCase();
  for (const leak of ["dana", "@", "systemaops.test", "founder"]) {
    assert.ok(!metadataBlob.includes(leak), `metadata leaked "${leak}"`);
  }

  assert.equal(
    params.success_url,
    `${TEST_FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`
  );
  assert.equal(
    params.cancel_url,
    `${TEST_FRONTEND_URL}/payment/cancel?consultation_id=${enquiry._id}`
  );

  const stored = await consultationFor(enquiry._id);
  assert.equal(stored.paymentStatus, "pending");
  assert.ok(stored.stripeSessionId);
  assert.equal(stored.paymentPriceId, TEST_PRICE_ID);
  assert.equal(stored.paymentAmountMinor, PRICE_AMOUNT);
  assert.equal(stored.paymentCurrency, PRICE_CURRENCY);
  assert.equal(stored.paymentQuantity, 1);
  assert.equal(stored.checkoutLockUntil, null);
  assert.equal(stored.checkoutLockToken, null);
});

test("checkout uses and snapshots the actual configured Price (INR and JPY)", async () => {
  const cases = [
    { priceId: "price_checkout_inr", currency: "inr", amountMinor: 100 },
    { priceId: "price_checkout_jpy", currency: "jpy", amountMinor: 1000 },
  ];

  for (const { priceId, currency, amountMinor } of cases) {
    const captured = [];
    stubCheckoutCreate(async (params) => {
      captured.push(params);
      const id = rememberSession(uniqueSessionId());
      return { id, url: `https://checkout.stripe.com/c/pay/${id}` };
    });

    const restore = configurePrice(
      makePrice({ id: priceId, currency, unit_amount: amountMinor }),
      priceId
    );

    try {
      const enquiry = await createConsultation();
      const { status } = await post(
        ctx.api.baseUrl,
        "/api/payments/create-checkout-session",
        {
          consultationId: String(enquiry._id),
          amountMinor: 1,
          currency: "usd",
          quantity: 99,
        }
      );

      /* Commercial fields make the request invalid, even when the server
         Price is non-EUR. */
      assert.equal(status, 400);
      assert.equal(captured.length, 0);

      const accepted = await post(
        ctx.api.baseUrl,
        "/api/payments/create-checkout-session",
        { consultationId: String(enquiry._id) }
      );
      assert.equal(accepted.status, 200);
      assert.equal(captured.length, 1);
      assert.deepEqual(captured[0].line_items, [
        { price: priceId, quantity: 1 },
      ]);
      assert.equal(captured[0].metadata.price_id, priceId);
      assert.equal(captured[0].metadata.amount_minor, String(amountMinor));
      assert.equal(captured[0].metadata.currency, currency);
      assert.equal(captured[0].metadata.quantity, "1");

      const stored = await consultationFor(enquiry._id);
      assert.equal(stored.paymentPriceId, priceId);
      assert.equal(stored.paymentAmountMinor, amountMinor);
      assert.equal(stored.paymentCurrency, currency);
      assert.equal(stored.paymentQuantity, 1);
    } finally {
      restore();
    }
  }
});

test("client-supplied commercial fields are rejected before Stripe is called", async () => {
  let calls = 0;
  stubCheckoutCreate(async () => {
    calls += 1;
    return { id: uniqueSessionId(), url: "https://checkout.stripe.com/c/pay/x" };
  });

  const enquiry = await createConsultation();

  const { status, payload } = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    {
      consultationId: String(enquiry._id),
      price: "price_attacker_free",
      priceId: "price_attacker_free",
      amount: 1,
      amountMinor: 100,
      currency: "inr",
      quantity: 99,
      line_items: [{ price: "price_attacker_free", quantity: 99 }],
      unit_amount: 100,
    }
  );

  assert.equal(status, 400);
  assert.equal(payload.success, false);
  assert.match(payload.message, /controlled by the server/i);
  assert.equal(calls, 0);

  const stored = await consultationFor(enquiry._id);
  assert.equal(stored.stripeSessionId, null);
});

test("a repeat request reuses the open matching session", async () => {
  let created = 0;
  stubCheckoutCreate(async () => {
    created += 1;
    const id = rememberSession(uniqueSessionId());
    return { id, url: `https://checkout.stripe.com/c/pay/${id}` };
  });

  const enquiry = await createConsultation();
  const first = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { consultationId: String(enquiry._id) }
  );
  assert.equal(first.status, 200);
  assert.equal(created, 1);

  const stored = await consultationFor(enquiry._id);
  const session = makeSession({
    consultationId: enquiry._id,
    id: stored.stripeSessionId,
    status: "open",
    payment_status: "unpaid",
  });
  stubSessionRetrieve(async (id) => {
    assert.equal(id, stored.stripeSessionId);
    return { ...session, url: `https://checkout.stripe.com/c/pay/${id}` };
  });

  const second = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { consultationId: String(enquiry._id) }
  );

  assert.equal(second.status, 200);
  assert.equal(
    second.payload.url,
    `https://checkout.stripe.com/c/pay/${stored.stripeSessionId}`
  );
  assert.equal(created, 1, "no second Checkout Session may be created");
});

test("an open session with wrong commercial terms is never reused", async () => {
  let created = 0;
  stubCheckoutCreate(async () => {
    created += 1;
    const id = rememberSession(uniqueSessionId());
    return { id, url: `https://checkout.stripe.com/c/pay/${id}` };
  });

  const enquiry = await createConsultation();
  const session = makeSession({
    consultationId: enquiry._id,
    status: "open",
    payment_status: "unpaid",
    amount_total: 100,
    currency: "inr",
    line_items: {
      object: "list",
      data: [makeLineItem({ amount_total: 100, currency: "inr", price: makePrice({ currency: "inr", unit_amount: 100 }) })],
    },
  });
  rememberSession(session.id);
  await linkSession(enquiry, session);
  stubSessionRetrieve(async () => ({
    ...session,
    url: `https://checkout.stripe.com/c/pay/${session.id}`,
  }));

  const { status, payload } = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { consultationId: String(enquiry._id) }
  );

  assert.equal(status, 409);
  assert.equal(payload.success, false);
  assert.equal(created, 0);
});

test("a transient session-retrieval failure fails closed instead of creating a second session", async () => {
  let created = 0;
  stubCheckoutCreate(async () => {
    created += 1;
    const id = rememberSession(uniqueSessionId());
    return { id, url: `https://checkout.stripe.com/c/pay/${id}` };
  });

  const enquiry = await createConsultation();
  const session = makeSession({
    consultationId: enquiry._id,
    status: "open",
    payment_status: "unpaid",
  });
  rememberSession(session.id);
  await linkSession(enquiry, session);

  stubSessionRetrieve(async () => {
    throw Object.assign(new Error("socket hang up"), {
      type: "StripeConnectionError",
      code: "connection_error",
    });
  });

  const { status, payload } = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { consultationId: String(enquiry._id) }
  );

  assert.equal(status, 502);
  assert.equal(payload.success, false);
  assert.match(payload.message, /unable to verify the existing checkout/i);
  assert.equal(created, 0, "an unverifiable old session must not be replaced");

  const stored = await consultationFor(enquiry._id);
  assert.equal(stored.stripeSessionId, session.id, "the original link is preserved");
});

test("an already-paid consultation is refused", async () => {
  let created = 0;
  stubCheckoutCreate(async () => {
    created += 1;
    return { id: uniqueSessionId(), url: "https://stripe.test/x" };
  });

  const enquiry = await createConsultation({ paymentStatus: "paid" });

  const { status } = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { consultationId: String(enquiry._id) }
  );

  assert.equal(status, 409);
  assert.equal(created, 0);
});

test("a legitimate repeat purchase uses a new enquiry, never the paid one", async () => {
  const calls = [];
  stubCheckoutCreate(async (params) => {
    calls.push(params);
    const id = rememberSession(uniqueSessionId());
    return { id, url: `https://checkout.stripe.com/c/pay/${id}` };
  });

  /* A previous, already-paid order for the same customer. */
  const priorSession = makeSession({ id: uniqueSessionId() });
  rememberSession(priorSession.id);
  const paid = await createConsultation();
  await linkSession(paid, priorSession, {
    paymentStatus: "paid",
    paidAt: new Date(),
  });

  /* The customer comes back and submits a NEW enquiry. That new order is a
     legitimate second purchase and must be allowed exactly one session. */
  const repeat = await createConsultation();

  const refused = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { consultationId: String(paid._id) }
  );
  assert.equal(refused.status, 409, "the paid order is never charged twice");
  assert.equal(calls.length, 0);

  const second = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { consultationId: String(repeat._id) }
  );
  assert.equal(second.status, 200);
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].line_items, [
    { price: TEST_PRICE_ID, quantity: 1 },
  ]);

  const stored = await consultationFor(repeat._id);
  assert.equal(stored.paymentStatus, "pending");
  assert.equal(stored.paymentAmountMinor, PRICE_AMOUNT);
  assert.equal(stored.paymentCurrency, PRICE_CURRENCY);
  assert.equal(stored.paymentQuantity, 1);
  assert.notEqual(stored.stripeSessionId, priorSession.id);

  const paidStored = await consultationFor(paid._id);
  assert.equal(paidStored.paymentStatus, "paid");
  assert.equal(paidStored.stripeSessionId, priorSession.id);
});

test("changing STRIPE_PRICE_ID does not invalidate an in-flight checkout", async () => {
  const enquiry = await createConsultation();
  const checkout = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { consultationId: String(enquiry._id) }
  );
  assert.equal(checkout.status, 200);

  const stored = await consultationFor(enquiry._id);
  const session = makeSession({
    consultationId: enquiry._id,
    id: stored.stripeSessionId,
  });
  rememberSession(session.id);

  /* The owner rotates to an INR Price after the customer already started
     an EUR checkout. The stored per-consultation snapshot stays
     authoritative for that session. */
  const restore = configurePrice(
    makePrice({ id: "price_replaced_inr", currency: "inr", unit_amount: 100 }),
    "price_replaced_inr"
  );

  try {
    stubSessionRetrieve(async (id) => {
      assert.equal(id, session.id);
      return session;
    });

    const status = await fetch(
      `${ctx.api.baseUrl}/api/payments/session/${session.id}`,
      { headers: clientHeaders() }
    );
    assert.deepEqual(await status.json(), { success: true, status: "paid" });

    const freshOffer = await fetch(`${ctx.api.baseUrl}/api/payments/offer`, {
      headers: clientHeaders(),
    });
    assert.deepEqual((await freshOffer.json()).offer, {
      amountMinor: 100,
      currency: "inr",
      formattedAmount: "INR 1.00",
      quantity: 1,
    });

    const before = emailCount();
    const delivered = await deliverEvent(
      makeEvent("checkout.session.completed", session)
    );
    assert.equal(delivered.status, 200);
    assert.equal(delivered.payload.email, "sent");
    assert.equal(emailCount() - before, 1);

    /* The email describes what was actually charged, not the new Price. */
    const sent = ctx.provider.received[emailCount() - 1];
    assert.match(sent.body.html, /EUR 500\.00/);
    assert.ok(!sent.body.html.includes("INR"));

    const row = await rowFor(session.id);
    assert.equal(row.payment_status, "paid");
    assert.equal(row.amount_total, PRICE_AMOUNT);
    assert.equal(row.currency, PRICE_CURRENCY);
    assert.equal(row.price_id, TEST_PRICE_ID);
    assert.equal((await consultationFor(enquiry._id)).paymentStatus, "paid");
  } finally {
    restore();
  }
});

test("concurrent clicks create at most one Checkout Session", async () => {
  let created = 0;
  stubCheckoutCreate(async () => {
    created += 1;
    await new Promise((resolve) => setTimeout(resolve, 60));
    const id = rememberSession(uniqueSessionId());
    return { id, url: `https://checkout.stripe.com/c/pay/${id}` };
  });

  const enquiry = await createConsultation();

  const results = await Promise.all([
    post(ctx.api.baseUrl, "/api/payments/create-checkout-session", {
      consultationId: String(enquiry._id),
    }),
    post(ctx.api.baseUrl, "/api/payments/create-checkout-session", {
      consultationId: String(enquiry._id),
    }),
  ]);

  assert.equal(created, 1, "exactly one session may be created");
  assert.ok(
    results.some((result) => result.status === 200),
    "at least one request must return a checkout URL"
  );
  for (const result of results) {
    assert.ok([200, 409].includes(result.status), `unexpected ${result.status}`);
  }
});

test("a Stripe create failure returns a safe 502 and releases the lock", async () => {
  stubCheckoutCreate(async () => {
    throw Object.assign(new Error("Invalid API key provided: sk_live_***"), {
      type: "StripeAuthenticationError",
      code: "api_key_invalid",
      requestId: "req_safe_123",
    });
  });

  const enquiry = await createConsultation();

  const { status, payload } = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { consultationId: String(enquiry._id) }
  );

  assert.equal(status, 502);
  assert.equal(payload.success, false);
  const body = JSON.stringify(payload);
  assert.ok(!body.includes("sk_live"));
  assert.ok(!body.includes("Invalid API key"));
  assert.ok(!body.includes("api_key_invalid"));
  assert.ok(!body.includes("req_safe_123"));
  assert.match(body, /Unable to start checkout/i);

  const stored = await consultationFor(enquiry._id);
  assert.equal(stored.checkoutLockUntil, null);
  assert.equal(stored.checkoutLockToken, null);
  assert.equal(stored.stripeSessionId, null);
});

test("a test-mode deployment rejects a live-mode Price before creating checkout", async () => {
  stubPriceRetrieve(async () => makePrice({ livemode: true }));

  const enquiry = await createConsultation();
  let created = 0;
  stubCheckoutCreate(async () => {
    created += 1;
    return { id: uniqueSessionId(), url: "https://checkout.stripe.com/c/pay/x" };
  });

  const { status } = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { consultationId: String(enquiry._id) }
  );

  assert.equal(status, 503);
  assert.equal(created, 0);
});

test("unconfigured Stripe answers 503 while unrelated routes keep working", async () => {
  const previous = {
    secret: process.env.STRIPE_SECRET_KEY,
    webhook: process.env.STRIPE_WEBHOOK_SECRET,
    price: process.env.STRIPE_PRICE_ID,
    frontend: process.env.FRONTEND_URL,
  };

  process.env.STRIPE_SECRET_KEY = "sk_test_REPLACE_ME";
  process.env.STRIPE_WEBHOOK_SECRET = "";
  process.env.STRIPE_PRICE_ID = "";
  process.env.FRONTEND_URL = "";
  resetStripeClient();

  try {
    const payments = await post(
      ctx.api.baseUrl,
      "/api/payments/create-checkout-session",
      {}
    );
    assert.equal(payments.status, 503);
    assert.equal(payments.payload.success, false);
    assert.match(payments.payload.message, /not configured/i);

    const offer = await fetch(`${ctx.api.baseUrl}/api/payments/offer`, {
      headers: clientHeaders(),
    });
    assert.equal(offer.status, 503);

    const hook = await fetch(`${ctx.api.baseUrl}/api/payments/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "stripe-signature": "t=1,v1=deadbeef",
      },
      body: "{}",
    });
    assert.equal(hook.status, 503);

    const root = await fetch(`${ctx.api.baseUrl}/`);
    assert.equal(root.status, 200);
    const health = await fetch(`${ctx.api.baseUrl}/health`);
    assert.equal(health.status, 200);
    assert.equal((await health.json()).ok, true);
  } finally {
    process.env.STRIPE_SECRET_KEY = previous.secret;
    process.env.STRIPE_WEBHOOK_SECRET = previous.webhook;
    process.env.STRIPE_PRICE_ID = previous.price;
    process.env.FRONTEND_URL = previous.frontend;
    resetStripeClient();
  }
});

/* ══════════════════════════════════════════════════════════════════════
   SESSION STATUS (read-only)
   ══════════════════════════════════════════════════════════════════════ */

test("session status validates the reference and returns only normalized state", async () => {
  const session = makeSession({
    status: "open",
    payment_status: "unpaid",
  });
  rememberSession(session.id);
  stubSessionRetrieve(async (id) => {
    assert.equal(id, session.id);
    return session;
  });

  const bad = await fetch(
    `${ctx.api.baseUrl}/api/payments/session/not-a-session`,
    { headers: clientHeaders() }
  );
  assert.equal(bad.status, 400);

  const response = await fetch(
    `${ctx.api.baseUrl}/api/payments/session/${session.id}`,
    { headers: clientHeaders() }
  );
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.status, "pending");
  assert.deepEqual(Object.keys(payload).sort(), ["status", "success"]);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.ok(!JSON.stringify(payload).includes("payer-"));
});

test("stored terminal states are returned without calling Stripe", async () => {
  const paidId = rememberSession(uniqueSessionId());
  const expiredId = rememberSession(uniqueSessionId());
  await StripePayment.create({
    stripe_session_id: paidId,
    payment_status: "paid",
    livemode: false,
    email_status: "sent",
  });
  await StripePayment.create({
    stripe_session_id: expiredId,
    payment_status: "expired",
    livemode: false,
  });

  stubSessionRetrieve(async () => {
    throw new Error("Stripe must not be called for stored terminal state");
  });

  const paid = await fetch(`${ctx.api.baseUrl}/api/payments/session/${paidId}`, {
    headers: clientHeaders(),
  });
  assert.deepEqual(await paid.json(), { success: true, status: "paid" });

  const expired = await fetch(
    `${ctx.api.baseUrl}/api/payments/session/${expiredId}`,
    { headers: clientHeaders() }
  );
  assert.deepEqual(await expired.json(), { success: true, status: "expired" });
});

test("a paid session that does not match the configured Price is never reported as paid", async () => {
  const session = makeSession({
    amount_total: 100,
    currency: "inr",
    line_items: {
      object: "list",
      data: [
        makeLineItem({
          amount_total: 100,
          currency: "inr",
          price: makePrice({ currency: "inr", unit_amount: 100 }),
        }),
      ],
    },
  });
  rememberSession(session.id);
  stubSessionRetrieve(async () => session);

  const response = await fetch(
    `${ctx.api.baseUrl}/api/payments/session/${session.id}`,
    { headers: clientHeaders() }
  );
  const payload = await response.json();

  assert.equal(response.status, 502);
  assert.equal(payload.success, false);
  assert.notEqual(payload.status, "paid");
  const body = JSON.stringify(payload);
  assert.ok(!body.includes("inr"));
  assert.ok(!body.includes("100"));
});

test("session status accepts a zero-decimal Price in minor units", async () => {
  const priceId = "price_status_jpy";
  const restore = configurePrice(
    makePrice({ id: priceId, currency: "jpy", unit_amount: 1000 }),
    priceId
  );

  try {
    const session = makeSession({
      amount_total: 1000,
      currency: "jpy",
      line_items: {
        object: "list",
        data: [
          makeLineItem({
            amount_total: 1000,
            currency: "jpy",
            price: makePrice({
              id: priceId,
              currency: "jpy",
              unit_amount: 1000,
            }),
          }),
        ],
      },
    });
    rememberSession(session.id);
    stubSessionRetrieve(async () => session);

    const response = await fetch(
      `${ctx.api.baseUrl}/api/payments/session/${session.id}`,
      { headers: clientHeaders() }
    );
    assert.deepEqual(await response.json(), { success: true, status: "paid" });
  } finally {
    restore();
  }
});

test("a linked consultation with an invalid commercial snapshot is not reported paid", async () => {
  const enquiry = await createConsultation();
  const session = makeSession({ consultationId: enquiry._id });
  rememberSession(session.id);
  await linkSession(enquiry, session, { paymentAmountMinor: 0 });
  stubSessionRetrieve(async () => session);

  const response = await fetch(
    `${ctx.api.baseUrl}/api/payments/session/${session.id}`,
    { headers: clientHeaders() }
  );
  const payload = await response.json();

  assert.equal(response.status, 502);
  assert.equal(payload.success, false);
  assert.equal(payload.status, undefined);
});

test("a session from the other Stripe mode is not found", async () => {
  const session = makeSession({ livemode: true });
  rememberSession(session.id);
  stubSessionRetrieve(async () => session);

  const response = await fetch(
    `${ctx.api.baseUrl}/api/payments/session/${session.id}`,
    { headers: clientHeaders() }
  );
  assert.equal(response.status, 404);
});

test("an expired session is reported as expired, not paid", async () => {
  const session = makeSession({ status: "expired", payment_status: "unpaid" });
  rememberSession(session.id);
  stubSessionRetrieve(async () => session);

  const response = await fetch(
    `${ctx.api.baseUrl}/api/payments/session/${session.id}`,
    { headers: clientHeaders() }
  );
  assert.deepEqual(await response.json(), { success: true, status: "expired" });
});

/* ══════════════════════════════════════════════════════════════════════
   WEBHOOK CORRECTNESS
   ══════════════════════════════════════════════════════════════════════ */

test("missing, tampered and wrongly-signed webhooks are rejected with 400", async () => {
  const before = emailCount();
  const session = makeSession();
  rememberSession(session.id);
  const event = makeEvent("checkout.session.completed", session);

  const missing = await fetch(`${ctx.api.baseUrl}/api/payments/webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(event),
  });
  assert.equal(missing.status, 400);

  const tampered = await deliverEvent(event, {
    mutate: (payload) =>
      payload.replace(
        `"amount_total":${PRICE_AMOUNT}`,
        '"amount_total":100'
      ),
  });
  assert.equal(tampered.status, 400);

  const wrongSecret = await deliverEvent(event, {
    secret: "whsec_completelyDifferentSecretValue",
  });
  assert.equal(wrongSecret.status, 400);

  assert.equal(emailCount() - before, 0);
  assert.equal(await rowFor(session.id), null);
});

test("an unhandled event type is acknowledged and ignored", async () => {
  const before = emailCount();
  const session = makeSession();
  rememberSession(session.id);

  const { status, payload } = await deliverEvent(
    makeEvent("customer.created", session)
  );

  assert.equal(status, 200);
  assert.equal(payload.ignored, true);
  assert.equal(emailCount() - before, 0);
  assert.equal(await rowFor(session.id), null);
});

test("a verified paid event records the payment and sends exactly one email", async () => {
  const before = emailCount();
  const enquiry = await createConsultation();
  const session = makeSession({ consultationId: enquiry._id });
  rememberSession(session.id);
  await linkSession(enquiry, session);
  stubSessionRetrieve(async () => session);

  const { status, payload } = await deliverEvent(
    makeEvent("checkout.session.completed", session)
  );

  assert.equal(status, 200);
  assert.equal(payload.received, true);
  assert.equal(payload.email, "sent");
  assert.equal(emailCount() - before, 1);

  const row = await rowFor(session.id);
  assert.equal(row.payment_status, "paid");
  assert.equal(row.email_status, "sent");
  assert.equal(row.email_attempts, 1);
  assert.equal(row.amount_total, PRICE_AMOUNT);
  assert.equal(row.currency, PRICE_CURRENCY);
  assert.equal(row.livemode, false);
  assert.equal(row.price_id, TEST_PRICE_ID);
  assert.equal(row.quantity, 1);
  assert.equal(String(row.consultation_id), String(enquiry._id));
  assert.ok(row.email_sent_at instanceof Date);
  assert.equal(row.email_lease_expires_at, null);

  const paid = await consultationFor(enquiry._id);
  assert.equal(paid.paymentStatus, "paid");
  assert.ok(paid.paidAt instanceof Date);

  const sent = ctx.provider.received[emailCount() - 1];
  assert.match(sent.body.subject, /Payment received/i);
  assert.match(sent.body.html, /EUR 500\.00/);
  assert.equal(sent.idempotencyKey, `payment-confirmation-${session.id}`);
  assert.ok(!/booked|scheduled for|your (call|meeting) is on/i.test(sent.body.html));
});

test("a zero-decimal Price is verified and emailed without dividing by 100", async () => {
  const priceId = "price_webhook_jpy";
  const restore = configurePrice(
    makePrice({ id: priceId, currency: "jpy", unit_amount: 1000 }),
    priceId
  );

  try {
    const before = emailCount();
    const enquiry = await createConsultation();
    const session = makeSession({ consultationId: enquiry._id });
    session.amount_total = 1000;
    session.currency = "jpy";
    session.metadata = {
      ...session.metadata,
      price_id: priceId,
      amount_minor: "1000",
      currency: "jpy",
    };
    session.line_items = {
      object: "list",
      data: [
        makeLineItem({
          amount_total: 1000,
          currency: "jpy",
          price: makePrice({
            id: priceId,
            currency: "jpy",
            unit_amount: 1000,
          }),
        }),
      ],
    };
    rememberSession(session.id);
    await linkSession(enquiry, session, {
      paymentPriceId: priceId,
      paymentAmountMinor: 1000,
      paymentCurrency: "jpy",
    });
    stubSessionRetrieve(async () => session);

    const { status, payload } = await deliverEvent(
      makeEvent("checkout.session.completed", session)
    );

    assert.equal(status, 200);
    assert.equal(payload.email, "sent");
    assert.equal(emailCount() - before, 1);

    const row = await rowFor(session.id);
    assert.equal(row.payment_status, "paid");
    assert.equal(row.amount_total, 1000);
    assert.equal(row.currency, "jpy");
    assert.equal(row.price_id, priceId);

    const sent = ctx.provider.received[emailCount() - 1];
    assert.match(sent.body.html, /JPY 1,000/);
    assert.ok(!/JPY 10\.00/.test(sent.body.html));
  } finally {
    restore();
  }
});

test("an invalid stored commercial snapshot is ignored by the webhook", async () => {
  const before = emailCount();
  const enquiry = await createConsultation();
  const session = makeSession({ consultationId: enquiry._id });
  rememberSession(session.id);
  await linkSession(enquiry, session, { paymentAmountMinor: 0 });
  stubSessionRetrieve(async () => session);

  const { status, payload } = await deliverEvent(
    makeEvent("checkout.session.completed", session)
  );

  assert.equal(status, 200);
  assert.equal(payload.ignored, true);
  assert.equal(payload.reason, "invalid_commercial_snapshot");
  assert.equal(emailCount() - before, 0);
  assert.equal(await rowFor(session.id), null);
  assert.notEqual((await consultationFor(enquiry._id)).paymentStatus, "paid");
});

test("the confirmation email escapes a customer-supplied name", async () => {
  const before = emailCount();
  const enquiry = await createConsultation();
  const session = makeSession({
    consultationId: enquiry._id,
    customer_details: {
      name: "<script>alert(1)</script>",
      email: testEmail("xss"),
    },
  });
  rememberSession(session.id);
  await linkSession(enquiry, session);
  stubSessionRetrieve(async () => session);

  const { status } = await deliverEvent(
    makeEvent("checkout.session.completed", session)
  );

  assert.equal(status, 200);
  assert.equal(emailCount() - before, 1);
  const sent = ctx.provider.received[emailCount() - 1];
  assert.ok(!sent.body.html.includes("<script>"));
  assert.match(sent.body.html, /&lt;script&gt;/);
});

test("a customer with no name still gets a valid confirmation email", async () => {
  const before = emailCount();
  const enquiry = await createConsultation();
  const session = makeSession({
    consultationId: enquiry._id,
    customer_details: { name: "   ", email: testEmail("noname") },
  });
  rememberSession(session.id);
  await linkSession(enquiry, session);
  stubSessionRetrieve(async () => session);

  const { status } = await deliverEvent(
    makeEvent("checkout.session.completed", session)
  );

  assert.equal(status, 200);
  assert.equal(emailCount() - before, 1);
  const sent = ctx.provider.received[emailCount() - 1];
  assert.match(sent.body.html, /Hello,/);
  assert.match(sent.body.html, /Not provided/);

  const row = await rowFor(session.id);
  assert.equal(row.customer_name, null);
});

test("the same event delivered twice sends exactly one email", async () => {
  const before = emailCount();
  const enquiry = await createConsultation();
  const session = makeSession({ consultationId: enquiry._id });
  rememberSession(session.id);
  await linkSession(enquiry, session);
  stubSessionRetrieve(async () => session);
  const event = makeEvent("checkout.session.completed", session);

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
  const enquiry = await createConsultation();
  const session = makeSession({ consultationId: enquiry._id });
  rememberSession(session.id);
  await linkSession(enquiry, session);
  stubSessionRetrieve(async () => session);
  const event = makeEvent("checkout.session.completed", session);

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
  assert.equal(emailCount() - before, 1);
  assert.equal((await rowFor(session.id)).email_status, "sent");
});

test("a late async failure cannot downgrade a verified paid row", async () => {
  const before = emailCount();
  const enquiry = await createConsultation();
  const session = makeSession({ consultationId: enquiry._id });
  rememberSession(session.id);
  await linkSession(enquiry, session);
  stubSessionRetrieve(async () => session);

  const paid = await deliverEvent(
    makeEvent("checkout.session.completed", session)
  );
  assert.equal(paid.status, 200);

  const failed = await deliverEvent(
    makeEvent("checkout.session.async_payment_failed", {
      ...session,
      payment_status: "unpaid",
    })
  );
  assert.equal(failed.status, 200);

  const row = await rowFor(session.id);
  assert.equal(row.payment_status, "paid");
  assert.equal(row.email_status, "sent");
  assert.equal(emailCount() - before, 1, "no duplicate email");
  assert.equal((await consultationFor(enquiry._id)).paymentStatus, "paid");
});

test("a late expired event cannot downgrade a verified paid row", async () => {
  const before = emailCount();
  const enquiry = await createConsultation();
  const session = makeSession({ consultationId: enquiry._id });
  rememberSession(session.id);
  await linkSession(enquiry, session);
  stubSessionRetrieve(async () => session);

  assert.equal(
    (await deliverEvent(makeEvent("checkout.session.completed", session))).status,
    200
  );

  const expired = await deliverEvent(
    makeEvent("checkout.session.expired", {
      ...session,
      status: "expired",
      payment_status: "unpaid",
    })
  );
  assert.equal(expired.status, 200);

  const row = await rowFor(session.id);
  assert.equal(row.payment_status, "paid");
  assert.equal(emailCount() - before, 1);
  assert.equal((await consultationFor(enquiry._id)).paymentStatus, "paid");
});

test("an expired session marks the payment and consultation expired without email", async () => {
  const before = emailCount();
  const enquiry = await createConsultation();
  const session = makeSession({
    consultationId: enquiry._id,
    status: "expired",
    payment_status: "unpaid",
  });
  rememberSession(session.id);
  await linkSession(enquiry, session);

  const { status } = await deliverEvent(
    makeEvent("checkout.session.expired", session)
  );

  assert.equal(status, 200);
  assert.equal(emailCount() - before, 0);

  const row = await rowFor(session.id);
  assert.equal(row.payment_status, "expired");
  assert.equal(row.livemode, false);
  assert.equal((await consultationFor(enquiry._id)).paymentStatus, "expired");
});

test("failed and expired events must match the session mode and expired status", async () => {
  const before = emailCount();

  const notExpiredEnquiry = await createConsultation();
  const notExpired = makeSession({
    consultationId: notExpiredEnquiry._id,
    status: "complete",
    payment_status: "unpaid",
  });
  rememberSession(notExpired.id);
  await linkSession(notExpiredEnquiry, notExpired);

  const notExpiredResult = await deliverEvent(
    makeEvent("checkout.session.expired", notExpired)
  );
  assert.equal(notExpiredResult.status, 200);
  assert.equal(notExpiredResult.payload.ignored, true);
  assert.equal(notExpiredResult.payload.reason, "session_not_expired");
  assert.equal(await rowFor(notExpired.id), null);

  const wrongModeEnquiry = await createConsultation();
  const wrongMode = makeSession({
    consultationId: wrongModeEnquiry._id,
    status: "expired",
    payment_status: "unpaid",
    livemode: true,
  });
  rememberSession(wrongMode.id);
  await linkSession(wrongModeEnquiry, wrongMode);

  const wrongModeResult = await deliverEvent(
    makeEvent("checkout.session.expired", wrongMode)
  );
  assert.equal(wrongModeResult.status, 200);
  assert.equal(wrongModeResult.payload.ignored, true);
  assert.equal(wrongModeResult.payload.reason, "session_mode_mismatch");
  assert.equal(await rowFor(wrongMode.id), null);

  const failedEnquiry = await createConsultation();
  const failedSession = makeSession({
    consultationId: failedEnquiry._id,
    status: "complete",
    payment_status: "unpaid",
    livemode: true,
  });
  rememberSession(failedSession.id);
  await linkSession(failedEnquiry, failedSession);

  const failedResult = await deliverEvent(
    makeEvent("checkout.session.async_payment_failed", failedSession)
  );
  assert.equal(failedResult.status, 200);
  assert.equal(failedResult.payload.ignored, true);
  assert.equal(failedResult.payload.reason, "session_mode_mismatch");
  assert.equal(await rowFor(failedSession.id), null);

  for (const enquiry of [notExpiredEnquiry, wrongModeEnquiry, failedEnquiry]) {
    const after = await consultationFor(enquiry._id);
    assert.equal(after.paymentStatus, "pending");
  }
  assert.equal(emailCount() - before, 0);
});

test("an async payment failure marks failed and sends no email", async () => {
  const before = emailCount();
  const enquiry = await createConsultation();
  const session = makeSession({
    consultationId: enquiry._id,
    status: "complete",
    payment_status: "unpaid",
  });
  rememberSession(session.id);
  await linkSession(enquiry, session);

  const { status } = await deliverEvent(
    makeEvent("checkout.session.async_payment_failed", session)
  );

  assert.equal(status, 200);
  assert.equal(emailCount() - before, 0);

  const row = await rowFor(session.id);
  assert.equal(row.payment_status, "failed");
  assert.equal(row.email_status, "pending");
  assert.equal((await consultationFor(enquiry._id)).paymentStatus, "failed");
});

test("a ₹1.00 paid session is ignored: no row, no email, no paid consultation", async () => {
  const before = emailCount();
  const enquiry = await createConsultation();
  const session = makeSession({
    consultationId: enquiry._id,
    amount_total: 100,
    currency: "inr",
    line_items: {
      object: "list",
      data: [
        makeLineItem({
          amount_total: 100,
          currency: "inr",
          price: makePrice({ currency: "inr", unit_amount: 100 }),
        }),
      ],
    },
  });
  rememberSession(session.id);
  await linkSession(enquiry, session);
  stubSessionRetrieve(async () => session);

  const { status, payload } = await deliverEvent(
    makeEvent("checkout.session.completed", session)
  );

  assert.equal(status, 200);
  assert.equal(payload.ignored, true);
  assert.equal(payload.reason, "commercial_terms_mismatch");
  assert.equal(emailCount() - before, 0);
  assert.equal(await rowFor(session.id), null);
  const after = await consultationFor(enquiry._id);
  assert.equal(after.paymentStatus, "pending");
  assert.equal(after.paidAt, null);
});

test("a wrong Price id, quantity or mode is ignored", async () => {
  const cases = [
    {
      label: "price id",
      session: makeSession({
        line_items: {
          object: "list",
          data: [makeLineItem({ price: makePrice({ id: "price_other" }) })],
        },
      }),
    },
    {
      label: "quantity",
      session: makeSession({
        line_items: {
          object: "list",
          data: [
            makeLineItem({
              quantity: 2,
              amount_total: PRICE_AMOUNT * 2,
            }),
          ],
        },
        amount_total: PRICE_AMOUNT * 2,
      }),
    },
    {
      label: "mode",
      session: makeSession({ livemode: true }),
    },
  ];

  for (const { label, session } of cases) {
    const before = emailCount();
    const enquiry = await createConsultation();
    session.id = uniqueSessionId();
    session.metadata = {
      ...session.metadata,
      consultation_id: String(enquiry._id),
    };
    session.client_reference_id = String(enquiry._id);
    rememberSession(session.id);
    await linkSession(enquiry, session);
    stubSessionRetrieve(async () => session);

    const result = await deliverEvent(
      makeEvent("checkout.session.completed", session)
    );

    assert.equal(result.status, 200, label);
    assert.equal(result.payload.ignored, true, label);
    assert.equal(emailCount() - before, 0, label);
    assert.equal(await rowFor(session.id), null, label);
    assert.notEqual(
      (await consultationFor(enquiry._id)).paymentStatus,
      "paid",
      label
    );
  }
});

test("a synthetic or unlinked session is ignored", async () => {
  const before = emailCount();

  const noMetadata = makeSession();
  rememberSession(noMetadata.id);
  const first = await deliverEvent(
    makeEvent("checkout.session.completed", noMetadata)
  );
  assert.equal(first.status, 200);
  assert.equal(first.payload.ignored, true);
  assert.equal(await rowFor(noMetadata.id), null);

  const enquiry = await createConsultation();
  const differentSession = makeSession();
  rememberSession(differentSession.id);
  await linkSession(enquiry, differentSession);

  const unlinked = makeSession({ consultationId: enquiry._id });
  unlinked.id = uniqueSessionId();
  unlinked.metadata = {
    ...unlinked.metadata,
    consultation_id: String(enquiry._id),
  };
  unlinked.client_reference_id = String(enquiry._id);
  rememberSession(unlinked.id);
  stubSessionRetrieve(async () => unlinked);

  const second = await deliverEvent(
    makeEvent("checkout.session.completed", unlinked)
  );
  assert.equal(second.status, 200);
  assert.equal(second.payload.ignored, true);
  assert.equal(second.payload.reason, "session_not_linked_to_consultation");
  assert.equal(await rowFor(unlinked.id), null);

  assert.equal(emailCount() - before, 0);
  assert.notEqual((await consultationFor(enquiry._id)).paymentStatus, "paid");
});

/* ══════════════════════════════════════════════════════════════════════
   EMAIL FAILURE AND RETRY
   ══════════════════════════════════════════════════════════════════════ */

test("email failure answers non-2xx, keeps payment paid, and a retry sends once", async () => {
  const enquiry = await createConsultation();
  const session = makeSession({ consultationId: enquiry._id });
  rememberSession(session.id);
  await linkSession(enquiry, session);
  stubSessionRetrieve(async () => session);
  const event = makeEvent("checkout.session.completed", session);

  ctx.provider.setStatus(500);
  try {
    const failed = await deliverEvent(event);
    assert.ok(failed.status >= 500, `expected non-2xx, got ${failed.status}`);
  } finally {
    ctx.provider.setStatus(200);
  }

  const row = await rowFor(session.id);
  assert.equal(row.payment_status, "paid");
  assert.equal(row.email_status, "failed");
  assert.ok(row.email_attempts >= 1);
  assert.ok(row.last_error && row.last_error.length <= 200);
  assert.equal(row.email_sent_at, null);

  const beforeRetry = emailCount();
  const retry = await deliverEvent(event);

  assert.equal(retry.status, 200);
  assert.equal(emailCount() - beforeRetry, 1, "retry delivers exactly one email");
  const after = await rowFor(session.id);
  assert.equal(after.email_status, "sent");
  assert.ok(after.email_attempts >= 2);

  const beforeFinal = emailCount();
  const final = await deliverEvent(event);
  assert.equal(final.status, 200);
  assert.equal(emailCount() - beforeFinal, 0, "no email once already sent");
});

test("a stale sending lease is reclaimed by a later delivery", async () => {
  const enquiry = await createConsultation();
  const session = makeSession({ consultationId: enquiry._id });
  rememberSession(session.id);
  await linkSession(enquiry, session);
  await StripePayment.create({
    stripe_session_id: session.id,
    consultation_id: enquiry._id,
    payment_status: "paid",
    livemode: false,
    amount_total: PRICE_AMOUNT,
    currency: PRICE_CURRENCY,
    price_id: TEST_PRICE_ID,
    quantity: 1,
    customer_email: testEmail("lease"),
    email_status: "sending",
    email_attempts: 1,
    email_lease_expires_at: new Date(Date.now() - 60 * 1000),
  });
  stubSessionRetrieve(async () => session);

  const before = emailCount();
  const { status } = await deliverEvent(
    makeEvent("checkout.session.completed", session)
  );

  assert.equal(status, 200);
  assert.equal(emailCount() - before, 1);

  const row = await rowFor(session.id);
  assert.equal(row.email_status, "sent");
  assert.ok(row.email_attempts >= 2);
});

test("a paid session with no customer email cannot send and does not retry forever", async () => {
  const enquiry = await createConsultation();
  const session = makeSession({
    consultationId: enquiry._id,
    customer_details: { email: null, name: null },
  });
  rememberSession(session.id);
  await linkSession(enquiry, session);
  stubSessionRetrieve(async () => session);

  const before = emailCount();
  const { status } = await deliverEvent(
    makeEvent("checkout.session.completed", session)
  );

  assert.equal(status, 200);
  assert.equal(emailCount() - before, 0);

  const row = await rowFor(session.id);
  assert.equal(row.payment_status, "paid");
  assert.equal(row.email_status, "failed");
  assert.equal(row.last_error, "no_customer_email");
});

test("the email service refuses a row that is not verified paid", async () => {
  const sessionId = rememberSession(uniqueSessionId());
  await StripePayment.create({
    stripe_session_id: sessionId,
    payment_status: "expired",
    livemode: false,
    customer_email: testEmail("not-paid"),
    email_status: "pending",
  });

  const before = emailCount();
  const result = await deliverConfirmationEmail({
    session: { id: sessionId },
  });

  assert.equal(result.outcome, "not_paid");
  assert.equal(emailCount() - before, 0);
  assert.equal((await rowFor(sessionId)).email_status, "pending");
});

/* ══════════════════════════════════════════════════════════════════════
   TEST/LIVE ISOLATION AND RAW BODY
   ══════════════════════════════════════════════════════════════════════ */

test("a test event cannot mutate a live-mode deployment", async () => {
  const before = emailCount();
  process.env.STRIPE_SECRET_KEY = TEST_LIVE_KEY;
  resetStripeClient();
  try {
    const enquiry = await createConsultation();
    const session = makeSession({ consultationId: enquiry._id });
    rememberSession(session.id);
    await linkSession(enquiry, session);
    stubSessionRetrieve(async () => ({
      ...session,
      livemode: true,
    }));

    /* Deliver a TEST event (livemode: false) to a live-mode app. */
    const { status, payload } = await deliverEvent(
      makeEvent("checkout.session.completed", session)
    );

    assert.equal(status, 200);
    assert.equal(payload.ignored, true);
    assert.equal(payload.reason, "livemode_mismatch");
    assert.equal(emailCount() - before, 0);
    assert.equal(await rowFor(session.id), null);
    assert.notEqual((await consultationFor(enquiry._id)).paymentStatus, "paid");
  } finally {
    process.env.STRIPE_SECRET_KEY = TEST_SECRET_KEY;
    resetStripeClient();
  }
});

test("the raw request body reaches the webhook unmodified", async () => {
  const before = emailCount();
  const enquiry = await createConsultation();
  const session = makeSession({ consultationId: enquiry._id });
  rememberSession(session.id);
  await linkSession(enquiry, session);
  stubSessionRetrieve(async () => session);

  const stripe = getStripeClient();
  const event = makeEvent("checkout.session.completed", session);
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

  ctx.eventIds.push(event.id);
  assert.equal(response.status, 200);
  assert.equal(emailCount() - before, 1);
});

/* ══════════════════════════════════════════════════════════════════════
   SECURITY
   ══════════════════════════════════════════════════════════════════════ */

test("no unauthenticated request can mark a payment paid or trigger the email", async () => {
  const before = emailCount();
  const session = makeSession();
  rememberSession(session.id);

  const attempts = [
    {
      method: "POST",
      path: "/api/payments/webhook",
      body: JSON.stringify(makeEvent("checkout.session.completed", session)),
    },
    {
      method: "PUT",
      path: "/api/payments/create-checkout-session",
      body: JSON.stringify({}),
    },
    { method: "PATCH", path: "/api/payments/webhook", body: JSON.stringify({}) },
    {
      method: "POST",
      path: "/api/payments/mark-paid",
      body: JSON.stringify({ stripe_session_id: session.id }),
    },
    {
      method: "POST",
      path: "/api/payments/resend-email",
      body: JSON.stringify({ stripe_session_id: session.id }),
    },
    { method: "GET", path: "/api/payments/webhook", body: undefined },
    { method: "POST", path: "/api/payments", body: JSON.stringify({}) },
  ];

  for (const attempt of attempts) {
    const response = await fetch(`${ctx.api.baseUrl}${attempt.path}`, {
      method: attempt.method,
      headers: { "Content-Type": "application/json", ...clientHeaders() },
      body: attempt.body,
    });
    assert.ok(
      response.status >= 400,
      `${attempt.method} ${attempt.path} should not succeed (got ${response.status})`
    );
  }

  assert.equal(emailCount() - before, 0);
  assert.equal(await rowFor(session.id), null);
});

test("responses and errors never leak secrets or customer data", async () => {
  const session = makeSession();
  rememberSession(session.id);

  const result = await deliverEvent(
    makeEvent("checkout.session.completed", session),
    { secret: "whsec_wrongSecretForLeakCheck" }
  );
  const body = JSON.stringify(result.payload);

  assert.equal(result.status, 400);
  for (const secret of [TEST_SECRET_KEY, TEST_WEBHOOK_SECRET, TEST_PRICE_ID]) {
    assert.ok(!body.includes(secret), "response must not echo a secret");
  }
  assert.ok(
    !body.includes(session.customer_details.email),
    "response must not echo customer email"
  );
  assert.ok(!/payload|signature=|stripe-signature/i.test(body));
});
