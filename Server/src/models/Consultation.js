// src/models/Consultation.js
//
// Book-a-call enquiry (/book-a-call): the prospect's requirements plus
// the service area they want to discuss.
//
// NOT a second contact-management system. It reuses the same
// conventions as Contact.js: the same 1-year retention policy
// (utils/retention.js + TTL index), the same privacy-acknowledgement
// fields, and the same downstream plumbing (activity log, admin
// notification, founder email).
//
// It exists as its own collection because Contact REQUIRES a phone
// number (public contact form), and this form deliberately has no
// phone field. Inventing a placeholder phone to force a fit would
// pollute the existing lead data.

import mongoose from "mongoose";
import { AREAS_OF_INTEREST } from "../config/workflow.js";
import {
  expiresAtFor,
  isValidDate,
  oneYearFromNow,
} from "../utils/retention.js";

const consultationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"],
    },

    /* Optional by design (prompt: company name optional). */
    company: {
      type: String,
      default: "",
      trim: true,
      maxlength: 160,
    },

    areaOfInterest: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },

    privacyAccepted: {
      type: Boolean,
      required: true,
      default: false,
    },

    privacyVersion: {
      type: String,
      default: "2026-01-01",
      trim: true,
      maxlength: 32,
    },

    privacyAcceptedAt: {
      type: Date,
    },

    /* Same 1-year retention policy as every other lead collection. */
    expiresAt: {
      type: Date,
      default: oneYearFromNow,
      index: { expireAfterSeconds: 0 },
    },

    /* ---- Payment state (consultation payments) --------------------------
     * The enquiry exists independently of payment: a consultation is
     * recorded on submission, long before any money moves.
     *
     *   null      - enquiry received, no payment started
     *   'pending' - a Checkout Session exists and has not completed
     *   'paid'    - a SIGNATURE-VERIFIED webhook confirmed payment
     *   'failed'  - Checkout was completed without payment, or the async
     *               payment failed
     *
     * Only the webhook may write 'paid'. Nothing here trusts the browser. */
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: null,
    },

    /* Server-generated Stripe session id for this enquiry. Used to reuse an
     * open session instead of creating a duplicate one, and to link the
     * verified webhook back to the enquiry. */
    stripeSessionId: {
      type: String,
      default: null,
      trim: true,
      maxlength: 255,
    },

    /* Commercial snapshot taken from the server-validated Price when the
     * session was created. The webhook compares Stripe's signed session /
     * line items against THIS snapshot, so a later config change cannot
     * silently re-price an in-flight checkout. */
    paymentPriceId: {
      type: String,
      default: null,
      trim: true,
      maxlength: 255,
    },

    paymentAmountMinor: {
      type: Number,
      default: null,
    },

    paymentCurrency: {
      type: String,
      default: null,
      lowercase: true,
      trim: true,
      maxlength: 8,
    },

    paymentQuantity: {
      type: Number,
      default: null,
    },

    paymentStartedAt: {
      type: Date,
      default: null,
    },

    /* Stable per-attempt nonce used for the Stripe idempotency key. It is
     * rotated only when a known-expired session must be replaced, so an
     * ambiguous network failure can be retried without creating a second
     * session. */
    checkoutNonce: {
      type: String,
      default: null,
      trim: true,
      maxlength: 64,
    },

    /* Short-lived server-side lock: only one request may create a Checkout
     * Session for an enquiry at a time. The token prevents a late request
     * from clearing a lock owned by another request. */
    checkoutLockUntil: {
      type: Date,
      default: null,
    },

    checkoutLockToken: {
      type: String,
      default: null,
      trim: true,
      maxlength: 64,
    },

    /* When the payment was confirmed (verified webhook only). */
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "consultations",
  }
);

/* Operational query pattern: newest enquiries first. */
consultationSchema.index({ createdAt: -1 });
consultationSchema.index({ areaOfInterest: 1, createdAt: -1 });

/* Reuse/duplicate-guard lookup for the checkout endpoint. */
consultationSchema.index({ stripeSessionId: 1 });

/* Safety net: never persist a missing/invalid expiresAt. */
consultationSchema.pre("validate", function () {
  if (!isValidDate(this.expiresAt)) {
    try {
      this.expiresAt = expiresAtFor(this.createdAt);
    } catch {
      this.expiresAt = oneYearFromNow();
    }
  }
});

export { AREAS_OF_INTEREST };

export default mongoose.model("Consultation", consultationSchema);
