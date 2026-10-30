# UI/UX Specification

## Page hierarchy and layout

The existing shared navbar/footer/theme/language system remains. `/book-a-call` uses a compact consultation heading, concise intro, area-of-interest chooser, form, and a small offer/summary panel. Desktop may use form + summary columns; mobile is a single column. Reuse SystemaOps typography, teal actions, theme tokens, and existing page spacing.

## Form order and behavior

1. Name (required, max 120)
2. Business email (required, max 254)
3. Company (optional, max 160)
4. Area of interest (required, only configured service slugs)
5. Brief message (required, max 1200 frontend / 4000 server; frontend limit is intentionally stricter)
6. Privacy acknowledgement (required)

Use real labels, keyboard-operable area selection, inline validation on blur/submit, `aria-invalid` and descriptions, focused error summary, character count, pending submit state, and preserve user input after errors. Review stage precedes any configured payment step.

## Offer/payment states

- Current default: `undecided`; no price/duration/payment promise is shown.
- `free`: payment UI is absent.
- `paid`: the production build starts the Stripe flow after the consultation is saved. The page loads the active server-side one-time Price and displays its amount/currency; Stripe configuration errors remain visible and retryable. An explicit `VITE_ENABLE_STRIPE_CHECKOUT=false` can disable paid checkout.
- Result: pending/checking, verified paid, failed, expired, verification unavailable, or invalid/missing reference. A browser redirect never claims success. Retry status is safe and does not change payment state. If Stripe configuration or provider calls fail after the enquiry is stored, retain the payment step and data, display an actionable error, and allow retry rather than showing enquiry-only success.
- Cancel route reports cancellation; it does not assert an appointment or mutate payment records.

## Accessibility, responsive, and theming

All text is localized in English, Dutch, and German. Maintain visible focus, semantic headings/labels, status announcements, reduced motion, theme token compatibility, and no horizontal overflow. Verify 360, 390, 768, 1024, and 1440px when browser tooling is available. No visual browser is available in the current environment; this check is pending.
