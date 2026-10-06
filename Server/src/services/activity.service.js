// src/services/activity.service.js — audit + notification writers.
// Best-effort by design: audit failures must NEVER break the business
// operation they describe (callers wrap in try/catch regardless).

import Activity from "../models/Activity.js";
import Notification from "../models/Notification.js";
import AdminUser from "../models/AdminUser.js";

function requestMeta(req) {
  if (!req) return {};
  const forwarded = req.headers && req.headers["x-forwarded-for"];
  const ip =
    (typeof forwarded === "string" && forwarded.split(",")[0].trim()) ||
    (req.ip || "");
  return {
    ipAddress: String(ip).slice(0, 64),
    userAgent: String(req.headers["user-agent"] || "").slice(0, 300),
  };
}

export async function recordActivity({
  req = null,
  actor = null,
  action,
  entityType,
  entityId = null,
  entityLabel = "",
  fromValue = "",
  toValue = "",
  metadata = undefined,
}) {
  try {
    await Activity.create({
      actorId: (actor && actor.id) || null,
      actorName: (actor && actor.name) || "System",
      action,
      entityType,
      entityId,
      entityLabel: String(entityLabel || "").slice(0, 160),
      fromValue: String(fromValue ?? "").slice(0, 120),
      toValue: String(toValue ?? "").slice(0, 120),
      ...(metadata === undefined ? {} : { metadata }),
      ...requestMeta(req),
    });
  } catch {
    // Audit is append-only evidence, never a hard dependency.
  }
}

/* Fan-out a notification to every active admin except the actor.
   Bounded: skips when there are no other admins. */
export async function notifyAdmins({
  excludeId = null,
  type,
  title,
  body = "",
  entityType = "",
  entityId = null,
}) {
  try {
    const admins = await AdminUser.find({ status: "active" }).select("_id");
    const docs = admins
      .map((a) => String(a._id))
      .filter((id) => id !== String(excludeId || ""))
      .map((id) => ({
        userId: id,
        type,
        title: String(title).slice(0, 160),
        body: String(body).slice(0, 500),
        entityType,
        entityId,
      }));
    if (docs.length > 0) await Notification.insertMany(docs);
  } catch {
    // Notifications must never fail the triggering operation.
  }
}

export async function notifyUser({
  userId,
  type,
  title,
  body = "",
  entityType = "",
  entityId = null,
}) {
  try {
    if (!userId) return;
    await Notification.create({
      userId,
      type,
      title: String(title).slice(0, 160),
      body: String(body).slice(0, 500),
      entityType,
      entityId,
    });
  } catch {
    // See above.
  }
}
