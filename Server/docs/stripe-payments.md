# Consultation payments (Stripe Checkout)

One-time payment for a consultation. No booking, no subscriptions, no
refunds logic, no admin UI.

```
Browser ──POST /api/payments/create-checkout-session──▶ backend
   │                                                    │ Stripe Checkout Session
   │◀────────────── { url } ────────────────────────────┤
   ▼
Stripe-hosted Checkout ──▶ customer pays
   │
   └──▶ POST /api/payments/webhook (signed) ──▶ record payment ──▶ send ONE email
                                                          │
   └──▶ redirect to /payment/success?session_id=…  (informational only)
```

The redirect pages prove nothing. The **signature-verified webhook is the
only source of truth** for payment state.

---

## Environment variables

Backend only, git-ignored. Which file is loaded:

- host-side development (run from `Server/`): `Server/.env`
- Docker Compose backend: the repository-root `.env` (`backend.env_file`)

Placeholders are in `Server/.env.example` and the root `.env.example`.
Never put these values in a `VITE_*` frontend variable.

| Variable | Example | Meaning |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | `sk_test_…` | Stripe secret key. Server-side only. |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` | Signing secret of the webhook endpoint. |
| `STRIPE_PRICE_ID` | `price_…` | The **only** source of amount/currency. |
| `CONSULTATION_CURRENCY` | `eur` | Expected currency guard (defaults to `eur`). |
| `CONSULTATION_AMOUNT_MINOR` | `50000` | Expected amount guard in minor units (defaults to €500.00). |
| `FRONTEND_URL` | `http://localhost:5173` | Builds the success/cancel redirect URLs. |

Behaviour when they are missing, empty, malformed or still contain
`REPLACE_ME`: the app starts normally, `/api/payments/*` answers **503
“Payments are not configured”**, and the rest of the site is unaffected.
The frontend shows a friendly "online payment is not available" message.

**The frontend never supplies an amount, price or currency.** The Price
lives in the Stripe dashboard; the browser only triggers session creation.
Checkout is disabled if the configured Price is inactive, recurring, or does
not match the expected €500.00 EUR offer. The production Price ID is never
rewritten by the application; configure an approved Price ID in the backend
environment and verify it in Stripe before enabling live payments.

---

## Files

Backend (`Server/`):

| File | Purpose |
| --- | --- |
| `src/config/payments.js` | Env validation (never throws at boot), lazy Stripe client. |
| `src/models/StripePayment.js` | `stripe_payments` collection, UNIQUE `stripe_session_id`. |
| `src/services/payments.service.js` | Record / claim-email / mark-sent / mark-failed, email content. |
| `src/services/mail.service.js` | Existing Resend service — additive `idempotencyKey` support. |
| `src/controllers/payments.controller.js` | The two endpoints. |
| `src/routes/payments.routes.js` | Route-scoped parsers: `express.raw` for the webhook, `express.json` for create-session. |
| `src/app.js` | Mounts `/api/payments` **before `express.json()`**; limiter on create-session only. |
| `src/controllers/consultation.controller.js` | `/api/consultations` — book-a-call requirements form. |
| `src/models/Consultation.js` | `consultations` collection, same retention/privacy conventions as Contact. |
| `mongo-init/01-schema.js` | Fresh-volume collections, validators and indexes. |
| `tests/payments.test.js` | Payment tests (mocked Stripe + fake Resend). |
| `tests/consultation.test.js` | Book-a-call enquiry tests. |

Frontend (`systemaops-webpage/`):
`components/sections/PayForConsultation.{jsx,css}` (rendered in the home
bottom CTA and on `/book-a-call`), `pages/BookACall/{index.jsx,BookACall.css}`,
`pages/Payments/PaymentResult.jsx` + `.css`, routes in `App.jsx`
(`/book-a-call`, `/payment/success`, `/payment/cancel`), the two navbar CTAs in
`components/layout/Navbar.{jsx,css}`, and `payments.*` / `consultation.*`
strings in `i18n/translations-services.js` (EN/NL/DE).

### Endpoints at a glance

| Route | Purpose |
| --- | --- |
| `POST /api/consultations` | Book-a-call enquiry (public, rate limited) |
| `GET /api/payments/offer` | Public amount/currency display from the server-side Price |
| `POST /api/payments/create-checkout-session` | Starts Stripe Checkout (public, rate limited) |
| `GET /api/payments/session/:sessionId` | Read-only normalized payment status |
| `POST /api/payments/webhook` | Signature-verified; the ONLY writer of payment state |
| `POST /api/contact` | Existing contact form — unchanged |

