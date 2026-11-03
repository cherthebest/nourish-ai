"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { getDictionary } from "./dictionaries";
import type { Dictionary, Locale } from "./types";
import { LOCALE_STORAGE_KEY } from "./types";

type I18nContextValue = {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  ready: boolean;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function detectLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (saved === "en" || saved === "zh-Hant") return saved;
  const nav = navigator.language.toLowerCase();
  if (nav.startsWith("zh")) return "zh-Hant";
  return "en";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [ready, setReady] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const next = detectLocale();
    setLocaleState(next);
    document.documentElement.lang = next === "zh-Hant" ? "zh-Hant" : "en";
    setReady(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    startTransition(() => {
      setLocaleState(next);
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
      document.documentElement.lang = next === "zh-Hant" ? "zh-Hant" : "en";
    });
  }, []);

  const value = useMemo(
    () => ({
      locale,
      t: getDictionary(locale),
      setLocale,
      ready,
    }),
    [locale, setLocale, ready],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}