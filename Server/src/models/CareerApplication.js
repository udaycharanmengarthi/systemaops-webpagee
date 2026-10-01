// src/models/CareerApplication.js
import mongoose from "mongoose";
import {
  expiresAtFor,
  isValidDate,
  oneYearFromNow,
} from "../utils/retention.js";

const careerApplicationSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: 80,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: 32,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
      maxlength: 120,
    },
    linkedin: {
      type: String,
      required: [true, "LinkedIn profile is required"],
      trim: true,
      maxlength: 500,
    },
    portfolio: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    whyUs: {
      type: String,
      default: "",
      trim: true,
      maxlength: 2000,
    },
    resumeUrl: {
      type: String,
      required: [true, "Resume link is required"],
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Shortlisted", "Rejected"],
      default: "Pending",
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
    collection: "careerapplications",
  }
);

/* Safety net: never persist a missing/invalid expiresAt. Prefers the
   record's own createdAt (exact policy); falls back to now. Valid
   explicit values (controllers, backfill) are never overwritten. */
careerApplicationSchema.pre("validate", function () {
  if (!isValidDate(this.expiresAt)) {
    try {
      this.expiresAt = expiresAtFor(this.createdAt);
    } catch {
      this.expiresAt = oneYearFromNow();
    }
  }
});

const CareerApplication = mongoose.model(
  "CareerApplication",
  careerApplicationSchema
);

export default CareerApplication;