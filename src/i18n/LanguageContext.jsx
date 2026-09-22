import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  defaultLanguage,
  languages,
  translations as baseTranslations,
} from "./translations";

import { pagesTranslations } from "./translations-pages";

// Combine the main translations with page-specific translations
const translations = {
  en: {
    ...baseTranslations.en,
    ...pagesTranslations.en,
  },
  nl: {
    ...baseTranslations.nl,
    ...pagesTranslations.nl,
  },
  de: {
    ...baseTranslations.de,
    ...pagesTranslations.de,
  },
};

export const LanguageContext = createContext(null);

// Custom hook
export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}

const STORAGE_KEY = "systemaops-language";

function resolvePath(source, path) {
  return path
    .split(".")
    .reduce((value, key) => value?.[key], source);
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    return translations[saved]
      ? saved
      : defaultLanguage;
  });

  // Save selected language and update HTML language attribute
  useEffect(() => {
    console.log("Current language:", language);

    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => {
    const setLanguage = (nextLanguage) => {
      console.log("Changing language:", nextLanguage);

      if (translations[nextLanguage]) {
        setLanguageState(nextLanguage);
      }
    };

    const t = (path, replacements = {}) => {
      let translated =
        resolvePath(translations[language], path) ??
        resolvePath(translations[defaultLanguage], path);

      // If translation doesn't exist, return the key
      if (translated === undefined) {
        console.warn(
          `[i18n] Missing translation for key: ${path}`
        );

        return path;
      }

      // Some translation values can be arrays/objects
      if (typeof translated !== "string") {
        return translated;
      }

      // Replace placeholders such as {name}, {country}, etc.
      return Object.entries(replacements).reduce(
        (text, [key, value]) =>
          text.replaceAll(`{${key}}`, value),
        translated
      );
    };

    return {
      language,
      languages,
      setLanguage,
      t,
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}