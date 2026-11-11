"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
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

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function I18nProvider({
  children,
  initialLocale = "uz",
}: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Sync client-side if a valid locale exists in localStorage and differs from initial SSR
  useEffect(() => {
    try {
      const saved = localStorage.getItem("spacehub_locale") as Locale | null;
      if (
        saved &&
        saved !== initialLocale &&
        (saved === "uz" || saved === "ru" || saved === "en")
      ) {
        document.cookie = `spacehub_locale=${saved}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.lang = saved;
        queueMicrotask(() => {
          setLocaleState(saved);
        });
      }
    } catch {
      // ignore
    }
  }, [initialLocale]);

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
