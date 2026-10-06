// src/controllers/adminContacts.controller.js — operational contact API.
// All routes are admin-authenticated; mutations additionally require
// MANAGER+ (enforced in routes). Every mutation writes an activity.
import Contact from "../models/Contact.js";
import AdminUser from "../models/AdminUser.js";
import Activity from "../models/Activity.js";
import {
  CONTACT_STATUSES,
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
  "name email phone company status priority assigneeId assigneeName assignedAt tags followUpAt followUpNote followUpDone lastActivityAt createdAt updatedAt expiresAt";

function buildFilters(query, admin) {
  const filter = {};
  if (query.status) {
    const statuses = String(query.status)
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter((s) => CONTACT_STATUSES.includes(s));
    if (statuses.length > 0) filter.status = { $in: statuses };
  }
  if (query.priority) {
    const priorities = String(query.priority)
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter((s) => PRIORITIES.includes(s));
    if (priorities.length > 0) filter.priority = { $in: priorities };
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
    filter.status = { $nin: ["CLOSED", "CONVERTED"] };
  } else if (query.followup === "none") {
    filter.followUpAt = null;
  }
  if (query.q && typeof query.q === "string" && query.q.trim()) {
    filter.$text = { $search: query.q.trim().slice(0, 120) };
  }
  return filter;
}

export const listContacts = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = buildFilters(req.query, req.admin);
    const sort = parseSort(req.query);
    const [total, items] = await Promise.all([
      Contact.countDocuments(filter),
      Contact.find(filter, LIST_PROJECTION)
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

export const getContact = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return fail(res, 400, "INVALID_ID", "Invalid contact id");
    }
    const contact = await Contact.findById(req.params.id).lean();
    if (!contact) return fail(res, 404, "CONTACT_NOT_FOUND", "Contact not found");
    const timeline = await Activity.find({
      entityType: "contact",
      entityId: contact._id,
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();
    return ok(res, { contact, timeline });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

function labelFor(contact) {
  return `${contact.name} — ${contact.company || contact.email}`;
}

async function saveAndAudit(req, res, contact, { action, fromValue = "", toValue = "", metadata }) {
  touchActivity(contact);
  await contact.save();
  await recordActivity({
    req,
    actor: req.admin,
    action,
    entityType: "contact",
    entityId: contact._id,
    entityLabel: labelFor(contact),
    fromValue,
    toValue,
    metadata,
  });
  return ok(res, { contact: contact.toObject() });
}

export const setContactStatus = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return fail(res, 400, "INVALID_ID", "Invalid contact id");
    }
    const to = String(req.body.status || "").trim().toUpperCase();
    if (!CONTACT_STATUSES.includes(to)) {
      return fail(res, 400, "INVALID_STATUS", "Unknown status");
    }
    const contact = await Contact.findById(req.params.id);
    if (!contact) return fail(res, 404, "CONTACT_NOT_FOUND", "Contact not found");
    if (contact.status === to) return ok(res, { contact: contact.toObject() });
    const allowReopen = req.admin.role === "ADMIN" || req.admin.role === "SUPER_ADMIN";
    if (!canTransition("contact", contact.status, to, { allowReopen })) {
      return fail(
        res,
        400,
        "INVALID_TRANSITION",
        `Cannot move contact from ${contact.status} to ${to}`
      );
    }
    const from = contact.status;
    contact.status = to;
    return await saveAndAudit(req, res, contact, {
      action: "CONTACT_STATUS_CHANGED",
      fromValue: from,
      toValue: to,
    });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

export const setContactAssignee = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return fail(res, 400, "INVALID_ID", "Invalid contact id");
    }
    const contact = await Contact.findById(req.params.id);
    if (!contact) return fail(res, 404, "CONTACT_NOT_FOUND", "Contact not found");
    const raw = req.body.assigneeId;
    const from = contact.assigneeName || "Unassigned";
    if (raw === null || raw === "" || raw === undefined) {
      contact.assigneeId = null;
      contact.assigneeName = "";
      contact.assignedAt = null;
      await saveAndAudit(req, res, contact, {
        action: "CONTACT_UNASSIGNED",
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
    contact.assigneeId = assignee._id;
    contact.assigneeName = assignee.name;
    contact.assignedAt = new Date();
    await saveAndAudit(req, res, contact, {
      action: "CONTACT_ASSIGNED",
      fromValue: from,
      toValue: assignee.name,
    });
    await notifyUser({
      userId: String(assignee._id),
      type: "ASSIGNMENT",
      title: `Contact assigned: ${contact.name}`,
      body: `${contact.company || contact.email}`,
      entityType: "contact",
      entityId: contact._id,
    });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

export const setContactPriority = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return fail(res, 400, "INVALID_ID", "Invalid contact id");
    }
    const to = String(req.body.priority || "").trim().toUpperCase();
    if (!PRIORITIES.includes(to)) {
      return fail(res, 400, "INVALID_PRIORITY", "Unknown priority");
    }
    const contact = await Contact.findById(req.params.id);
    if (!contact) return fail(res, 404, "CONTACT_NOT_FOUND", "Contact not found");
    const from = contact.priority;
    contact.priority = to;
    return await saveAndAudit(req, res, contact, {
      action: "CONTACT_PRIORITY_CHANGED",
      fromValue: from,
      toValue: to,
    });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

export const addContactNote = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return fail(res, 400, "INVALID_ID", "Invalid contact id");
    }
    const body = typeof req.body.body === "string" ? req.body.body.trim() : "";
    if (!body || body.length > 2000) {
      return fail(res, 400, "INVALID_NOTE", "Note must be 1-2000 characters");
    }
    const contact = await Contact.findById(req.params.id);
    if (!contact) return fail(res, 404, "CONTACT_NOT_FOUND", "Contact not found");
    contact.notes.push({
      authorId: req.admin.id,
      authorName: req.admin.name,
      body: body.slice(0, 2000),
    });
    return await saveAndAudit(req, res, contact, {
      action: "CONTACT_NOTE_ADDED",
      metadata: { notePreview: body.slice(0, 140) },
    });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

export const setContactFollowUp = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return fail(res, 400, "INVALID_ID", "Invalid contact id");
    }
    const contact = await Contact.findById(req.params.id);
    if (!contact) return fail(res, 404, "CONTACT_NOT_FOUND", "Contact not found");
    if (req.body.followUpAt !== undefined) {
      if (req.body.followUpAt === null || req.body.followUpAt === "") {
        contact.followUpAt = null;
      } else {
        const at = new Date(req.body.followUpAt);
        if (Number.isNaN(at.getTime())) {
          return fail(res, 400, "INVALID_FOLLOWUP", "Invalid follow-up date");
        }
        contact.followUpAt = at;
      }
      contact.followUpDone = false;
    }
    if (req.body.followUpNote !== undefined) {
      contact.followUpNote = String(req.body.followUpNote || "").slice(0, 500);
    }
    if (req.body.followUpDone !== undefined) {
      contact.followUpDone = req.body.followUpDone === true;
    }
    return await saveAndAudit(req, res, contact, {
      action: "CONTACT_FOLLOWUP_CHANGED",
      toValue: contact.followUpAt ? contact.followUpAt.toISOString() : "cleared",
    });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

export const setContactTags = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return fail(res, 400, "INVALID_ID", "Invalid contact id");
    }
    const tags = cleanTags(req.body.tags);
    if (tags === null) {
      return fail(res, 400, "INVALID_TAGS", "Tags must be an array of strings");
    }
    const contact = await Contact.findById(req.params.id);
    if (!contact) return fail(res, 404, "CONTACT_NOT_FOUND", "Contact not found");
    const from = (contact.tags || []).join(", ");
    contact.tags = tags;
    return await saveAndAudit(req, res, contact, {
      action: "CONTACT_TAGS_CHANGED",
      fromValue: from,
      toValue: tags.join(", "),
    });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};

