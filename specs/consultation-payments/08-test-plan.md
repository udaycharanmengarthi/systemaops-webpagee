# Test Plan

## Existing automated coverage

- Frontend Node test suite covers language parity, payload/area mapping, validation, route wiring, no client-side price, development mock gating, Stripe adapter contract, no success-URL trust, and production bundle secret exclusion.
- Backend Node integration suite boots the actual Express app against Compose MongoDB, uses Stripe SDK test signatures and stubs outbound Checkout, and points Resend to a local fake provider. It covers consultation validation/persistence/retention, raw webhook body, server Price, invalid signature, duplicate/concurrent/out-of-order events, payment/email states, retry, and secret-safe responses.

## Required verification

| Test area | Method |
|---|---|
| Consultation validation/persistence | `Server` `npm test` against test MongoDB |
| Checkout and server price | backend payment integration tests; assert client price fields are ignored |
| Missing config/provider response | config and endpoint tests; assert 503 and no secret leakage |
| Webhook signature/raw bytes | Stripe test header through actual Express middleware |
| Duplicate/out-of-order delivery | integration tests with repeated, concurrent, and async failure/success events |
| Status lookup | valid paid/pending/failed/expired, invalid id, unknown provider session, no PII, no-store, and rate limit tests |
| Email delivery | fake Resend success/failure, duplicate and retry behavior |
| UI and i18n | frontend tests, keyboard check, responsive browser review |
| API connectivity | health request through local dev proxy and production reverse proxy |
| Build/security | backend tests, frontend tests/lint/build, Compose config validation, frontend secret scan |

## Current run result

Frontend tests pass (70/70), lint passes, and production build succeeds with an existing large-chunk warning. `docker compose config --quiet` passes. Backend test suite was attempted but cannot connect because `MONGO_URI` is unset in this shell and no Mongo service is reachable. TCP checks show no listener on localhost ports 5000 or 80. Docker Compose rebuild/log checks and browser checks are pending because Docker Engine access is denied and browser tooling is unavailable.
