import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, XCircle } from "lucide-react";

import { PAYMENT_OUTCOME } from "../consultation/paymentService";

/**
 * DEVELOPMENT DEMO — simulated hosted checkout.
 *
 * Rendered ONLY when the mock adapter is available, which requires
 * import.meta.env.DEV. There is no card input, no Stripe request and no
 * credential anywhere in this component.
 */
export default function MockCheckout({
  summary,
  busy,
  onSimulate,
  onBack,
  t,
}) {
  const headingRef = useRef(null);
  const [armed, setArmed] = useState("");

  /* Focus moves to the step heading on every step change. */
  useEffect(() => {
    if (headingRef.current) headingRef.current.focus();
  }, []);

  return (
    <section
      className="cs-mock"
      aria-labelledby="cs-mock-heading"
    >
      <div
        className="cs-mock-banner"
        role="note"
      >
        <AlertTriangle
          size={16}
          aria-hidden="true"
        />
        <strong>{t("consultation.mock.banner")}</strong>
      </div>

      <h2
        id="cs-mock-heading"
        ref={headingRef}
        tabIndex={-1}
        className="cs-step-heading"
      >
        {t("consultation.mock.heading")}
      </h2>

      <p className="cs-step-text">{t("consultation.mock.text")}</p>

      <dl className="cs-mock-summary">
        <div className="cs-panel-row">
          <dt>{t("consultation.mock.area")}</dt>
          <dd>{summary.areaLabel}</dd>
        </div>
        <div className="cs-panel-row">
          <dt>{t("consultation.mock.customer")}</dt>
          <dd>{summary.email}</dd>
        </div>
        <div className="cs-panel-row">
          <dt>{t("consultation.mock.status")}</dt>
          <dd>{t("consultation.mock.statusValue")}</dd>
        </div>
      </dl>

      <p className="cs-mock-note">{t("consultation.mock.noCardNote")}</p>

      <div className="cs-mock-actions">
        <button
          type="button"
          className="cs-btn cs-btn--primary"
          disabled={busy}
          aria-busy={busy}
          onClick={() => {
            setArmed("success");
            onSimulate(PAYMENT_OUTCOME.SUCCESS);
          }}
        >
          {busy && armed === "success" && (
            <Loader2
              size={16}
              className="cs-spin"
              aria-hidden="true"
            />
          )}
          {t("consultation.mock.simulateSuccess")}
        </button>

        <button
          type="button"
          className="cs-btn cs-btn--ghost"
          disabled={busy}
          onClick={() => {
            setArmed("cancel");
            onSimulate(PAYMENT_OUTCOME.CANCELLED);
          }}
        >
          {busy && armed === "cancel" && (
            <Loader2
              size={16}
              className="cs-spin"
              aria-hidden="true"
            />
          )}
          {t("consultation.mock.simulateCancel")}
        </button>
      </div>

      <button
        type="button"
        className="cs-linkback"
        onClick={onBack}
      >
        {t("consultation.mock.back")}
      </button>
    </section>
  );
}

/**
 * DEVELOPMENT DEMO — simulated result after the mock checkout.
 * Clearly labelled, never claims a real verified payment.
 */
export function MockResult({ payment, onTryAgain, onBack, t }) {
  const headingRef = useRef(null);

  useEffect(() => {
    if (headingRef.current) headingRef.current.focus();
  }, []);

  const success = payment?.outcome === PAYMENT_OUTCOME.SUCCESS;
  const cancelled = payment?.outcome === PAYMENT_OUTCOME.CANCELLED;

  return (
    <section
      className="cs-result"
      aria-labelledby="cs-result-heading"
    >
      <div
        className="cs-mock-banner"
        role="note"
      >
        <AlertTriangle
          size={16}
          aria-hidden="true"
        />
        <strong>{t("consultation.mock.banner")}</strong>
      </div>

      <span
        className={`cs-result-icon ${success ? "cs-result-icon--ok" : "cs-result-icon--warn"}`}
        aria-hidden="true"
      >
        {success ? <CheckCircle2 size={26} /> : <XCircle size={26} />}
      </span>

      <h2
        id="cs-result-heading"
        ref={headingRef}
        tabIndex={-1}
        className="cs-step-heading"
      >
        {t(
          success
            ? "consultation.mock.successHeading"
            : cancelled
              ? "consultation.mock.cancelHeading"
              : "consultation.mock.failHeading"
        )}
      </h2>

      <p className="cs-step-text">
        {t(
          success
            ? "consultation.mock.successText"
            : cancelled
              ? "consultation.mock.cancelText"
              : "consultation.mock.failText"
        )}
      </p>

      {success && payment?.reference && (
        <p className="cs-result-ref">
          <span>{t("consultation.mock.reference")}</span>
          <code>{payment.reference}</code>
        </p>
      )}

      <p className="cs-mock-note">{t("consultation.mock.realFlowNote")}</p>

      <div className="cs-mock-actions">
        <button
          type="button"
          className="cs-btn cs-btn--primary"
          onClick={onTryAgain}
        >
          {t("consultation.mock.tryAgain")}
        </button>

        <button
          type="button"
          className="cs-btn cs-btn--ghost"
          onClick={onBack}
        >
          {t("consultation.mock.backToConsultation")}
        </button>
      </div>
    </section>
  );
}