/* Server-side bulk operations (bounded). Each affected record gets its
   own activity entry; failures are reported per id, never silently. */
export const bulkContacts = async (req, res) => {
  try {
    const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
    const op = req.body.op;
    const cleanIds = [...new Set(ids.filter((id) => isValidObjectId(id)))].slice(0, 100);
    if (cleanIds.length === 0) {
      return fail(res, 400, "INVALID_BULK", "Provide 1-100 valid contact ids");
    }
    const results = { updated: [], failed: [] };
    if (op === "status") {
      const to = String(req.body.status || "").trim().toUpperCase();
      if (!CONTACT_STATUSES.includes(to)) {
        return fail(res, 400, "INVALID_STATUS", "Unknown status");
      }
      const allowReopen = req.admin.role === "ADMIN" || req.admin.role === "SUPER_ADMIN";
      for (const id of cleanIds) {
        const contact = await Contact.findById(id);
        if (!contact) {
          results.failed.push({ id, reason: "not found" });
          continue;
        }
        if (contact.status !== to && !canTransition("contact", contact.status, to, { allowReopen })) {
          results.failed.push({ id, reason: `invalid transition ${contact.status} -> ${to}` });
          continue;
        }
        const from = contact.status;
        contact.status = to;
        touchActivity(contact);
        await contact.save();
        await recordActivity({
          req,
          actor: req.admin,
          action: "CONTACT_STATUS_CHANGED",
          entityType: "contact",
          entityId: contact._id,
          entityLabel: labelFor(contact),
          fromValue: from,
          toValue: to,
          metadata: { bulk: true },
        });
        results.updated.push(id);
      }
    } else if (op === "priority") {
      const to = String(req.body.priority || "").trim().toUpperCase();
      if (!PRIORITIES.includes(to)) {
        return fail(res, 400, "INVALID_PRIORITY", "Unknown priority");
      }
      for (const id of cleanIds) {
        const contact = await Contact.findById(id);
        if (!contact) {
          results.failed.push({ id, reason: "not found" });
          continue;
        }
        const from = contact.priority;
        contact.priority = to;
        touchActivity(contact);
        await contact.save();
        await recordActivity({
          req,
          actor: req.admin,
          action: "CONTACT_PRIORITY_CHANGED",
          entityType: "contact",
          entityId: contact._id,
          entityLabel: labelFor(contact),
          fromValue: from,
          toValue: to,
          metadata: { bulk: true },
        });
        results.updated.push(id);
      }
    } else if (op === "assign") {
      const raw = req.body.assigneeId;
      let assignee = null;
      if (raw !== null && raw !== "" && raw !== undefined) {
        if (!isValidObjectId(raw)) {
          return fail(res, 400, "INVALID_ASSIGNEE", "Invalid assignee id");
        }
        assignee = await AdminUser.findById(raw).select("_id name status");
        if (!assignee || assignee.status !== "active") {
          return fail(res, 400, "INVALID_ASSIGNEE", "Assignee is not an active admin");
        }
      }
      for (const id of cleanIds) {
        const contact = await Contact.findById(id);
        if (!contact) {
          results.failed.push({ id, reason: "not found" });
          continue;
        }
        const from = contact.assigneeName || "Unassigned";
        contact.assigneeId = assignee ? assignee._id : null;
        contact.assigneeName = assignee ? assignee.name : "";
        contact.assignedAt = assignee ? new Date() : null;
        touchActivity(contact);
        await contact.save();
        await recordActivity({
          req,
          actor: req.admin,
          action: assignee ? "CONTACT_ASSIGNED" : "CONTACT_UNASSIGNED",
          entityType: "contact",
          entityId: contact._id,
          entityLabel: labelFor(contact),
          fromValue: from,
          toValue: assignee ? assignee.name : "Unassigned",
          metadata: { bulk: true },
        });
        results.updated.push(id);
      }
    } else {
      return fail(res, 400, "INVALID_BULK", "Unknown bulk operation");
    }
    return ok(res, results);
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
}
