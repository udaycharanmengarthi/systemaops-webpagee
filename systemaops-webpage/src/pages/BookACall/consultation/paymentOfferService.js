const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || "").replace(/\/+$/, "");

const CURRENCY_RE = /^[A-Za-z]{3}$/;
const MAX_FORMATTED_LENGTH = 64;

/**
 * Validate the public offer shape without inventing a fallback.
 * The backend is the only pricing authority; this function only rejects a
 * malformed response so the UI cannot render an incomplete amount.
 */
export function parsePaymentOffer(body) {
  if (!body || body.success !== true || !body.offer) {
    throw new Error("payments.offerInvalid");
  }

  const { amountMinor, currency, formattedAmount, quantity } = body.offer;

  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) {
    throw new Error("payments.offerInvalid");
  }
  if (typeof currency !== "string" || !CURRENCY_RE.test(currency.trim())) {
    throw new Error("payments.offerInvalid");
  }
  if (quantity !== 1) {
    throw new Error("payments.offerInvalid");
  }
  if (
    typeof formattedAmount !== "string" ||
    !formattedAmount.trim() ||
    formattedAmount.length > MAX_FORMATTED_LENGTH
  ) {
    throw new Error("payments.offerInvalid");
  }

  return {
    amountMinor,
    currency: currency.trim().toLowerCase(),
    formattedAmount: formattedAmount.trim(),
    quantity: 1,
  };
}

export async function fetchPaymentOffer({ signal } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/payments/offer`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal,
    });
  } catch {
    throw new Error("payments.errorNetwork");
  }

  const body = await response.json().catch(() => null);
  if (response.status === 503) throw new Error("payments.notConfigured");
  if (!response.ok || body?.success !== true) {
    throw new Error(
      response.status === 502
        ? "payments.offerUnavailable"
        : "payments.errorGeneric"
    );
  }

  return parsePaymentOffer(body);
}
