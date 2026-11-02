// src/config/payments.js
//
// Stripe configuration for the one-time consultation payment.
//
// Design rules:
//   * NEVER throws at import/startup. The rest of the site (contact form,
//     careers, admin) must work normally when Stripe is not configured.
//   * Payment endpoints answer 503 "Payments are not configured" instead.
//   * Placeholder values (REPLACE_ME, CHANGE_ME, ...) and values with the
//     wrong shape count as NOT configured, so a half-filled .env can never
//     be mistaken for a working integration.
//   * Values are read lazily on every call so tests can mutate process.env
//     without re-importing modules.
//   * Secrets are never logged. `describeMissing()` returns KEY NAMES only.

import Stripe from "stripe";

import {
  isSupportedCurrency,
  normalizeCurrency,
} from "../utils/currency.js";

export const PAYMENTS_NOT_CONFIGURED_MESSAGE =
  "Payments are not configured";

/* The configured Stripe Price is the single source of amount and currency.
   There is deliberately no expected amount/currency constant in this file:
   validation accepts exactly what Stripe returns for STRIPE_PRICE_ID, while
   still rejecting Prices that are not fixed one-time charges. */

/* An unset value, or an obvious template placeholder. */
const PLACEHOLDER = /REPLACE_ME|CHANGE_ME|PLACEHOLDER|your[_-]?key|xxxx/i;

const readEnv = (name) => {
  const raw = process.env[name];
  if (typeof raw !== "string") return "";
  const value = raw.trim();
  if (!value) return "";
  if (PLACEHOLDER.test(value)) return "";
  return value;
};

const isPrefixed = (value, prefix) =>
  typeof value === "string" && value.startsWith(prefix);

/* A Stripe secret key must identify its mode unambiguously. Accept both
   standard (sk_) and restricted (rk_) secret keys; public publishable keys
   (pk_) are never valid here. */
const STRIPE_KEY_MODES = Object.freeze([
  ["sk_test_", "test"],
  ["sk_live_", "live"],
  ["rk_test_", "test"],
  ["rk_live_", "live"],
]);

export const modeForStripeSecretKey = (value) => {
  if (typeof value !== "string") return null;
  const match = STRIPE_KEY_MODES.find(([prefix]) => value.startsWith(prefix));
  return match ? match[1] : null;
};

/**
 * Effective configuration. `configured` is true only when every required
 * value is present AND shape-valid. `mode` is derived from the secret key;
 * it is never inferred from a Price ID or from the frontend.
 */
export const getPaymentsConfig = () => {
  const secretKey = readEnv("STRIPE_SECRET_KEY");
  const webhookSecret = readEnv("STRIPE_WEBHOOK_SECRET");
  const priceId = readEnv("STRIPE_PRICE_ID");
  const frontendUrl = readEnv("FRONTEND_URL").replace(/\/+$/, "");
  const mode = modeForStripeSecretKey(secretKey);

  const missing = [];

  if (!mode) missing.push("STRIPE_SECRET_KEY");
  if (!isPrefixed(webhookSecret, "whsec_")) {
    missing.push("STRIPE_WEBHOOK_SECRET");
  }
  if (!isPrefixed(priceId, "price_")) missing.push("STRIPE_PRICE_ID");

  let frontendOk = false;
  if (frontendUrl) {
    try {
      const parsed = new URL(frontendUrl);
      frontendOk =
        (parsed.protocol === "http:" || parsed.protocol === "https:") &&
        !parsed.username &&
        !parsed.password &&
        !parsed.search &&
        !parsed.hash;
    } catch {
      frontendOk = false;
    }
  }
  if (!frontendOk) missing.push("FRONTEND_URL");

  return {
    secretKey,
    webhookSecret,
    priceId,
    frontendUrl,
    mode,
    live: mode === "live",
    missing,
    configured: missing.length === 0,
  };
};

export const isPaymentsConfigured = () => getPaymentsConfig().configured;

/* Test/live isolation: a signed test event must never mutate live data
   and a live event must never be processed by a test deployment. */
export const isLiveMode = () => getPaymentsConfig().mode === "live";

