/* Phase 1 mock-journey safety.
 *
 * The mock payment adapter is a DEVELOPMENT DEMO. It must never reach a
 * production bundle, and the string "DEVELOPMENT DEMO" must never be
 * shipped to visitors. These tests prove that against the real build
 * output.
 */
import assert from "node:assert/strict";
import test from "node:test";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const distAssets = path.join(root, "dist", "assets");

const hasBuild = () => fs.existsSync(distAssets);

/* ══════════════════════════════════════════════════════════════════
   SOURCE-LEVEL GATES (run without a build)
   ══════════════════════════════════════════════════════════════════ */

test("the mock adapter is gated behind a development-only flag", () => {
  const source = fs.readFileSync(
    path.join(root, "src/pages/BookACall/consultation/offerConfig.js"),
    "utf8"
  );

  assert.ok(
    /isMockJourneyEnabled[\s\S]*import\.meta\.env\.DEV/.test(source),
    "mock availability must require import.meta.env.DEV"
  );
  assert.ok(
    source.includes('VITE_ENABLE_MOCK_PAYMENT'),
    "an explicit opt-out flag must exist"
  );
});

test("the payment service reaches Stripe only through our own backend", () => {
  const source = fs.readFileSync(
    path.join(root, "src/pages/BookACall/consultation/paymentService.js"),
    "utf8"
  );
  const redirectSource = fs.readFileSync(
    path.join(root, "src/pages/BookACall/consultation/checkoutRedirect.js"),
    "utf8"
  );

  assert.ok(
    source.includes("stripePaymentAdapter"),
    "the real Stripe adapter must exist"
  );

  /* Still true in every phase: the browser never holds Stripe machinery.
     The adapter talks to THIS app's backend, which owns the Price. */
  assert.ok(
    !/new Stripe\(|from ["']stripe["']|require\(["']stripe/.test(source),
    "no Stripe SDK may ever be imported in the frontend"
  );
  assert.ok(
    !/sk_(test|live)_/.test(source),
    "no Stripe-like secret may appear in frontend source"
  );
  assert.ok(
    !/whsec_/.test(source),
    "no webhook secret may appear in frontend source"
  );
  assert.ok(
    !/new URL\([`"']https:\/\/checkout\.stripe\.com/.test(source + redirectSource),
    "the browser must not construct a Stripe URL"
  );

  /* The only network call is to this app's own backend. */
  const fetches = [...source.matchAll(/fetch\(\s*([^,)]+)/g)].map((m) =>
    m[1].trim()
  );
  assert.ok(fetches.length > 0, "the real adapter must call the backend");
  for (const target of fetches) {
    assert.ok(
      target.includes("/api/payments/create-checkout-session"),
      `the adapter must only call this app's backend, found: ${target}`
    );
  }

  /* The real adapter is the default; the demo is opt-in only. */
  assert.ok(
    source.includes("isAvailable: () => !MOCK_ENABLED"),
    "the real adapter must be available unless the mock is explicitly on"
  );
});

test("the mock adapter contains no card inputs or credentials", () => {
  const source = fs.readFileSync(
    path.join(root, "src/pages/BookACall/consultation/paymentService.js"),
    "utf8"
  );
  const component = fs.readFileSync(
    path.join(root, "src/pages/BookACall/components/MockCheckout.jsx"),
    "utf8"
  );

  for (const forbidden of [
    "cardNumber",
    "card_number",
    "cvc",
    "expiry",
    "iban",
    "sk_test",
    "sk_live",
    "whsec_",
    "price_",
  ]) {
    assert.ok(
      !source.includes(forbidden),
      `mock adapter must not contain "${forbidden}"`
    );
    assert.ok(
      !component.includes(forbidden),
      `mock checkout UI must not contain "${forbidden}"`
    );
  }
});

test("the mock result is labelled as simulated, never as a verified payment", () => {
  const source = fs.readFileSync(
    path.join(root, "src/pages/BookACall/components/MockCheckout.jsx"),
    "utf8"
  );

  assert.ok(
    source.includes("consultation.mock.banner"),
    "the demo banner must always render"
  );
  assert.ok(
    source.includes("simulated: true") ||
      fs
        .readFileSync(
          path.join(root, "src/pages/BookACall/consultation/paymentService.js"),
          "utf8"
        )
        .includes("simulated: true"),
    "mock results must be flagged as simulated"
  );
  assert.ok(
    !/payment (is )?verified/i.test(source),
    "mock result must never claim a verified payment"
  );
});

test("no personal data is placed in the URL", () => {
  const dir = path.join(root, "src/pages/BookACall");
  const stack = [dir];
  const files = [];

  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (/\.(jsx|js)$/.test(entry.name)) files.push(full);
    }
  }

  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    assert.ok(
      !/useSearchParams|URLSearchParams/.test(source),
      `${path.relative(root, file)} must not read/write personal data via the URL`
    );
    assert.ok(
      !/navigate\([^)]*\?/.test(source),
      `${path.relative(root, file)} must not push personal data into a URL`
    );
  }
});

/* ══════════════════════════════════════════════════════════════════
   BUILD-LEVEL GATES (require `npm run build` first)
   ══════════════════════════════════════════════════════════════════ */

test("the production bundle excludes the mock adapter and demo strings", () => {
  if (!hasBuild()) {
    console.log("[tests] no dist/assets — run `npm run build` first");
    return;
  }

  const files = fs
    .readdirSync(distAssets)
    .filter((name) => name.endsWith(".js"));

  assert.ok(files.length > 0, "dist/assets exists but contains no JS");

  /* import.meta.env.DEV is statically false in a production build, so
     these literals must have been eliminated. */
  const forbidden = [
    "DEVELOPMENT DEMO",
    "Simulate successful payment",
    "Simulate cancelled or failed payment",
    "DEMO-",
    "Development build",
    "VITE_ENABLE_MOCK_PAYMENT",
  ];

  for (const file of files) {
    const content = fs.readFileSync(path.join(distAssets, file), "utf8");

    for (const token of forbidden) {
      assert.ok(
        !content.includes(token),
        `production bundle ${file} must not contain "${token}"`
      );
    }
  }
});

test("the production bundle contains no Stripe secret or key material", () => {
  if (!hasBuild()) return;

  const files = fs
    .readdirSync(distAssets)
    .filter((name) => /\.(js|css)$/.test(name));

  const forbidden = [
    "sk_test_",
    "sk_live_",
    "whsec_",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_PRICE_ID",
  ];

  for (const file of files) {
    const content = fs.readFileSync(path.join(distAssets, file), "utf8");
    for (const token of forbidden) {
      assert.ok(!content.includes(token), `${file} must not contain "${token}"`);
    }
  }
});

test("the production bundle does not import the Stripe SDK", () => {
  if (!hasBuild()) return;

  const files = fs
    .readdirSync(distAssets)
    .filter((name) => name.endsWith(".js"));

  for (const file of files) {
    const content = fs.readFileSync(path.join(distAssets, file), "utf8");
    assert.ok(
      !/@stripe\/stripe-js|loadStripe/.test(content),
      `${file} must not reference the Stripe browser SDK in Phase 1`
    );
  }
});
