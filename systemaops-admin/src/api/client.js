// Centralized API client. Cookie session (HTTP-only sysops_admin) is
// sent on every request via credentials:"include". No tokens ever touch
// JS storage. Backend envelope: {success,data,meta} or {success:false,
// error:{code,message}}.

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

let unauthorizedHandler = null;
export function onUnauthorized(handler) {
  unauthorizedHandler = handler;
}

function errorMessage(status, payload) {
  if (payload && payload.error && payload.error.message) {
    return payload.error.message;
  }
  if (status === 401) return "Your session has expired. Please log in again.";
  if (status === 403) return "You do not have permission to perform this action.";
  if (status === 429) return "Too many requests. Please try again shortly.";
  if (status === 404) return "Record not found.";
  return "Something went wrong. Please try again.";
}

export async function request(path, { method = "GET", body, params } = {}) {
  let url = path;
  if (params) {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === "") continue;
      qs.set(key, String(value));
    }
    const query = qs.toString();
    if (query) url += `?${query}`;
  }
  let response;
  try {
    response = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Unable to reach the server. Check your connection and retry.");
  }
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  if (!response.ok) {
    const code = (payload && payload.error && payload.error.code) || "REQUEST_FAILED";
    if (response.status === 401 && unauthorizedHandler) {
      try {
        unauthorizedHandler();
      } catch {
        /* never break error propagation */
      }
    }
    throw new ApiError(response.status, code, errorMessage(response.status, payload));
  }
  return payload && payload.success ? { data: payload.data, meta: payload.meta } : { data: null };
}

export const api = {
  get: (path, params) => request(path, { params }),
  post: (path, body) => request(path, { method: "POST", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
};

/* Multipart upload (avatar). Cookie auth via credentials:"include".
   The server validates type/size — the client never trusts itself. */
export async function upload(path, formData) {
  let response;
  try {
    response = await fetch(path, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Unable to reach the server. Check your connection and retry.");
  }
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  if (!response.ok) {
    if (response.status === 401 && unauthorizedHandler) {
      try {
        unauthorizedHandler();
      } catch {
        /* never break error propagation */
      }
    }
    throw new ApiError(response.status, (payload && payload.error && payload.error.code) || "REQUEST_FAILED", errorMessage(response.status, payload));
  }
  return payload && payload.success ? { data: payload.data } : { data: null };
}

export async function del(path) {
  return request(path, { method: "DELETE" });
}