/**
 * Validate a Stripe Price for the server-configured Price ID.
 *
 * Returns stable reason codes only — never a provider payload. The Price
 * was retrieved with the configured secret key, so it necessarily belongs
 * to the configured Stripe account; the id check catches a misbehaving
 * adapter returning a different Price than the one requested.
 *
 * Only fixed one-time Prices are supported. Recurring, tiered, custom,
 * transform-quantity, multi-currency and unit-amount-less Prices are
 * rejected before any checkout can be created.
 */
export const getPriceValidationIssues = (
  price,
  { priceId = "", live = isLiveMode() } = {}
) => {
  const reasons = [];

  if (!price || typeof price !== "object") {
    return ["price_missing"];
  }

  if (priceId && price.id !== priceId) reasons.push("price_id_mismatch");
  if (price.active !== true) reasons.push("price_inactive");
  if (price.type !== "one_time") reasons.push("price_not_one_time");
  if (price.recurring) reasons.push("price_recurring");
  if (price.livemode !== live) reasons.push("price_mode_mismatch");

  if (price.billing_scheme && price.billing_scheme !== "per_unit") {
    reasons.push("price_billing_scheme_unsupported");
  }
  if (price.custom_unit_amount) {
    reasons.push("price_custom_amount_unsupported");
  }
  if (Array.isArray(price.tiers) && price.tiers.length > 0) {
    reasons.push("price_tiered_unsupported");
  }
  if (price.tiers_mode) reasons.push("price_tiered_unsupported");
  if (price.transform_quantity) {
    reasons.push("price_quantity_transform_unsupported");
  }
  if (
    price.currency_options &&
    typeof price.currency_options === "object" &&
    Object.keys(price.currency_options).length > 0
  ) {
    reasons.push("price_multi_currency_unsupported");
  }

  if (!normalizeCurrency(price.currency)) {
    reasons.push("price_currency_invalid");
  } else if (!isSupportedCurrency(price.currency)) {
    reasons.push("price_currency_unsupported");
  }

  if (!Number.isSafeInteger(price.unit_amount) || price.unit_amount <= 0) {
    reasons.push("price_amount_invalid");
  }

  return reasons;
};

/**
 * Convert a validated Stripe Price into the server-owned commercial terms.
 * Callers must only pass a Price for which getPriceValidationIssues returned
 * an empty list.
 */
export const offerFromPrice = (price) => ({
  priceId: price.id,
  amountMinor: price.unit_amount,
  currency: normalizeCurrency(price.currency).toLowerCase(),
  quantity: 1,
  valid: true,
});

/* Human-readable status for logs/startup output: KEY NAMES only. */
export const describeMissing = () => {
  const { missing } = getPaymentsConfig();
  return missing.length ? missing.join(", ") : "none";
};

/* Startup-safe summary. Never includes a secret value. */
export const describePaymentsConfig = () => {
  const config = getPaymentsConfig();
  return {
    configured: config.configured,
    mode: config.mode || "unconfigured",
    priceConfigured: Boolean(config.priceId),
    frontendConfigured: Boolean(config.frontendUrl),
    missing: config.missing,
  };
};

let client = null;
let clientKey = "";

/**
 * Lazily-created Stripe client. Recreated if the configured key changes
 * (tests). Throws only when called while unconfigured — callers must gate
 * on isPaymentsConfigured() first and answer 503.
 */
export const getStripeClient = () => {
  const { secretKey, configured } = getPaymentsConfig();
  if (!configured || !secretKey) {
    const error = new Error(PAYMENTS_NOT_CONFIGURED_MESSAGE);
    error.status = 503;
    throw error;
  }
  if (!client || clientKey !== secretKey) {
    /* No explicit apiVersion: the SDK's own pinned default applies, so the
       payload shape cannot drift under a deployed implementation and no
       version string is hard-coded here. */
    client = new Stripe(secretKey);
    clientKey = secretKey;
  }
  return client;
};

/* Test-only: drop the memoized client. */
export const resetStripeClient = () => {
  client = null;
  clientKey = "";
};
