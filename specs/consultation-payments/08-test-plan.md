# Test Plan

## Existing automated coverage

- Frontend Node test suite covers language parity, payload/area mapping, validation, route wiring, no client-side price, the fail-closed display offer guard, development mock gating, Stripe adapter contract, no success-URL trust, repeated-click disabling, and production bundle secret exclusion.
- Backend Node integration suite boots the actual Express app against MongoDB, uses Stripe SDK test signatures and stubs outbound Checkout, and points Resend to a local fake provider. It covers consultation validation/persistence/retention, raw webhook body, configured Price server Price, client commercial-field rejection, repeated/concurrent checkout clicks, restart and open-session reuse, invalid signature, duplicate/concurrent/out-of-order events, event-ledger leases, wrong Price/currency/amount/quantity, synthetic/unlinked sessions, test/live isolation, cancel/expiry/failure, legitimate repeat purchase, payment/email states, retry, and secret-safe responses.

## Required verification

| Test area | Method |
|---|---|
| Consultation validation/persistence | `Server` `npm test` against test MongoDB |
| Checkout and server price | backend payment integration tests; assert client price fields are rejected and exactly one `price: STRIPE_PRICE_ID, quantity: 1` line item is sent |
| Repeated clicks / restart | concurrent checkout tests; open-session reuse and lock/nonce/idempotency-key assertions |
| Missing config/provider response | config and endpoint tests; assert 503 and no secret leakage |
| Webhook signature/raw bytes | Stripe test header through actual Express middleware |
| Webhook ownership/commercial proof | unlinked/synthetic events, wrong metadata, wrong Price/currency/amount/quantity, wrong mode |
| Duplicate/out-of-order delivery | integration tests with repeated, concurrent, and async failure/success events |
| Status lookup | valid paid/pending/failed/expired, invalid id, unknown provider session, no PII, no-store, and rate limit tests |
| Email delivery | fake Resend success/failure, duplicate and retry behavior |
| UI and i18n | frontend tests, keyboard check, responsive browser review |
| API connectivity | health request through local dev proxy and production reverse proxy |
| Build/security | backend tests, frontend tests/lint/build, Compose config validation, frontend secret scan |

## Current run result

- Backend payments + consultation-link suites pass **63/63** against
  `mongodb://127.0.0.1:27017/systemaops`; the complete backend suite passes
  **94/94**.
- Frontend tests pass **103/103**, lint passes, and the production build
  succeeds with an existing large-chunk warning.
- `docker compose config --quiet` passes.
- Still pending: a real Stripe test-mode payment (requires a live CLI/Dashboard
  webhook secret), payment-page browser inspection, and a Docker rebuild/API
  smoke test after the backend changes. No live payment was attempted.
