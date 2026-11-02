/* Consultation <-> payment linkage.
 *
 * A Checkout Session is only actionable when the server has already stored
 * its id against a real consultation. These tests cover the REAL Express
 * app and REAL webhook signature verification; the Stripe calls are stubbed.
 *
 * Run from Server/ with MongoDB available:
 *   node --env-file=.env --test tests/consultation-payment-link.test.js
 */
import assert from "node:assert/strict";
import test from "node:test";

import { startFakeProvider } from "./support/fakeResend.js";
import { startTestServer, post } from "./support/testServer.js";
import Consultation from "../src/models/Consultation.js";
import StripePayment from "../src/models/StripePayment.js";
import StripeWebhookEvent from "../src/models/StripeWebhookEvent.js";
import {
  getStripeClient,
  resetStripeClient,
} from "../src/config/payments.js";

const TEST_SECRET_KEY = "sk_test_0000000000000000000000linkage";
const TEST_WEBHOOK_SECRET = "whsec_0000000000000000000000000000link";
const TEST_PRICE_ID = "price_00000000000000consult";
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
  return `cs_test_link_${Date.now()}_${sessionCounter}`;
};

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
  product: "prod_test_linkage",
  ...overrides,
});

const makeSession = ({
  consultationId = null,
  id = uniqueSessionId(),
  ...overrides
} = {}) => ({
  id,
  object: "checkout.session",
  livemode: false,
  mode: "payment",
  status: "complete",
  payment_status: "paid",
  amount_total: PRICE_AMOUNT,
  currency: PRICE_CURRENCY,
  payment_intent: `pi_test_link_${Date.now()}`,
  client_reference_id: consultationId ? String(consultationId) : null,
  metadata: consultationId
    ? {
        app: "systemaops-consultation",
        consultation_id: String(consultationId),
        price_id: TEST_PRICE_ID,
        quantity: "1",
        amount_minor: String(PRICE_AMOUNT),
        currency: PRICE_CURRENCY,
        attempt: "link-test",
      }
    : {},
  customer_details: { email: testEmail("link"), name: "Linkage Tester" },
  line_items: {
    object: "list",
    data: [
      {
        id: "li_test_linkage",
        object: "item",
        quantity: 1,
        amount_total: PRICE_AMOUNT,
        currency: PRICE_CURRENCY,
        price: makePrice(),
      },
    ],
  },
  ...overrides,
});

const makeEvent = (type, session) => ({
  id: `evt_test_link_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  object: "event",
  type,
  api_version: "2026-09-30.endive",
  created: Math.floor(Date.now() / 1000),
  livemode: false,
  pending_webhooks: 0,
  request: { id: null, idempotency_key: null },
  data: { object: session },
});

const validConsultation = async (overrides = {}) => {
  const doc = await Consultation.create({
    name: "Linkage Tester",
    email: testEmail("linkage"),
    company: "",
    areaOfInterest: "ai-automation",
    message: "Testing consultation/payment linkage.",
    privacyAccepted: true,
    ...overrides,
  });
  ctx.consultationIds.push(doc._id);
  return doc;
};

const consultationById = (id) => Consultation.findById(id).lean();

const rowFor = (sessionId) =>
  StripePayment.findOne({ stripe_session_id: sessionId }).lean();

const rememberSession = (sessionId) => {
  ctx.sessionIds.push(sessionId);
  return sessionId;
};

const linkSession = async (consultation, session) => {
  await Consultation.updateOne(
    { _id: consultation._id },
    {
      $set: {
        stripeSessionId: session.id,
        paymentStatus: "pending",
        paymentPriceId: TEST_PRICE_ID,
        paymentAmountMinor: PRICE_AMOUNT,
        paymentCurrency: PRICE_CURRENCY,
        paymentQuantity: 1,
        paymentStartedAt: new Date(),
      },
    }
  );
};

const stubPriceRetrieve = (impl) => {
  getStripeClient().prices.retrieve = impl;
};

const stubCheckoutCreate = (impl) => {
  getStripeClient().checkout.sessions.create = impl;
};

const stubSessionRetrieve = (impl) => {
  getStripeClient().checkout.sessions.retrieve = impl;
};

const missingSession = () =>
  Object.assign(new Error("No such checkout session"), {
    type: "StripeInvalidRequestError",
    code: "resource_missing",
  });

const defaultCreate = (captured) => async (params) => {
  const id = rememberSession(uniqueSessionId());
  if (captured) captured.push(params);
  return {
    id,
    object: "checkout.session",
    url: `https://checkout.stripe.com/c/pay/${id}#test`,
    status: "open",
    payment_status: "unpaid",
    livemode: false,
    mode: "payment",
    amount_total: PRICE_AMOUNT,
    currency: PRICE_CURRENCY,
  };
};