### Book-a-call flow

1. Navbar **Book a Call** (or the home CTA) opens `/book-a-call`.
2. The visitor reads what can be discussed (rendered from the real
   `servicesMenu`, nothing invented) and submits the requirements form.
3. On success, Stripe Checkout starts immediately. The browser sends the
   visitor's email (used solely to prefill Stripe-hosted Checkout; Stripe
   collects the name itself) **and the server-generated `consultationId`**
   returned by `POST /api/consultations`. It never sends an amount, price,
   currency or Price ID.
4. Checkout -> signed webhook -> `paid` row -> one confirmation email ->
   redirect to `/payment/success` (informational) or `/payment/cancel`
   (retries the same consultation when a linked id is present).

### Linking a session to its enquiry

`create-checkout-session` requires the server-generated `consultationId`:

| `consultationId` | Behaviour |
| --- | --- |
| omitted | `400` — a checkout must be linked to an enquiry |
| malformed | `400` |
| unknown but well-formed | `404` |
| already `paid` | `409` — an enquiry is never charged twice |
| valid and unpaid | Session is created and linked |

After validating the reference, the endpoint:

- stores the session id on the enquiry (`stripeSessionId`) and sets
  `paymentStatus: "pending"`;
- reuses the existing **open** session on a repeat request, so a double
  click or a refresh cannot leave two live payment sessions for one
  enquiry;
- attaches `metadata.consultation_id` to the Stripe session. Metadata
  carries **only** the opaque id — never the name, email or message;
- appends that opaque id to the cancel URL so the cancel page can reopen
  Checkout for the same enquiry instead of creating a duplicate.

The verified webhook writes the final state back onto the enquiry
(`paid`/`failed`, plus `paidAt`) only when the session ID stored on the
enquiry matches the event's Checkout Session. Metadata alone is not enough.
This is a second copy of state, not the source of truth: `paid` can only
ever be written from a signature-verified event, and the browser can never
set it (the consultation endpoint ignores any such field).

`/api/consultations` stores the enquiry with the same 1-year retention and
privacy fields as `contacts`, logs activity, notifies admins and emails the
founder through the existing mail service. It is a separate endpoint (not a
flag on `/api/contact`) because the contact form *requires* a phone number
while this form has none — inventing a placeholder phone would corrupt
existing lead data. `/api/contact` is untouched.

---

## Payment data model

`stripe_payments`, one row per Checkout Session:

| Field | Notes |
| --- | --- |
| `stripe_session_id` | **UNIQUE** — the duplicate-delivery collapse point |
| `payment_intent_id` | nullable |
| `payment_status` | `paid` \| `failed`, written **only** from verified events |
| `amount_total`, `currency`, `customer_email` | verified session data only |
| `email_status` | `pending` \| `sending` \| `sent` \| `failed` |
| `email_attempts` | incremented on every claim |
| `email_lease_expires_at` | lease that makes a crashed `sending` reclaimable |
| `email_sent_at`, `last_error` (sanitized, no PII), `last_event_id` | |
| `created_at`, `updated_at` | `timestamps: true` |

Delivery uses a single **compare-and-set** claim:

```js
findOneAndUpdate(
  { stripe_session_id, $or: [
      { email_status: { $in: ["pending", "failed"] } },
      { email_status: "sending", email_lease_expires_at: { $lt: now } },
  ]},
  { $set: { email_status: "sending", email_lease_expires_at: … }, $inc: { email_attempts: 1 } }
)
```

Only the caller whose update matched a row may send. This is safe across
concurrent deliveries and across multiple app instances because the
decision lives in MongoDB, not in process memory.

---

## Delivery guarantees and limitations (read this)

**Delivery is AT-LEAST-ONCE.** Honest statement of what is and is not
guaranteed:

- **Duplicate deliveries are safe.** The unique session index plus the
  claim means N deliveries (sequential, concurrent, or after a restart)
  produce **exactly one** email. Verified by tests.
