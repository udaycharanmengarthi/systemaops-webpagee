/* Focused consultation experience guards.
 *
 * The redesign removes the duplicate service-card picker and the
 * unnecessary step rail, keeps one primary action, shows the configured
 * fee before checkout, and links the privacy acknowledgement to the
 * existing policy page.
 */
import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

const page = read("src/pages/BookACall/index.jsx");
const form = read("src/pages/BookACall/components/ConsultationForm.jsx");
const css = read("src/pages/BookACall/BookACall.css");

test("book-a-call has one area dropdown and no duplicate service picker", () => {
  assert.ok(page.includes("servicesMenu"), "the dropdown uses the canonical service list");
  assert.ok(page.includes("ConsultationForm"), "the single form is rendered");
  assert.ok(!page.includes("AreaPicker"), "the service-card picker must not be rendered");
  assert.ok(!page.includes("cs-areas-grid"), "the duplicate service cards must be gone");
});

test("book-a-call has no unnecessary step rail", () => {
  assert.ok(!page.includes("Stepper"), "the step rail must not be rendered");
  assert.ok(!css.includes(".cs-stepper"), "the step rail styles must be removed");
});

test("the form has one full-width primary action with flow-aware copy", () => {
  assert.ok(form.includes("paymentRequired"), "the form must know when payment is required");
  assert.ok(
    form.includes('t("consultation.review.toPayment")'),
    "paid flow uses the Continue to payment label"
  );
  assert.ok(
    form.includes('t("consultation.form.submit")'),
    "enquiry flow uses the request label"
  );
  assert.ok(form.includes("cs-submit"), "the primary submit action is present");
  assert.match(css, /\.cs-submit\s*\{[^}]*width:\s*100%/s);
});

test("the configured fee is shown before checkout", () => {
  assert.ok(page.includes("priceLabel"), "the page resolves the server offer price");
  assert.ok(form.includes("priceLabel"), "the form receives the price");
  assert.ok(form.includes("paymentOfferError"), "payment setup failures are visible");
  assert.ok(form.includes('t("consultation.panel.price")'), "the fee row has a label");
  assert.ok(form.includes('t("consultation.panel.oneTime")'), "the fee is described as one-time");
});

test("the privacy acknowledgement links to the existing policy", () => {
  assert.ok(form.includes('to="/privacy-policy"'), "privacy policy link is present");
  assert.ok(form.includes('t("privacy.policyLink")'), "the link uses the shared policy copy");
});

test("the page and form use existing theme tokens", () => {
  assert.ok(css.includes("var(--bg-surface)"), "surfaces use theme tokens");
  assert.ok(css.includes("var(--text-primary)"), "text uses theme tokens");
  assert.ok(css.includes("var(--accent-primary)"), "actions use the brand accent token");
  assert.ok(!css.includes("#FFFFFF") && !css.includes("#0B1720"), "no hardcoded theme colours");
});