async function deliverEvent(event, { secret = TEST_WEBHOOK_SECRET } = {}) {
  const stripe = getStripeClient();
  const payload = JSON.stringify(event);
  const header = stripe.webhooks.generateTestHeaderString({ payload, secret });

  const response = await fetch(`${ctx.api.baseUrl}/api/payments/webhook`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "stripe-signature": header,
    },
    body: payload,
  });

  let json = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }

  ctx.eventIds.push(event.id);
  return { status: response.status, payload: json };
}

/* ── lifecycle ──────────────────────────────────────────────────────────── */

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
  stubCheckoutCreate(defaultCreate());
  stubSessionRetrieve(async () => {
    throw missingSession();
  });
});

test.after(async () => {
  try {
    if (ctx.consultationIds.length) {
      await Consultation.deleteMany({ _id: { $in: ctx.consultationIds } });
    }
    if (ctx.sessionIds.length) {
      await StripePayment.deleteMany({
        stripe_session_id: { $in: ctx.sessionIds },
      });
    }
    if (ctx.eventIds.length) {
      await StripeWebhookEvent.deleteMany({ event_id: { $in: ctx.eventIds } });
    }
  } catch (error) {
    console.error(`[tests] cleanup failed: ${error.message}`);
  }
  if (ctx.provider) await ctx.provider.close();
  if (ctx.api) await ctx.api.stop();
});

/* ═══════════════════════════════════════════════════════════════════════
   CREATE CHECKOUT SESSION — consultation linkage
   ═══════════════════════════════════════════════════════════════════════ */

test("a malformed consultation reference is rejected with 400", async () => {
  const { status } = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { consultationId: "not-an-id" }
  );
  assert.equal(status, 400);
});

test("an unknown but well-formed consultation reference is rejected with 404", async () => {
  const { status } = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { consultationId: "000000000000000000000000" }
  );
  assert.equal(status, 404);
});

test("an omitted consultation reference is rejected instead of creating an unlinked session", async () => {
  const captured = [];
  stubCheckoutCreate(defaultCreate(captured));

  const { status } = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { name: "No Reference" }
  );

  assert.equal(status, 400);
  assert.equal(captured.length, 0);
});

test("a valid enquiry is linked with an opaque id and no personal data", async () => {
  const captured = [];
  stubCheckoutCreate(defaultCreate(captured));

  const enquiry = await validConsultation();

  const { status } = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    {
      consultationId: String(enquiry._id),
      name: "Linkage Tester",
      email: "linkage@example.com",
    }
  );

  assert.equal(status, 200);
  assert.equal(captured.length, 1);

  const params = captured[0];
  assert.deepEqual(params.line_items, [
    { price: TEST_PRICE_ID, quantity: 1 },
  ]);
  assert.equal(params.mode, "payment");
  assert.equal(params.metadata.consultation_id, String(enquiry._id));
  assert.equal(params.metadata.app, "systemaops-consultation");

  const metadataBlob = JSON.stringify(params.metadata).toLowerCase();
  for (const leak of ["linkage", "@", "example.com", "tester"]) {
    assert.ok(!metadataBlob.includes(leak), `metadata leaked "${leak}"`);
  }

  assert.equal(
    params.cancel_url,
    `${TEST_FRONTEND_URL}/payment/cancel?consultation_id=${enquiry._id}`
  );
  assert.equal(
    Object.prototype.hasOwnProperty.call(params, "customer_name"),
    false
  );

  const stored = await consultationById(enquiry._id);
  assert.equal(stored.paymentStatus, "pending");
  assert.ok(stored.stripeSessionId);
  assert.equal(stored.paymentPriceId, TEST_PRICE_ID);
  assert.equal(stored.paymentAmountMinor, PRICE_AMOUNT);
  assert.equal(stored.paymentCurrency, PRICE_CURRENCY);
  assert.equal(stored.paymentQuantity, 1);
});

test("a repeat request reuses the open session instead of creating a second one", async () => {
  const captured = [];
  stubCheckoutCreate(defaultCreate(captured));

  const enquiry = await validConsultation();
  const first = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { consultationId: String(enquiry._id) }
  );
  assert.equal(first.status, 200);

  const stored = await consultationById(enquiry._id);
  const sessionId = stored.stripeSessionId;

  stubSessionRetrieve(async (id) => {
    assert.equal(id, sessionId);
    return {
      ...makeSession({
        id: sessionId,
        consultationId: enquiry._id,
        status: "open",
        payment_status: "unpaid",
      }),
      url: `https://checkout.stripe.com/c/pay/${sessionId}#test`,
    };
  });

  const second = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { consultationId: String(enquiry._id) }
  );

  assert.equal(second.status, 200);
  assert.equal(
    second.payload.url,
    `https://checkout.stripe.com/c/pay/${sessionId}#test`
  );
  assert.equal(captured.length, 1, "no second Checkout Session should be created");
});

