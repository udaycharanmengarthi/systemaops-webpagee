/* Frontend offer contract.
 *
 * The backend is the only pricing authority. These tests exercise the real
 * parser (paymentOfferService.js) with EUR, INR, zero-decimal and
 * three-decimal offers, and assert that the UI renders the backend-provided
 * formattedAmount instead of calculating an amount.
 *
 * Run:  npm test
 */
import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  fetchPaymentOffer,
  parsePaymentOffer,
} from "../src/pages/BookACall/consultation/paymentOfferService.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const read = (relative) =>
  fs.readFileSync(path.join(root, relative), "utf8");

const offerService = read(
  "src/pages/BookACall/consultation/paymentOfferService.js"
);
const bookACall = read("src/pages/BookACall/index.jsx");
const stripeCheckout = read(
  "src/pages/BookACall/components/StripeCheckout.jsx"
);
const offerPanel = read("src/pages/BookACall/components/OfferPanel.jsx");
const hook = read("src/pages/BookACall/consultation/useConsultationForm.js");
const i18n = read("src/i18n/translations-services.js");

const withFetch = async (impl, fn) => {
  const original = globalThis.fetch;
  globalThis.fetch = impl;
  try {
    return await fn();
  } finally {
    globalThis.fetch = original;
  }
};

/* ── parser ──────────────────────────────────────────────────────────────── */

test("parsePaymentOffer accepts the backend contract for every currency", () => {
  const cases = [
    {
      currency: "eur",
      amountMinor: 50000,
      formattedAmount: "EUR 500.00",
    },
    {
      currency: "inr",
      amountMinor: 100,
      formattedAmount: "INR 1.00",
    },
    {
      currency: "jpy",
      amountMinor: 1000,
      formattedAmount: "JPY 1,000",
    },
    {
      currency: "kwd",
      amountMinor: 123456,
      formattedAmount: "KWD 123.456",
    },
  ];

  for (const offer of cases) {
    assert.deepEqual(
      parsePaymentOffer({ success: true, offer: { ...offer, quantity: 1 } }),
      { ...offer, quantity: 1 }
    );
  }
});

test("parsePaymentOffer rejects missing or malformed offers", () => {
  const valid = {
    amountMinor: 100,
    currency: "inr",
    formattedAmount: "INR 1.00",
    quantity: 1,
  };

  const invalid = [
    null,
    undefined,
    {},
    { success: false, offer: valid },
    { success: true },
    { success: true, offer: { ...valid, amountMinor: 0 } },
    { success: true, offer: { ...valid, amountMinor: -100 } },
    { success: true, offer: { ...valid, amountMinor: 1.5 } },
    { success: true, offer: { ...valid, amountMinor: "100" } },
    { success: true, offer: { ...valid, currency: "" } },
    { success: true, offer: { ...valid, currency: "US" } },
    { success: true, offer: { ...valid, currency: "usdollars" } },
    { success: true, offer: { ...valid, quantity: 0 } },
    { success: true, offer: { ...valid, quantity: 2 } },
    { success: true, offer: { ...valid, quantity: "1" } },
    { success: true, offer: { ...valid, formattedAmount: "" } },
    { success: true, offer: { ...valid, formattedAmount: "   " } },
    { success: true, offer: { ...valid, formattedAmount: 100 } },
    {
      success: true,
      offer: { ...valid, formattedAmount: "X".repeat(65) },
    },
  ];

  for (const body of invalid) {
    assert.throws(
      () => parsePaymentOffer(body),
      /payments\.offerInvalid/,
      `must reject ${JSON.stringify(body)}`
    );
  }
});

/* ── service errors ──────────────────────────────────────────────────────── */

