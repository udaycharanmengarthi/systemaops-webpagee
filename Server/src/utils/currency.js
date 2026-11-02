/* Server/src/utils/currency.js
 *
 * Currency-aware formatting for Stripe minor-unit amounts.
 *
 * Stripe reports `unit_amount` / `amount_total` in the currency's minor
 * unit, but the exponent is not always 2: JPY has 0, KWD/BHD/JOD have 3.
 * Dividing by 100 is therefore wrong. Intl resolves the exponent for the
 * currency, so the same formatter works for every Stripe currency.
 *
 * Output uses the ISO currency code (for example "USD 10.00") so a symbol
 * can never be mistaken for a different currency. This is display-only;
 * payment arithmetic always stays in integer minor units.
 */

const CURRENCY_RE = /^[A-Za-z]{3}$/;
const formatters = new Map();

/* Intl accepts any well-formed three-letter code (including "ABC"), so a
   format attempt alone is not a validity check. supportedValuesOf lists the
   actual ISO 4217 currencies known to this ICU build. */
const KNOWN_CURRENCIES = (() => {
  try {
    return new Set(
      Intl.supportedValuesOf("currency").map((code) => code.toUpperCase())
    );
  } catch {
    return null;
  }
})();

export const normalizeCurrency = (value) => {
  if (typeof value !== "string") return null;
  const currency = value.trim().toUpperCase();
  return CURRENCY_RE.test(currency) ? currency : null;
};

const isKnownCurrencyCode = (normalized) =>
  Boolean(normalized) &&
  (!KNOWN_CURRENCIES || KNOWN_CURRENCIES.has(normalized));

export const getCurrencyFormatter = (currency) => {
  const normalized = normalizeCurrency(currency);
  if (!isKnownCurrencyCode(normalized)) {
    throw new TypeError("Invalid ISO currency code");
  }

  if (!formatters.has(normalized)) {
    formatters.set(
      normalized,
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: normalized,
        currencyDisplay: "code",
      })
    );
  }

  return formatters.get(normalized);
};

export const getCurrencyFractionDigits = (currency) => {
  const digits = getCurrencyFormatter(currency).resolvedOptions()
    .maximumFractionDigits;
  if (!Number.isInteger(digits) || digits < 0 || digits > 4) {
    throw new RangeError("Unsupported currency exponent");
  }
  return digits;
};

/**
 * Format a Stripe minor-unit amount for display.
 * Returns null for a non-integer or negative amount; validation elsewhere
 * rejects those, so null is only a defensive guard.
 */
export const formatMinorUnits = (amountMinor, currency) => {
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0) return null;
  try {
    const digits = getCurrencyFractionDigits(currency);
    return getCurrencyFormatter(currency)
      .format(amountMinor / 10 ** digits)
      .replace(/\u00A0/g, " ");
  } catch {
    return null;
  }
};

export const isSupportedCurrency = (currency) =>
  isKnownCurrencyCode(normalizeCurrency(currency));

export { CURRENCY_RE };
