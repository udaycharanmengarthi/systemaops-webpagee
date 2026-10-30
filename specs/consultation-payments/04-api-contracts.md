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

- Request: `{name?:string,email?:string,consultationId?:string}`. Name/email are Checkout prefill only. Amount, currency, Price ID, callback URLs, and metadata are server-owned.
- Validation: optional consultation id must be a 24-hex ObjectId referencing an eligible unpaid consultation.
- `200`: `{url:string}`. Open linked session is reused where available.
- `400/404/409`: invalid, missing, or already-paid consultation. `503`: missing provider configuration. `502`: provider failure. `429`: rate limit.
- Side effects: creates hosted Checkout Session and stores session id/pending state when linked.
- Idempotency: reuses an open session per linked enquiry; there is no explicit Stripe idempotency key.

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
- Handles `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `checkout.session.async_payment_failed`; unknown valid event types are acknowledged and ignored.
- `200` after safe processing; `400` invalid/missing signature; `503` configuration missing; `500` transient persistence/email processing failure (provider retry).
- Side effects: verified events update payment record; paid events sync consultation and attempt one confirmation email.
- Idempotency: unique session id and conditional email claim/lease; duplicate event delivery is safe.
