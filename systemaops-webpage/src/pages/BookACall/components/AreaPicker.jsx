import { Check } from "lucide-react";

/**
 * Areas of expertise — accessible single-select group.
 *
 * Implemented as a radiogroup: arrow keys move between options, which is
 * the native behaviour visitors expect and what screen readers announce.
 * This is the single source of truth for "area of interest": the form
 * field mirrors it and both write the same state.
 */
export default function AreaPicker({ areas, value, onChange, t }) {
  const handleKeyDown = (event, index) => {
    const { key } = event;
    const last = areas.length - 1;
    let next = null;

    if (key === "ArrowRight" || key === "ArrowDown") next = index === last ? 0 : index + 1;
    else if (key === "ArrowLeft" || key === "ArrowUp") next = index === 0 ? last : index - 1;
    else if (key === "Home") next = 0;
    else if (key === "End") next = last;

    if (next === null) return;

    event.preventDefault();
    onChange(areas[next].value);

    /* Keep focus on the newly selected option for keyboard users. */
    const group = event.currentTarget.closest('[role="radiogroup"]');
    const target = group && group.querySelectorAll('[role="radio"]')[next];
    if (target) target.focus();
  };

  return (
    <div
      className="cs-areas"
      role="radiogroup"
      aria-labelledby="cs-areas-label"
      aria-describedby="cs-areas-hint"
    >
      <h3
        id="cs-areas-label"
        className="cs-subheading"
      >
        {t("consultation.areas.heading")}
      </h3>

      <p
        id="cs-areas-hint"
        className="cs-hint"
      >
        {t("consultation.areas.hint")}
      </p>

      <ul className="cs-areas-grid">
        {areas.map((area, index) => {
          const selected = value === area.value;

          return (
            <li key={area.value}>
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                tabIndex={selected || (!value && index === 0) ? 0 : -1}
                className={`cs-area ${selected ? "cs-area--selected" : ""}`}
                onClick={() => onChange(area.value)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                <span className="cs-area-top">
                  <span className="cs-area-title">{area.label}</span>

                  <span
                    className="cs-area-check"
                    aria-hidden="true"
                  >
                    {selected && <Check size={14} />}
                  </span>
                </span>

                {area.desc && (
                  <span className="cs-area-desc">{area.desc}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
