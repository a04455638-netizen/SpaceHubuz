"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { Locale, Translations } from "./types";
import { getTranslation } from "./index";

interface I18nContextValue {
  locale: Locale;
  setLocale: (nextLocale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "uz",
  setLocale: () => {},
  t: getTranslation("uz"),
});

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "uz";
  try {
    const saved = localStorage.getItem("spacehub_locale") as Locale | null;
    if (saved && (saved === "uz" || saved === "ru" || saved === "en")) {
      document.documentElement.lang = saved;
      return saved;
    }
  } catch {
    // ignore storage access errors
  }
  return "uz";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  function setLocale(next: Locale) {
    setLocaleState(next);
    try {
      localStorage.setItem("spacehub_locale", next);
      document.cookie = `spacehub_locale=${next}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = next;
    } catch {
      // ignore
    }
  }

  const t = getTranslation(locale);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
