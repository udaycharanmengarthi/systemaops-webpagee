// src/controllers/adminDashboard.controller.js — founder's morning page.
// Everything is computed server-side with countDocuments/aggregations;
// full record sets are NEVER fetched for metrics.
import Contact from "../models/Contact.js";
import CareerApplication from "../models/CareerApplication.js";
import Activity from "../models/Activity.js";
import { fail, ok } from "./adminShared.js";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfYesterday() {
  const d = startOfToday();
  d.setDate(d.getDate() - 1);
  return d;
}

export const getSummary = async (req, res) => {
  try {
    const today = startOfToday();
    const yesterday = startOfYesterday();
    const now = new Date();
    const openContact = { status: { $nin: ["CLOSED", "CONVERTED"] } };
    const openCareer = { status: { $nin: ["HIRED", "REJECTED"] } };

    const [
      contactsNew,
      contactsNewToday,
      contactsUnassigned,
      contactsOverdue,
      contactsByStatus,
      careersNew,
      careersNewToday,
      careersUnassigned,
      careersOverdue,
      careersByStatus,
      careersByRole,
      activityToday,
      recentActivity,
    ] = await Promise.all([
      Contact.countDocuments({ status: "NEW" }),
      Contact.countDocuments({ createdAt: { $gte: today } }),
      Contact.countDocuments({ ...openContact, assigneeId: null }),
      Contact.countDocuments({
        ...openContact,
        followUpAt: { $lt: now },
        followUpDone: { $ne: true },
      }),
      Contact.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      CareerApplication.countDocuments({ status: "NEW" }),
      CareerApplication.countDocuments({ createdAt: { $gte: today } }),
      CareerApplication.countDocuments({ ...openCareer, assigneeId: null }),
      CareerApplication.countDocuments({
        ...openCareer,
        followUpAt: { $lt: now },
        followUpDone: { $ne: true },
      }),
      CareerApplication.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      CareerApplication.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      Activity.countDocuments({ createdAt: { $gte: yesterday } }),
      Activity.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select("actorName action entityType entityLabel fromValue toValue createdAt")
        .lean(),
    ]);

    // Attention queue: actionable items, most urgent first.
    const [staleContacts, staleCareers] = await Promise.all([
      Contact.find(
        {
          ...openContact,
          $or: [
            { followUpAt: { $lt: now }, followUpDone: { $ne: true } },
            { assigneeId: null, createdAt: { $lt: yesterday } },
          ],
        },
        "name company email status priority assigneeName followUpAt createdAt"
      )
        .sort({ followUpAt: 1, createdAt: 1 })
        .limit(10)
        .lean(),
      CareerApplication.find(
        {
          ...openCareer,
          $or: [
            { followUpAt: { $lt: now }, followUpDone: { $ne: true } },
            { assigneeId: null, createdAt: { $lt: yesterday } },
          ],
        },
        "firstName lastName role email status priority assigneeName followUpAt createdAt"
      )
        .sort({ followUpAt: 1, createdAt: 1 })
        .limit(10)
        .lean(),
    ]);

    const byStatus = (rows) =>
      Object.fromEntries(rows.map((r) => [r._id || "UNKNOWN", r.count]));

    return ok(res, {
      generatedAt: new Date().toISOString(),
      contacts: {
        new: contactsNew,
        newToday: contactsNewToday,
        unassigned: contactsUnassigned,
        overdue: contactsOverdue,
        byStatus: byStatus(contactsByStatus),
      },
      careers: {
        new: careersNew,
        newToday: careersNewToday,
        unassigned: careersUnassigned,
        overdue: careersOverdue,
        byStatus: byStatus(careersByStatus),
        byRole: careersByRole.map((r) => ({ role: r._id, count: r.count })),
      },
      attention: { contacts: staleContacts, careers: staleCareers },
      activity: { sinceYesterday: activityToday, recent: recentActivity },
    });
  } catch {
    return fail(res, 500, "SERVER_ERROR", "Server error");
  }
};
