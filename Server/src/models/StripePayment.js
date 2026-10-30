// src/models/StripePayment.js
//
// One row per Stripe Checkout Session. The UNIQUE stripe_session_id is the
// idempotency backbone: duplicate and concurrent webhook deliveries
// collapse onto the same row instead of creating new payment records.
//
// Payment state and email state are tracked SEPARATELY on purpose:
//   payment_status  — only ever written from a SIGNATURE-VERIFIED webhook
//   email_status    — delivery bookkeeping (claim → send → sent/failed)
//
// Email delivery is at-least-once. The `sending` lease lets any instance
// reclaim a delivery that was interrupted mid-flight.

import mongoose from "mongoose";

export const PAYMENT_STATUSES = ["paid", "failed"];
export const EMAIL_STATUSES = ["pending", "sending", "sent", "failed"];

/* Short lease: long enough for a normal provider round-trip, short enough
   that a crashed worker's claim is reclaimed quickly. */
export const EMAIL_LEASE_MS = 60 * 1000;

const stripePaymentSchema = new mongoose.Schema(
  {
    /* UNIQUE — the duplicate-delivery collapse point. */
    stripe_session_id: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },

    payment_intent_id: {
      type: String,
      default: null,
      trim: true,
      maxlength: 255,
    },

    /* The app-owned order this payment belongs to. Only set after the
       webhook verified that the session is linked to this consultation. */
    consultation_id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    /* Verified commercial snapshot used for the audit trail. */
    price_id: {
      type: String,
      default: null,
      trim: true,
      maxlength: 255,
    },

    quantity: {
      type: Number,
      default: null,
    },

    /* Only 'paid' | 'failed' are stored. Verified events only. */
    payment_status: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: null,
    },

    /* Minor units (cents), exactly as Stripe reports it. */
    amount_total: {
      type: Number,
      default: null,
    },

    currency: {
      type: String,
      default: null,
      lowercase: true,
      trim: true,
      maxlength: 8,
    },

    /* From the VERIFIED session only — never from a client request. */
    customer_email: {
      type: String,
      default: null,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    /* Optional: only present when Stripe captured a name (the customer
       may leave it blank on hosted Checkout). Used for the confirmation
       email's greeting. */
    customer_name: {
      type: String,
      default: null,
      trim: true,
      maxlength: 120,
    },

    email_status: {
      type: String,
      enum: EMAIL_STATUSES,
      default: "pending",
    },

    email_attempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* Set while email_status === 'sending'. Lets another delivery (or
       another instance) reclaim an abandoned claim. */
    email_lease_expires_at: {
      type: Date,
      default: null,
    },

    email_sent_at: {
      type: Date,
      default: null,
    },

    /* Sanitized short string: provider name/status/message fragment.
       Never PII, never payloads, never secrets. */
    last_error: {
      type: String,
      default: null,
      trim: true,
      maxlength: 200,
    },

    /* Stripe event id that last touched the row (traceability only). */
    last_event_id: {
      type: String,
      default: null,
      trim: true,
      maxlength: 255,
    },
  },
  {
    timestamps: true,
    /* Canonical collection. Do NOT rename without a data migration. */
    collection: "stripe_payments",
  }
);

/* Duplicate/concurrent deliveries collapse on this index. */
stripePaymentSchema.index({ stripe_session_id: 1 }, { unique: true });
stripePaymentSchema.index({ consultation_id: 1, createdAt: -1 });

/* Manual follow-up: find deliveries that need attention (see
   Server/docs/stripe-payments.md — exhausted Stripe retries). */
stripePaymentSchema.index({ email_status: 1, updatedAt: -1 });
stripePaymentSchema.index({ payment_status: 1, createdAt: -1 });

export default mongoose.model("StripePayment", stripePaymentSchema);
