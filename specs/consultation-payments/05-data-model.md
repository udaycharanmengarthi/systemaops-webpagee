# Data Model

## Consultation (`consultations`)

Mongo document fields: ObjectId `_id`; required `name` (120), lowercase `email` (254), optional `company` (160), required slug `areaOfInterest` (40), `message` (4000), `privacyAccepted`, `privacyVersion`, `privacyAcceptedAt`, `createdAt`, `updatedAt`, and `expiresAt` (one-year TTL). Payment linkage: nullable `paymentStatus` (`pending|paid|failed|expired`), `stripeSessionId`, `paidAt`; checkout serialization uses `checkoutLockUntil`/`checkoutLockToken` and `checkoutNonce`; the verified commercial snapshot is `paymentPriceId`, `paymentAmountMinor`, `paymentCurrency`, `paymentQuantity`.

Indexes: TTL on `expiresAt`, descending `createdAt`, `{areaOfInterest, createdAt}`, and non-unique `stripeSessionId`. Existing init script adds collection/indexes on new DB initialization; deployments with existing data must validate schema/index state before migration changes.

## Stripe payment (`stripe_payments`)

One document per `stripe_session_id` (unique): Stripe payment intent/session ids; normalized `payment_status` (`paid|failed|expired`); minor-unit `amount_total`; lowercase currency; verified Price ID and line-item quantity; `livemode`; linked `consultation_id` when known; verified customer email/name; `last_event_id`; timestamps. Email state is separate: `email_status` (`pending|sending|sent|failed`), attempts, short sending lease expiry, sent time, and sanitized last error.

## Webhook event ledger (`stripe_webhook_events`)

One document per Stripe `event_id` (unique): `event_type`, `stripe_session_id`, `status` (`processing|processed|ignored|failed`), `claim_id`, `lease_expires_at`, `attempts`, sanitized `last_error`, and timestamps. A delivery must win the compare-and-set claim before it may change payment state or send mail; an expired lease is reclaimable so a crashed process does not lose Stripe retries.

## Repeated work and retention

- Repeated checkout uses the linked open Stripe session, a 30-second per-consultation lock, a stored attempt nonce and Stripe idempotency keys. The unique payment-session index remains the final collapse point.
- Duplicate/concurrent event ids are collapsed by the unique ledger row; out-of-order and duplicate payments must preserve paid state and never cause a second confirmation email. Email claims use conditional DB updates and an expiring lease.
- Consultation TTL currently applies to the enquiry/payment linkage. Stripe payment and webhook-event collections have no TTL because financial audit/retention policy is not yet defined; owner/legal retention policy is unresolved.
