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
- Price is controlled by server-side `STRIPE_PRICE_ID`; no amount is accepted from the browser.
- Consultation offer mode defaults to `undecided`. Paid UI remains off until a business owner approves the offer and production build configuration enables checkout.
- Webhook verification remains the sole persistence/email trigger. Status lookup may query Stripe server-side and returns only normalized status.
- Email is sent after verified payment and tracked independently using a database claim/lease; delivery is at-least-once with provider idempotency where supported.

## Assumptions needing confirmation

- Business owner must decide whether consultations are free or paid, approve a Stripe Price, currency, duration, offer wording, and production domain.
- Owner must configure Stripe test/live keys, webhook endpoint secret, and Resend sender/recipient configuration outside source control.

## Risks and unresolved questions

- Current environment cannot reach `localhost:5000`; Docker Engine access is denied and the backend test environment has no `MONGO_URI`. Container logs and a live API request therefore remain unavailable.
- Webhook retry is Stripe-driven; no authenticated operator email-replay endpoint or scheduled retry worker currently exists. Failed delivery remains queryable in `stripe_payments` for operational recovery.
- No live Stripe or Resend credentials were inspected or used. No transaction was made.
