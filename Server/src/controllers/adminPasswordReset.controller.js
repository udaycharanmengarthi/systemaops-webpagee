// src/controllers/adminPasswordReset.controller.js
// Secure password recovery: single-use, short-lived, hashed tokens.
//
// Anti-enumeration: forgot-password returns the IDENTICAL response for
// existing and unknown emails. Reset rejects invalid/expired/reused
// tokens uniformly. Raw tokens are never logged or stored.
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import validator from "validator";
import AdminUser from "../models/AdminUser.js";
import { fail, ok } from "./adminShared.js";
import { recordActivity } from "../services/activity.service.js";
import { sendAdminEmail } from "../services/mail.service.js";

const DEFAULT_TTL_MINUTES = 30;
const MAX_TTL_MINUTES = 60;

function ttlMinutes() {
  const raw = parseInt(process.env.RESET_TOKEN_TTL_MINUTES, 10);
  if (Number.isFinite(raw) && raw > 0 && raw <= MAX_TTL_MINUTES) return raw;
  return DEFAULT_TTL_MINUTES;
}

function ttlMs() {
  return ttlMinutes() * 60 * 1000;
}

/* Trusted application origin for reset links. NEVER derived from the
   request Host header. */
function appOrigin() {
  const configured = process.env.ADMIN_APP_ORIGIN || "";
  if (configured) return configured.replace(/\/+$/, "");
  return process.env.NODE_ENV === "production"
    ? "https://systemaops.com"
    : "http://localhost";
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function safeCompare(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
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

export const forgotPassword = async (req, res) => {
  try {
    const email =
      typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";

    if (!email || !validator.isEmail(email)) {
      // Same shape as the success response of a valid-but-unknown flow
      // is not needed here (invalid format), but never reveal specifics.
      return ok(res, {
        message: "If an account exists for that email, reset instructions have been sent.",
      });
    }

    const user = await AdminUser.findOne({ email }).select(
      "_id email name status resetTokenHash resetTokenExpiresAt"
    );

    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const ttl = ttlMs();
      await AdminUser.updateOne(
        { _id: user._id },
        {
          $set: {
            resetTokenHash: sha256(rawToken),
            resetTokenExpiresAt: new Date(Date.now() + ttl),
          },
        }
      );
      await recordActivity({
        req,
        actor: { name: user.email },
        action: "ADMIN_PASSWORD_RESET_REQUESTED",
        entityType: "adminuser",
        entityId: user._id,
        entityLabel: user.email,
      });
      // Best-effort delivery; the response is identical either way.
      try {
        const resetUrl = `${appOrigin()}/admin/reset-password?token=${encodeURIComponent(rawToken)}&email=${encodeURIComponent(email)}`;
        const body = resetEmailBody(resetUrl, ttlMinutes());
        await sendAdminEmail({
          to: email,
          subject: "Reset your SystemaOps Admin password",
          html: body.html,
          text: body.text,
        });
      } catch {
        /* email failure must not reveal anything */
      }
    }

    // IDENTICAL response for existing and unknown emails.
    return ok(res, {
      message: "If an account exists for that email, reset instructions have been sent.",
    });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

export const resetPassword = async (req, res) => {
  try {
    const email =
      typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    const rawToken =
      typeof req.body.token === "string" ? req.body.token.trim() : "";
    const password =
      typeof req.body.password === "string" ? req.body.password : "";

    // Uniform rejection: never reveal whether the token ever existed.
    const reject = () =>
      fail(res, 400, "INVALID_RESET", "Reset link is invalid or expired. Request a new one.");

    if (!email || !validator.isEmail(email) || !rawToken) return reject();
    if (password.length < 12 || password.length > 128) {
      return fail(res, 400, "INVALID_PASSWORD", "Password must be 12-128 characters");
    }

    const user = await AdminUser.findOne({ email }).select(
      "_id name email status tokenVersion failedAttempts lockedUntil resetTokenHash resetTokenExpiresAt"
    );
    if (!user) return reject();

    const storedHash = user.resetTokenHash || "";
    const expiresAt = user.resetTokenExpiresAt;
    const valid =
      storedHash.length === 64 &&
      safeCompare(sha256(rawToken), storedHash) &&
      expiresAt instanceof Date &&
      expiresAt.getTime() > Date.now();

    if (!valid) return reject();

    // Single-use: consume the token BEFORE applying the password.
    const passwordHash = await bcrypt.hash(password, 12);
    await AdminUser.updateOne(
      { _id: user._id },
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

    return ok(res, { message: "Password updated successfully. You can now sign in." });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};
