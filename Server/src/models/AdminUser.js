// src/models/AdminUser.js — internal operations users. Never public.
import mongoose from "mongoose";
import { ROLES } from "../config/workflow.js";

const adminUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"],
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    // bcrypt hash. NEVER selected by default, NEVER returned by APIs.
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ROLES,
      default: "VIEWER",
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    /* Bumped on password change / role change / suspension. JWTs carry
       the version they were issued at; mismatches are rejected, which
       gives us instant session invalidation without a sessions table. */
    tokenVersion: {
      type: Number,
      default: 0,
    },
    failedAttempts: {
      type: Number,
      default: 0,
    },
    lockedUntil: {
      type: Date,
      default: null,
    },
    /* Password recovery: only a SHA-256 hash of the single-use token is
       stored; the raw token exists solely in the reset email. Never
       selected by default, never returned by APIs. */
    resetTokenHash: {
      type: String,
      default: "",
      select: false,
    },
    resetTokenExpiresAt: {
      type: Date,
      default: null,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    // Profile avatar. MongoDB stores METADATA ONLY — the optimized
    // image lives in the persistent uploads volume (see
    // services/storage). Never store binaries/base64 in this document.
    avatar: {
      storageKey: { type: String, default: "", trim: true, maxlength: 80 },
      mimeType: { type: String, default: "", trim: true, maxlength: 40 },
      size: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
      updatedAt: { type: Date, default: null },
    },
  },
  { timestamps: true, collection: "adminusers" }
);

adminUserSchema.index({ status: 1 });

/* JSON hygiene: strip the hash even if a query explicitly selected it
   and a controller forgot to delete it. Defense in depth. */
adminUserSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});

export default mongoose.model("AdminUser", adminUserSchema);
