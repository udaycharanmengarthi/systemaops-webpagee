// src/controllers/adminActivity.controller.js — company-wide audit feed.
// Read-only. Activities are append-only; no update/delete endpoints exist
// by design (see models/Activity.js).
import Activity from "../models/Activity.js";
import {
  fail,
  isValidObjectId,
  metaFor,
  ok,
  parseDateRange,
  parsePagination,
} from "./adminShared.js";

export const listActivity = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};
    if (req.query.actor && isValidObjectId(req.query.actor)) {
      filter.actorId = req.query.actor;
    }
    if (req.query.action && typeof req.query.action === "string") {
      filter.action = req.query.action.trim().slice(0, 64).toUpperCase();
    }
    if (req.query.entityType && typeof req.query.entityType === "string") {
      const t = req.query.entityType.trim().toLowerCase();
      if (["contact", "career", "adminuser", "auth", "system"].includes(t)) {
        filter.entityType = t;
      }
    }
    if (req.query.entityId && isValidObjectId(req.query.entityId)) {
      filter.entityId = req.query.entityId;
    }
    const range = parseDateRange(req.query);
    if (range) filter.createdAt = range;

    const [total, items] = await Promise.all([
      Activity.countDocuments(filter),
      Activity.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);
    return ok(res, { items }, metaFor(total, page, limit));
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};
