/* The REAL Stripe adapter, and the safety rails around it.
 *
 * paymentService.js is what the book-a-call step machine calls once a
 * validated enquiry has been accepted by the backend. These tests pin the
 * three properties that matter:
 *
 *   1. it talks ONLY to this app's backend, and sends no amount, price,
 *      currency or Price ID;
 *   2. it follows the backend-returned URL rather than building one;
 *   3. it stays UNAVAILABLE while the offer is still undecided, so an
 *      unapproved price can never be presented to a visitor.
 *
 * The adapter is read as source rather than executed: it branches on
 * import.meta.env, which plain node:test cannot evaluate, and the project
 * deliberately has no DOM runner.
 */
import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

const read = (relative) =>
  fs.readFileSync(path.join(root, relative), "utf8");

const paymentService = read(
  "src/pages/BookACall/consultation/paymentService.js"
);
const offerConfig = read(
  "src/pages/BookACall/consultation/offerConfig.js"
);
const useConsultationForm = read(
  "src/pages/BookACall/consultation/useConsultationForm.js"
);
const checkoutRedirect = read(
  "src/pages/BookACall/consultation/checkoutRedirect.js"
);

/* Only the code, never a comment or a doc string. */
const stripComments = (source) =>
  source
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^[ \t]*\/\/.*$/gm, " ");

test("the real adapter posts to this app's backend checkout endpoint", () => {
  assert.ok(
    paymentService.includes("/api/payments/create-checkout-session"),
    "must call POST /api/payments/create-checkout-session"
  );
  assert.ok(paymentService.includes('method: "POST"'), "must use POST");
  assert.ok(
    paymentService.includes("VITE_API_BASE_URL"),
    "must reuse the VITE_API_BASE_URL convention"
  );
});

test("the adapter never sends an amount, price, currency or Price ID", () => {
  const code = stripComments(paymentService);

  for (const token of [
    "amount:",
    "price:",
    "currency:",
    "unit_amount",
    "line_items",
    "amount_total",
    "priceId",
  ]) {
    assert.ok(
      !code.includes(token),
      `the adapter must not send "${token}" — the server owns pricing`
    );
  }
});

test("the adapter follows the backend-returned URL", () => {
  const code = stripComments(paymentService);

  assert.ok(
    paymentService.includes("readCheckoutUrl(response)") &&
      paymentService.includes("redirectToStripeCheckout(checkoutUrl)"),
    "must validate and redirect using the backend-returned URL"
  );
  assert.ok(
    !/new URL\([`"']https:\/\/checkout\.stripe\.com/.test(code + checkoutRedirect),
    "must never construct a Stripe URL in the browser"
  );
});

test("the adapter sends the server-generated consultation reference", () => {
  assert.ok(
    paymentService.includes("consultationId"),
    "must send consultationId so the session links to the enquiry"
  );
  assert.ok(
    useConsultationForm.includes("consultationId"),
    "the form hook must supply the consultation id"
  );
  assert.ok(
    useConsultationForm.includes("consultationIdRef.current = result?.id"),
    "the id must come from the backend response, never be generated here"
  );
});

test("the real Stripe adapter is the default; the mock is opt-in in development", () => {
  const code = stripComments(paymentService);

  /* The real adapter must be available by default in every build. A missing
     environment file must never silently route the visitor to the demo. */
  assert.ok(
    code.includes("isAvailable: () => !MOCK_ENABLED"),
    "Stripe must be available unless the development mock is explicitly on"
  );
  assert.ok(
    offerConfig.includes('VITE_ENABLE_MOCK_PAYMENT === "true"'),
    "the mock may only be selected with an explicit opt-in flag"
  );
  assert.ok(
    /import\.meta\.env\.DEV\s*===\s*true[\s\S]*VITE_ENABLE_MOCK_PAYMENT\s*===\s*"true"/.test(offerConfig),
    "the mock may only exist in a development build"
  );

  /* A missing backend configuration must reach the payment UI and report
     an actionable error instead of silently becoming an enquiry-only flow. */
  assert.ok(
    /import\.meta\.env\.DEV\s*===\s*true[\s\S]*VITE_ENABLE_STRIPE_CHECKOUT\s*===\s*"false"/.test(offerConfig),
    "enquiry-only mode may only be explicitly selected in development"
  );
  assert.ok(
    offerConfig.includes("priceLabel: null"),
    "no price may be hardcoded while the amount is unapproved"
  );
  assert.ok(
    offerConfig.includes("currency: null"),
    "no currency may be hardcoded while it is unapproved"
  );
});

test("the development mock adapter remains development-gated", () => {
  const code = stripComments(paymentService);

  assert.ok(
    code.includes("mockPaymentAdapter"),
    "the mock adapter must still exist for local demos"
  );
  assert.ok(
    /MOCK_ENABLED \? mockPaymentAdapter : stripePaymentAdapter/.test(code),
    "the mock must only be selected in a development build"
  );
  assert.ok(
    offerConfig.includes("import.meta.env.DEV"),
    "the mock gate must be tied to import.meta.env.DEV"
  );
});

test("a redirect is never treated as proof of payment", () => {
  const resultPage = read("src/pages/Payments/PaymentResult.jsx");

  assert.ok(
    resultPage.includes("fetchPaymentStatus(sessionId"),
    "the result page must ask the server to verify the returned session"
  );
  assert.ok(
    resultPage.includes('verification.state === "paid"'),
    "the paid state must come from the server verification response"
  );
  assert.ok(
    resultPage.includes("noindex"),
    "payment result pages must not be indexed"
  );
});