test("an already-paid enquiry is refused so it is never charged twice", async () => {
  const enquiry = await validConsultation({ paymentStatus: "paid" });

  const { status } = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { consultationId: String(enquiry._id) }
  );

  assert.equal(status, 409);
});

/* ═══════════════════════════════════════════════════════════════════════
   WEBHOOK -> consultation state
   ═══════════════════════════════════════════════════════════════════════ */

test("a verified paid event marks the linked enquiry paid and stores the link", async () => {
  const enquiry = await validConsultation();
  const session = makeSession({ consultationId: enquiry._id });
  rememberSession(session.id);
  await linkSession(enquiry, session);
  stubSessionRetrieve(async () => session);

  const result = await deliverEvent(
    makeEvent("checkout.session.completed", session)
  );
  assert.equal(result.status, 200);

  const paid = await consultationById(enquiry._id);
  assert.equal(paid.paymentStatus, "paid");
  assert.ok(paid.paidAt instanceof Date, "paidAt should be stamped");

  const row = await rowFor(session.id);
  assert.equal(row.payment_status, "paid");
  assert.equal(String(row.consultation_id), String(enquiry._id));
  assert.equal(row.price_id, TEST_PRICE_ID);
  assert.equal(row.quantity, 1);
  assert.equal(row.livemode, false);
});

test("an unpaid completed event never marks the enquiry paid", async () => {
  const enquiry = await validConsultation();
  const session = makeSession({
    consultationId: enquiry._id,
    payment_status: "unpaid",
  });
  rememberSession(session.id);
  await linkSession(enquiry, session);

  const result = await deliverEvent(
    makeEvent("checkout.session.completed", session)
  );
  assert.equal(result.status, 200);

  const after = await consultationById(enquiry._id);
  assert.notEqual(after.paymentStatus, "paid");
  assert.equal(await rowFor(session.id), null);
});

test("an async payment failure marks the linked enquiry failed, not paid", async () => {
  const enquiry = await validConsultation();
  const session = makeSession({
    consultationId: enquiry._id,
    status: "complete",
    payment_status: "unpaid",
  });
  rememberSession(session.id);
  await linkSession(enquiry, session);

  const result = await deliverEvent(
    makeEvent("checkout.session.async_payment_failed", session)
  );
  assert.equal(result.status, 200);

  const after = await consultationById(enquiry._id);
  assert.equal(after.paymentStatus, "failed");
  assert.notEqual(after.paymentStatus, "paid");
  assert.equal((await rowFor(session.id)).payment_status, "failed");
});

test("an expired session marks the linked enquiry expired, not paid", async () => {
  const enquiry = await validConsultation();
  const session = makeSession({
    consultationId: enquiry._id,
    status: "expired",
    payment_status: "unpaid",
  });
  rememberSession(session.id);
  await linkSession(enquiry, session);

  const result = await deliverEvent(
    makeEvent("checkout.session.expired", session)
  );
  assert.equal(result.status, 200);

  const after = await consultationById(enquiry._id);
  assert.equal(after.paymentStatus, "expired");
  assert.equal((await rowFor(session.id)).payment_status, "expired");
});

test("an event with no consultation link is ignored, not processed", async () => {
  const session = makeSession();
  rememberSession(session.id);

  const result = await deliverEvent(
    makeEvent("checkout.session.completed", session)
  );

  assert.equal(result.status, 200);
  assert.equal(result.payload.ignored, true);
  assert.equal(await rowFor(session.id), null);
});

test("an event whose metadata points at a different session is ignored", async () => {
  const enquiry = await validConsultation();
  const linked = makeSession({ consultationId: enquiry._id });
  rememberSession(linked.id);
  await linkSession(enquiry, linked);

  const other = makeSession({ consultationId: enquiry._id });
  other.id = uniqueSessionId();
  other.metadata = {
    ...other.metadata,
    consultation_id: String(enquiry._id),
  };
  other.client_reference_id = String(enquiry._id);
  rememberSession(other.id);
  stubSessionRetrieve(async () => other);

  const result = await deliverEvent(
    makeEvent("checkout.session.completed", other)
  );

  assert.equal(result.status, 200);
  assert.equal(result.payload.ignored, true);
  assert.equal(result.payload.reason, "session_not_linked_to_consultation");
  assert.equal(await rowFor(other.id), null);
  assert.notEqual((await consultationById(enquiry._id)).paymentStatus, "paid");
});

