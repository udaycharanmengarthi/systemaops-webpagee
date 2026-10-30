/* Consultation <-> payment linkage.
 *
 * Closes the gap where a Checkout Session could not be tied back to the
 * enquiry that produced it. These tests cover the REAL Express app and the
 * REAL webhook signature verification; the single outbound Stripe call is
 * stubbed, exactly as in payments.test.js. No network, no real credentials.
 *
 * Run inside the backend container (MongoDB is internal only):
 *   docker compose run --rm -v "${PWD}/Server/tests:/app/tests:ro" \
 *     backend node --test tests/
 */
import assert from "node:assert/strict";
import test from "node:test";

import { startFakeProvider } from "./support/fakeResend.js";
import { startTestServer, post } from "./support/testServer.js";
import Consultation from "../src/models/Consultation.js";
import StripePayment from "../src/models/StripePayment.js";
import {
  getStripeClient,
  resetStripeClient,
} from "../src/config/payments.js";

const TEST_SECRET_KEY = "sk_test_0000000000000000000000payments";
const TEST_WEBHOOK_SECRET = "whsec_0000000000000000000000000000test";
const TEST_PRICE_ID = "price_00000000000000consultation";
const TEST_FRONTEND_URL = "http://localhost:5173";

const ctx = { api: null, provider: null, sessionIds: [], consultationIds: [] };

/* ── helpers ────────────────────────────────────────────────────────────── */

let sessionCounter = 0;
const uniqueSessionId = () => {
  sessionCounter += 1;
  return `cs_test_link_${Date.now()}_${sessionCounter}`;
};

const validConsultation = async () => {
  const doc = await Consultation.create({
    name: "Linkage Tester",
    email: `linkage-${Date.now()}@systemaops.test`,
    company: "",
    areaOfInterest: "ai-automation",
    message: "Testing consultation/payment linkage.",
    privacyAccepted: true,
  });
  ctx.consultationIds.push(doc._id);
  return doc;
};

const consultationById = (id) => Consultation.findById(id).lean();

const buildEvent = (type, session) => ({
  id: `evt_test_link_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  object: "event",
  type,
  api_version: "2026-09-30.endive",
  created: Math.floor(Date.now() / 1000),
  livemode: false,
  pending_webhooks: 0,
  request: { id: null, idempotency_key: null },
  data: { object: session },
});

async function deliverEvent(event) {
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
    },
    body: payload,
  });

  let json = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }
  return { status: response.status, payload: json };
}

const stubCheckoutCreate = (impl) => {
  const stripe = getStripeClient();
  stripe.checkout.sessions.create = impl;
};

const stubSessionRetrieve = (impl) => {
  const stripe = getStripeClient();
  stripe.checkout.sessions.retrieve = impl;
};

const defaultCreate = (captured) => async (params) => {
  const id = uniqueSessionId();
  ctx.sessionIds.push(id);
  if (captured) captured.push(params);
  return {
    id,
    url: `https://checkout.stripe.com/c/pay/${id}#test`,
    status: "open",
    payment_status: "unpaid",
  };
};

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
  stubCheckoutCreate(defaultCreate());

  const { status } = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { consultationId: "not-an-id" }
  );

  assert.equal(status, 400);
});

test("an unknown but well-formed consultation reference is rejected with 404", async () => {
  stubCheckoutCreate(defaultCreate());

  const missing = new (await import("mongoose")).Types.ObjectId();

  const { status } = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { consultationId: String(missing) }
  );

  assert.equal(status, 404);
});

test("a valid enquiry is linked: metadata carries only the enquiry id", async () => {
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

  /* Server-side price only; never anything from the request. */
  assert.deepEqual(params.line_items, [{ price: TEST_PRICE_ID, quantity: 1 }]);
  assert.equal(params.mode, "payment");

  /* Metadata must carry the opaque id and NO personal data. */
  assert.equal(params.metadata.consultation_id, String(enquiry._id));
  const metadataBlob = JSON.stringify(params.metadata).toLowerCase();
  for (const leak of ["linkage", "@", "example.com", "tester"]) {
    assert.ok(
      !metadataBlob.includes(leak),
      `metadata leaked "${leak}"`
    );
  }

  /* The cancel page gets the opaque enquiry id so a retry can reuse this
     consultation instead of creating a duplicate one. */
  assert.equal(
    params.cancel_url,
    `${TEST_FRONTEND_URL}/payment/cancel?consultation_id=${enquiry._id}`
  );
  /* Checkout has no `customer_name` parameter; forwarding it makes Stripe
     reject the session. */
  assert.equal(
    Object.prototype.hasOwnProperty.call(params, "customer_name"),
    false
  );

  const stored = await consultationById(enquiry._id);
  assert.equal(stored.paymentStatus, "pending");
  assert.ok(stored.stripeSessionId, "the session id should be recorded");
});

