# Stripe Checkout setup and verification

This document describes the real end-to-end consultation payment flow in
this repository. It is intentionally limited to test mode until the founder
explicitly approves going live.

## What the code actually does

```
/book-a-call form
  -> POST /api/consultations                      (Express, Server/)
  -> POST /api/payments/create-checkout-session   (Express, Server/)
  -> { url: "https://checkout.stripe.com/..." }
  -> window.location.assign(url)
  -> Stripe-hosted Checkout (test mode)
       -> success: /payment/success?session_id=cs_...
       -> cancel:  /payment/cancel?consultation_id=<enquiry id>
  -> POST /api/payments/webhook (raw body, signature verified)
       -> stripe_payments row
       -> consultations.paymentStatus = paid
       -> one confirmation email
```

The browser redirect is **not** proof of payment. Only the signature-verified
webhook may mark a consultation paid or trigger the confirmation email. The
success page asks `GET /api/payments/session/:sessionId` for the normalized
state, which reads the stored verified state or retrieves the session from
Stripe when the webhook has not arrived yet.

## Environment variables (no values are stored in Git)

### Backend (Express, `Server/`)

Required for every payment endpoint. The backend deliberately answers `503`
when any of these are missing, empty, still contain a placeholder
(`REPLACE_ME`, `CHANGE_ME`, ...), or have the wrong prefix.

| Variable | Required value shape | Purpose |
| --- | --- | --- |
| `PAYMENT_PROVIDER` | `stripe` (default) | Selects the provider adapter. |
| `STRIPE_SECRET_KEY` | `sk_test_...` in test mode | Server-side Stripe API key. Never send to the browser. |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Verifies the raw webhook body. |
| `STRIPE_PRICE_ID` | `price_...` | The only source of amount/currency. |
| `FRONTEND_URL` | `http://localhost:5173` for host dev; `http://localhost:3000` for local Docker (the local override defaults it) | Builds success/cancel URLs. |

Which file is loaded:

- **Host-side development** (`npm run dev` / `npm start` inside `Server/`):
  `Server/.env`.
- **Docker Compose backend**: the repository-root `.env` (see
  `docker-compose.yml` -> `backend.env_file: .env`).
- Docker-internal `MONGO_URI`, `PORT`, `TRUST_PROXY`, and `DATA_DIR` are set
  directly in `docker-compose.yml` and do not belong in `.env`.

The backend starts normally if Stripe is not configured; only
`/api/payments/*` answers `503`. Do not put `sk_`, `whsec_`, or a real
`price_` value in any frontend file.

### Frontend (Vite, `systemaops-webpage/`)

Vite loads only environment files inside `systemaops-webpage/` (for example
`.env`, `.env.local`). The repository-root `.env` is **not** read by the Vite
dev server. A template is provided at `systemaops-webpage/.env.example`.

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | empty | Empty means same-origin `/api` (Vite dev proxy and the production reverse proxy both serve it). |
| `VITE_ENABLE_MOCK_PAYMENT` | unset/false | Development-only in-memory demo. Real Stripe is the default; set this to `true` only when you explicitly want the demo. |
| `VITE_ENABLE_STRIPE_CHECKOUT` | unset | In a development build only, `false` explicitly selects enquiry-only mode (no payment step). Production always uses the paid Stripe path. |

A hosted Checkout redirect does **not** need a Stripe publishable key. This
project does not load Stripe.js. A `pk_test_...` value is public by design,
but it is not what enables checkout and should not be confused with the
server-side secret.

### Docker Compose

- Put backend payment values in the repository-root `.env`.
- Rebuild the frontend after changing `VITE_*` flags because they are compiled
  into the static assets:
  `docker compose up -d --build`.
- `docker-compose.override.yml` publishes the backend on
  `127.0.0.1:5000` for host-side Vite development.
- It also makes `http://localhost:3000` the bundled proxy (frontend +
  `/api` + `/admin`). The static frontend preview moves to
  `http://localhost:3002` because `serve -s` cannot proxy `/api`.
  An explicit `FRONTEND_URL` in the root `.env` wins; otherwise the local
  default is `http://localhost:3000`.
- The bundled proxy serves `/api/*` to `backend:5000` and everything else to
  the frontend. It preserves the raw webhook body (no body rewriting).

## Stripe test-mode checklist (Dashboard access required)

These steps need an authorized Stripe Dashboard user. The code cannot verify
that the account owns a Price or that the Dashboard webhook exists.

