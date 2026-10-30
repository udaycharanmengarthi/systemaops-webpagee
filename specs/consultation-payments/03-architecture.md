# Architecture

## Existing stack

React/Vite frontend (`systemaops-webpage`) calls relative `/api` paths. Vite dev server forwards `/api` to host `localhost:5000`; production Nginx forwards `/api/` to Compose service `backend:5000`. Express mounts consultation, payment, contact, career, and admin routes. MongoDB stores consultation and Stripe payment records. Existing Resend service handles admin/founder and transactional mail.

## Responsibilities

- `BookACall` and its components: presentation, translated UI, form interactions.
- `consultationService.js`: HTTP boundary for enquiry submission.
- `paymentService.js`: frontend adapter selection; Stripe browser action only calls this backend.
- `paymentStatusService.js`: retrieves a normalized result state, no provider SDK.
- consultation controller/model: server validation, enquiry persistence, privacy/retention.
- payment controller: HTTP validation, consultation/session orchestration, webhook event policy, status response.
- `services/paymentProvider.js`: provider interface and current Stripe adapter. It owns SDK-facing calls for checkout creation, session retrieval, and webhook verification.
- `services/payments.service.js`: payment row idempotency and email delivery state machine.
- Stripe payment model: one row/session, normalized payment state, email attempt state.
- Resend adapter: outbound email transport; provider failure does not undo paid state.

## Payment-provider boundary

`getPaymentProvider()` defaults to Stripe and rejects unsupported provider names. The interface currently exposes `createCheckoutSession(params)`, `retrieveCheckoutSession(sessionId)`, and `verifyWebhook(rawBody, signature, secret)`. A future Razorpay adapter must implement equivalent semantics and provider-specific signature verification. It is not configured or simulated.

## Integrity and failure behavior

Missing Stripe configuration yields `503` for payment endpoints; other APIs remain available. Checkout provider errors yield a safe `502`. Webhook verification failure yields `400`; transient processing/email failures yield `500` to request provider retry. Status lookup uses a stored verified result first, then server-to-provider retrieval, and returns only a status enum. DB writes and email delivery are separate; successful payment state is not reversed by email failure.

## Deployment/API connection decision

Do not point browser code at a guessed backend URL. Keep same-origin `/api`. Development requires backend on host port 5000 (Compose override publishes loopback `127.0.0.1:5000`); production needs the configured reverse proxy. The static frontend container alone cannot proxy `/api`. Current local API check timed out, Docker Engine returned access denied, and backend tests reported missing `MONGO_URI`; therefore no claim is made that the live listener is healthy.
