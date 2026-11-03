import type { Locale, Dictionary } from "../types";
import { en } from "./en";
import { zhHant } from "./zh-Hant";

export const dictionaries: Record<Locale, Dictionary> = {
  en: en as Dictionary,
  "zh-Hant": zhHant as Dictionary,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}