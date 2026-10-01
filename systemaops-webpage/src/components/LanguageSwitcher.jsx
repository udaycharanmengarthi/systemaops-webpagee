import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Languages } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import "./LanguageSwitcher.css";

export default function LanguageSwitcher({ className = "" }) {
  const { language, languages, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const optionRefs = useRef([]);

  const activeIndex = Math.max(
    0,
    languages.findIndex((item) => item.code === language),
  );
  const active = languages[activeIndex] || languages[0];

  /* Close on outside click */
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open ]);

  const focusOption = (index) => {
    const total = languages.length;
    const next = ((index % total) + total) % total;
    const el = optionRefs.current[next];
    if (el) el.focus();
  };

  const choose = (code) => {
    setLanguage(code);
    setOpen(false);
    if (buttonRef.current) buttonRef.current.focus();
  };

  const onButtonKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((v) => !v);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      window.requestAnimationFrame(() => focusOption(activeIndex));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      window.requestAnimationFrame(() => focusOption(activeIndex));
    }
  };

  const onOptionKeyDown = (event, index) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      if (buttonRef.current) buttonRef.current.focus();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      focusOption(index + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusOption(index - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      choose(languages[index].code);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={`language-switcher ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        className="language-switcher__button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("nav.language")}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onButtonKeyDown}
      >
        <Languages size={15} aria-hidden="true" />
        <span className="language-switcher__current">{active.label}</span>
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={`language-switcher__chevron${open ? " open" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("nav.language")}
          className="language-switcher__menu"
        >
          {languages.map((item, index) => {
            const selected = item.code === language;
            return (
              <li key={item.code} role="presentation">
                <button
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`language-switcher__option${
                    selected ? " selected" : ""
                  }`}
                  onClick={() => choose(item.code)}
                  onKeyDown={(event) => onOptionKeyDown(event, index)}
                >
                  <span>{item.label}</span>
                  {selected && (
                    <Check size={14} aria-hidden="true" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
