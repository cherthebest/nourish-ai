"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CURRENCY_STORAGE_KEY,
  detectCurrency,
  formatMoney,
  type CurrencyCode,
} from "@/lib/currency";

type Ctx = {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  money: (usdAmount: number) => string;
  ready: boolean;
};

const CurrencyContext = createContext<Ctx | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCurrencyState(detectCurrency());
    setReady(true);
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, c);
  }, []);

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      money: (usd: number) => formatMoney(usd, currency),
      ready,
    }),
    [currency, setCurrency, ready],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}