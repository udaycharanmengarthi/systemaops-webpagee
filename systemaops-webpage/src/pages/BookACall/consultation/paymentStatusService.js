const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || "").replace(/\/+$/, "");

const SESSION_ID_PATTERN = /^cs_(?:(?:test|live)_)?[A-Za-z0-9_-]+$/;

export async function fetchPaymentStatus(sessionId, { signal } = {}) {
  if (typeof sessionId !== "string" || !SESSION_ID_PATTERN.test(sessionId)) {
    throw new Error("invalid_checkout_reference");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/payments/session/${encodeURIComponent(sessionId)}`,
    { method: "GET", headers: { Accept: "application/json" }, signal }
  );
  const body = await response.json().catch(() => null);
  if (!response.ok || body?.success !== true) throw new Error("payment_status_unavailable");
  if (!["paid", "pending", "failed", "expired"].includes(body.status)) {
    throw new Error("payment_status_unavailable");
  }
  return body.status;
}
