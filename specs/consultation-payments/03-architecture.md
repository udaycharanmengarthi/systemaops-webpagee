# Architecture

## Existing stack

React/Vite frontend (`systemaops-webpage`) calls relative `/api` paths. Vite dev server forwards `/api` to host `localhost:5000`; production Nginx forwards `/api/` to Compose service `backend:5000`. Express mounts consultation, payment, contact, career, and admin routes. MongoDB stores consultation and Stripe payment records. Existing Resend service handles admin/founder and transactional mail.

## Responsibilities

- `BookACall` and its components: presentation, translated UI, form interactions.
- `consultationService.js`: HTTP boundary for enquiry submission.
- `paymentService.js`: frontend adapter selection; Stripe browser action only calls this backend.
- `paymentStatusService.js`: retrieves a normalized result state, no provider SDK.
- consultation controller/model: server validation, enquiry persistence, privacy/retention.
- payment controller: HTTP validation, checkout lock/idempotency, consultation/session orchestration, webhook ownership and commercial verification, status response.
- `services/paymentProvider.js`: provider interface and current Stripe adapter. It owns SDK-facing calls for checkout creation (with idempotency options), session retrieval (with line items), and webhook verification.
- `services/payments.service.js`: payment row idempotency, webhook-event claim ledger, and email delivery state machine.
- Stripe payment model: one row/session, normalized payment state, verified Price/quantity, email attempt state.
- Webhook event model: one row/event id, processing lease, terminal disposition.
- Resend adapter: outbound email transport; provider failure does not undo paid state.

## Payment-provider boundary

`getPaymentProvider()` defaults to Stripe and rejects unsupported provider names. The interface exposes `createCheckoutSession(params, options)`, `retrieveCheckoutSession(sessionId, options)`, `expireCheckoutSession`, and `verifyWebhook(rawBody, signature, secret)`. A future Razorpay adapter must implement equivalent semantics and provider-specific signature verification. It is not configured or simulated.

## Integrity and failure behavior

Missing Stripe configuration yields `503` for payment endpoints; other APIs remain available. Checkout provider errors yield a safe `502`. Checkout requires an existing unpaid consultation and rejects all client-supplied commercial fields. A per-consultation lock, stored attempt nonce, Stripe idempotency key and verified open-session reuse prevent duplicate sessions across clicks, retries and restarts. Webhook verification failure yields `400`. A signature-valid event is still ignored unless it is app-owned, matches the configured Stripe mode, and its retrieved session matches the approved/commercial snapshot. Transient processing/email failures yield `500` to request provider retry. Status lookup uses a stored verified result first, then server-to-provider retrieval, and returns only a status enum. DB writes and email delivery are separate; successful payment state is not reversed by email failure.

## Deployment/API connection decision

Do not point browser code at a guessed backend URL. Keep same-origin `/api`. Development requires backend on host port 5000 (Compose override publishes loopback `127.0.0.1:5000`); production needs the configured reverse proxy. The static frontend container alone cannot proxy `/api`. The local Docker stack is healthy (proxy :3000, frontend :3002, backend `127.0.0.1:5000`, admin :3001); a post-change container rebuild/API smoke test is still pending.
