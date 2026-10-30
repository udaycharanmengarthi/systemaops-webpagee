// src/models/StripeWebhookEvent.js
//
// Database-level idempotency ledger for verified Stripe webhook events.
//
// Stripe (and any at-least-once delivery system) can deliver the same event
// more than once, and can deliver it concurrently. The UNIQUE event_id is the
// collapse point: one database row owns the processing lease for that event.
//
// The payment/email state machines remain independently idempotent. This
// ledger adds an explicit, auditable record of "this exact event was already
// accepted / ignored / is in flight", which makes duplicate detection and
// operational debugging possible without logging payloads.

import mongoose from "mongoose";

export const WEBHOOK_EVENT_STATUSES = [
  "processing",
  "processed",
  "ignored",
  "failed",
];

/* Long enough for a normal provider retrieval + DB update + email attempt;
   short enough that a crashed worker's claim can be reclaimed. */
export const WEBHOOK_EVENT_LEASE_MS = 60 * 1000;

const stripeWebhookEventSchema = new mongoose.Schema(
  {
    /* UNIQUE — the duplicate-delivery collapse point. */
    event_id: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },

    event_type: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    stripe_session_id: {
      type: String,
      default: null,
      trim: true,
      maxlength: 255,
    },

    status: {
      type: String,
      enum: WEBHOOK_EVENT_STATUSES,
      default: "processing",
    },

    /* Identifies the worker that currently owns the processing lease. A
       stale worker cannot overwrite a newer claim's result. */
    claim_id: {
      type: String,
      default: null,
      trim: true,
      maxlength: 64,
    },

    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    lease_expires_at: {
      type: Date,
      default: null,
    },

    /* Sanitized short reason only. Never a payload, PII or secret. */
    last_error: {
      type: String,
      default: null,
      trim: true,
      maxlength: 200,
    },
  },
  {
    timestamps: true,
    collection: "stripe_webhook_events",
  }
);

stripeWebhookEventSchema.index({ event_id: 1 }, { unique: true });
stripeWebhookEventSchema.index({ status: 1, updatedAt: -1 });

export default mongoose.model("StripeWebhookEvent", stripeWebhookEventSchema);
