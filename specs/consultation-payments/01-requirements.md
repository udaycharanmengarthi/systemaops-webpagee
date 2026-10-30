# Requirements

Status legend: **Implemented** = present in repository; **Pending** = not verified in the available runtime; **Blocked** = requires an owner decision or external configuration.

## Functional requirements

| ID | Requirement | Status | Implementation / verification |
|---|---|---|---|
| FR-001 | Visitor can submit name, email, optional company, service area, message, and privacy acknowledgement. | Implemented | `BookACall`, `consultationService`, `submitConsultation`; frontend and backend consultation tests |
| FR-002 | Server validates and stores accepted enquiries with a server-generated ID and retention date. | Implemented | `Consultation`, controller, retention utility; backend tests |
| FR-003 | Consultation submission sends best-effort admin/founder notifications without reporting failure after a stored enquiry. | Implemented | `consultation.controller.js`, existing activity/mail services |
| FR-004 | Checkout is offered only in an explicitly enabled offer mode and sends no amount from the browser. | Implemented/Blocked | `offerConfig`, `paymentService`; actual offer policy remains blocked |
| FR-005 | Backend creates hosted Checkout using server-configured Stripe Price and links the session to an enquiry where supplied. | Implemented | payment controller/provider adapter; backend payment tests |
| FR-006 | Browser success/cancel routes are informational; success route requests normalized status and retries pending verification. | Implemented; runtime pending | `PaymentResult`, `paymentStatusService`, status API |
| FR-007 | Webhook handles successful, asynchronous-success, asynchronous-failure, duplicate, and irrelevant events safely. | Implemented | `payments.controller`, `payments.service`; backend payment tests |
| FR-008 | A successful payment triggers a confirmation email and maintains recoverable delivery state. | Implemented | `StripePayment`, `payments.service`, `mail.service`; tests cover duplicate/concurrent/failure/retry |
| FR-009 | Contact form and unrelated website behavior remain available. | Regression pending | Separate `/api/contact` route retained; run regression suite |

## Non-functional requirements

| ID | Requirement | Status | Verification |
|---|---|---|---|
| NFR-001 | Consultation pages use existing SystemaOps design tokens and responsive single-column mobile layout. | Implemented; visual pending | Frontend tests and browser viewport review |
| NFR-002 | API responses and errors never disclose secrets, webhook bodies, or unnecessary customer data. | Implemented | Backend tests and response review |
| NFR-003 | User-visible consultation/payment messages exist in English, Dutch, and German. | Implemented | i18n parity tests |
| NFR-004 | API URLs work through Vite development proxy and production reverse proxy. | Configured; runtime pending | Vite/Nginx config review and API smoke check |

## Security requirements

| ID | Requirement | Status | Implementation |
|---|---|---|---|
| SEC-001 | Secrets remain server-side and are never logged or emitted in frontend builds. | Implemented | Server env config; frontend bundle test |
| SEC-002 | Webhook signature is verified against the raw request body. | Implemented | `express.raw` before JSON middleware; Stripe adapter |
| SEC-003 | Status lookup returns no PII and uses no-store caching. | Implemented | `GET /api/payments/session/:sessionId` |
| SEC-004 | Public checkout and status endpoints are rate limited. | Implemented | Express rate limiter |
| SEC-005 | A browser success URL alone never confirms or persists payment. | Implemented | Server verification/webhook; frontend result page |

## Payment requirements

| ID | Requirement | Status | Implementation |
|---|---|---|---|
| PAY-001 | Server owns amount, currency, and price selection through a trusted Stripe Price ID. | Implemented; configuration blocked | `STRIPE_PRICE_ID`; no client price fields |
| PAY-002 | Duplicate checkout requests reuse an open session for the same enquiry. | Implemented | Session lookup and consultation link |
| PAY-003 | Duplicate webhook deliveries do not duplicate payment rows or confirmation emails. | Implemented | Unique session index and email claim lease |
| PAY-004 | Payment status can be checked against stored webhook facts or Stripe retrieval. | Implemented | New session status endpoint |
| PAY-005 | Payment provider can be changed by adding an adapter without changing form/business orchestration. | Implemented boundary; future providers pending | `paymentProvider.js` |
| PAY-006 | Razorpay is not represented as implemented until credentials, adapter, webhook verification, and tests exist. | Implemented | No Razorpay adapter |

## UX requirements

| ID | Requirement | Status | Verification |
|---|---|---|---|
| UX-001 | Form has labels, inline errors, focused error summary, loading state, and preserves entered data on failure. | Implemented | Form component and tests |
| UX-002 | Payment result states distinguish pending, paid, failed, expired, unavailable, and invalid/missing session. | Implemented; browser pending | Translated result page |
| UX-003 | Status can be retried without claiming that retry changes payment state. | Implemented | Retry control and translated copy |
| UX-004 | Keyboard focus and reduced-motion behavior are respected. | Implemented; visual pending | CSS and accessibility inspection |
