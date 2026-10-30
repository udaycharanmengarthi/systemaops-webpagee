/* Book-a-call consultation enquiry suite.
 *
 * Boots the REAL Express app against the compose MongoDB and points the
 * REAL mail service at a local fake Resend endpoint, so validation,
 * persistence, retention and founder notification are genuinely exercised
 * with no network access and no secrets.
 *
 * Run inside the backend container:
 *   docker compose run --rm -v "${PWD}/Server/tests:/app/tests:ro" \
 *     backend node --test tests/
 */
import assert from "node:assert/strict";
import test from "node:test";

import { startFakeProvider } from "./support/fakeResend.js";
import { post, startTestServer } from "./support/testServer.js";
import Consultation from "../src/models/Consultation.js";
import { AREAS_OF_INTEREST } from "../src/config/workflow.js";

const ctx = { api: null, provider: null, ids: [] };

const validPayload = (overrides = {}) => ({
  name: "Dana Founder",
  email: "dana-founder@systemaops.test",
  company: "Acme Ops",
  areaOfInterest: "ai-automation",
  message: "We process invoices by hand every month.",
  privacyAccepted: true,
  ...overrides,
});

const remember = (id) => {
  ctx.ids.push(id);
  return id;
};

test.before(async () => {
  process.env.RESEND_API_KEY = process.env.RESEND_API_KEY || "re_fake_test_key";
  process.env.SENDER_EMAIL =
    process.env.SENDER_EMAIL || "test@systemaops.test";
  process.env.FOUNDER_EMAIL =
    process.env.FOUNDER_EMAIL || "founder@systemaops.test";
  process.env.NODE_ENV = "test";

  ctx.provider = await startFakeProvider({ status: 200 });
  process.env.RESEND_BASE_URL = ctx.provider.baseUrl;

  ctx.api = await startTestServer();
});

test.after(async () => {
  try {
    if (ctx.ids.length > 0) {
      const result = await Consultation.deleteMany({
        _id: { $in: ctx.ids },
      });
      ctx.ids = [];
      console.log(`[tests] removed ${result.deletedCount} consultation(s)`);
    }
  } catch (error) {
    console.error(`[tests] cleanup failed: ${error.message}`);
  }
  if (ctx.provider) await ctx.provider.close();
  if (ctx.api) await ctx.api.stop();
});

/* ── Happy path ──────────────────────────────────────────────────────────── */

test("a valid enquiry is stored, notifies the founder and applies 1-year retention", async () => {
  const before = ctx.provider.received.length;

  const { status, payload } = await post(
    ctx.api.baseUrl,
    "/api/consultations",
    validPayload()
  );

  assert.equal(status, 201);
  assert.equal(payload.success, true);
  assert.ok(payload.data.id, "must return the stored id");
  remember(payload.data.id);

  const stored = await Consultation.findById(payload.data.id).lean();
  assert.equal(stored.name, "Dana Founder");
  assert.equal(stored.email, "dana-founder@systemaops.test");
  assert.equal(stored.company, "Acme Ops");
  assert.equal(stored.areaOfInterest, "ai-automation");
  assert.equal(stored.privacyAccepted, true);
  assert.equal(stored.privacyVersion, "2026-01-01");
  assert.ok(stored.privacyAcceptedAt instanceof Date);

  /* Retention: expiresAt is exactly one calendar year after createdAt. */
  const created = new Date(stored.createdAt);
  const expires = new Date(stored.expiresAt);
  assert.equal(expires.getFullYear(), created.getFullYear() + 1);
  assert.equal(expires.getMonth(), created.getMonth());
  assert.equal(expires.getDate(), created.getDate());

  /* Founder notification went out through the existing mail service. */
  assert.ok(
    ctx.provider.received.length > before,
    "founder email should be sent"
  );
  const mail = ctx.provider.received[ctx.provider.received.length - 1];
  assert.match(mail.body.subject, /Book-a-Call/i);
  assert.match(mail.body.html, /ai-automation/);
});

test("company is optional", async () => {
  const { status, payload } = await post(
    ctx.api.baseUrl,
    "/api/consultations",
    validPayload({ company: "" })
  );

  assert.equal(status, 201);
  remember(payload.data.id);

  const stored = await Consultation.findById(payload.data.id).lean();
  assert.equal(stored.company, "");
});

/* ── Validation ──────────────────────────────────────────────────────────── */

test("required fields are enforced", async () => {
  const cases = [
    ["name", validPayload({ name: "" })],
    ["email", validPayload({ email: "" })],
    ["areaOfInterest", validPayload({ areaOfInterest: "" })],
    ["message", validPayload({ message: "" })],
  ];

  for (const [field, payload] of cases) {
    const { status, payload: body } = await post(
      ctx.api.baseUrl,
      "/api/consultations",
      payload
    );
    assert.equal(status, 400, `${field} must be required`);
    assert.equal(body.success, false);
  }
});

test("an invalid email address is rejected", async () => {
  const { status } = await post(
    ctx.api.baseUrl,
    "/api/consultations",
    validPayload({ email: "not-an-email" })
  );
  assert.equal(status, 400);
});

test("an unknown area of interest is rejected, not silently stored", async () => {
  const { status } = await post(
    ctx.api.baseUrl,
    "/api/consultations",
    validPayload({ areaOfInterest: "free-lol-cats" })
  );
  assert.equal(status, 400);
});

test("every documented area of interest is accepted", async () => {
  for (const area of AREAS_OF_INTEREST) {
    const { status, payload } = await post(
      ctx.api.baseUrl,
      "/api/consultations",
      validPayload({
        areaOfInterest: area,
        email: `area-${area}@systemaops.test`,
      })
    );
    assert.equal(status, 201, `area "${area}" should be accepted`);
    remember(payload.data.id);
  }
});

test("privacy acknowledgement is mandatory", async () => {
  const { status } = await post(
    ctx.api.baseUrl,
    "/api/consultations",
    validPayload({ privacyAccepted: false })
  );
  assert.equal(status, 400);
});

test("oversized input is trimmed rather than rejected mid-write", async () => {
  const { status, payload } = await post(
    ctx.api.baseUrl,
    "/api/consultations",
    validPayload({ message: "x".repeat(5000) })
  );

  assert.equal(status, 201);
  remember(payload.data.id);

  const stored = await Consultation.findById(payload.data.id).lean();
  assert.equal(stored.message.length, 4000);
});

/* ── Separation from the contact form ────────────────────────────────────── */

test("the consultation endpoint does not accept a price, currency or session id", async () => {
  const { status, payload } = await post(
    ctx.api.baseUrl,
    "/api/consultations",
    validPayload({
      amount: 1,
      currency: "eur",
      priceId: "price_attacker",
      stripe_session_id: "cs_test_forged",
      paymentStatus: "paid",
    })
  );

  assert.equal(status, 201);
  remember(payload.data.id);

  /* The enquiry record can never carry client-supplied payment state.
   *
   * The Consultation model DOES now have server-written payment fields
   * (paymentStatus / stripeSessionId), written only by the verified
   * Stripe webhook. What must never happen is the REQUEST deciding them,
   * so the assertion is that the forged values were ignored — which is a
   * stronger check than the absence of the fields themselves. */
  const stored = await Consultation.findById(payload.data.id).lean();
  const serialized = JSON.stringify(stored);
  assert.ok(!serialized.includes("price_attacker"));
  assert.equal(stored.paymentStatus, null, "a request must never set paymentStatus");
  assert.equal(
    stored.stripeSessionId,
    null,
    "a request must never set the Stripe session id"
  );
  assert.ok(!("amount" in stored));
});
