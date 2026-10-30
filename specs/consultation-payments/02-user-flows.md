# User Flows

## Consultation request

1. Visitor opens `/book-a-call` and selects a service area.
2. Client validates required fields and privacy consent; server repeats validation.
3. Browser posts to `POST /api/consultations` through Vite proxy or production Nginx.
4. Backend stores the enquiry and retention/privacy metadata, then attempts activity/admin/founder notifications.
5. The client advances only after a successful `201` response. Network/server errors preserve entered values for retry.

## Checkout and verification

```mermaid
sequenceDiagram
  actor Visitor
  participant Browser
  participant API as Express API
  participant DB as MongoDB
  participant Stripe
  participant Mail as Resend
  Visitor->>Browser: Request checkout after accepted enquiry
  Browser->>API: POST /api/payments/create-checkout-session (enquiry id, name/email prefill)
  API->>DB: Confirm enquiry eligible; reuse an open session if available
  API->>Stripe: Create hosted session using server Price ID
  Stripe-->>API: Checkout URL and session id
  API->>DB: Store session link and pending state
  API-->>Browser: Checkout URL
  Browser->>Stripe: Redirect to hosted checkout
  Stripe-->>Browser: Redirect to success or cancel URL
  Browser->>API: GET /api/payments/session/:sessionId (success return only)
  API->>DB: Check verified webhook state
  alt webhook state not stored yet
    API->>Stripe: Retrieve session server-side
    Stripe-->>API: Current session state
  end
  API-->>Browser: Normalized status only; no PII
  Stripe->>API: Signed webhook with raw request body
  API->>API: Verify signature and event type
  API->>DB: Idempotently record payment and claim email delivery
  API->>Mail: Send confirmation only for paid state
  Mail-->>API: Delivery result
  API->>DB: Mark email sent/failed and persist attempt state
```

The browser redirect is an untrusted navigation signal. The status API's server-to-Stripe retrieval and the signature-verified webhook are authoritative sources. Only webhook processing persists payment and initiates email delivery.

## Cancellation, failure, and retry

- Cancel URL says the visitor cancelled; it does not write a failed/paid record.
- A success return starts a bounded status check (initial request plus up to four 2.5-second retries while pending). Unavailable/failed/expired results offer an explicit retry.
- Stripe retries non-2xx webhook deliveries. Email state has a claim lease so concurrent deliveries do not send concurrently; Resend idempotency keys reduce duplicates on retried sends.
- Operational recovery for exhausted Stripe retries is to inspect failed email state and use provider delivery/replay tooling. There is no public resend endpoint.
