import { Pencil, ShieldCheck } from "lucide-react";

/**
 * Summary / offer panel.
 *
 * Shows what the consultation is, what happens next, and — only in paid
 * mode with an approved configuration — the price. No invented amounts,
 * no security theatre: the only security statement is the true one (card
 * details are entered on Stripe's hosted page, once Phase 2 is enabled).
 */
export default function OfferPanel({
  offer,
  values,
  areaLabel,
  values_,
  t,
  children,
}) {
  return (
    <aside
      className="cs-panel"
      aria-label={t("consultation.panel.label")}
    >
      <h3 className="cs-panel-heading">
        {t("consultation.panel.heading")}
      </h3>

      <p className="cs-panel-text">{t("consultation.panel.purpose")}</p>

      <dl className="cs-panel-list">
        <div className="cs-panel-row">
          <dt>{t("consultation.panel.mode")}</dt>
          <dd>{t(`consultation.offer.mode.${offer.mode}`)}</dd>
        </div>

        {offer.isPaid && (
          <div className="cs-panel-row cs-panel-row--price">
            <dt>{t("consultation.panel.price")}</dt>
            <dd>
              {offer.priceLabel
                ? `${offer.priceLabel} ${offer.currency || ""}`.trim()
                : t("consultation.offer.pricePending")}
            </dd>
          </div>
        )}

        <div className="cs-panel-row">
          <dt>{t("consultation.panel.next")}</dt>
          <dd>{t(`consultation.offer.next.${offer.mode}`)}</dd>
        </div>
      </dl>

      {offer.isPaid && (
        <p className="cs-panel-note">
          <ShieldCheck
            size={15}
            aria-hidden="true"
          />
          {t("consultation.panel.stripeNote")}
        </p>
      )}

      {children}

      <p className="cs-panel-footnote">
        {t("consultation.panel.footnote")}
      </p>

      {/* Values are rendered only when explicitly requested (review step);
          nothing personal ever goes into the URL. */}
      {values_ && (
        <div className="cs-panel-summary">
          <h4 className="cs-panel-subheading">
            {t("consultation.review.heading")}
          </h4>

          <dl>
            <div className="cs-panel-row">
              <dt>{t("consultation.form.name")}</dt>
              <dd>{values.name}</dd>
            </div>
            <div className="cs-panel-row">
              <dt>{t("consultation.form.email")}</dt>
              <dd>{values.email}</dd>
            </div>
            {values.company && (
              <div className="cs-panel-row">
                <dt>{t("consultation.form.company")}</dt>
                <dd>{values.company}</dd>
              </div>
            )}
            <div className="cs-panel-row">
              <dt>{t("consultation.form.area")}</dt>
              <dd>{areaLabel}</dd>
            </div>
          </dl>

          <button
            type="button"
            className="cs-btn cs-btn--ghost cs-edit"
            onClick={values_.onEdit}
          >
            <Pencil
              size={15}
              aria-hidden="true"
            />
            {t("consultation.review.edit")}
          </button>
        </div>
      )}
    </aside>
  );
}
