import { api, del, upload } from "./client.js";

export const dashboardApi = {
  summary: () => api.get("/api/admin/dashboard/summary").then((r) => r.data),
};

function resource(base) {
  return {
    list: (params) => api.get(base, params),
    get: (id) => api.get(`${base}/${id}`).then((r) => r.data),
    setStatus: (id, status) => api.patch(`${base}/${id}/status`, { status }),
    setAssignee: (id, assigneeId) => api.patch(`${base}/${id}/assignee`, { assigneeId }),
    setPriority: (id, priority) => api.patch(`${base}/${id}/priority`, { priority }),
    setTags: (id, tags) => api.patch(`${base}/${id}/tags`, { tags }),
    addNote: (id, noteBody) => api.post(`${base}/${id}/notes`, { body: noteBody }),
    setFollowUp: (id, followUp) => api.post(`${base}/${id}/followup`, followUp),
  };
}

export const contactsApi = {
  ...resource("/api/admin/contacts"),
  bulk: (payload) => api.post("/api/admin/contacts/bulk", payload),
};

export const careersApi = resource("/api/admin/careers");

export const activityApi = {
  list: (params) => api.get("/api/admin/activity", params),
};

export const notificationsApi = {
  list: (params) => api.get("/api/admin/notifications", params),
  markRead: (id) => api.post(`/api/admin/notifications/${id}/read`),
  markAllRead: () => api.post("/api/admin/notifications/read-all"),
};

export const usersApi = {
  list: (params) => api.get("/api/admin/users", params),
  assignable: () => api.get("/api/admin/users/assignable"),
  create: (payload) => api.post("/api/admin/users", payload),
  update: (id, payload) => api.patch(`/api/admin/users/${id}`, payload),
  resetPassword: (id, password) =>
    api.post(`/api/admin/users/${id}/reset-password`, { password }),
  changeMyPassword: (currentPassword, newPassword) =>
    api.patch("/api/admin/users/me/password", { currentPassword, newPassword }),
  uploadAvatar: (formData) => upload("/api/admin/auth/me/avatar", formData),
  removeAvatar: () => del("/api/admin/auth/me/avatar"),
  removeUserAvatar: (id) => del(`/api/admin/users/${id}/avatar`),
};
