// src/controllers/adminCareers.controller.js — operational career API.
// Mirrors adminContacts.controller.js; adds role filtering and the
// career workflow (NEW..HIRED/REJECTED). Every mutation is audited.
import CareerApplication from "../models/CareerApplication.js";
import AdminUser from "../models/AdminUser.js";
import Activity from "../models/Activity.js";
import {
  CAREER_STATUSES,
  PRIORITIES,
  canTransition,
} from "../config/workflow.js";
import {
  cleanTags,
  fail,
  isValidObjectId,
  metaFor,
  ok,
  parseDateRange,
  parsePagination,
  parseSort,
  touchActivity,
} from "./adminShared.js";
import {
  notifyUser,
  recordActivity,
} from "../services/activity.service.js";

const LIST_PROJECTION =
  "firstName lastName email phone role status priority assigneeId assigneeName assignedAt tags followUpAt followUpNote followUpDone lastActivityAt createdAt updatedAt expiresAt";

function buildFilters(query, admin) {
  const filter = {};
  if (query.status) {
    const statuses = String(query.status)
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter((s) => CAREER_STATUSES.includes(s));
    if (statuses.length > 0) filter.status = { $in: statuses };
  }
  if (query.priority) {
    const priorities = String(query.priority)
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter((s) => PRIORITIES.includes(s));
    if (priorities.length > 0) filter.priority = { $in: priorities };
  }
  if (query.role && typeof query.role === "string" && query.role.trim()) {
    filter.role = { $regex: query.role.trim().slice(0, 120).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
  }
  if (query.assignee) {
    if (query.assignee === "unassigned") filter.assigneeId = null;
    else if (query.assignee === "me") filter.assigneeId = admin.id;
    else if (isValidObjectId(query.assignee)) filter.assigneeId = query.assignee;
  }
  if (query.tags) {
    const tags = String(query.tags)
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 10);
    if (tags.length > 0) filter.tags = { $in: tags };
  }
  const range = parseDateRange(query);
  if (range) filter.createdAt = range;
  if (query.followup === "overdue" || query.followup === "due") {
    const end = query.followup === "due" ? new Date() : new Date();
    if (query.followup === "due") end.setHours(23, 59, 59, 999);
    filter.followUpAt = query.followup === "due" ? { $lte: end } : { $lt: new Date() };
    filter.followUpDone = { $ne: true };
    filter.status = { $nin: ["HIRED", "REJECTED"] };
  } else if (query.followup === "none") {
    filter.followUpAt = null;
  }
  if (query.q && typeof query.q === "string" && query.q.trim()) {
    filter.$text = { $search: query.q.trim().slice(0, 120) };
  }
  return filter;
}

export const listCareers = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = buildFilters(req.query, req.admin);
    const sort = parseSort(req.query);
    const [total, items] = await Promise.all([
      CareerApplication.countDocuments(filter),
      CareerApplication.find(
        filter,
        `${LIST_PROJECTION} linkedin portfolio resumeUrl`
      )
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);
    return ok(res, { items }, metaFor(total, page, limit));
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

export const getCareer = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return fail(res, 400, "INVALID_ID", "Invalid application id");
    }
    const career = await CareerApplication.findById(req.params.id).lean();
    if (!career) return fail(res, 404, "CAREER_NOT_FOUND", "Application not found");
    const timeline = await Activity.find({
      entityType: "career",
      entityId: career._id,
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    return ok(res, { career, timeline });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

function labelFor(career) {
  return `${career.firstName} ${career.lastName} — ${career.role}`;
}

async function saveAndAudit(req, res, career, { action, fromValue = "", toValue = "", metadata }) {
  touchActivity(career);
  await career.save();
  await recordActivity({
    req,
    actor: req.admin,
    action,
    entityType: "career",
    entityId: career._id,
    entityLabel: labelFor(career),
    fromValue,
    toValue,
    metadata,
  });
  return ok(res, { career: career.toObject() });
}

export const setCareerStatus = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return fail(res, 400, "INVALID_ID", "Invalid application id");
    }
    const to = String(req.body.status || "").trim().toUpperCase();
    if (!CAREER_STATUSES.includes(to)) {
      return fail(res, 400, "INVALID_STATUS", "Unknown status");
    }
    const career = await CareerApplication.findById(req.params.id);
    if (!career) return fail(res, 404, "CAREER_NOT_FOUND", "Application not found");
    if (career.status === to) return ok(res, { career: career.toObject() });
    if (!canTransition("career", career.status, to)) {
      return fail(
        res,
        400,
        "INVALID_TRANSITION",
        `Cannot move application from ${career.status} to ${to}`
      );
    }
    const from = career.status;
    career.status = to;
    return await saveAndAudit(req, res, career, {
      action: "CAREER_STATUS_CHANGED",
      fromValue: from,
      toValue: to,
    });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

export const setCareerAssignee = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return fail(res, 400, "INVALID_ID", "Invalid application id");
    }
    const career = await CareerApplication.findById(req.params.id);
    if (!career) return fail(res, 404, "CAREER_NOT_FOUND", "Application not found");
    const raw = req.body.assigneeId;
    const from = career.assigneeName || "Unassigned";
    if (raw === null || raw === "" || raw === undefined) {
      career.assigneeId = null;
      career.assigneeName = "";
      career.assignedAt = null;
      await saveAndAudit(req, res, career, {
        action: "CAREER_UNASSIGNED",
        fromValue: from,
        toValue: "Unassigned",
      });
      return;
    }
    if (!isValidObjectId(raw)) {
      return fail(res, 400, "INVALID_ASSIGNEE", "Invalid assignee id");
    }
    const assignee = await AdminUser.findById(raw).select("_id name status");
    if (!assignee || assignee.status !== "active") {
      return fail(res, 400, "INVALID_ASSIGNEE", "Assignee is not an active admin");
    }
    career.assigneeId = assignee._id;
    career.assigneeName = assignee.name;
    career.assignedAt = new Date();
    await saveAndAudit(req, res, career, {
      action: "CAREER_ASSIGNED",
      fromValue: from,
      toValue: assignee.name,
    });
    await notifyUser({
      userId: String(assignee._id),
      type: "ASSIGNMENT",
      title: `Application assigned: ${career.firstName} ${career.lastName}`,
      body: `${career.role}`,
      entityType: "career",
      entityId: career._id,
    });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

