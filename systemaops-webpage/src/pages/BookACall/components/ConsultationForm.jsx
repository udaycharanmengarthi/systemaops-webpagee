import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, Loader2, LockKeyhole } from "lucide-react";

import { MESSAGE_MAX } from "../consultation/validation";

const ERROR_TARGETS = {
  name: "cs-name",
  email: "cs-email",
  areaOfInterest: "cs-area",
  message: "cs-message",
  privacyAccepted: "cs-privacy",
};

export default function ConsultationForm({
  areas,
  values,
  errors,
  errorList,
  touched,
  submitError,
  status,
  paymentRequired,
  priceLabel,
  paymentOfferError,
  onRetryOffer,
  onChange,
  onBlur,
  onSubmit,
  errorMessages,
  t,
}) {
  const summaryRef = useRef(null);
  const shouldFocusSummary = useRef(false);

  useEffect(() => {
    if (errorList.length > 0 && shouldFocusSummary.current) {
      shouldFocusSummary.current = false;
      if (summaryRef.current) summaryRef.current.focus();
    }
  }, [errorList.length]);

  const pending = status === "submitting";
  const messageLength = (values.message || "").length;

  const handleSubmit = (event) => {
    event.preventDefault();
    shouldFocusSummary.current = true;
    onSubmit();
  };

  const describedBy = (field) => {
    const hint = field === "message" ? "cs-message-hint" : "";
    const error = errors[field] ? `${ERROR_TARGETS[field]}-error` : "";
    return [hint, error].filter(Boolean).join(" ") || undefined;
  };

  const fieldError = (field) =>
    errors[field] && touched[field] ? (
      <span
        id={`${ERROR_TARGETS[field]}-error`}
        className="cs-field-error"
      >
        {errorMessages[errors[field]] || errors[field]}
      </span>
    ) : null;

  const submitLabel = paymentRequired
    ? t("consultation.review.toPayment")
    : t("consultation.form.submit");

  const submittingLabel = paymentRequired
    ? t("payments.loading")
    : t("consultation.form.submitting");

  return (
    <form
      className="cs-form-card"
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="cs-form-heading"
    >
      <header className="cs-form-header">
        <h2
          id="cs-form-heading"
          className="cs-form-title"
        >
          {t("consultation.form.heading")}
        </h2>

        <p className="cs-form-sub">
          {t("consultation.form.subheading")}
        </p>
      </header>

      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="cs-error-summary"
          role="alert"
        >
          <p className="cs-error-summary-title">
            <AlertCircle size={16} aria-hidden="true" />
            {t("consultation.form.errorSummaryTitle", {
              count: errorList.length,
            })}
          </p>

          <ul>
            {errorList.map((item) => (
              <li key={item.field}>
                <a href={`#${ERROR_TARGETS[item.field]}`}>
                  {errorMessages[item.key] || item.key}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {submitError && (
        <p className="cs-alert" role="alert">
          <AlertCircle size={16} aria-hidden="true" />
          {t(`consultation.form.submitError.${submitError}`)}
        </p>
      )}

      <div className="cs-form-grid">
        <div className="cs-field">
          <label className="cs-label" htmlFor="cs-name">
            {t("consultation.form.name")}
          </label>

          <input
            id="cs-name"
            name="name"
            className="cs-input"
            type="text"
            autoComplete="name"
            maxLength={120}
            value={values.name}
            onChange={(event) => onChange("name", event.target.value)}
            onBlur={() => onBlur("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            required
          />

          {fieldError("name")}
        </div>

        <div className="cs-field">
          <label className="cs-label" htmlFor="cs-email">
            {t("consultation.form.email")}
          </label>

          <input
            id="cs-email"
            name="email"
            className="cs-input"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={254}
            value={values.email}
            onChange={(event) => onChange("email", event.target.value)}
            onBlur={() => onBlur("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            required
          />

          {fieldError("email")}
        </div>

        <div className="cs-field">
          <label className="cs-label" htmlFor="cs-company">
            {t("consultation.form.company")}
            <span className="cs-optional">
              {t("consultation.form.optional")}
            </span>
          </label>

          <input
            id="cs-company"
            name="company"
            className="cs-input"
            type="text"
            autoComplete="organization"
            maxLength={160}
            value={values.company}
            onChange={(event) => onChange("company", event.target.value)}
          />
        </div>

        <div className="cs-field">
          <label className="cs-label" htmlFor="cs-area">
            {t("consultation.form.area")}
            <span className="cs-optional">
              {t("consultation.form.optional")}
            </span>
          </label>

          <select
            id="cs-area"
            name="areaOfInterest"
            className="cs-input cs-select"
            value={values.areaOfInterest}
            onChange={(event) => onChange("areaOfInterest", event.target.value)}
            onBlur={() => onBlur("areaOfInterest")}
            aria-invalid={Boolean(errors.areaOfInterest)}
            aria-describedby={describedBy("areaOfInterest")}
          >
            <option value="">{t("consultation.form.areaPlaceholder")}</option>

            {areas.map((area) => (
              <option key={area.value} value={area.value}>
                {area.label}
              </option>
            ))}
          </select>

          {fieldError("areaOfInterest")}
        </div>

        <div className="cs-field cs-field--full">
          <label className="cs-label" htmlFor="cs-message">
            {t("consultation.form.message")}
          </label>

          <textarea
            id="cs-message"
            name="message"
            className="cs-input cs-textarea"
            rows={5}
            maxLength={MESSAGE_MAX}
            value={values.message}
            onChange={(event) => onChange("message", event.target.value)}
            onBlur={() => onBlur("message")}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy("message")}
            required
          />

          <span
            id="cs-message-hint"
            className="cs-counter"
            aria-live="polite"
          >
            {t("consultation.form.counter", {
              count: messageLength,
              max: MESSAGE_MAX,
            })}
          </span>

          {fieldError("message")}
        </div>
      </div>

      <div className="cs-privacy-block">
        <label className="cs-check" htmlFor="cs-privacy">
          <input
            id="cs-privacy"
            name="privacyAccepted"
            type="checkbox"
            checked={values.privacyAccepted}
            onChange={(event) =>
              onChange("privacyAccepted", event.target.checked)
            }
            onBlur={() => onBlur("privacyAccepted")}
            aria-invalid={Boolean(errors.privacyAccepted)}
            aria-describedby={describedBy("privacyAccepted")}
            required
          />

          <span>{t("consultation.form.privacy")}</span>
        </label>

        <Link
          to="/privacy-policy"
          className="cs-privacy-link"
        >
          {t("privacy.policyLink")}
        </Link>

        {fieldError("privacyAccepted")}
      </div>

      {paymentRequired && (
        <div className="cs-price-block">
          <div>
            <span className="cs-price-label">
              {t("consultation.panel.price")}
            </span>

            <strong className="cs-price-value" aria-live="polite">
              {priceLabel || t("consultation.offer.pricePending")}
            </strong>
          </div>

          <span className="cs-price-caption">
            {t("consultation.panel.oneTime")}
          </span>
        </div>
      )}

      {paymentRequired && paymentOfferError && (
        <div className="cs-price-alert" role="status">
          <span>{t(paymentOfferError)}</span>
          <button
            type="button"
            className="cs-inline-link"
            onClick={onRetryOffer}
          >
            {t("payments.retryConfiguration")}
          </button>
        </div>
      )}

      <button
        type="submit"
        className="cs-btn cs-btn--primary cs-submit"
        disabled={pending}
        aria-busy={pending}
      >
        {pending && (
          <Loader2 size={17} className="cs-spin" aria-hidden="true" />
        )}

        {pending ? submittingLabel : submitLabel}
      </button>

      <p className="cs-form-note cs-form-reassurance">
        {paymentRequired && (
          <LockKeyhole size={14} aria-hidden="true" />
        )}
        <span>
          {t(
            paymentRequired
              ? "consultation.panel.secureCheckout"
              : "consultation.form.note"
          )}
        </span>
      </p>
    </form>
  );
}
