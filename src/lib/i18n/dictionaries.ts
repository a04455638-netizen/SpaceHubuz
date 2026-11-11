import { uz } from "./uz";
import { ru } from "./ru";
import { en } from "./en";
import type { Locale, Translations } from "./types";

export function getTranslation(locale: Locale = "uz"): Translations {
  if (locale === "ru") return ru;
  if (locale === "en") return en;
  return uz;
}

export const dictionaries: Record<Locale, Translations> = {
  uz,
  ru,
  en,
};
