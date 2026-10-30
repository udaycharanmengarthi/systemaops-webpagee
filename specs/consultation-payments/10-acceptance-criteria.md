# Acceptance Criteria

Status is evidence-based. **PASS** means the check ran successfully; **PENDING** means not run; **BLOCKED** means the current environment cannot run it or business approval is required.

| ID | Criterion | Requirement(s) | Verification | Status |
|---|---|---|---|---|
| AC-001 | Enquiry fields validate and accepted requests persist with privacy and retention fields. | FR-001/002 | Backend consultation integration tests | BLOCKED: no `MONGO_URI`/reachable Mongo in this shell |
| AC-002 | Checkout amount/price comes from server configuration only. | FR-005, PAY-001 | Backend payment tests (client tampering) | BLOCKED with backend suite |
| AC-003 | Raw webhook signature required before payment state/email effects. | FR-007, SEC-002 | Stripe signed/invalid-signature integration tests | BLOCKED with backend suite |
| AC-004 | Duplicate/concurrent webhook processing does not duplicate payment or confirmation email. | PAY-003 | Backend idempotency tests | BLOCKED with backend suite |
| AC-005 | Status and offer routes return only normalized status/trusted server price and never persist/send mail. | FR-006, SEC-003, PAY-004 | Payment controller integration tests | PENDING: dedicated tests added; backend unavailable |
| AC-006 | Status page distinguishes states and can retry verification without asserting success from URL. | FR-006, UX-002/003, SEC-005 | Frontend tests and browser inspection | PENDING: frontend automated checks/build pass; browser unavailable |
| AC-007 | Confirmation email follows verified paid event only; failure remains recoverable. | FR-008, PAY-003 | Fake Resend integration tests | BLOCKED with backend suite |
| AC-008 | English, Dutch, and German payment status strings resolve. | NFR-003 | Frontend i18n tests | PASS: 70 frontend tests |
| AC-009 | Frontend static production build succeeds and contains no Stripe secrets. | SEC-001 | `npm run build`, frontend bundle test | PASS; build emitted a large-chunk warning |
| AC-010 | Frontend tests and lint pass. | NFR-003, UX-001 | `npm test`, `npm run lint` | PASS: 70 tests; lint clean |
| AC-011 | Docker config and frontend/backend API connectivity work in the running stack. | NFR-004 | Compose validation + health/API smoke test | BLOCKED: Compose config passes; no listener on 5000/80; Docker Engine access denied |
| AC-012 | Consultation layout is visually responsive at 360/390/768/1024/1440px. | NFR-001, UX-004 | Browser inspection | BLOCKED: browser tool unavailable |
| AC-013 | Paid offer only uses owner-approved price/currency/duration and test/live keys remain separated. | FR-004, PAY-001 | Business config review + Stripe test-mode check | BLOCKED: owner has not established offer or Stripe Price ID |
| AC-014 | No changes are committed/pushed/deployed and unrelated edits are preserved. | Scope | Git status/diff review | PASS: no commit/deploy; implementation remained limited to feature files and new specs; prior dirty files preserved |
