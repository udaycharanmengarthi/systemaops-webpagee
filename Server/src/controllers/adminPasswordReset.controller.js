// src/controllers/adminPasswordReset.controller.js
// Secure password recovery: single-use, short-lived, hashed tokens.
//
// ACCOUNT MODEL (verified against the codebase):
//   One shared model — AdminUser (mongoose, collection "adminusers").
//   There is no separate admin vs employee model; both are the same
//   document, distinguished by `role` (VIEWER | MANAGER | ADMIN |
//   SUPER_ADMIN, see config/workflow.js ROLES). Every role signs in
//   through the same /auth/login, so every role may reset a password.
//   `status` ("active" | "suspended") is the eligibility field.
//
// ELIGIBILITY: account exists AND status === "active".
//
// REQUESTED TRADE-OFF (documented, not accidental):
//   An unknown or ineligible email returns an explicit
//   EMAIL_NOT_FOUND response. That reveals whether an address belongs
//   to an active console account. Mitigations that stay in place:
//   dedicated rate limiting (5 requests / 15 min / IP on this route
//   only, see routes/admin.routes.js), server-side activity logging,
//   and monitoring of EMAIL_NOT_FOUND volume. Do not "helpfully"
//   revert this to a generic success response — it is a product
//   decision; if it must change, change it deliberately and re-read
//   this note.
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import validator from "validator";
import AdminUser from "../models/AdminUser.js";
import { fail, ok } from "./adminShared.js";
import { recordActivity } from "../services/activity.service.js";
import { sendAdminEmail } from "../services/mail.service.js";

const DEFAULT_TTL_MINUTES = 30;
const MAX_TTL_MINUTES = 60;

/* Response copy. Kept in one place so the frontend never hard-codes it
   and both surfaces stay in sync. */
export const RESET_MESSAGES = Object.freeze({
  invalidEmail: "Please enter a valid email address.",
  emailNotFound:
    "Email not found. Please enter your registered admin or employee email address.",
  emailSendFailed:
    "We couldn't send the reset email right now. Please try again in a moment.",
  serverError: "Server error",
  invalidReset: "Reset link is invalid or expired. Request a new one.",
  invalidPassword: "Password must be 12-128 characters",
  passwordUpdated: "Password updated successfully. You can now sign in.",
});

export function ttlMinutes() {
  const raw = parseInt(process.env.RESET_TOKEN_TTL_MINUTES, 10);
  if (Number.isFinite(raw) && raw > 0 && raw <= MAX_TTL_MINUTES) return raw;
  return DEFAULT_TTL_MINUTES;
}

export function ttlMs() {
  return ttlMinutes() * 60 * 1000;
}

/* Trusted application origin for reset links. NEVER derived from the
   request Host header. */
export function appOrigin() {
  const configured = process.env.ADMIN_APP_ORIGIN || "";
  if (configured) return configured.replace(/\/+$/, "");
  return process.env.NODE_ENV === "production"
    ? "https://systemaops.com"
    : "http://localhost";
}

