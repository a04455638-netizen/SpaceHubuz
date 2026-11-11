import { uz } from "./uz";
import { ru } from "./ru";
import { en } from "./en";
import type { Locale, Translations } from "./types";

export * from "./types";
export * from "./context";

const dictionaries: Record<Locale, Translations> = {
  uz,
  ru,
  en,
};

export function getTranslation(locale: Locale = "uz"): Translations {
  return dictionaries[locale] || dictionaries.uz;
}
