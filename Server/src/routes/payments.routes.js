// src/routes/payments.routes.js
import express from "express";
import {
  createCheckoutSession,
  getCheckoutOffer,
  getCheckoutSessionStatus,
  stripeWebhook,
} from "../controllers/payments.controller.js";

const router = express.Router();

router.get("/offer", getCheckoutOffer);

/* Public: starts a Stripe-hosted Checkout session.
   Only the visitor's own name/email are read (Checkout prefill); the
   server-configured Price decides amount and currency.

   This router is mounted BEFORE the global express.json() (the webhook
   needs the raw body), so this route gets its own JSON parser scoped to
   it — otherwise req.body would be undefined here. */
router.post(
  "/create-checkout-session",
  express.json({ limit: "16kb" }),
  createCheckoutSession
);

router.get("/session/:sessionId", getCheckoutSessionStatus);

/* Stripe webhook: RAW body required for signature verification.
   express.raw is scoped to this route ONLY, so every other endpoint keeps
   the normal JSON parsing. */
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

export default router;
