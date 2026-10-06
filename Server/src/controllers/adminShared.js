// src/controllers/adminShared.js — shared admin API plumbing:
// consistent envelope, pagination, ObjectId guards, audit timestamping.
import mongoose from "mongoose";
import { adminError } from "../middleware/adminAuth.js";

export function ok(res, data, meta = undefined) {
  return res.json(
    meta === undefined
      ? { success: true, data }
      : { success: true, data, meta }
  );
}

export function fail(res, status, code, message) {
  return adminError(res, status, code, message);
}

export function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

export function parsePagination(query, { defaultLimit = 25, maxLimit = 100 } = {}) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(query.limit, 10) || defaultLimit)
  );
  return { page, limit, skip: (page - 1) * limit };
}

export function metaFor(total, page, limit) {
  return { total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) };
}

/* Sort allowlist: "createdAt" | "-createdAt" | "updatedAt" | "-updatedAt"
   | "followUpAt" | "-followUpAt" | "priority" (custom order below). */
const SORTABLE = new Set([
  "createdAt",
  "-createdAt",
  "updatedAt",
  "-updatedAt",
  "followUpAt",
  "-followUpAt",
]);

export function parseSort(query, fallback = "-createdAt") {
  const raw = typeof query.sort === "string" ? query.sort : fallback;
  if (raw === "priority" || raw === "-priority") {
    // Mongo can't sort enums semantically; the aggregation-free trick:
    // sort by a projected weight is overkill — secondary createdAt sort
    // keeps it deterministic; UI groups by priority client-side.
    return { createdAt: -1 };
  }
  if (!SORTABLE.has(raw)) return { createdAt: -1 };
  const desc = raw.startsWith("-");
  return { [desc ? raw.slice(1) : raw]: desc ? -1 : 1 };
}

export function parseDateRange(query) {
  const out = {};
  if (query.from) {
    const from = new Date(query.from);
    if (!Number.isNaN(from.getTime())) out.$gte = from;
  }
  if (query.to) {
    const to = new Date(query.to);
    if (!Number.isNaN(to.getTime())) out.$lte = to;
  }
  return Object.keys(out).length > 0 ? out : null;
}

export function cleanTags(value) {
  if (!Array.isArray(value)) return null;
  const tags = [
    ...new Set(
      value
        .filter((t) => typeof t === "string")
        .map((t) => t.trim().toLowerCase().slice(0, 40))
        .filter(Boolean)
    ),
  ].slice(0, 20);
  return tags;
}

/* Stamp lastActivityAt on every successful mutation. */
export function touchActivity(doc) {
  doc.lastActivityAt = new Date();
}
