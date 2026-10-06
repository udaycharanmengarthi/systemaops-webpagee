// src/controllers/adminUsers.controller.js — admin user management.
// Listing requires MANAGER+; every mutation requires SUPER_ADMIN (routes).
// Password changes bump tokenVersion, revoking all existing sessions.
import bcrypt from "bcryptjs";
import validator from "validator";
import AdminUser from "../models/AdminUser.js";
import { isValidRole } from "../config/workflow.js";
import {
  fail,
  isValidObjectId,
  metaFor,
  ok,
  parsePagination,
} from "./adminShared.js";
import { recordActivity } from "../services/activity.service.js";

const SAFE_PROJECTION = "_id name email role status lastLoginAt createdAt updatedAt avatar";

function validatePassword(password) {
  return typeof password === "string" && password.length >= 12 && password.length <= 128;
}

/* Safe avatar shape for list responses: presence + freshness only.
   Storage keys/implementation details are never exposed. */
function publicAvatar(user) {
  const hasAvatar = !!(user.avatar && user.avatar.storageKey);
  return {
    hasAvatar,
    updatedAt: (user.avatar && user.avatar.updatedAt) || null,
  };
}

export const listUsers = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const [total, items] = await Promise.all([
      AdminUser.countDocuments(),
      AdminUser.find({}, SAFE_PROJECTION)
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);
    const safe = items.map((u) => ({ ...u, avatar: publicAvatar(u) }));
    return ok(res, { items: safe }, metaFor(total, page, limit));
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

/* Minimal assignee directory for operational dropdowns (assign/assignee
   filters). MANAGER+ only, lean projection — deliberately NOT the full
   user-administration list (that remains SUPER_ADMIN-only). */
export const listAssignableUsers = async (req, res) => {
  try {
    const items = await AdminUser.find(
      { status: "active" },
      "_id name role avatar"
    )
      .sort({ name: 1 })
      .limit(100)
      .lean();
    const safe = items.map((u) => ({ ...u, avatar: publicAvatar(u) }));
    return ok(res, { items: safe });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

export const createUser = async (req, res) => {
  try {
    const email =
      typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const { role, password } = req.body;
    if (!email || !validator.isEmail(email)) {
      return fail(res, 400, "INVALID_EMAIL", "Valid email is required");
    }
    if (!name || name.length > 120) {
      return fail(res, 400, "INVALID_NAME", "Name is required (max 120)");
    }
    if (!isValidRole(role)) {
      return fail(res, 400, "INVALID_ROLE", "Unknown role");
    }
    if (!validatePassword(password)) {
      return fail(res, 400, "INVALID_PASSWORD", "Password must be 12-128 characters");
    }
    const existing = await AdminUser.findOne({ email }).select("_id");
    if (existing) {
      return fail(res, 409, "EMAIL_TAKEN", "An admin with this email already exists");
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await AdminUser.create({ email, name: name.slice(0, 120), role, passwordHash });
    await recordActivity({
      req,
      actor: req.admin,
      action: "ADMIN_CREATED",
      entityType: "adminuser",
      entityId: user._id,
      entityLabel: `${user.name} <${user.email}>`,
      toValue: role,
    });
    const created = await AdminUser.findById(user._id).select(SAFE_PROJECTION).lean();
    return res.status(201).json({ success: true, data: { user: created } });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

export const updateUser = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return fail(res, 400, "INVALID_ID", "Invalid user id");
    }
    const user = await AdminUser.findById(req.params.id);
    if (!user) return fail(res, 404, "USER_NOT_FOUND", "User not found");
    // Never allow deactivating/demoting your own account.
    if (String(user._id) === req.admin.id) {
      return fail(res, 400, "SELF_CHANGE", "Use profile settings for your own account");
    }
    const changes = [];
    if (req.body.role !== undefined) {
      if (!isValidRole(req.body.role)) {
        return fail(res, 400, "INVALID_ROLE", "Unknown role");
      }
      if (req.body.role !== user.role) {
        changes.push(`role ${user.role} -> ${req.body.role}`);
        user.role = req.body.role;
        user.tokenVersion = (user.tokenVersion || 0) + 1;
      }
    }
    if (req.body.status !== undefined) {
      if (!["active", "suspended"].includes(req.body.status)) {
        return fail(res, 400, "INVALID_STATUS", "Unknown status");
      }
      if (req.body.status !== user.status) {
        changes.push(`status ${user.status} -> ${req.body.status}`);
        user.status = req.body.status;
        user.tokenVersion = (user.tokenVersion || 0) + 1;
      }
    }
    if (req.body.name !== undefined) {
      const name = String(req.body.name || "").trim().slice(0, 120);
      if (!name) return fail(res, 400, "INVALID_NAME", "Name is required");
      user.name = name;
    }
    await user.save();
    await recordActivity({
      req,
      actor: req.admin,
      action: "ADMIN_ROLE_CHANGED",
      entityType: "adminuser",
      entityId: user._id,
      entityLabel: `${user.name} <${user.email}>`,
      toValue: changes.join("; ") || "profile updated",
    });
    const updated = await AdminUser.findById(user._id).select(SAFE_PROJECTION).lean();
    return ok(res, { user: updated });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

export const resetUserPassword = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return fail(res, 400, "INVALID_ID", "Invalid user id");
    }
    if (!validatePassword(req.body.password)) {
      return fail(res, 400, "INVALID_PASSWORD", "Password must be 12-128 characters");
    }
    const user = await AdminUser.findById(req.params.id);
    if (!user) return fail(res, 404, "USER_NOT_FOUND", "User not found");
    user.passwordHash = await bcrypt.hash(req.body.password, 12);
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    user.failedAttempts = 0;
    user.lockedUntil = null;
    await user.save();
    await recordActivity({
      req,
      actor: req.admin,
      action: "ADMIN_PASSWORD_CHANGED",
      entityType: "adminuser",
      entityId: user._id,
      entityLabel: `${user.name} <${user.email}>`,
    });
    return ok(res, { reset: true });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

export const changeMyPassword = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.admin.id).select("+passwordHash");
    if (!user || user.status !== "active") {
      return fail(res, 401, "UNAUTHENTICATED", "Account is not active");
    }
    const valid = await bcrypt.compare(String(req.body.currentPassword || ""), user.passwordHash);
    if (!valid) {
      return fail(res, 400, "INVALID_PASSWORD", "Current password is incorrect");
    }
    if (!validatePassword(req.body.newPassword)) {
      return fail(res, 400, "INVALID_PASSWORD", "New password must be 12-128 characters");
    }
    user.passwordHash = await bcrypt.hash(req.body.newPassword, 12);
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();
    await recordActivity({
      req,
      actor: req.admin,
      action: "ADMIN_PASSWORD_CHANGED",
      entityType: "adminuser",
      entityId: user._id,
      entityLabel: "own password",
    });
    return ok(res, { changed: true });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};