- **One narrow window cannot be fully eliminated.** If the process crashes
  *after* the email provider accepted the message but *before* the
  database recorded `sent`, a retry may send a second email. Mitigation:
  the provider idempotency key (`payment-confirmation-<session_id>`) —
  Resend honours `Idempotency-Key`, so the duplicate is deduplicated
  provider-side. If the provider ever stops honouring it, this window
  reopens.
- **If Stripe exhausts its webhook retries** (it retries for ~3 days), the
  row stays `email_status: 'failed'` with `payment_status: 'paid'` and the
  customer gets no confirmation. There is deliberately **no admin UI** for
  this. To find those rows:

  ```js
  // mongosh / any Mongo client — read-only inspection
  db.stripe_payments.find(
    { email_status: "failed" },
    { stripe_session_id: 1, payment_status: 1, email_attempts: 1, last_error: 1, updatedAt: 1 }
  ).sort({ updatedAt: -1 })
  ```

  Re-drive delivery by re-sending the original event
  (`stripe events resend <evt_id>` — the `last_event_id` field records the
  event that last touched the row). Do not write to this collection by
  hand; only a verified webhook may change payment state.
- **Email is not configured** → delivery counts as a failure
  (`email_not_configured`), the webhook answers 500 and Stripe retries.
  That is intentional: a silent "sent" would be worse.

### Events handled

| Event | Behaviour |
| --- | --- |
| `checkout.session.completed` + `payment_status === 'paid'` | Record `paid`, send email |
| `checkout.session.completed` + not paid | **Nothing recorded, no email**, 200 |
| `checkout.session.async_payment_succeeded` | Record `paid`, send email |
| `checkout.session.async_payment_failed` | Record `failed`, **no email**, 200 |
| anything else | 200, ignored |

200 = handled safely. 500 = transient failure, Stripe retries. 400 =
bad/missing signature, nothing is written and nothing is sent.

No other endpoint can mark a payment paid or trigger the email. The only
other payment endpoint is the read-only
`GET /api/payments/session/:sessionId` status check used by the success
page; it never writes state. There is no "mark as paid" and no "resend
email" — by design.

---

## Test-mode procedure (manual)

1. Stripe Dashboard (**test mode**) → create a Product and a **one-time**
   Price → copy the `price_…` ID.
2. Copy the `sk_test_…` key. Start the CLI:
   `stripe listen --forward-to localhost:5000/api/payments/webhook`
   and copy the `whsec_…` it prints.
3. Put all three values plus `FRONTEND_URL` into `Server/.env` for host-side
   development, or the repository-root `.env` for Docker Compose (never
   commit either). Restart the backend.
4. Pay with test card `4242 4242 4242 4242`, any future expiry, any CVC.
   Verify **exactly one** email and
   `email_status: 'sent'` in `stripe_payments`.
5. Decline with `4000 0000 0000 0002` → no email, no `paid` row.
   Cancel via the back link on Checkout → `/payment/cancel`, nothing charged;
   the linked retry button reopens Checkout for the SAME enquiry.
6. Duplicate: `stripe events resend <evt_id>` → confirm **no second email**.
7. Email failure: temporarily break `RESEND_API_KEY`, pay, confirm the
   webhook answers non-2xx and Stripe retries; restore the key and confirm
   exactly one email is delivered.

Automated equivalents (mocked Stripe + fake Resend, no network):

```bash
# backend — needs the compose MongoDB
docker compose run --rm -v "${PWD}/Server/tests:/app/tests:ro" backend node --test tests/

# frontend
cd systemaops-webpage && npm test
```

---

## Go-live checklist (only after explicit founder approval)

- [ ] Live keys as server env vars: `sk_live_…`, live `whsec_…`, live `price_…`
- [ ] Production webhook endpoint `https://<domain>/api/payments/webhook`
      in the Stripe Dashboard **with its own signing secret**
- [ ] `FRONTEND_URL=https://www.systemaops.com`
- [ ] Sender domain verified in Resend (SPF + DKIM + DMARC) — otherwise
      confirmation mail lands in spam and `email_status` still reads
      `sent`, so this is a deliverability problem, not a code problem
- [ ] `docker compose -f docker-compose.yml up -d --build` (no proxy
      override on the production host — host NGINX owns :80)
- [ ] Confirm NGINX passes the body untouched: `location /api/` proxies
      without buffering or rewriting, which it already does; verify with
      one live-mode test payment before announcing
- [ ] Decide the refund/cancellation policy **manually in the Stripe
      dashboard** — intentionally not automated here
