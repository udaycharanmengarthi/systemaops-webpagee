// src/models/Activity.js — append-only audit trail. No update/delete
// routes exist; writes happen only inside controllers via recordActivity().
import mongoose from "mongoose";
import { oneYearFromNow } from "../utils/retention.js";

const activitySchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      default: null,
    },
    // Denormalized so history stays readable after renames/deletions.
    actorName: { type: String, default: "System", trim: true, maxlength: 120 },
    action: { type: String, required: true, trim: true, maxlength: 64 },
    entityType: {
      type: String,
      required: true,
      enum: ["contact", "career", "adminuser", "auth", "system"],
    },
    entityId: { type: mongoose.Schema.Types.ObjectId, default: null },
    // Human-readable label snapshot (e.g. contact name) for feeds.
    entityLabel: { type: String, default: "", trim: true, maxlength: 160 },
    fromValue: { type: String, default: "", trim: true, maxlength: 120 },
    toValue: { type: String, default: "", trim: true, maxlength: 120 },
    metadata: { type: mongoose.Schema.Types.Mixed, default: undefined },
    ipAddress: { type: String, default: "", trim: true, maxlength: 64 },
    userAgent: { type: String, default: "", trim: true, maxlength: 300 },
    // Same 1-year retention as operational records (see retention.js).
    expiresAt: {
      type: Date,
      default: oneYearFromNow,
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false }, collection: "activities" }
);

activitySchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
activitySchema.index({ actorId: 1, createdAt: -1 });
activitySchema.index({ action: 1, createdAt: -1 });
activitySchema.index({ createdAt: -1 });

export default mongoose.model("Activity", activitySchema);
