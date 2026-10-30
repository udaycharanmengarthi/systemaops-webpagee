# Security and Payment Integrity

- **Server-owned pricing:** client never sends amount, currency, or Price ID. Backend uses `STRIPE_PRICE_ID`; do not set it until owner approval.
- **Secret handling:** Stripe, webhook, database, and Resend secrets stay in ignored deployment env files/secret store. Example files contain placeholders only. Do not print env files or log key values.
- **Webhook verification:** payment router is mounted before JSON middleware; webhook uses route-scoped `express.raw`; Stripe signature is verified before payload effects.
- **Authoritative status:** success URL is untrusted. Status lookup retrieves Stripe session server-side and returns only a normalized enum; it does not write payment state. Verified webhooks own persistence and email.
- **Idempotency:** unique checkout session id, checkout reuse for a linked enquiry, conditional email claim, lease recovery, and Resend idempotency key limit duplicate effects.
- **Lookup authorization:** session id is a capability. Status API exposes no PII and is rate-limited/no-store. Do not add email/name or arbitrary consultation lookup to the public response.
- **Validation:** request field types/lengths, area slugs, ObjectId syntax, email, session ID, and consent are validated server-side.
- **Logging:** safe operation/type/code diagnostics only; never request bodies, emails, signatures, URLs with sensitive parameters, or secret values.
- **Email:** only verified paid events trigger confirmation email. Failure is tracked independently; it does not change payment state. Stripe retry can recover transient email errors. Exhausted provider retries need operational review.
- **Environments:** use test keys and a test Price in Stripe test mode. Do not enable live checkout until commercial offer and live webhook configuration are explicitly approved.
