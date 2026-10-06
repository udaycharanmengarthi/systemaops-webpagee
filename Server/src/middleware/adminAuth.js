/* Server/src/middleware/adminAuth.js
 *
 * Admin authentication (HTTP-only cookie JWT) + role-based authorization.
 * Server-side enforcement is the ONLY trust boundary — frontend role
 * checks are presentation hints, never security.
 */

import jwt from "jsonwebtoken";
import AdminUser from "../models/AdminUser.js";
import { hasMinRole } from "../config/workflow.js";

export const ADMIN_COOKIE = "sysops_admin";
export const TOKEN_TTL_SECONDS = 12 * 60 * 60; // 12h sessions

function jwtSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_JWT_SECRET is not set");
  }
  // Dev-only ephemeral fallback (sessions die on restart — loud on purpose).
  if (!secret) {
    if (!globalThis.__sysopsDevJwtWarned) {
      globalThis.__sysopsDevJwtWarned = true;
      console.error(
        "WARNING: ADMIN_JWT_SECRET unset — using ephemeral dev secret. " +
          "Set ADMIN_JWT_SECRET for any real deployment."
      );
    }
    if (!globalThis.__sysopsDevJwt) {
      globalThis.__sysopsDevJwt =
        `dev-${Date.now()}-${Math.random().toString(36).slice(2)}` +
        `${Math.random().toString(36).slice(2)}`;
    }
    return globalThis.__sysopsDevJwt;
  }
  return secret;
}

export function signAdminToken(user) {
  return jwt.sign(
    { sub: String(user._id), tv: user.tokenVersion || 0 },
    jwtSecret(),
    { expiresIn: TOKEN_TTL_SECONDS }
  );
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    // Secure only behind HTTPS (compose proxy terminates plain HTTP in
    // local dev; set COOKIE_SECURE=1 in production with TLS).
    secure:
      process.env.COOKIE_SECURE === "1" ||
      process.env.COOKIE_SECURE === "true",
    path: "/",
    maxAge: TOKEN_TTL_SECONDS * 1000,
  };
}

export function adminError(res, status, code, message) {
  return res.status(status).json({ success: false, error: { code, message } });
}

/* Requires a valid session. Attaches req.admin = { id, role, name }. */
export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies && req.cookies[ADMIN_COOKIE];
    if (!token) {
      return adminError(res, 401, "UNAUTHENTICATED", "Authentication required");
    }
    let payload;
    try {
      payload = jwt.verify(token, jwtSecret());
    } catch {
      return adminError(res, 401, "UNAUTHENTICATED", "Session expired or invalid");
    }
    const user = await AdminUser.findById(payload.sub).select(
      "_id name email role status tokenVersion"
    );
    if (!user || user.status !== "active") {
      return adminError(res, 401, "UNAUTHENTICATED", "Account is not active");
    }
    if ((user.tokenVersion || 0) !== (payload.tv || 0)) {
      return adminError(res, 401, "UNAUTHENTICATED", "Session revoked");
    }
    req.admin = {
      id: String(user._id),
      role: user.role,
      name: user.name,
      email: user.email,
    };
    return next();
  } catch {
    return adminError(res, 500, "SERVER_ERROR", "Server error");
  }
}

/* Minimum-role gate. Use AFTER requireAuth. VIEWER (rank 1) may only
   reach GET routes because every mutation route additionally requires
   requireMinRole("MANAGER") or higher. */
export function requireMinRole(minimum) {
  return (req, res, next) => {
    if (!req.admin || !hasMinRole(req.admin.role, minimum)) {
      return adminError(res, 403, "FORBIDDEN", "Insufficient permissions");
    }
    return next();
  };
}

/* Cheap CSRF reinforcement for cookie-authenticated mutations:
   same-origin clients send Origin/Referer; cross-site forged requests
   don't (or send a foreign one). Safe to skip when absent (curl/tests)
   but enforced when present. */
export function enforceSameOrigin(req, res, next) {
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const host = req.headers.host;
  if ((origin || referer) && host) {
    const check = (v) => {
      try {
        return new URL(v, `http://${host}`).host === host;
      } catch {
        return false;
      }
    };
    const value = origin || referer;
    if (!check(value)) {
      return adminError(res, 403, "FORBIDDEN", "Cross-origin request rejected");
    }
  }
  return next();
}
