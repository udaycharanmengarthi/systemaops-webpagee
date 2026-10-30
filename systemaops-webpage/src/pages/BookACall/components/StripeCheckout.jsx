import { Loader2, ShieldCheck } from "lucide-react";

export default function StripeCheckout({
  busy,
  offer,
  offerError,
  paymentError,
  onRetryOffer,
  onStart,
  t,
}) {
  const canStart = Boolean(offer) && !busy;

  return (
    <section className="cs-mock" aria-labelledby="cs-stripe-heading">
      <h2 id="cs-stripe-heading" className="cs-step-heading" tabIndex={-1}>
        {t("payments.checkoutHeading")}
      </h2>
      <p className="cs-step-text">{t("payments.checkoutText")}</p>

      {offer && (
        <dl className="cs-mock-summary">
          <div className="cs-panel-row">
            <dt>{t("consultation.panel.price")}</dt>
            <dd>{new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: offer.currency,
            }).format(offer.amountMinor / 100)}</dd>
          </div>
        </dl>
      )}

      {offerError && (
        <div className="cs-alert" role="alert">
          <span>{t(offerError)}</span>
          <button type="button" className="cs-linkback" onClick={onRetryOffer}>
            {t("payments.retryConfiguration")}
          </button>
        </div>
      )}

      {paymentError && (
        <p className="cs-alert" role="alert">{t(paymentError)}</p>
      )}

      <button
        type="button"
        className="cs-btn cs-btn--primary"
        disabled={!canStart}
        aria-busy={busy}
        onClick={onStart}
      >
        {busy && <Loader2 size={16} className="cs-spin" aria-hidden="true" />}
        {t(busy ? "payments.loading" : "payments.button")}
        {!busy && <ShieldCheck size={16} aria-hidden="true" />}
      </button>

      <p className="cs-mock-note">{t("consultation.panel.stripeNote")}</p>
    </section>
  );
}
