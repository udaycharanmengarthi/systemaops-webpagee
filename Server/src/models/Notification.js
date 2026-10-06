// src/models/Notification.js — per-admin inbox items. Created by the
// backend on business events; read-state is the only mutation.
import mongoose from "mongoose";
import { oneYearFromNow } from "../utils/retention.js";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      maxlength: 64,
    },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    body: { type: String, default: "", trim: true, maxlength: 500 },
    entityType: { type: String, default: "", trim: true, maxlength: 32 },
    entityId: { type: mongoose.Schema.Types.ObjectId, default: null },
    read: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
    expiresAt: {
      type: Date,
      default: oneYearFromNow,
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false }, collection: "notifications" }
);

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
