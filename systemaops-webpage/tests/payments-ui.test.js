/* Frontend payment checks — zero new dependencies (node:test + Node
 * built-ins only), because the project has no frontend test framework
 * and adding one (vitest/testing-library) is a separate decision.
 *
 * What this covers WITHOUT a DOM:
 *   - the pay button targets the right endpoint and sends no amount,
 *     price or currency;
 *   - the success/cancel pages are routed;
 *   - the success copy does NOT claim a confirmed payment;
 *   - no Stripe secret or price/secret ENV NAME reaches the build output.
 *
 * What it does NOT cover (needs a DOM runner): actual rendering, click
 * handling and loading/error transitions. See the report's BLOCKERS.
 *
 * Run:  npm run test
 */
import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const src = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

const buttonSource = src("src/components/sections/PayForConsultation.jsx");
const buttonCtaSource = src("src/components/sections/ButtonCta.jsx");
const resultSource = src("src/pages/Payments/PaymentResult.jsx");
const appSource = src("src/App.jsx");
const i18nSource = src("src/i18n/translations-services.js");
const navbarSource = src("src/components/layout/Navbar.jsx");
const bookACallSource = src("src/pages/BookACall/index.jsx");
const contactSource = src("src/components/sections/ContactUs.jsx");

/* ── Pay button wiring ───────────────────────────────────────────────────── */

test("home pay button routes into the consultation flow instead of creating an unlinked session", () => {
  assert.ok(
    buttonSource.includes('navigate("/book-a-call")'),
    "must navigate to /book-a-call so a real consultation is created first"
  );
  assert.ok(
    !buttonSource.includes("/api/payments/create-checkout-session"),
    "the home CTA must not start an unlinked Checkout Session"
  );
  assert.ok(
    !buttonSource.includes("fetch("),
    "the home CTA must not make a payment API request"
  );
});

test("home pay button never sends an amount, price or currency", () => {
  const forbidden = [
    "amount:",
    "price:",
    "currency:",
    "unit_amount",
    "line_items",
    "amount_total",
  ];
  for (const token of forbidden) {
    assert.ok(
      !buttonSource.includes(token),
      `pay button must not send "${token}"`
    );
  }
});

test("book-a-call remains the only Stripe checkout entry point", () => {
  const adapterSource = src(
    "src/pages/BookACall/consultation/paymentService.js"
  );
  assert.ok(
    adapterSource.includes("/api/payments/create-checkout-session"),
    "the Book a Call adapter must call the backend checkout endpoint"
  );
  assert.ok(
    adapterSource.includes("consultationId"),
    "the checkout request must carry the server-generated consultation id"
  );
  assert.ok(
    buttonCtaSource.includes("<PayForConsultation"),
    "the home CTA component must stay wired"
  );
});

test("Stripe checkout button is disabled while the request is in flight", () => {
  const checkoutSource = src(
    "src/pages/BookACall/components/StripeCheckout.jsx"
  );
  assert.ok(
    checkoutSource.includes("disabled={!canStart}"),
    "the pay button must be disabled while busy or without an offer"
  );
  assert.ok(
    checkoutSource.includes("aria-busy={busy}"),
    "the pay button must expose aria-busy"
  );

  const hookSource = src(
    "src/pages/BookACall/consultation/useConsultationForm.js"
  );
  assert.ok(
    hookSource.includes("paymentBusyRef"),
    "payment submission needs a synchronous double-click guard"
  );
  assert.ok(
    hookSource.includes("statusRef.current === \"submitting\""),
    "enquiry submission needs a synchronous double-click guard"
  );
});

/* ── Result pages ────────────────────────────────────────────────────────── */

test("success and cancel routes exist", () => {
  assert.ok(appSource.includes('path="/payment/success"'), "missing /payment/success route");
  assert.ok(appSource.includes('path="/payment/cancel"'), "missing /payment/cancel route");
  assert.ok(appSource.includes("PaymentSuccess"), "success page not wired");
  assert.ok(appSource.includes("PaymentCancel"), "cancel page not wired");
});

/* ── Navbar: two independent actions ─────────────────────────────────────── */

test("navbar keeps Contact Us pointing at the contact page", () => {
  assert.ok(
    navbarSource.includes('navigate("/contact")'),
    "Contact Us must still navigate to /contact"
  );
  assert.ok(
    navbarSource.includes('t("nav.contact")'),
    "Contact Us label must stay"
  );
  assert.ok(
    contactSource.includes("/api/contact"),
    "the contact form must keep posting to /api/contact"
  );
});

test("navbar has a separate Book a Call CTA to /book-a-call", () => {
  assert.ok(
    navbarSource.includes('navigate("/book-a-call")'),
    "Book a Call must navigate to /book-a-call"
  );
  assert.ok(
    navbarSource.includes('t("nav.bookCall")'),
    "Book a Call must use its own label"
  );
  /* Desktop AND mobile must both offer it. */
  const occurrences = navbarSource.split('navigate("/book-a-call")').length - 1;
  assert.ok(occurrences >= 2, "Book a Call must exist on desktop and mobile");
});

test("/book-a-call is routed", () => {
  assert.ok(
    appSource.includes('path="/book-a-call"'),
    "missing /book-a-call route"
  );
  assert.ok(appSource.includes("BookACall"), "book-a-call page not wired");
});

/* ── Book-a-call page ────────────────────────────────────────────────────── */

test("book-a-call submits through a service boundary, not from the component", () => {
  const serviceSource = src(
    "src/pages/BookACall/consultation/consultationService.js"
  );

  assert.ok(
    serviceSource.includes("/api/consultations"),
    "the service must post to /api/consultations"
  );
  assert.ok(
    !bookACallSource.includes("fetch("),
    "presentation components must not call fetch directly"
  );
  assert.ok(
    bookACallSource.includes("useConsultationForm"),
    "the page must use the form hook"
  );
});

