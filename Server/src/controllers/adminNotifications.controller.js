// src/controllers/adminNotifications.controller.js — per-admin inbox.
// Only read-state mutations exist; notifications are created by the
// backend on business events (see services/activity.service.js).
import Notification from "../models/Notification.js";
import {
  fail,
  isValidObjectId,
  metaFor,
  ok,
  parsePagination,
} from "./adminShared.js";

export const listNotifications = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { userId: req.admin.id };
    if (req.query.unread === "true") filter.read = false;
    const [total, unread, items] = await Promise.all([
      Notification.countDocuments(filter),
      Notification.countDocuments({ userId: req.admin.id, read: false }),
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);
    return ok(res, { items, unread }, metaFor(total, page, limit));
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return fail(res, 400, "INVALID_ID", "Invalid notification id");
    }
    const note = await Notification.findOne({
      _id: req.params.id,
      userId: req.admin.id,
    });
    if (!note) return fail(res, 404, "NOTIFICATION_NOT_FOUND", "Notification not found");
    note.read = true;
    note.readAt = new Date();
    await note.save();
    return ok(res, { notification: note.toObject() });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.admin.id, read: false },
      { $set: { read: true, readAt: new Date() } }
    );
    return ok(res, { updated: result.modifiedCount || 0 });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};
