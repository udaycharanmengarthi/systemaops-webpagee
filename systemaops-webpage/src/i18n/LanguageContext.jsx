/* eslint-disable react-refresh/only-export-components -- pre-existing architecture:
   single global language state (context + provider + hook) must stay together
   so every consumer shares one instance. HMR-only concern, no runtime effect. */
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

import {
  serviceContent,
  megaMenuContent,
  sharedContent,
  n8nPageContent,
} from "./translations-services";

// Combine the main translations with page-specific translations.
// serviceDetail / megaMenu / cookie / privacy / common / legal are new
// top-level namespaces and do not collide with existing keys.
const translations = {
  en: {
    ...baseTranslations.en,
    ...pagesTranslations.en,
    serviceDetail: serviceContent.en,
    megaMenu: megaMenuContent.en,
    n8nPage: n8nPageContent.en,
    cookie: sharedContent.en.cookie,
    privacy: sharedContent.en.privacy,
    common: sharedContent.en.common,
    legal: sharedContent.en.legal,
  },
  nl: {
    ...baseTranslations.nl,
    ...pagesTranslations.nl,
    serviceDetail: serviceContent.nl,
    megaMenu: megaMenuContent.nl,
    n8nPage: n8nPageContent.nl,
    cookie: sharedContent.nl.cookie,
    privacy: sharedContent.nl.privacy,
    common: sharedContent.nl.common,
    legal: sharedContent.nl.legal,
  },
  de: {
    ...baseTranslations.de,
    ...pagesTranslations.de,
    serviceDetail: serviceContent.de,
    megaMenu: megaMenuContent.de,
    n8nPage: n8nPageContent.de,
    cookie: sharedContent.de.cookie,
    privacy: sharedContent.de.privacy,
    common: sharedContent.de.common,
    legal: sharedContent.de.legal,
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

  // Save selected language and update HTML language attribute.
  // setLanguage only flips global state: the active route re-renders
  // in place, no navigation and no reload.
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(() => {
    const setLanguage = (nextLanguage) => {
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