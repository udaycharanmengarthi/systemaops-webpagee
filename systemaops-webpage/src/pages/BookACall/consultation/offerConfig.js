/* ================================================================
   CONSULTATION OFFER CONFIGURATION
   ------------------------------------------------------------
   Single typed source of truth for WHAT the consultation offer is.

   The consultation uses Stripe Checkout when enabled. The price and
   currency always come from the server's configured Stripe Price. Nothing
   in this file (or anywhere in the UI) invents them.

   mode:
     'undecided' — explicit enquiry-only deployment.
     'free'       — a free introductory call. No payment UI at all.
     'paid'       — a paid consultation. The price shown MUST come from
                   configuration, never from a component literal.

   `priceLabel` / `currency` are intentionally null in this module. The
   page fills them from the same server-side Stripe Price that is charged,
   so display and charge cannot diverge. Never hardcode them in a component.
   ================================================================ */

export const OFFER_MODES = /** @type {const} */ ([
  "undecided",
  "free",
  "paid",
]);

/* Production always follows the paid Checkout path. Only a development
   build may explicitly select enquiry-only mode for local QA. This avoids
   a production build silently confirming an enquiry when Stripe is unset. */
export const OFFER_MODE =
  import.meta.env.DEV === true &&
  import.meta.env?.VITE_ENABLE_STRIPE_CHECKOUT === "false"
    ? OFFER_MODES[0]
    : "paid";

/* ================================================================
   MOCK JOURNEY GATE — must stay a MODULE-SCOPE CONSTANT.
   The real Stripe adapter is the DEFAULT in every build. The in-memory
   demo is opt-in only in development, so a missing environment file can
   never silently skip Stripe Checkout again.
   `import.meta.env.DEV` is statically replaced with `false` in a
   production bundle, so `false && …` constant-folds, MOCK_ENABLED
   becomes a literal `false`, and every branch guarded by it (including
   the whole mock adapter) is dead-code-eliminated by the bundler.
   Keeping this inside a function would defeat that folding.
   ================================================================ */
export const MOCK_ENABLED =
  import.meta.env.DEV === true &&
  import.meta.env?.VITE_ENABLE_MOCK_PAYMENT === "true" &&
  import.meta.env?.VITE_ENABLE_STRIPE_CHECKOUT !== "true";

/** Is a development-only mock payment journey available in this build? */
export const isMockJourneyEnabled = () => MOCK_ENABLED;

/**
 * Build-time override for QA.
 *
 * Only honoured in a development build AND only when the operator opts
 * in with VITE_ENABLE_DEV_OFFER_MODE.
 */
const DEV_MODE = import.meta.env.DEV === true
  ? String(import.meta.env?.VITE_ENABLE_DEV_OFFER_MODE || "").toLowerCase()
  : "";

const devMode = OFFER_MODES.includes(DEV_MODE) ? DEV_MODE : null;

/**
 * The effective offer for this build.
 * `isDevScenario` is true only when a developer explicitly switched it.
 */
export const consultationOffer = {
  mode: devMode || OFFER_MODE,

  /* Only meaningful when mode === 'paid'. Populated from backend offer data. */
  priceLabel: null,
  currency: null,

  /* Everything user-visible is a translation key, never a literal. */
  durationKey: "consultation.offer.duration",
  deliverableKey: "consultation.offer.deliverable",

  /* Free mode never executes a payment code path. */
  get isPaid() {
    return this.mode === "paid";
  },
  get isFree() {
    return this.mode === "free";
  },
  get isUndecided() {
    return this.mode === "undecided";
  },

  /* True only for an explicitly switched development scenario. */
  isDevScenario: Boolean(devMode),
  devMode,
};