test("fetchPaymentOffer requests a non-cached offer and maps each failure", async () => {
  const response = (status, body) => ({
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => "no-store" },
    json: async () => body,
  });
  const offer = {
    amountMinor: 100,
    currency: "inr",
    formattedAmount: "INR 1.00",
    quantity: 1,
  };

  let init = null;
  const parsed = await withFetch(
    async (_url, requestInit) => {
      init = requestInit;
      return response(200, { success: true, offer });
    },
    () => fetchPaymentOffer()
  );
  assert.deepEqual(parsed, offer);
  assert.equal(init.cache, "no-store");
  assert.equal(init.headers.Accept, "application/json");

  const failures = [
    [503, () => response(503, { success: false }), /payments\.notConfigured/],
    [502, () => response(502, { success: false }), /payments\.offerUnavailable/],
    [500, () => response(500, { success: false }), /payments\.errorGeneric/],
    [
      200,
      () => response(200, { success: true, offer: { ...offer, quantity: 2 } }),
      /payments\.offerInvalid/,
    ],
  ];

  for (const [label, makeResponse, expected] of failures) {
    await withFetch(
      async () => makeResponse(),
      async () => {
        await assert.rejects(fetchPaymentOffer(), expected, String(label));
      }
    );
  }

  await withFetch(
    async () => {
      throw new TypeError("offline");
    },
    async () => {
      await assert.rejects(fetchPaymentOffer(), /payments\.errorNetwork/);
    }
  );
});

/* ── source invariants ───────────────────────────────────────────────────── */

test("the frontend has no hardcoded offer or amount arithmetic", () => {
  assert.ok(!offerService.includes("APPROVED_OFFER"));
  assert.ok(!offerService.includes("50000"));
  assert.ok(!offerService.includes("amountMinor / 100"));
  assert.ok(!/\bEUR\b/.test(offerService));
  assert.ok(!bookACall.includes("amountMinor / 100"));
  assert.ok(!stripeCheckout.includes("amountMinor / 100"));
  assert.ok(!offerPanel.includes("amountMinor / 100"));
});

test("the UI renders the backend-provided formattedAmount", () => {
  assert.ok(
    bookACall.includes("paymentOffer?.formattedAmount"),
    "the price label must come from the offer"
  );
  assert.ok(
    stripeCheckout.includes("offer.formattedAmount"),
    "checkout must display the backend-formatted amount"
  );
  assert.ok(
    offerPanel.includes("offer.formattedAmount"),
    "the offer panel must display the backend-formatted amount"
  );
});

test("checkout refreshes and compares the offer before creating a session", () => {
  assert.ok(hook.includes("refreshPaymentOffer"));
  assert.equal(
    (hook.match(/const freshOffer = await refreshPaymentOffer\(\);/g) || [])
      .length,
    2,
    "both submit and payment-click paths must refresh the offer"
  );

  const sameOffer = hook.slice(
    hook.indexOf("const sameOffer"),
    hook.indexOf("export function useConsultationForm")
  );
  for (const field of ["amountMinor", "currency", "quantity"]) {
    assert.ok(
      sameOffer.includes(field),
      `a changed ${field} must stop checkout`
    );
  }
});

test("payment is disabled without a valid offer and exposes a retry", () => {
  assert.ok(
    stripeCheckout.includes(
      "const canStart = Boolean(offer?.formattedAmount) && !offerError && !busy;"
    ),
    "checkout must require a formatted offer and no offer error"
  );
  assert.ok(stripeCheckout.includes("disabled={!canStart}"));
  assert.ok(stripeCheckout.includes("onRetryOffer"));
  assert.ok(stripeCheckout.includes("offerError"));
});

test("every language has actionable offer error copy", () => {
  for (const key of ["offerMismatch", "offerInvalid", "offerUnavailable"]) {
    const occurrences = i18n.match(new RegExp(`${key}:`, "g")) || [];
    assert.equal(
      occurrences.length,
      3,
      `EN, NL and DE must all define ${key}`
    );
  }

  for (const phrase of [
    "The consultation price could not be verified",
    "De consultatieprijs kon niet worden geverifieerd",
    "Der Beratungspreis konnte nicht verifiziert werden",
    "The consultation price is invalid",
    "De consultatieprijs is ongeldig",
    "Der Beratungspreis ist ungültig",
    "The consultation price is temporarily unavailable",
    "De consultatieprijs is tijdelijk niet beschikbaar",
    "Der Beratungspreis ist derzeit nicht verfügbar",
  ]) {
    assert.ok(i18n.includes(phrase), `missing offer copy: ${phrase}`);
  }
});
