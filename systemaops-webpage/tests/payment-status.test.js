import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { fetchPaymentStatus } from "../src/pages/BookACall/consultation/paymentStatusService.js";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("status client calls the same-origin session endpoint and accepts only normalized states", () => {
  const source = read("../src/pages/BookACall/consultation/paymentStatusService.js");
  assert.ok(source.includes("/api/payments/session/"));
  for (const state of ["paid", "pending", "failed", "expired"]) {
    assert.ok(source.includes(`"${state}"`));
  }
  assert.ok(source.includes("encodeURIComponent(sessionId)"));
  assert.ok(source.includes("AbortSignal") === false || source.includes("signal"));
});

test("return page verifies status and offers retry without treating redirect as payment proof", () => {
  const page = read("../src/pages/Payments/PaymentResult.jsx");
  assert.ok(page.includes("fetchPaymentStatus(sessionId"));
  assert.ok(page.includes("retryVerification"));
  assert.ok(page.includes("verifiedHeading"));
  assert.ok(page.includes("unavailableHeading"));
  assert.match(page, /never claim a payment is\s+confirmed/i);
});

test("status client accepts Stripe-shaped references and rejects junk without a request", async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(url);
    return {
      ok: true,
      json: async () => ({ success: true, status: "paid" }),
    };
  };

  try {
    assert.equal(
      await fetchPaymentStatus("cs_test_status_pending"),
      "paid",
      "ids containing underscores are valid references"
    );
    assert.equal(
      calls[0],
      "/api/payments/session/cs_test_status_pending"
    );

    await assert.rejects(
      () => fetchPaymentStatus("not-a-session"),
      /invalid_checkout_reference/
    );
    assert.equal(calls.length, 1, "invalid references must not reach the API");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("cancel page retries the linked consultation without creating a duplicate", () => {
  const page = read("../src/pages/Payments/PaymentResult.jsx");

  assert.ok(page.includes("consultation_id"), "must read the linked enquiry id");
  assert.ok(
    page.includes("CONSULTATION_ID_PATTERN"),
    "the enquiry id must be shape-checked"
  );
  assert.ok(
    page.includes("adapter.create({ consultationId })"),
    "retry must reopen Checkout for the same consultation"
  );
  assert.ok(
    page.includes('adapter.name === "stripe"'),
    "only the real Stripe adapter may retry"
  );
});

test("status messages exist for all supported languages", () => {
  const translations = read("../src/i18n/translations-services.js");
  for (const key of ["verifiedHeading", "failedHeading", "expiredHeading", "unavailableHeading", "retryVerification"]) {
    assert.equal(translations.split(key).length - 1, 3, `${key} must exist in EN, NL, and DE`);
  }
});

test("paid checkout creates the enquiry once, enters payment, then starts Stripe immediately", () => {
  const offer = read("../src/pages/BookACall/consultation/offerConfig.js");
  const hook = read("../src/pages/BookACall/consultation/useConsultationForm.js");
  assert.ok(offer.includes('VITE_ENABLE_STRIPE_CHECKOUT === "false"'));
  assert.ok(hook.includes('statusRef.current === "submitting"'));
  assert.ok(hook.includes("setStep(paymentAvailable ? STEPS.PAYMENT : STEPS.CONFIRMATION)"));
  assert.ok(hook.includes("consultationIdRef.current = result?.id || null"));
  assert.ok(hook.includes("await adapter.create({"));
  assert.ok(hook.includes('setPaymentError("payments.notConfigured")') || hook.includes('"payments.notConfigured"'));
  assert.ok(
    hook.indexOf("consultationService.submit(") < hook.indexOf("await adapter.create({"),
    "checkout creation must follow the successful consultation response"
  );
});

test("real Checkout uses the server Price and keeps provider errors on the payment step", () => {
  const hook = read("../src/pages/BookACall/consultation/useConsultationForm.js");
  const checkout = read("../src/pages/BookACall/components/StripeCheckout.jsx");
  const adapter = read("../src/pages/BookACall/consultation/paymentService.js");
  assert.ok(hook.includes('"payments.notConfigured"'));
  assert.ok(hook.includes("setPaymentError("));
  assert.ok(hook.includes("if (adapter.name === \"stripe\") return result;"));
  assert.ok(checkout.includes("disabled={!canStart}"));
  assert.ok(adapter.includes("readCheckoutUrl(response)"));
  assert.ok(adapter.includes("redirectToStripeCheckout(checkoutUrl)"));
});
