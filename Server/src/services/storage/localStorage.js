// src/services/storage/localStorage.js
// Local persistent storage for admin uploads (avatars). A thin,
// validated abstraction so a future S3-compatible backend can be
// introduced WITHOUT touching AdminUser/business logic.
//
// Files live under DATA_DIR (Docker: named volume mounted at /app/data).
// Storage keys are server-generated UUIDs — never user-controlled —
// and validated against a strict pattern before any filesystem access
// (path-traversal-proof).
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const KEY_PATTERN = /^[a-f0-9-]{36}\.webp$/;

function storageRoot() {
  const base = process.env.DATA_DIR || path.join(process.cwd(), "data");
  return path.join(base, "admin-avatars");
}

function ensureRoot() {
  fs.mkdirSync(storageRoot(), { recursive: true });
}

function resolveKey(storageKey) {
  if (typeof storageKey !== "string" || !KEY_PATTERN.test(storageKey)) {
    throw new Error("Invalid storage key");
  }
  const resolved = path.join(storageRoot(), storageKey);
  // Defense in depth: result must stay inside the storage root.
  if (!resolved.startsWith(storageRoot())) {
    throw new Error("Invalid storage key");
  }
  return resolved;
}

export async function saveImage(buffer) {
  ensureRoot();
  const storageKey = `${crypto.randomUUID()}.webp`;
  await fsp.writeFile(resolveKey(storageKey), buffer);
  return storageKey;
}

/* Idempotent: missing file is not an error. */
export async function deleteImage(storageKey) {
  if (!storageKey) return;
  try {
    await fsp.unlink(resolveKey(storageKey));
  } catch {
    /* already gone */
  }
}

export async function imageExists(storageKey) {
  if (!storageKey) return false;
  try {
    return fs.existsSync(resolveKey(storageKey));
  } catch {
    return false;
  }
}

/* Returns an absolute path for streaming, or null when invalid/missing. */
export function imagePath(storageKey) {
  if (!storageKey) return null;
  try {
    const resolved = resolveKey(storageKey);
    return fs.existsSync(resolved) ? resolved : null;
  } catch {
    return null;
  }
}
