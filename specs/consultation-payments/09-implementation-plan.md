# Implementation Plan

| Step | Requirement IDs | Modules | Outcome / completion |
|---|---|---|---|
| 1. Repository audit and spec | All | existing repo, `specs/consultation-payments` | Map existing uncommitted implementation; identify API runtime/config blockers; cross-check docs. |
| 2. Consultation API | FR-001–003, SEC-005 | consultation route/controller/model, Vite/Nginx/Compose | Validated, retained enquiry and safe notification. Existing code present; backend integration suite required. |
| 3. Provider boundary | PAY-005/006, SEC-002 | `Server/src/services/paymentProvider.js`, controller | Isolate Stripe SDK calls; unsupported provider fails closed; future adapter can be added independently. |
| 4. Secure checkout and webhook | FR-005/007/008, PAY-001–003, SEC-001/002 | payment controller/routes/service/models/config | Server Price, raw signature verification, idempotent state and email. Existing code plus provider seam; test suite required. |
| 5. Return-status verification | FR-006, PAY-004, UX-002/003 | status endpoint, frontend status service/result page, translations | Bounded server-side status verification and retry, no PII or client-side payment assertion. Automated frontend test/build and backend integration needed. |
| 6. Responsive consultation UI | UX-001/004, NFR-001/003 | BookACall components/CSS/i18n | Accessible, translated, responsive branded form; existing implementation needs viewport visual check. |
| 7. Safe deployment config | NFR-004, SEC-001 | env examples, Vite, Compose, proxy | Use same-origin API routing and test keys/placeholders only. Do not read or overwrite ignored `.env`. |
| 8. Integration/regression | All | tests, docs, Compose | Run frontend/backend suites, lint/build, compose validation, API smoke tests, browser viewport checks. Backend/Compose/browser currently externally blocked. |