test("a repeat request reuses the open session instead of creating a second one", async () => {
  const captured = [];
  stubCheckoutCreate(defaultCreate(captured));

  const enquiry = await validConsultation();
  const first = await post(ctx.api.baseUrl, "/api/payments/create-checkout-session", {
    consultationId: String(enquiry._id),
  });

  assert.equal(first.status, 200);

  const stored = await consultationById(enquiry._id);
  const sessionId = stored.stripeSessionId;

  /* Stripe reports the session still open and unpaid. */
  stubSessionRetrieve(async (id) => {
    assert.equal(id, sessionId);
    return {
      id: sessionId,
      url: `https://checkout.stripe.com/c/pay/${sessionId}#test`,
      status: "open",
      payment_status: "unpaid",
    };
  });

  const second = await post(ctx.api.baseUrl, "/api/payments/create-checkout-session", {
    consultationId: String(enquiry._id),
  });

  assert.equal(second.status, 200);
  assert.equal(second.payload.url, `https://checkout.stripe.com/c/pay/${sessionId}#test`);
  assert.equal(captured.length, 1, "no second Checkout Session should be created");
});

test("an already-paid enquiry is refused so it is never charged twice", async () => {
  stubCheckoutCreate(defaultCreate());

  const enquiry = await validConsultation();
  await Consultation.updateOne(
    { _id: enquiry._id },
    { $set: { paymentStatus: "paid" } }
  );

  const { status } = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { consultationId: String(enquiry._id) }
  );

  assert.equal(status, 409);
});

test("omitting the reference keeps the previous unlinked behaviour", async () => {
  const captured = [];
  stubCheckoutCreate(defaultCreate(captured));

  const { status, payload } = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { name: "No Reference" }
  );

  assert.equal(status, 200);
  assert.ok(payload.url);
  assert.equal(captured[0].metadata, undefined);
});

/* ═══════════════════════════════════════════════════════════════════════
   WEBHOOK -> consultation state
   ═══════════════════════════════════════════════════════════════════════ */

test("a verified paid event marks the linked enquiry paid", async () => {
  stubCheckoutCreate(defaultCreate());

  const enquiry = await validConsultation();

  const created = await post(
    ctx.api.baseUrl,
    "/api/payments/create-checkout-session",
    { consultationId: String(enquiry._id) }
  );
  assert.equal(created.status, 200);

  const stored = await consultationById(enquiry._id);
  const sessionId = stored.stripeSessionId;

  const event = buildEvent("checkout.session.completed", {
    id: sessionId,
    object: "checkout.session",
    payment_status: "paid",
    amount_total: 24900,
    currency: "usd",
    payment_intent: "pi_test_link_1",
    customer_details: { email: "payer-link@systemaops.test" },
    metadata: { consultation_id: String(enquiry._id) },
  });

  const result = await deliverEvent(event);
  assert.equal(result.status, 200);

  const paid = await consultationById(enquiry._id);
  assert.equal(paid.paymentStatus, "paid");
  assert.ok(paid.paidAt instanceof Date, "paidAt should be stamped");
});

test("an unpaid completed event never marks the enquiry paid", async () => {
  const enquiry = await validConsultation();

  const event = buildEvent("checkout.session.completed", {
    id: uniqueSessionId(),
    object: "checkout.session",
    payment_status: "unpaid",
    amount_total: 24900,
    currency: "usd",
    customer_details: { email: "payer-link2@systemaops.test" },
    metadata: { consultation_id: String(enquiry._id) },
  });

  const result = await deliverEvent(event);
  assert.equal(result.status, 200);

  const after = await consultationById(enquiry._id);
  assert.notEqual(after.paymentStatus, "paid");
});

test("an async payment failure marks the linked enquiry failed, not paid", async () => {
  const enquiry = await validConsultation();

  const event = buildEvent("checkout.session.async_payment_failed", {
    id: uniqueSessionId(),
    object: "checkout.session",
    payment_status: "unpaid",
    amount_total: 24900,
    currency: "usd",
    customer_details: { email: "payer-link3@systemaops.test" },
    metadata: { consultation_id: String(enquiry._id) },
  });

  const result = await deliverEvent(event);
  assert.equal(result.status, 200);

  const after = await consultationById(enquiry._id);
  assert.equal(after.paymentStatus, "failed");
  assert.notEqual(after.paymentStatus, "paid");
});

test("an event with no consultation link is processed without error", async () => {
  const event = buildEvent("checkout.session.completed", {
    id: uniqueSessionId(),
    object: "checkout.session",
    payment_status: "paid",
    amount_total: 24900,
    currency: "usd",
    customer_details: { email: "payer-link4@systemaops.test" },
  });

  const result = await deliverEvent(event);
  assert.equal(result.status, 200);
});

test("redelivering the same paid event does not change the enquiry twice", async () => {
  const enquiry = await validConsultation();

  const event = buildEvent("checkout.session.completed", {
    id: uniqueSessionId(),
    object: "checkout.session",
    payment_status: "paid",
    amount_total: 24900,
    currency: "usd",
    customer_details: { email: "payer-link5@systemaops.test" },
    metadata: { consultation_id: String(enquiry._id) },
  });

  const first = await deliverEvent(event);
  const second = await deliverEvent(event);

  assert.equal(first.status, 200);
  assert.equal(second.status, 200);

  const after = await consultationById(enquiry._id);
  assert.equal(after.paymentStatus, "paid");
});