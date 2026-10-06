import mongoose from "mongoose";
import {
  CONTACT_STATUSES,
  PRIORITIES,
} from "../config/workflow.js";
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

    /* ── Operations (admin platform). All optional with safe defaults
       so pre-existing documents remain valid without migration. ── */
    status: {
      type: String,
      enum: CONTACT_STATUSES,
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
  },
  {
    timestamps: true,
    /* Canonical collection. Do NOT rename without a data migration:
       production records and the TTL index live here. */
    collection: "contacts",
  }
);

/* Operational query patterns (lists, kanban, dashboard, search). */
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ assigneeId: 1, status: 1 });
contactSchema.index({ priority: 1, status: 1 });
contactSchema.index({ followUpAt: 1 });
contactSchema.index(
  { name: "text", email: "text", company: "text", phone: "text" },
  { name: "contact_text" }
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