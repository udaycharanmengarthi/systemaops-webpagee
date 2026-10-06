// src/models/CareerApplication.js
import mongoose from "mongoose";
import {
  CAREER_STATUSES,
  PRIORITIES,
} from "../config/workflow.js";
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
      enum: CAREER_STATUSES,
      default: "NEW",
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: "MEDIUM",
    },
    assigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null,
    },
    // Denormalized to avoid N+1 lookups in lists/kanban.
    assigneeName: { type: String, default: "", trim: true, maxlength: 120 },
    assignedAt: { type: Date, default: null },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (v) => Array.isArray(v) && v.length <= 20,
        message: "Too many tags",
      },
    },
    notes: {
      type: [
        {
          authorId: { type: mongoose.Schema.Types.ObjectId, ref: "AdminUser" },
          authorName: { type: String, trim: true, maxlength: 120 },
          body: { type: String, required: true, trim: true, maxlength: 2000 },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    followUpAt: { type: Date, default: null },
    followUpNote: { type: String, default: "", trim: true, maxlength: 500 },
    followUpDone: { type: Boolean, default: false },
    lastActivityAt: { type: Date, default: null },
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

/* Operational query patterns (lists, kanban, dashboard, search). */
careerApplicationSchema.index({ status: 1, createdAt: -1 });
careerApplicationSchema.index({ assigneeId: 1, status: 1 });
careerApplicationSchema.index({ priority: 1, status: 1 });
careerApplicationSchema.index({ followUpAt: 1 });
careerApplicationSchema.index({ role: 1, status: 1 });
careerApplicationSchema.index(
  { firstName: "text", lastName: "text", email: "text", role: "text" },
  { name: "career_text" }
);

const CareerApplication = mongoose.model(
  "CareerApplication",
  careerApplicationSchema
);

export default CareerApplication;