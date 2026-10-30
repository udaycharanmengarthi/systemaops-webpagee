import { getStripeClient } from "../config/payments.js";

/* Minimal provider boundary. The application depends on these operations,
   while Stripe SDK types and request methods stay in this adapter. A future
   provider must implement the same contract and its own signature checks. */
export const stripePaymentProvider = {
  createCheckoutSession(params, options = {}) {
    return getStripeClient().checkout.sessions.create(params, options);
  },
  retrieveCheckoutSession(sessionId, options = {}) {
    return getStripeClient().checkout.sessions.retrieve(sessionId, options);
  },
  expireCheckoutSession(sessionId) {
    return getStripeClient().checkout.sessions.expire(sessionId);
  },
  retrievePrice(priceId) {
    return getStripeClient().prices.retrieve(priceId);
  },
  verifyWebhook(rawBody, signature, secret) {
    return getStripeClient().webhooks.constructEvent(rawBody, signature, secret);
  },
};

export const getPaymentProvider = () => {
  const name = (process.env.PAYMENT_PROVIDER || "stripe").trim().toLowerCase();
  if (name !== "stripe") {
    const error = new Error("Unsupported payment provider");
    error.status = 503;
    throw error;
  }
  return stripePaymentProvider;
};
