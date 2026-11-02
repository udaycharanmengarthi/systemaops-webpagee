/* Server/src/scripts/check-payments.js
 *
 * Operator preflight for the consultation payment integration.
 *
 * Read-only: retrieves the configured Stripe Price and validates that it is
 * a fixed one-time Price in the configured Stripe mode. The Price's own
 * amount and currency are the source of truth; this script never compares
 * them to a hardcoded offer. It never creates a Checkout Session, never
 * charges anything, and never prints a secret key or webhook secret.
 *
 * Usage (from Server/):
 *   npm run payments:check              test mode, or live with explicit opt-in
 *   npm run payments:check -- --allow-live
 *
 * Exit codes:
 *   0 = configuration and Price are valid
 *   1 = configuration/Price is invalid
 *   2 = not configured, or live mode refused without --allow-live
 */

import dotenv from "dotenv";
dotenv.config();

import {
  getPaymentsConfig,
  getPriceValidationIssues,
  getStripeClient,
  offerFromPrice,
} from "../config/payments.js";
import { formatMinorUnits } from "../utils/currency.js";

const OUTPUT_SCOPE = "payments:check";

const print = (payload) => {
  console.log(JSON.stringify({ scope: OUTPUT_SCOPE, ...payload }, null, 2));
};

const fail = (payload, code) => {
  print({ ok: false, ...payload });
  process.exit(code);
};

const allowLive = process.argv.includes("--allow-live");
const config = getPaymentsConfig();

print({
  ok: null,
  configured: config.configured,
  mode: config.mode || "unconfigured",
  missing: config.missing,
});

if (!config.configured) {
  fail(
    {
      reason: "not_configured",
      detail: `Missing or invalid: ${config.missing.join(", ")}`,
    },
    2
  );
}

if (config.live && !allowLive) {
  fail(
    {
      reason: "live_mode_requires_opt_in",
      detail: "Re-run with --allow-live to validate the live Price.",
    },
    2
  );
}

try {
  const price = await getStripeClient().prices.retrieve(config.priceId);
  const issues = getPriceValidationIssues(price, {
    priceId: config.priceId,
    live: config.live,
  });
  const offer =
    issues.length === 0 ? offerFromPrice(price) : null;
  const formattedAmount = offer
    ? formatMinorUnits(offer.amountMinor, offer.currency)
    : null;

  if (offer && !formattedAmount) issues.push("price_currency_unsupported");

  print({
    ok: issues.length === 0,
    mode: config.mode,
    price: {
      active: price.active === true,
      livemode: price.livemode === true,
      type: price.type,
      currency: price.currency,
      unitAmount: price.unit_amount,
      formattedAmount,
      recurring: Boolean(price.recurring),
    },
    issues,
  });

  process.exit(issues.length === 0 ? 0 : 1);
} catch (error) {
  fail(
    {
      reason: "stripe_price_retrieval_failed",
      errorType: error?.type || error?.name || "unknown",
      errorCode: error?.code || "",
      requestId: error?.requestId || error?.raw?.requestId || "",
      statusCode: error?.statusCode || error?.raw?.statusCode || "",
    },
    1
  );
}
