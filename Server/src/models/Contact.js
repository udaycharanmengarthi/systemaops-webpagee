import mongoose from "mongoose";
import {
  expiresAtFor,
  isValidDate,
  oneYearFromNow,
} from "../utils/retention.js";

const contactSchema = new mongoose.Schema(
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

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },

    company: {
      type: String,
      default: "",
      trim: true,
      maxlength: 160,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
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

    expiresAt: {
      type: Date,
      default: oneYearFromNow,
      index: { expireAfterSeconds: 0 },
    },
  },
  {
    timestamps: true,
    /* Canonical collection. Do NOT rename without a data migration:
       production records and the TTL index live here. */
    collection: "contacts",
  }
);

/* Safety net: never persist a missing/invalid expiresAt. Prefers the
   record's own createdAt (exact policy); falls back to now. Valid
   explicit values (controllers, backfill) are never overwritten. */
contactSchema.pre("validate", function () {
  if (!isValidDate(this.expiresAt)) {
    try {
      this.expiresAt = expiresAtFor(this.createdAt);
    } catch {
      this.expiresAt = oneYearFromNow();
    }
  }
});

export default mongoose.model("Contact", contactSchema);