1. Switch the Stripe Dashboard to **Test mode**.
2. Create (or select) a Product and an **active one-time Price**. Copy its
   `price_...` ID. The amount and currency are defined in Stripe, not in code.
3. Copy the test **secret** key (`sk_test_...`) from Developers -> API keys.
4. Create a webhook endpoint (or use the Stripe CLI locally) and copy its
   signing secret (`whsec_...`).
5. Put those values in the correct file for the way you run the app (see the
   table above). Do not paste them into chat, docs, source, or Git.
6. Restart the backend after changing environment values.
7. Confirm the key is test mode: the prefix must be `sk_test_`, and the Price
   must be visible in the same test-mode account.
8. Pay with Stripe's official test card `4242 4242 4242 4242`, any future
   expiry date, any CVC, and any postal code accepted by the form.
9. Confirm a `stripe_payments` row appears, the linked consultation becomes
   `paid`, and exactly one confirmation email is delivered.
10. Cancel from Checkout and confirm no charge, no `paid` row, and that the
    cancel page can retry the same consultation.
11. Decline with `4000 0000 0000 0002` and confirm no `paid` state and no
    confirmation email.

Never use a live key (`sk_live_...`, `whsec_...` for a live endpoint, or a
live Price) during local development.

## Local run commands

### Option A - host-side development

```powershell
# Terminal 1: backend (loads Server/.env)
cd Server
npm install
npm run dev

# Terminal 2: frontend (loads systemaops-webpage/.env*)
cd systemaops-webpage
npm install
npm run dev
```

Open `http://localhost:5173/book-a-call`. The Vite proxy forwards `/api` to
`http://localhost:5000`.

### Option B - Docker Compose

```powershell
docker compose up -d --build
```

Open `http://localhost:3000/book-a-call` (the local proxy) or
`http://localhost/book-a-call` (the same proxy on port 80). Do not use
`http://localhost:3002` for the form: that is the static preview and has no
API. Success/cancel URLs are built from `FRONTEND_URL`; the local override
defaults it to `http://localhost:3000` when the root `.env` does not set it.

## Webhook setup

### Local Stripe CLI

```powershell
stripe listen --forward-to localhost:5000/api/payments/webhook
```

Copy the `whsec_...` printed by the CLI into `Server/.env` as
`STRIPE_WEBHOOK_SECRET`, then restart the backend. For the Docker stack, point
the CLI at the proxy instead:

```powershell
stripe listen --forward-to localhost/api/payments/webhook
```

Enable these events in the Dashboard or let the CLI forward all events:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`

The webhook route is mounted before `express.json()` and uses
`express.raw({ type: "application/json" })`; never move it after the global
JSON parser or signature verification will fail.

### Production

- Endpoint: `https://<your-domain>/api/payments/webhook`
- Subscribe to the three events above.
- Store the endpoint's own signing secret in the production backend
  environment.
- The webhook is intentionally not rate limited.
- Duplicate deliveries are idempotent: the unique Checkout Session ID plus a
  database email-claim/lease sends one confirmation email.

## Browser test sequence

1. Open `/book-a-call`.
2. Fill in name, email, area, and message; accept the privacy checkbox.
3. Submit. Expected network sequence:
   - `POST /api/consultations` -> `201 { success: true, data: { id } }`
   - `POST /api/payments/create-checkout-session` -> `200 { url: "https://checkout.stripe.com/..." }`
   - Browser navigates to the returned URL.
4. Complete payment with the test card.
5. You land on `/payment/success?session_id=cs_...`; the page verifies the
   status with `GET /api/payments/session/:sessionId`.
6. Confirm the webhook log and the confirmation email.
7. Repeat and cancel from Checkout. The cancel page shows a retry button when
   it has a linked `consultation_id`; retrying reuses the same consultation
   and does not create a second enquiry.

## Troubleshooting (based on the actual implementation)

### HTTP 503 - Payments are not configured

The backend config gate found at least one missing or malformed value. Check
the backend process environment (not the frontend) for:

- `STRIPE_SECRET_KEY` starting with `sk_`
- `STRIPE_WEBHOOK_SECRET` starting with `whsec_`
- `STRIPE_PRICE_ID` starting with `price_`
- a valid absolute `FRONTEND_URL`

Common causes:

- Values were placed in the repository-root `.env` while the backend runs
  host-side from `Server/` (which loads `Server/.env`).