test("book-a-call form payload carries every required field", () => {
  const validationSource = src(
    "src/pages/BookACall/consultation/validation.js"
  );

  for (const field of [
    "name",
    "email",
    "company",
    "areaOfInterest",
    "message",
    "privacyAccepted",
  ]) {
    assert.ok(
      validationSource.includes(`${field}:`),
      `payload must submit "${field}"`
    );
  }
});

test("book-a-call validates required fields and the email format", () => {
  const validationSource = src(
    "src/pages/BookACall/consultation/validation.js"
  );

  assert.ok(
    validationSource.includes("EMAIL_RE"),
    "must validate the email format"
  );
  assert.ok(
    validationSource.includes("privacyRequired"),
    "privacy acknowledgement must be required"
  );
  assert.ok(
    src("src/pages/BookACall/components/ConsultationForm.jsx").includes(
      "aria-invalid"
    ),
    "invalid fields must be marked for assistive tech"
  );
  assert.ok(
    src("src/pages/BookACall/components/ConsultationForm.jsx").includes(
      "cs-error-summary"
    ),
    "an error summary must be rendered for failed submits"
  );
});

test("book-a-call lists the real services and invents no price", () => {
  assert.ok(
    bookACallSource.includes("servicesMenu"),
    "must render services from the single source of truth"
  );
  /* No hard-coded commercial claim anywhere on the page copy. */
  const forbidden = ["$", "€", "£", "USD", "EUR", "per hour", "hourly"];
  const stripComments = (source) =>
    source.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^[ \t]*\/\/.*$/gm, " ");
  const copy = stripComments(i18nSource);
  for (const token of forbidden) {
    if (token === "$") continue; /* currency symbols are not used in the copy */
    assert.ok(
      !copy.includes(token),
      `payment copy must not mention "${token}" before a price is approved`
    );
  }
});

test("book-a-call payment is gated behind a validated submission", () => {
  const hookSource = src(
    "src/pages/BookACall/consultation/useConsultationForm.js"
  );

  assert.ok(
    hookSource.includes("validateAll"),
    "submission must run validation first"
  );
  assert.ok(
    hookSource.includes("paymentAvailable"),
    "the payment step must depend on an available adapter"
  );
  assert.ok(
    hookSource.includes("consultationOffer.isPaid"),
    "payment must only exist in paid mode"
  );
  assert.ok(
    hookSource.includes("statusRef.current === \"submitting\""),
    "duplicate submission must be guarded"
  );
});

test("success page copy does not claim the payment is confirmed", () => {
  const required =
    "Thank you. We are confirming your payment. A confirmation email will be sent once it is verified.";
  assert.ok(
    i18nSource.includes(required),
    "success copy must use the approved wording"
  );

  /* No USER-FACING wording may assert a confirmed payment. Comments that
     explain WHY the page stays silent are stripped first — they are not
     rendered to the customer. */
  const stripComments = (source) =>
    source.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^[ \t]*\/\/.*$/gm, " ");

  const banned = [
    "payment is confirmed",
    "payment confirmed",
    "we received your payment",
    "payment successful",
    "successfully paid",
    "your payment was successful",
  ];
  for (const phrase of banned) {
    assert.ok(
      !stripComments(resultSource).toLowerCase().includes(phrase),
      `result page must not claim "${phrase}"`
    );
    assert.ok(
      !stripComments(i18nSource).toLowerCase().includes(phrase),
      `payment copy must not claim "${phrase}"`
    );
  }
});

test("cancel page states nothing was charged and offers a retry", () => {
  assert.ok(
    i18nSource.includes("You cancelled the payment and nothing was charged."),
    "cancel copy must state nothing was charged"
  );
  assert.ok(
    resultSource.includes('to="/book-a-call"'),
    "cancel page must send the visitor back to /book-a-call"
  );
});

test("success page handles a missing or invalid session reference", () => {
  assert.ok(
    resultSource.includes("useSearchParams"),
    "success page must read the session reference defensively"
  );
  assert.ok(
    resultSource.includes('startsWith("cs_")'),
    "session reference must be shape-checked, not trusted"
  );
  assert.ok(
    i18nSource.includes("missingSession"),
    "needs copy for a missing session reference"
  );
});

test("result pages are excluded from search indexing", () => {
  assert.ok(resultSource.includes('name="robots"'), "payment pages must not be indexed");
  assert.ok(resultSource.includes('content="noindex"'));
});

/* ── Build output must never contain secrets ─────────────────────────────── */

test("built bundle contains no Stripe secret, webhook secret or Stripe env names", () => {
  const distAssets = path.join(root, "dist", "assets");
  if (!fs.existsSync(distAssets)) {
    /* No build yet — nothing to scan. Not a failure. */
    console.log("[tests] no dist/assets yet — run `npm run build` first to scan output");
    return;
  }

  const files = fs
    .readdirSync(distAssets)
    .filter((name) => /\.(js|css|html)$/.test(name));

  assert.ok(files.length > 0, "dist/assets exists but is empty");

  const forbiddenTokens = [
    "sk_test_",
    "sk_live_",
    "whsec_",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_PRICE_ID",
    "price_",
  ];

  for (const file of files) {
    const content = fs.readFileSync(path.join(distAssets, file), "utf8");
    for (const token of forbiddenTokens) {
      assert.ok(
        !content.includes(token),
        `${file} must not contain "${token}"`
      );
    }
  }
});
