// src/routes/admin.routes.js — all /api/admin/* endpoints.
// Reads: any authenticated admin. Mutations: MANAGER+. User admin: SUPER_ADMIN.
import express from "express";
import rateLimit from "express-rate-limit";
import {
  enforceSameOrigin,
  requireAuth,
  requireMinRole,
} from "../middleware/adminAuth.js";
import {
  adminLogin,
  adminLogout,
  adminMe,
} from "../controllers/adminAuth.controller.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/adminPasswordReset.controller.js";
import { getSummary } from "../controllers/adminDashboard.controller.js";
import {
  addContactNote,
  bulkContacts,
  getContact,
  listContacts,
  setContactAssignee,
  setContactFollowUp,
  setContactPriority,
  setContactStatus,
  setContactTags,
} from "../controllers/adminContacts.controller.js";
import {
  addCareerNote,
  getCareer,
  listCareers,
  setCareerAssignee,
  setCareerFollowUp,
  setCareerPriority,
  setCareerStatus,
  setCareerTags,
} from "../controllers/adminCareers.controller.js";
import { listActivity } from "../controllers/adminActivity.controller.js";
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../controllers/adminNotifications.controller.js";
import {
  changeMyPassword,
  createUser,
  listAssignableUsers,
  listUsers,
  resetUserPassword,
  updateUser,
} from "../controllers/adminUsers.controller.js";
import {
  avatarUpload,
  avatarUploadError,
  removeMyAvatar,
  removeUserAvatar,
  serveAvatar,
  serveMyAvatar,
  uploadMyAvatar,
} from "../controllers/adminAvatar.controller.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: "RATE_LIMITED", message: "Too many login attempts, try again later" },
  },
});

// --- Auth (public sub-paths; login is strictly rate-limited) ---
router.post("/auth/login", loginLimiter, adminLogin);
router.post("/auth/logout", requireAuth, adminLogout);
router.get("/auth/me", requireAuth, adminMe);

/* Password recovery (public). Tight rate limit blocks token guessing
   and email flooding; same-origin check blocks CSRF-style abuse. */
const recoveryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: "RATE_LIMITED", message: "Too many attempts, please try again later" },
  },
});
router.post("/auth/forgot-password", recoveryLimiter, enforceSameOrigin, forgotPassword);
router.post("/auth/reset-password", recoveryLimiter, enforceSameOrigin, resetPassword);

// Everything below requires a session; mutations additionally pass
// through the same-origin check.
router.use(requireAuth);
const mutate = [enforceSameOrigin, requireMinRole("MANAGER")];

// --- Dashboard ---
router.get("/dashboard/summary", getSummary);

// --- Contacts ---
router.get("/contacts", listContacts);
router.get("/contacts/:id", getContact);
router.patch("/contacts/:id/status", ...mutate, setContactStatus);
router.patch("/contacts/:id/assignee", ...mutate, setContactAssignee);
router.patch("/contacts/:id/priority", ...mutate, setContactPriority);
router.patch("/contacts/:id/tags", ...mutate, setContactTags);
router.post("/contacts/:id/notes", ...mutate, addContactNote);
router.post("/contacts/:id/followup", ...mutate, setContactFollowUp);
router.post("/contacts/bulk", ...mutate, bulkContacts);

// --- Careers ---
router.get("/careers", listCareers);
router.get("/careers/:id", getCareer);
router.patch("/careers/:id/status", ...mutate, setCareerStatus);
router.patch("/careers/:id/assignee", ...mutate, setCareerAssignee);
router.patch("/careers/:id/priority", ...mutate, setCareerPriority);
router.patch("/careers/:id/tags", ...mutate, setCareerTags);
router.post("/careers/:id/notes", ...mutate, addCareerNote);
router.post("/careers/:id/followup", ...mutate, setCareerFollowUp);

// --- Activity (read-only audit feed; operational roles only) ---
router.get("/activity", requireMinRole("MANAGER"), listActivity);

// --- Notifications ---
router.get("/notifications", listNotifications);
router.post("/notifications/:id/read", markNotificationRead);
router.post("/notifications/read-all", markAllNotificationsRead);

// --- Avatars (any authenticated admin manages their OWN avatar;
//     viewing others' avatars is authenticated; SUPER_ADMIN may
//     remove another admin's avatar) ---
router.get("/avatar/:userId", serveAvatar);
router.get("/auth/me/avatar", serveMyAvatar);
router.post("/auth/me/avatar", enforceSameOrigin, avatarUpload, uploadMyAvatar);
router.delete("/auth/me/avatar", enforceSameOrigin, removeMyAvatar);
router.delete("/users/:id/avatar", requireMinRole("SUPER_ADMIN"), enforceSameOrigin, removeUserAvatar);
router.use(avatarUploadError);

// --- Users ---
// Assignee directory (lean) for operational dropdowns: MANAGER+.
// Full user administration list: SUPER_ADMIN only.
router.get("/users/assignable", requireMinRole("MANAGER"), listAssignableUsers);
router.get("/users", requireMinRole("SUPER_ADMIN"), listUsers);
router.post("/users", requireMinRole("SUPER_ADMIN"), createUser);
router.patch("/users/me/password", changeMyPassword);
router.patch("/users/:id", requireMinRole("SUPER_ADMIN"), updateUser);
router.post("/users/:id/reset-password", requireMinRole("SUPER_ADMIN"), resetUserPassword);

export default router;