- Values were placed in `Server/.env` while the backend runs in Docker (which
  loads the root `.env`).
- The value is still a template placeholder such as `sk_test_REPLACE_ME`.

Inspect key names and emptiness without printing values; do not echo the
file.

### HTTP 400 - Invalid request

- `Invalid consultation reference`: the frontend sent a malformed
  `consultationId`; it must be a 24-character hexadecimal MongoDB id.
- `Invalid Stripe signature` or `Missing Stripe signature`: the webhook is not
  receiving the raw body, or `STRIPE_WEBHOOK_SECRET` does not match the
  endpoint that sent the event.
- A malformed frontend request is also rejected by the route-scoped JSON
  parser; the payload is limited to 16 kB.

### HTTP 401/403 from Stripe

The backend logs only the error type/code (for example
`StripeAuthenticationError`). Check that the secret key is a test key from the
same test-mode account as the Price. A frontend publishable key is unrelated.

### HTTP 404 - Not found

- `Consultation not found`: the linked enquiry id no longer exists, or the
  cancel link belongs to a different database.
- `Checkout session not found`: the status page received an unknown session
  id.

### HTTP 409 - Already paid

The consultation is already marked `paid` by a verified webhook; a second
checkout is intentionally refused.

### HTTP 502 - Stripe request failed

The backend intentionally hides Stripe's message from the browser and logs
only the type/code. Common causes:

- The configured Price ID is inactive, deleted, or belongs to another account
  or mode.
- The Stripe API rejected a request parameter. In particular, Checkout
  Sessions have no `customer_name` create parameter; this repository
  intentionally does not send one.
- Stripe is unreachable or the key is invalid.

Check the backend console, the Stripe Dashboard request logs, and the Price
configuration. Never expose the full Stripe error to the browser.

### The form always says "Something went wrong on our side"

Check the Network panel for the `POST /api/consultations`:

- **HTTP 200 `text/html`** means the browser reached a static-only preview
  server, not the API. The SPA index.html was returned, JSON parsing failed,
  and the form correctly refused to report success.
- In Docker, use `http://localhost:3000` (proxy) or
  `http://localhost` (proxy). `http://localhost:3002` is the static preview
  and intentionally has no API.
- In host-side development, use the Vite server (`http://localhost:5173`);
  its `/api` proxy targets `http://localhost:5000`.
- A direct `POST http://localhost:5000/api/consultations` returning `201`
  with `{"success":true,"data":{"id":"..."}}` proves the backend itself is
  healthy.

### Redirect does not happen

- Inspect the `POST /api/payments/create-checkout-session` response. It must
  be `200` with a top-level `url` string. The frontend does not accept
  `checkoutUrl`, `sessionUrl`, or a nested field.
- The frontend accepts only an `https://checkout.stripe.com/...` URL; any
  other host is rejected as a safety check.
- If the request returns `503`, the browser stays on the page and shows the
  not-configured message.
- If the request returns `502`, the enquiry is still saved; the payment step
  shows a retry path and the same consultation id is reused.
- If the frontend was opened through a different origin, set
  `VITE_API_BASE_URL` or use the same-origin `/api` proxy.

### The frontend shows the demo instead of Stripe

The mock is now opt-in only. Check `systemaops-webpage/.env*` for
`VITE_ENABLE_MOCK_PAYMENT=true` and remove it for real Checkout. Do not set
`VITE_ENABLE_STRIPE_CHECKOUT=false` unless you intentionally want
enquiry-only mode in a development build.

### Webhook works locally but not in production

- The production webhook URL must be publicly reachable over HTTPS and end in
  `/api/payments/webhook`.
- The production backend must have the live/test webhook signing secret for
  that exact endpoint.
- The reverse proxy must not buffer or rewrite the raw body. The bundled
  proxy does not rewrite it; if you use host NGINX, verify its `/api/`
  location passes the body unchanged.
- Check `last_error` and `email_status` in `stripe_payments` if a payment is
  `paid` but mail failed.

## Tests

```powershell
# Backend: real Express app + real signature verification, Stripe mocked
cd Server
$env:MONGO_URI="mongodb://127.0.0.1:27017/systemaops"
npm test

# Frontend: parser, redirect, routing, UI/wiring, build-output scans
cd systemaops-webpage
npm test
npm run lint
npm run build
```

Automated tests never create real charges. Real Stripe test-mode verification
requires the Dashboard/CLI values described above.
