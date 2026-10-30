# Data Model

## Consultation (`consultations`)

Mongo document fields: ObjectId `_id`; required `name` (120), lowercase `email` (254), optional `company` (160), required slug `areaOfInterest` (40), `message` (4000), `privacyAccepted`, `privacyVersion`, `privacyAcceptedAt`, `createdAt`, `updatedAt`, and `expiresAt` (one-year TTL). Payment linkage: nullable `paymentStatus` (`pending|paid|failed`), `stripeSessionId`, `paidAt`.

Indexes: TTL on `expiresAt`, descending `createdAt`, `{areaOfInterest, createdAt}`, and non-unique `stripeSessionId`. Existing init script adds collection/indexes on new DB initialization; deployments with existing data must validate schema/index state before migration changes.

## Stripe payment (`stripe_payments`)

One document per `stripe_session_id` (unique): Stripe payment intent/session ids; normalized `payment_status` (`paid|failed`); minor-unit `amount_total`; lowercase currency; verified customer email/name; `last_event_id`; timestamps. Email state is separate: `email_status` (`pending|sending|sent|failed`), attempts, short sending lease expiry, sent time, and sanitized last error.

## Repeated work and retention

- Repeated checkout uses the linked open Stripe session. The unique payment-session index collapses concurrent/duplicate webhooks.
- Out-of-order and duplicate events must preserve paid state and never cause a second confirmation email; reviewed by integration tests. Email claims use conditional DB updates and an expiring lease.
- Consultation TTL currently applies to the enquiry/payment linkage. Stripe payment collection has no TTL because financial audit retention is not yet defined; owner/legal retention policy is unresolved.
- No webhook event ledger is stored separately; `last_event_id` records only the event that last touched a payment row. Duplicate safety depends on the unique session and state machine.
