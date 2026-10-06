// src/controllers/adminAvatar.controller.js
// Profile-avatar lifecycle: strict validation -> server-side processing
// (sharp: 512px center-crop WebP) -> persistent storage -> metadata in
// MongoDB (reference only, never binaries) -> audit.
// Replace order is safe: new file stored -> DB updated -> old file deleted.
import fs from "node:fs";
import multer from "multer";
import sharp from "sharp";
import AdminUser from "../models/AdminUser.js";
import { fail, isValidObjectId, ok } from "./adminShared.js";
import { recordActivity } from "../services/activity.service.js";
import {
  deleteImage,
  imagePath,
  saveImage,
} from "../services/storage/localStorage.js";

const ALLOWED = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "image/webp": [0x52, 0x49, 0x46, 0x46],
};

export const MAX_AVATAR_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_DIMENSION = 512;

function isMagicMatch(buffer, magic) {
  if (!buffer || buffer.length < magic.length) return false;
  return magic.every((byte, i) => buffer[i] === byte);
}

export const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_AVATAR_BYTES, files: 1 },
}).single("avatar");

/* Maps multer's size error to a clean, code-based API response. */
export function avatarUploadError(err, req, res, next) {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return fail(res, 400, "AVATAR_TOO_LARGE", "Image must be smaller than 5 MB");
  }
  return next(err);
}

/* Rejects oversized/invalid uploads, processes to a predictable,
   optimized 512x512 center-cropped WebP. Throws on corrupt input. */
async function processAvatar(buffer) {
  const processed = await sharp(buffer)
    .rotate()
    .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: "cover", position: "center" })
    .webp({ quality: 82 })
    .toBuffer();
  const meta = await sharp(processed).metadata();
  return {
    buffer: processed,
    mimeType: "image/webp",
    size: processed.length,
    width: meta.width || 0,
    height: meta.height || 0,
  };
}

function streamFile(res, filePath, mimeType) {
  res.setHeader("Content-Type", mimeType);
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Private (cookie-authenticated) + always revalidated; the frontend
  // additionally busts with ?v=<updatedAt> so a new avatar shows
  // immediately without a hard refresh.
  res.setHeader("Cache-Control", "private, no-cache");
  const stream = fs.createReadStream(filePath);
  stream.on("error", () => {
    if (!res.headersSent) res.status(404).end();
  });
  stream.pipe(res);
}

export const uploadMyAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return fail(res, 400, "INVALID_AVATAR", "Provide a JPG, PNG or WebP image");
    }
    const declared = String(req.file.mimetype || "").toLowerCase();
    if (!ALLOWED[declared] || !isMagicMatch(req.file.buffer, ALLOWED[declared])) {
      return fail(res, 400, "INVALID_AVATAR", "Please upload a JPG, PNG, or WebP image");
    }

    let processed;
    try {
      processed = await processAvatar(req.file.buffer);
    } catch {
      return fail(res, 400, "AVATAR_INVALID", "That image could not be processed");
    }

    // 1. Store the new image first.
    const storageKey = await saveImage(processed.buffer);

    const user = await AdminUser.findById(req.admin.id);
    if (!user) return fail(res, 404, "USER_NOT_FOUND", "User not found");
    const previousKey = user.avatar && user.avatar.storageKey ? user.avatar.storageKey : "";

    // 2. Update metadata only after the file is safely stored.
    await AdminUser.updateOne(
      { _id: user._id },
      {
        $set: {
          "avatar.storageKey": storageKey,
          "avatar.mimeType": processed.mimeType,
          "avatar.size": processed.size,
          "avatar.width": processed.width,
          "avatar.height": processed.height,
          "avatar.updatedAt": new Date(),
        },
      }
    );

    // 3. Only now delete the previous image (never before success).
    if (previousKey) await deleteImage(previousKey);

    await recordActivity({
      req,
      actor: req.admin,
      action: previousKey ? "AVATAR_REPLACED" : "AVATAR_UPLOADED",
      entityType: "adminuser",
      entityId: user._id,
      entityLabel: "own avatar",
    });

    return ok(res, {
      avatar: { hasAvatar: true, updatedAt: new Date().toISOString() },
    });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Upload failed. Please try again.");
  }
};

export const removeMyAvatar = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.admin.id);
    if (!user) return fail(res, 404, "USER_NOT_FOUND", "User not found");
    const key = user.avatar && user.avatar.storageKey ? user.avatar.storageKey : "";
    await deleteImage(key); // idempotent when already missing
    await AdminUser.updateOne(
      { _id: user._id },
      { $set: { "avatar.storageKey": "", "avatar.updatedAt": new Date() } }
    );
    await recordActivity({
      req,
      actor: req.admin,
      action: "AVATAR_REMOVED",
      entityType: "adminuser",
      entityId: user._id,
      entityLabel: "own avatar",
    });
    return ok(res, { avatar: { hasAvatar: false, updatedAt: null } });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

/* SUPER_ADMIN housekeeping: remove another admin's avatar. */
export const removeUserAvatar = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return fail(res, 400, "INVALID_ID", "Invalid user id");
    }
    const user = await AdminUser.findById(req.params.id);
    if (!user) return fail(res, 404, "USER_NOT_FOUND", "User not found");
    const key = user.avatar && user.avatar.storageKey ? user.avatar.storageKey : "";
    await deleteImage(key);
    await AdminUser.updateOne(
      { _id: user._id },
      { $set: { "avatar.storageKey": "", "avatar.updatedAt": new Date() } }
    );
    await recordActivity({
      req,
      actor: req.admin,
      action: "AVATAR_REMOVED",
      entityType: "adminuser",
      entityId: user._id,
      entityLabel: `${user.name} <${user.email}>`,
    });
    return ok(res, { removed: true });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

/* Own avatar stream (prompt convention: auth-scoped). */
export const serveMyAvatar = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.admin.id);
    if (!user) return fail(res, 404, "USER_NOT_FOUND", "User not found");
    const key = user.avatar && user.avatar.storageKey ? user.avatar.storageKey : "";
    const filePath = imagePath(key);
    if (!filePath) {
      return res.status(404).json({ success: false, error: { code: "AVATAR_NOT_FOUND", message: "Avatar not found" } });
    }
    return streamFile(res, filePath, "image/webp");
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

/* Avatar stream for any authenticated admin (header/team display).
   Only serves files matching the strict server-generated key pattern. */
export const serveAvatar = async (req, res) => {
  try {
    const id = String(req.params.userId || "");
    if (!/^[a-f0-9]{24}$/.test(id)) {
      return fail(res, 400, "INVALID_ID", "Invalid user id");
    }
    const user = await AdminUser.findById(id).select("avatar");
    const key = user && user.avatar && user.avatar.storageKey ? user.avatar.storageKey : "";
    const filePath = imagePath(key);
    if (!filePath) {
      return res.status(404).json({ success: false, error: { code: "AVATAR_NOT_FOUND", message: "Avatar not found" } });
    }
    return streamFile(res, filePath, "image/webp");
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};
