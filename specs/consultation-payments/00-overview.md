# Consultation and Payment Platform — Overview

## Business problem and objective

The website needs a reliable way to capture consultation enquiries and, only when the business offer is approved, accept payment through hosted checkout. A browser redirect must not be confused with a confirmed payment.

## Scope

- `/book-a-call` consultation form, server validation, persistence, privacy acknowledgement, notification, and translated result states.
- Stripe-hosted Checkout using a server-owned Stripe Price ID; signed webhook processing; normalized payment state; confirmation email after payment verification.
- Status lookup for a returned Checkout Session, without exposing customer data.
- Local/deployment API connectivity, safe configuration, tests, and operational documentation.

## Non-goals

- Setting a fee, currency, meeting duration, appointment guarantee, or paid/free business policy without owner approval.
- Live transactions, payment capture outside Stripe Checkout, or implementing Razorpay.
- Replacing the existing contact form, CRM/admin, mail provider, navbar, or unrelated site sections.

## Existing system context

The repository is a React/Vite public website, Express 5 backend, MongoDB/Mongoose, Resend mail service, and Docker Compose stack behind Nginx. `/api/consultations` stores a separate consultation record (no fake phone number), and payment records use `stripe_payments`. The form sends relative `/api/...` URLs; Vite proxies these to `http://localhost:5000`; Nginx proxies `/api/` to backend service `backend:5000`. The production frontend image serves a static Vite build and does not itself proxy API traffic.

## Dependencies and decisions

- Stripe Checkout Sessions and signed webhooks are the only implemented payment provider.
- `PAYMENT_PROVIDER` defaults to `stripe`; unsupported providers fail closed. A small provider interface isolates SDK calls.
- Price is controlled by server-side `STRIPE_PRICE_ID`; no amount, currency, quantity or Price ID is accepted from the browser. The configured Price is the configured Stripe Price.
- Consultation offer mode is `paid` in production; only an explicit development build can select enquiry-only mode. Live payments remain disabled until the owner approves the live Price, live webhook secret, and production domain.
- Webhook verification remains the sole persistence/email trigger, and only for an app-owned Checkout Session whose retrieved terms match the configured Price. Status lookup may query Stripe server-side and returns only normalized status.
- Email is sent after verified payment and tracked independently using a database claim/lease; delivery is at-least-once with provider idempotency where supported.
- Checkout creation is serialized per consultation with a database lock, attempt nonce and Stripe idempotency key; repeat clicks and restarts reuse the verified open session instead of creating another.
- Webhook event ids are claimed in a unique ledger with a processing lease, so duplicate/concurrent delivery has one effect. Test-mode events are isolated from live mode via `livemode`.

## Assumptions needing confirmation

- Business owner must approve the live Stripe Price, currency, duration, offer wording, and production domain. The test-mode the configured Price offer is already configured and validated.
- Owner must configure Stripe test/live keys, webhook endpoint secret, and Resend sender/recipient configuration outside source control.

## Risks and unresolved questions

- A real Stripe test-mode end-to-end payment has not been run; the webhook secret's validity against the active endpoint is unproven.
- Webhook retry is Stripe-driven; no authenticated operator email-replay endpoint or scheduled retry worker currently exists. Failed delivery remains queryable in `stripe_payments` for operational recovery.
- No live Stripe or Resend credentials were inspected or used. No transaction was made.
