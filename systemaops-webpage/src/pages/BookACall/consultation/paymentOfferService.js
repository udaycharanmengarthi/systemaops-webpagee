const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || "").replace(/\/+$/, "");

export async function fetchPaymentOffer({ signal } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/payments/offer`, {
      headers: { Accept: "application/json" },
      signal,
    });
  } catch {
    throw new Error("payments.errorNetwork");
  }

  const body = await response.json().catch(() => null);
  if (response.status === 503) throw new Error("payments.notConfigured");
  if (!response.ok || body?.success !== true) {
    throw new Error("payments.errorGeneric");
  }

  const amountMinor = body.price?.amountMinor;
  const currency = body.price?.currency;
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0 || typeof currency !== "string") {
    throw new Error("payments.errorGeneric");
  }
  return { amountMinor, currency: currency.toUpperCase() };
}
