/* ================================================================
   PAYMENT SERVICE — real Stripe adapter + development mock
   ------------------------------------------------------------
   Provider logic lives HERE, never inside a presentation component.

   TWO adapters:
   - stripePaymentAdapter: the real one. Posts to this app's backend
     (/api/payments/create-checkout-session), which owns the Stripe
     Price, then hands the browser to Stripe-hosted Checkout. It carries
     no Stripe SDK, secret, amount, currency or Price ID.
   - mockPaymentAdapter: a DEVELOPMENT DEMO that simulates the handoff
     in memory. No network, no card inputs, no credentials.

   SAFETY: the mock adapter is gated on import.meta.env.DEV (statically
   false in a production bundle) plus an explicit opt-in flag, so the
   whole branch is compiled out of production builds. The bundle scan in
   tests/payments-ui.test.js asserts that neither the mock code nor the
   "DEVELOPMENT DEMO" string reaches a production build.

   The REAL adapter is the default in every build. The development mock is
   selected only when VITE_ENABLE_MOCK_PAYMENT=true (or when a development
   build explicitly disables Stripe Checkout with
   VITE_ENABLE_STRIPE_CHECKOUT=false). Price is fetched from the backend and
   missing Stripe config is actionable.
   ================================================================ */

import { MOCK_ENABLED } from "./offerConfig";
import { readCheckoutUrl, redirectToStripeCheckout } from "./checkoutRedirect";

/* Same-origin by default (Vite dev proxy and the production reverse proxy
   both serve /api); override only for a standalone build. Identical
   convention to consultationService.js and PayForConsultation.jsx. */
const API_BASE_URL = (
  import.meta.env?.VITE_API_BASE_URL || ""
).replace(/\/+$/, "");

/* Result codes shared by every adapter. */
export const PAYMENT_OUTCOME = {
  SUCCESS: "success",
  CANCELLED: "cancelled",
  FAILED: "failed",
};

/**
 * @typedef {object} PaymentRequest
 * @property {string} name     Visitor name (prefill only, Phase 2)
 * @property {string} email    Visitor email (prefill only, Phase 2)
 * @property {object} summary  Non-sensitive offer summary for display
 *
 * @typedef {object} PaymentResult
 * @property {string} outcome  one of PAYMENT_OUTCOME
 * @property {string} reference demo reference, clearly prefixed DEMO-
 * @property {boolean} simulated  ALWAYS true in Phase 1
 */

/**
 * The REAL adapter. Talks only to this app's backend, which owns the Stripe
 * Price. No Stripe secret, no amount, no currency and no Price ID ever
 * reaches the browser.
 *
 * create({ name, email, consultationId }) -> redirects the browser to
 * Stripe-hosted Checkout and NEVER RESOLVES on success: the page is
 * navigated away. Any returned value is only reached when the redirect did
 * not happen (an error), so the outcome is decided by the backend webhook,
 * never by the redirect itself.
 *
 * Production always exposes the Stripe adapter. Development uses it only
 * when explicitly selected; otherwise the mock adapter remains available.
 */
export const stripePaymentAdapter = {
  name: "stripe",
  isAvailable: () => !MOCK_ENABLED,
  async create(request = {}) {
    const response = await fetch(
      `${API_BASE_URL}/api/payments/create-checkout-session`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          /* Prefill only. Never an amount, price or currency. */
          name: request.name || undefined,
          email: request.email || undefined,
          /* Server-generated enquiry id, so the session is linked to the
             consultation and a repeat click reuses the open session. */
          consultationId: request.consultationId || undefined,
        }),
      }
    );

    const checkoutUrl = await readCheckoutUrl(response);
    redirectToStripeCheckout(checkoutUrl);

    /* Unreachable in practice: the browser is leaving this page. */
    return { outcome: PAYMENT_OUTCOME.FAILED, reference: null, simulated: false };
  },
};

/**
 * DEVELOPMENT DEMO adapter. Simulates the hosted-checkout handoff
 * entirely in memory. No network, no card inputs, no credentials.
 */
export const mockPaymentAdapter = {
  name: "mock",
  isAvailable: () => MOCK_ENABLED,
  async create() {
    /* Small delay so the pending state is visible, as in the real flow. */
    await new Promise((resolve) => setTimeout(resolve, 450));

    return {
      outcome: PAYMENT_OUTCOME.SUCCESS,
      reference: `DEMO-${Date.now().toString(36).toUpperCase()}`,
      simulated: true,
    };
  },
};

/** Resolve the adapter for this build. Mock only in a dev build. */
export const getPaymentAdapter = () =>
  MOCK_ENABLED ? mockPaymentAdapter : stripePaymentAdapter;
