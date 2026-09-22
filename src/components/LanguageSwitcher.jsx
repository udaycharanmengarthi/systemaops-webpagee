import { Languages } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";

export default function LanguageSwitcher({ className = "" }) {
  const { language, languages, setLanguage, t } = useLanguage();

  return (
    <label className={`language-switcher ${className}`}>
      <Languages size={15} aria-hidden="true" />
      <span className="language-switcher__label">{t("nav.language")}</span>
      <select
        aria-label={t("nav.language")}
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
