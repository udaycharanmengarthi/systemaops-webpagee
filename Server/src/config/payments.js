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

export const PAYMENTS_NOT_CONFIGURED_MESSAGE =
  "Payments are not configured";

/* The commercial offer is deliberately server-owned. The Stripe Price is
   still the source of amount/currency, but these expected values are the
   guard that catches a wrong Price ID in configuration before a customer
   can pay the wrong amount. They default to the currently approved
   consultation (EUR 500.00) and are overridable only through the backend
   environment. */
const DEFAULT_EXPECTED_OFFER = Object.freeze({
  currency: "eur",
  amountMinor: 50000,
  quantity: 1,
});

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

/**
 * Effective configuration. `configured` is true only when every required
 * value is present AND shape-valid.
 */
export const getPaymentsConfig = () => {
  const secretKey = readEnv("STRIPE_SECRET_KEY");
  const webhookSecret = readEnv("STRIPE_WEBHOOK_SECRET");
  const priceId = readEnv("STRIPE_PRICE_ID");
  const frontendUrl = readEnv("FRONTEND_URL").replace(/\/+$/, "");

  const missing = [];

  if (!isPrefixed(secretKey, "sk_")) missing.push("STRIPE_SECRET_KEY");
  if (!isPrefixed(webhookSecret, "whsec_")) {
    missing.push("STRIPE_WEBHOOK_SECRET");
  }
  if (!isPrefixed(priceId, "price_")) missing.push("STRIPE_PRICE_ID");

  let frontendOk = false;
  if (frontendUrl) {
    try {
      const parsed = new URL(frontendUrl);
      frontendOk =
        parsed.protocol === "http:" || parsed.protocol === "https:";
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
    missing,
    configured: missing.length === 0,
  };
};

export const isPaymentsConfigured = () => getPaymentsConfig().configured;

/**
 * The expected consultation offer used to reject a misconfigured Stripe
 * Price before checkout. `CONSULTATION_AMOUNT_MINOR` is in minor units
 * (cents), exactly as Stripe reports `unit_amount`.
 */
export const getExpectedOffer = () => {
  const currency = (
    readEnv("CONSULTATION_CURRENCY") || DEFAULT_EXPECTED_OFFER.currency
  ).toLowerCase();
  const amountRaw = readEnv("CONSULTATION_AMOUNT_MINOR");
  const amountMinor =
    amountRaw === ""
      ? DEFAULT_EXPECTED_OFFER.amountMinor
      : Number(amountRaw);

  const valid =
    /^[a-z]{3}$/.test(currency) &&
    Number.isSafeInteger(amountMinor) &&
    amountMinor > 0;

  return {
    currency,
    amountMinor,
    quantity: DEFAULT_EXPECTED_OFFER.quantity,
    valid,
  };
};

/* Test/live isolation: a signed test event must never mutate live data
   and a live event must never be processed by a test deployment. */
export const isLiveMode = () =>
  getPaymentsConfig().secretKey.startsWith("sk_live_");

/* Human-readable status for logs/startup output: KEY NAMES only. */
export const describeMissing = () => {
  const { missing } = getPaymentsConfig();
  return missing.length ? missing.join(", ") : "none";
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
