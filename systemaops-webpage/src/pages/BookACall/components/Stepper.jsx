import { Check } from "lucide-react";

/**
 * Stepper — Details -> Review -> [Payment] -> Confirmation.
 * Only the steps that apply to this build/offer are rendered.
 */
export default function Stepper({ steps, current, t }) {
  const currentIndex = steps.findIndex((s) => s.id === current);

  return (
    <nav
      className="cs-stepper"
      aria-label={t("consultation.steps.label")}
    >
      <ol className="cs-stepper-list">
        {steps.map((step, index) => {
          const state =
            index < currentIndex
              ? "done"
              : index === currentIndex
                ? "current"
                : "todo";

          return (
            <li
              key={step.id}
              className={`cs-stepper-item cs-stepper-item--${state}`}
              aria-current={state === "current" ? "step" : undefined}
            >
              <span
                className="cs-stepper-dot"
                aria-hidden="true"
              >
                {state === "done" ? <Check size={13} /> : index + 1}
              </span>

              <span className="cs-stepper-label">
                {t(step.labelKey)}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