export const setCareerPriority = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return fail(res, 400, "INVALID_ID", "Invalid application id");
    }
    const to = String(req.body.priority || "").trim().toUpperCase();
    if (!PRIORITIES.includes(to)) {
      return fail(res, 400, "INVALID_PRIORITY", "Unknown priority");
    }
    const career = await CareerApplication.findById(req.params.id);
    if (!career) return fail(res, 404, "CAREER_NOT_FOUND", "Application not found");
    const from = career.priority;
    career.priority = to;
    return await saveAndAudit(req, res, career, {
      action: "CAREER_PRIORITY_CHANGED",
      fromValue: from,
      toValue: to,
    });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

export const addCareerNote = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return fail(res, 400, "INVALID_ID", "Invalid application id");
    }
    const body = typeof req.body.body === "string" ? req.body.body.trim() : "";
    if (!body || body.length > 2000) {
      return fail(res, 400, "INVALID_NOTE", "Note must be 1-2000 characters");
    }
    const career = await CareerApplication.findById(req.params.id);
    if (!career) return fail(res, 404, "CAREER_NOT_FOUND", "Application not found");
    career.notes.push({
      authorId: req.admin.id,
      authorName: req.admin.name,
      body: body.slice(0, 2000),
    });
    return await saveAndAudit(req, res, career, {
      action: "CAREER_NOTE_ADDED",
      metadata: { notePreview: body.slice(0, 140) },
    });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

export const setCareerFollowUp = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return fail(res, 400, "INVALID_ID", "Invalid application id");
    }
    const career = await CareerApplication.findById(req.params.id);
    if (!career) return fail(res, 404, "CAREER_NOT_FOUND", "Application not found");
    if (req.body.followUpAt !== undefined) {
      if (req.body.followUpAt === null || req.body.followUpAt === "") {
        career.followUpAt = null;
      } else {
        const at = new Date(req.body.followUpAt);
        if (Number.isNaN(at.getTime())) {
          return fail(res, 400, "INVALID_FOLLOWUP", "Invalid follow-up date");
        }
        career.followUpAt = at;
      }
      career.followUpDone = false;
    }
    if (req.body.followUpNote !== undefined) {
      career.followUpNote = String(req.body.followUpNote || "").slice(0, 500);
    }
    if (req.body.followUpDone !== undefined) {
      career.followUpDone = req.body.followUpDone === true;
    }
    return await saveAndAudit(req, res, career, {
      action: "CAREER_FOLLOWUP_CHANGED",
      toValue: career.followUpAt ? career.followUpAt.toISOString() : "cleared",
    });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

export const setCareerTags = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return fail(res, 400, "INVALID_ID", "Invalid application id");
    }
    const tags = cleanTags(req.body.tags);
    if (tags === null) {
      return fail(res, 400, "INVALID_TAGS", "Tags must be an array of strings");
    }
    const career = await CareerApplication.findById(req.params.id);
    if (!career) return fail(res, 404, "CAREER_NOT_FOUND", "Application not found");
    const from = (career.tags || []).join(", ");
    career.tags = tags;
    return await saveAndAudit(req, res, career, {
      action: "CAREER_TAGS_CHANGED",
      fromValue: from,
      toValue: tags.join(", "),
    });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};
