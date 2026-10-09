l// src/controllers/adminAuth.controller.js — login / logout / me.
import bcrypt from "bcryptjs";
import validator from "validator";
import AdminUser from "../models/AdminUser.js";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  signAdminToken,
} from "../middleware/adminAuth.js";
import { fail, ok } from "./adminShared.js";
import { recordActivity } from "../services/activity.service.js";

const MAX_FAILED = 8;
const LOCK_MS = 15 * 60 * 1000;

function publicUser(user) {
  const hasAvatar = !!(user.avatar && user.avatar.storageKey);
  return {
    id: String(user._id),
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
    lastLoginAt: user.lastLoginAt,
    avatar: {
      hasAvatar,
      updatedAt: (user.avatar && user.avatar.updatedAt) || null,
    },
    createdAt: user.createdAt || null,
  };
}

export const adminLogin = async (req, res) => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const password =
      typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !validator.isEmail(email) || !password) {
      return fail(res, 400, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    const user = await AdminUser.findOne({ email }).select(
      "+passwordHash _id name email role status tokenVersion failedAttempts lockedUntil avatar createdAt"
    );

    // Uniform response: unknown emails behave like wrong passwords.
    if (!user) {
      return fail(res, 401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
      await recordActivity({
        req,
        actor: { name: user.email },
        action: "ADMIN_LOGIN_LOCKED",
        entityType: "auth",
        entityId: user._id,
      });
      return fail(res, 423, "ACCOUNT_LOCKED", "Account temporarily locked. Try again later");
    }

    if (user.status !== "active") {
      return fail(res, 403, "ACCOUNT_SUSPENDED", "Account is suspended");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      user.failedAttempts = (user.failedAttempts || 0) + 1;
      if (user.failedAttempts >= MAX_FAILED) {
        user.lockedUntil = new Date(Date.now() + LOCK_MS);
        user.failedAttempts = 0;
      }
      await user.save();
      await recordActivity({
        req,
        actor: { name: user.email },
        action: "ADMIN_LOGIN_FAILED",
        entityType: "auth",
        entityId: user._id,
      });
      return fail(res, 401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    user.failedAttempts = 0;
    user.lockedUntil = null;
    user.lastLoginAt = new Date();
    await user.save();

    const token = signAdminToken(user);
    res.cookie(ADMIN_COOKIE, token, adminCookieOptions());

    await recordActivity({
      req,
      actor: { id: String(user._id), name: user.name },
      action: "ADMIN_LOGIN",
      entityType: "auth",
      entityId: user._id,
    });

    return ok(res, { user: publicUser(user) });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

export const adminLogout = async (req, res) => {
  try {
    if (req.admin) {
      await recordActivity({
        req,
        actor: req.admin,
        action: "ADMIN_LOGOUT",
        entityType: "auth",
        entityId: req.admin.id,
      });
    }
  } catch {
    // Logout must always succeed client-side.
  }
  res.clearCookie(ADMIN_COOKIE, { ...adminCookieOptions(), maxAge: undefined });
  return ok(res, { loggedOut: true });
};

export const adminMe = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.admin.id).select(
      "_id name email role status lastLoginAt createdAt avatar"
    );
    if (!user || user.status !== "active") {
      return fail(res, 401, "UNAUTHENTICATED", "Account is not active");
    }
    return ok(res, { user: publicUser(user) });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};