export function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function isValidEmail(value) {
  const email = normalizeEmail(value);
  // validator.isEmail alone accepts absurd inputs like "a@b"; the schema
  // already applies a stricter shape, so mirror it here.
  return Boolean(email) && validator.isEmail(email) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* Eligible = an existing, active console account. Roles are NOT a
   differentiator: every role authenticates through the same login and
   may therefore recover its own password. Suspended accounts cannot. */
export function isEligibleForReset(user) {
  return Boolean(user && user.status === "active");
}

export function safeCompare(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/* Raw token -> stored hash. Only the hash ever reaches the database. */
export function hashResetToken(rawToken) {
  return sha256(String(rawToken));
}

function resetEmailBody(resetUrl, minutes) {
  const textFallback =
    `Reset your SystemaOps Admin password\n\n` +
    `We received a request to reset the password for your SystemaOps Admin account.\n\n` +
    `Reset here (expires in ${minutes} minutes, single use): ${resetUrl}\n\n` +
    `If you did not request this, you can safely ignore this email.\n\n` +
    `SystemaOps — Technology that moves operations forward.`;
  return {
    html: `<!DOCTYPE html><html><body style="margin:0;padding:32px;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:520px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
  <div style="background:#0a141c;padding:22px 28px;">
    <span style="color:#ffffff;font-weight:700;letter-spacing:1px;">SYSTEMAOPS ADMIN</span>
  </div>
  <div style="padding:28px;">
    <h2 style="margin:0 0 8px;color:#0f172a;">Reset your password</h2>
    <p style="margin:0 0 20px;color:#475569;line-height:1.6;">We received a request to reset the password for your SystemaOps Admin account. This link expires in ${minutes} minutes and can only be used once.</p>
    <a href="${resetUrl}" style="display:inline-block;background:#159a9c;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:8px;">Reset password</a>
    <p style="margin:22px 0 0;color:#94a3b8;font-size:12px;">If you did not request this, you can safely ignore this email. Your password has not been changed.</p>
  </div>
</div>
</body></html>`,
    text: textFallback,
  };
}

function securityNoticeBody() {
  return `<!DOCTYPE html><html><body style="margin:0;padding:32px;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:520px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
  <div style="background:#0a141c;padding:22px 28px;">
    <span style="color:#ffffff;font-weight:700;letter-spacing:1px;">SYSTEMAOPS ADMIN</span>
  </div>
  <div style="padding:28px;">
    <h2 style="margin:0 0 8px;color:#0f172a;">Password changed</h2>
    <p style="margin:0 0 16px;color:#475569;line-height:1.6;">Your SystemaOps Admin password was changed. All previous sessions have been signed out.</p>
    <p style="margin:0;color:#94a3b8;font-size:12px;">If you did not make this change, contact a SUPER_ADMIN immediately.</p>
  </div>
</div>
</body></html>`;
}

/* Diagnostics only: operation name + error message. Never the request
   body (which can carry a reset token or PII). */
function logServerError(operation, error) {
  console.error(
    `[password-reset] ${operation} failed: ${(error && error.message) || "unknown error"}`
  );
}

/* Sends the reset email and reports whether it was actually delivered.
   sendAdminEmail resolves {sent:true} on success and {sent:false} /
   {skipped:true} when the provider is unconfigured or rejects the
   message — it never throws, so the RESULT must be inspected. */
async function deliverResetEmail({ email, rawToken, minutes }) {
  const resetUrl = `${appOrigin()}/admin/reset-password?token=${encodeURIComponent(rawToken)}&email=${encodeURIComponent(email)}`;
  const body = resetEmailBody(resetUrl, minutes);
  try {
    const result = await sendAdminEmail({
      to: email,
      subject: "Reset your SystemaOps Admin password",
      html: body.html,
      text: body.text,
    });
    return Boolean(result && result.sent === true);
  } catch (error) {
    logServerError("reset email delivery", error);
    return false;
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body && req.body.email);

    if (!isValidEmail(email)) {
      return fail(res, 400, "INVALID_EMAIL", RESET_MESSAGES.invalidEmail);
    }

    let user;
    try {
      user = await AdminUser.findOne({ email }).select(
        "_id email name status resetTokenHash resetTokenExpiresAt"
      );
    } catch (error) {
      logServerError("account lookup", error);
      return fail(res, 500, "SERVER_ERROR", RESET_MESSAGES.serverError);
    }

    /* Unknown OR ineligible (e.g. suspended): same answer, no token,
       no email, no activity record. */
    if (!isEligibleForReset(user)) {
      return fail(res, 404, "EMAIL_NOT_FOUND", RESET_MESSAGES.emailNotFound);
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const ttl = ttlMs();
    const tokenHash = hashResetToken(rawToken);

    let write;
    try {
      write = await AdminUser.updateOne(
        { _id: user._id },
        {
          $set: {
            resetTokenHash: tokenHash,
            resetTokenExpiresAt: new Date(Date.now() + ttl),
          },
        }
      );
    } catch (error) {
      logServerError("reset token persistence", error);
      return fail(res, 500, "SERVER_ERROR", RESET_MESSAGES.serverError);
    }

    /* The account disappeared between read and write — answer exactly
       like an unknown email rather than leaking the race. */
    if (!write || write.modifiedCount !== 1) {
      return fail(res, 404, "EMAIL_NOT_FOUND", RESET_MESSAGES.emailNotFound);
    }

    await recordActivity({
      req,
      actor: { name: user.email },
      action: "ADMIN_PASSWORD_RESET_REQUESTED",
      entityType: "adminuser",
      entityId: user._id,
      entityLabel: user.email,
    });

    const delivered = await deliverResetEmail({
      email,
      rawToken,
      minutes: ttlMinutes(),
    });

    if (!delivered) {
      /* Do not claim an email was sent, and do not leave an orphan
         token behind that can never be reached. */
      try {
        await AdminUser.updateOne(
          { _id: user._id, resetTokenHash: tokenHash },
          { $set: { resetTokenHash: "", resetTokenExpiresAt: null } }
        );
      } catch (error) {
        logServerError("reset token rollback", error);
      }
      logServerError("reset email not delivered", null);
      return fail(res, 503, "EMAIL_SEND_FAILED", RESET_MESSAGES.emailSendFailed);
    }

    return ok(res, {
      message: `Reset instructions sent to ${email}. The link expires in ${ttlMinutes()} minutes and can only be used once.`,
    });
  } catch (error) {
    logServerError("forgot-password", error);
    return fail(res, 500, "SERVER_ERROR", RESET_MESSAGES.serverError);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body && req.body.email);
    const rawToken =
      typeof req.body.token === "string" ? req.body.token.trim() : "";
    const password =
      typeof req.body.password === "string" ? req.body.password : "";

    // Uniform rejection: never reveal whether the token ever existed.
    const reject = () =>
      fail(res, 400, "INVALID_RESET", RESET_MESSAGES.invalidReset);

    if (!isValidEmail(email) || !rawToken) return reject();
    if (password.length < 12 || password.length > 128) {
      return fail(res, 400, "INVALID_PASSWORD", RESET_MESSAGES.invalidPassword);
    }

    let user;
    try {
      user = await AdminUser.findOne({ email }).select(
        "_id name email status tokenVersion failedAttempts lockedUntil resetTokenHash resetTokenExpiresAt"
      );
    } catch (error) {
      logServerError("reset account lookup", error);
      return fail(res, 500, "SERVER_ERROR", RESET_MESSAGES.serverError);
    }

    if (!user) return reject();

    const storedHash = user.resetTokenHash || "";
    const expiresAt = user.resetTokenExpiresAt;
    const valid =
      storedHash.length === 64 &&
      safeCompare(hashResetToken(rawToken), storedHash) &&
      expiresAt instanceof Date &&
      expiresAt.getTime() > Date.now();

    if (!valid) return reject();

    // Single-use, and single-use even under concurrent submissions:
    // the token is consumed by a FILTERED update, so only one request
    // can match. Everyone else rejects as invalid/expired.
    let passwordHash;
    try {
      passwordHash = await bcrypt.hash(password, 12);
    } catch (error) {
      logServerError("password hashing", error);
      return fail(res, 500, "SERVER_ERROR", RESET_MESSAGES.serverError);
    }

    let consumed;
    try {
      consumed = await AdminUser.updateOne(
        {
          _id: user._id,
          resetTokenHash: storedHash,
          resetTokenExpiresAt: { $gt: new Date() },
        },
        {
          $set: {
            passwordHash,
            resetTokenHash: "",
            resetTokenExpiresAt: null,
            failedAttempts: 0,
            lockedUntil: null,
          },
          $inc: { tokenVersion: 1 }, // invalidates every existing session
        }
      );
    } catch (error) {
      logServerError("reset token consumption", error);
      return fail(res, 500, "SERVER_ERROR", RESET_MESSAGES.serverError);
    }

    if (!consumed || consumed.modifiedCount !== 1) return reject();

    await recordActivity({
      req,
      actor: { name: user.email },
      action: "ADMIN_PASSWORD_RESET_COMPLETED",
      entityType: "adminuser",
      entityId: user._id,
      entityLabel: user.email,
    });

    // Security notification (never contains password/token).
    try {
      await sendAdminEmail({
        to: email,
        subject: "Your SystemaOps Admin password was changed",
        html: securityNoticeBody(),
      });
    } catch {
      /* best-effort */
    }

    return ok(res, { message: RESET_MESSAGES.passwordUpdated });
  } catch (error) {
    logServerError("reset-password", error);
    return fail(res, 500, "SERVER_ERROR", RESET_MESSAGES.serverError);
  }
};
