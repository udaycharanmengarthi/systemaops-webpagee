import { api } from "./client.js";

export const authApi = {
  login: (email, password) =>
    api.post("/api/admin/auth/login", { email, password }).then((r) => r.data),
  logout: () => api.post("/api/admin/auth/logout").then((r) => r.data),
  me: () => api.get("/api/admin/auth/me").then((r) => r.data),
  forgotPassword: (email) =>
    api.post("/api/admin/auth/forgot-password", { email }).then((r) => r.data),
  resetPassword: ({ token, email, password }) =>
    api.post("/api/admin/auth/reset-password", { token, email, password }).then((r) => r.data),
};
