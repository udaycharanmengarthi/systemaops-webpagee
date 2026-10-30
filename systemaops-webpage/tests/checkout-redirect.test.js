import assert from "node:assert/strict";
import test from "node:test";

import {
  readCheckoutUrl,
  redirectToStripeCheckout,
} from "../src/pages/BookACall/consultation/checkoutRedirect.js";

const response = (status, body) => ({
  status,
  ok: status >= 200 && status < 300,
  json: async () => body,
});

test("checkout response parser accepts only the backend's url field", async () => {
  assert.equal(
    await readCheckoutUrl(response(200, { url: "https://checkout.stripe.com/c/pay/session" })),
    "https://checkout.stripe.com/c/pay/session"
  );
  await assert.rejects(readCheckoutUrl(response(503, { message: "not configured" })), {
    message: "payments_not_configured",
  });
  await assert.rejects(readCheckoutUrl(response(502, { message: "provider failed" })), {
    message: "checkout_failed",
  });
  await assert.rejects(readCheckoutUrl(response(200, { checkoutUrl: "https://checkout.stripe.com" })), {
    message: "checkout_failed",
  });
  await assert.rejects(readCheckoutUrl({ status: 200, ok: true, json: async () => { throw new Error("invalid json"); } }), {
    message: "checkout_failed",
  });
});

test("a valid provider-returned Checkout URL redirects the browser", () => {
  const assigned = [];
  const location = { assign: (url) => assigned.push(url) };
  const returnedUrl = "https://checkout.stripe.com/c/pay/cs_test_example";

  assert.equal(redirectToStripeCheckout(returnedUrl, location), returnedUrl);
  assert.deepEqual(assigned, [returnedUrl]);
});

test("malformed, non-Stripe, and non-HTTPS checkout URLs are rejected", () => {
  const location = { assign() { assert.fail("invalid URL must not redirect"); } };
  for (const url of [
    "not a URL",
    "http://checkout.stripe.com/c/pay/session",
    "https://attacker.example/checkout",
    "https://user:pass@checkout.stripe.com/c/pay/session",
  ]) {
    assert.throws(
      () => redirectToStripeCheckout(url, location),
      { message: "checkout_failed" }
    );
  }
});