test("redelivering the same paid event does not change the enquiry twice", async () => {
  const enquiry = await validConsultation();
  const session = makeSession({ consultationId: enquiry._id });
  rememberSession(session.id);
  await linkSession(enquiry, session);
  stubSessionRetrieve(async () => session);

  const event = makeEvent("checkout.session.completed", session);
  const first = await deliverEvent(event);
  const second = await deliverEvent(event);

  assert.equal(first.status, 200);
  assert.equal(second.status, 200);

  const after = await consultationById(enquiry._id);
  assert.equal(after.paymentStatus, "paid");
  assert.equal((await rowFor(session.id)).email_status, "sent");
});

test("a commercial mismatch cannot mark the enquiry paid", async () => {
  const enquiry = await validConsultation();
  const session = makeSession({
    consultationId: enquiry._id,
    amount_total: 100,
    currency: "inr",
    line_items: {
      object: "list",
      data: [
        {
          id: "li_test_link_bad",
          object: "item",
          quantity: 1,
          amount_total: 100,
          currency: "inr",
          price: makePrice({ currency: "inr", unit_amount: 100 }),
        },
      ],
    },
  });
  rememberSession(session.id);
  await linkSession(enquiry, session);
  stubSessionRetrieve(async () => session);

  const result = await deliverEvent(
    makeEvent("checkout.session.completed", session)
  );

  assert.equal(result.status, 200);
  assert.equal(result.payload.ignored, true);
  assert.equal(await rowFor(session.id), null);
  const after = await consultationById(enquiry._id);
  assert.notEqual(after.paymentStatus, "paid");
  assert.equal(after.paidAt, null);
});

test("changing STRIPE_PRICE_ID after checkout does not break the consultation link", async () => {
  const enquiry = await validConsultation();
  const session = makeSession({ consultationId: enquiry._id });
  rememberSession(session.id);
  await linkSession(enquiry, session);
  stubSessionRetrieve(async () => session);

  process.env.STRIPE_PRICE_ID = "price_after_change_inr";
  stubPriceRetrieve(async (priceId) => {
    assert.equal(priceId, "price_after_change_inr");
    return makePrice({
      id: "price_after_change_inr",
      currency: "inr",
      unit_amount: 100,
    });
  });

  try {
    const result = await deliverEvent(
      makeEvent("checkout.session.completed", session)
    );
    assert.equal(result.status, 200);
    assert.equal(result.payload.email, "sent");

    const after = await consultationById(enquiry._id);
    assert.equal(after.paymentStatus, "paid");
    assert.equal(after.paymentPriceId, TEST_PRICE_ID);
    assert.equal(after.paymentAmountMinor, PRICE_AMOUNT);
    assert.equal(after.paymentCurrency, PRICE_CURRENCY);

    const row = await rowFor(session.id);
    assert.equal(row.payment_status, "paid");
    assert.equal(row.amount_total, PRICE_AMOUNT);
    assert.equal(row.currency, PRICE_CURRENCY);
    assert.equal(row.price_id, TEST_PRICE_ID);
  } finally {
    process.env.STRIPE_PRICE_ID = TEST_PRICE_ID;
    stubPriceRetrieve(async (priceId) => {
      assert.equal(priceId, TEST_PRICE_ID);
      return makePrice();
    });
  }
});

test("an invalid commercial snapshot cannot mark the enquiry paid", async () => {
  const enquiry = await validConsultation();
  const session = makeSession({ consultationId: enquiry._id });
  rememberSession(session.id);
  await linkSession(enquiry, session);
  await Consultation.updateOne(
    { _id: enquiry._id },
    { $set: { paymentCurrency: "" } }
  );
  stubSessionRetrieve(async () => session);

  const result = await deliverEvent(
    makeEvent("checkout.session.completed", session)
  );

  assert.equal(result.status, 200);
  assert.equal(result.payload.ignored, true);
  assert.equal(result.payload.reason, "invalid_commercial_snapshot");
  assert.equal(await rowFor(session.id), null);
  const after = await consultationById(enquiry._id);
  assert.notEqual(after.paymentStatus, "paid");
  assert.equal(after.paidAt, null);
});

test("a late failure cannot downgrade a paid enquiry", async () => {
  const enquiry = await validConsultation();
  const session = makeSession({ consultationId: enquiry._id });
  rememberSession(session.id);
  await linkSession(enquiry, session);
  stubSessionRetrieve(async () => session);

  assert.equal(
    (await deliverEvent(makeEvent("checkout.session.completed", session))).status,
    200
  );

  const late = await deliverEvent(
    makeEvent("checkout.session.async_payment_failed", {
      ...session,
      payment_status: "unpaid",
    })
  );
  assert.equal(late.status, 200);

  const after = await consultationById(enquiry._id);
  assert.equal(after.paymentStatus, "paid");
  assert.equal((await rowFor(session.id)).payment_status, "paid");
});
