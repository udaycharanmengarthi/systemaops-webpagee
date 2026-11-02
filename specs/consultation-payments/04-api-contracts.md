# API Contracts

All paths are relative to the same origin. Public JSON endpoints are rate-limited. No authentication is used for public enquiry creation. Session status requires an unguessable Stripe Checkout Session ID and returns no customer fields.

## `POST /api/consultations`

- Request: `{name:string, email:string, company?:string, areaOfInterest:string, message:string, privacyAccepted:true, privacyVersion?:string}`. Extra price/payment fields are ignored/not stored.
- Validation: required name/email/area/message; valid email; area in `AREAS_OF_INTEREST`; privacy consent true; field lengths bounded.
- `201`: `{success:true,message:string,data:{id:string}}`.
- `400`: `{success:false,message:string}`; `429`: safe rate-limit response; `500`: generic failure.
- Side effects: creates consultation, sets retention/privacy timestamps, attempts activity/admin/founder notification.
- Idempotency: no request idempotency key currently; repeated submissions create separate enquiries.

## `POST /api/payments/create-checkout-session`

- Request: `{name?:string,email?:string,consultationId:string}`. Name/email are Checkout prefill only. Amount, currency, Price ID, quantity, callback URLs, and metadata are server-owned.
- Validation: `consultationId` is **required**; it must be a 24-hex ObjectId referencing an existing consultation that is not already paid. Client-supplied `price`, `priceId`, `amount`, `amountMinor`, `currency`, `quantity`, `line_items` or `unit_amount` are rejected before Stripe is called.
- `200`: `{url:string}`. An existing open linked session is reused only after re-verifying its amount/currency/Price/quantity against the configured Price.
- `400/404/409`: malformed, missing, unknown, already-paid, or commercially mismatched session; `409` while another checkout attempt holds the lock. `503`: missing provider configuration. `502`: provider failure. `429`: rate limit.
- Side effects: creates one hosted Checkout Session with exactly one line item (`price: STRIPE_PRICE_ID`, `quantity: 1`) and stores its id, pending state, and a verified commercial snapshot on the consultation.
- Idempotency: per-consultation database lock (30 s), stored attempt nonce, Stripe idempotency key `consultation-<consultationId>-<nonce>`, and open-session reuse. Repeated clicks and restarts cannot create a second session for the same attempt.

## `GET /api/payments/session/:sessionId`

- Request: session id matching `cs_`, `cs_test_`, or `cs_live_` format. No request body.
- Response `200`: `{success:true,status:"paid"|"pending"|"failed"|"expired"}`. First reads normalized verified DB state; otherwise retrieves session from configured provider. Response has `Cache-Control: no-store`.
- Errors: `400` invalid format; `404` unknown provider session; `503` unconfigured; `502` provider unavailable; `429` rate limited.
- Authorization: possession of the session ID; no PII/payment details returned. Session id is treated as a capability.
- Side effects: none; this endpoint does not persist paid state or send email.

## `GET /api/payments/offer`

- No request body. Server retrieves the configured Stripe Price using the backend secret.
- `200`: `{success:true,price:{amountMinor:number,currency:string}}` only when the price is active, one-time, and has a positive fixed amount.
- Errors: `503` missing/invalid Stripe config or unsupported price; `502` provider retrieval failure; `429` rate limited.
- Side effects: none. This lets the UI display the exact same server-side Price used by Checkout.

## `POST /api/payments/webhook`

- Raw `application/json` request body with `Stripe-Signature` header. Stripe provider verifies signature using `STRIPE_WEBHOOK_SECRET`.
- Handles `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, and `checkout.session.expired`; unknown valid event types are acknowledged and ignored.
- Isolation: events whose `livemode` differs from the configured secret-key mode are ignored before any write. Events are processed only when `metadata.consultation_id` references an existing consultation whose stored `stripeSessionId` matches the event session.
- Commercial verification: retrieved Stripe session (with line items) must match the stored snapshot and configured Price — amount, currency, Price ID, quantity, and payment status. Mismatches are logged and ignored, never recorded as paid.
- `200` after safe processing or deliberate ignore; `400` invalid/missing signature; `503` configuration missing; `500` transient persistence/email processing failure (provider retry).
- Side effects: verified, app-owned events update payment/consultation state; paid events attempt one confirmation email. No webhook creates a Checkout Session or records a payment for an unrelated Stripe object.
- Idempotency: unique event id in `stripe_webhook_events` claimed with a processing lease, unique session id, conditional email claim/lease, and Resend idempotency key. Duplicate and concurrent deliveries produce one state change and one email.
