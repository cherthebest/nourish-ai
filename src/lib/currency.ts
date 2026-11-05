export type CurrencyCode = "USD" | "HKD" | "TWD" | "CNY" | "SGD" | "MYR" | "GBP" | "EUR" | "AUD" | "JPY";

/** Approximate FX vs USD for display (update periodically; not live rates). */
export const FX_FROM_USD: Record<CurrencyCode, number> = {
  USD: 1,
  HKD: 7.8,
  TWD: 32,
  CNY: 7.2,
  SGD: 1.34,
  MYR: 4.45,
  GBP: 0.78,
  EUR: 0.92,
  AUD: 1.52,
  JPY: 150,
};

export const CURRENCY_META: Record<
  CurrencyCode,
  { label: string; labelZh: string; locale: string }
> = {
  USD: { label: "US Dollar", labelZh: "美元", locale: "en-US" },
  HKD: { label: "Hong Kong Dollar", labelZh: "港幣", locale: "zh-HK" },
  TWD: { label: "New Taiwan Dollar", labelZh: "新台幣", locale: "zh-TW" },
  CNY: { label: "Chinese Yuan", labelZh: "人民幣", locale: "zh-CN" },
  SGD: { label: "Singapore Dollar", labelZh: "新加坡元", locale: "en-SG" },
  MYR: { label: "Malaysian Ringgit", labelZh: "馬幣", locale: "ms-MY" },
  GBP: { label: "British Pound", labelZh: "英鎊", locale: "en-GB" },
  EUR: { label: "Euro", labelZh: "歐元", locale: "de-DE" },
  AUD: { label: "Australian Dollar", labelZh: "澳幣", locale: "en-AU" },
  JPY: { label: "Japanese Yen", labelZh: "日圓", locale: "ja-JP" },
};

export const CURRENCY_STORAGE_KEY = "nourishai-currency";

export function detectCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "USD";
  const saved = window.localStorage.getItem(CURRENCY_STORAGE_KEY) as CurrencyCode | null;
  if (saved && saved in FX_FROM_USD) return saved;

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const lang = (navigator.language || "").toLowerCase();

  if (tz.includes("Hong_Kong") || lang.includes("zh-hk") || lang === "zh-hk") return "HKD";
  if (tz.includes("Taipei") || lang.includes("zh-tw")) return "TWD";
  if (tz.includes("Shanghai") || tz.includes("Beijing") || lang.includes("zh-cn")) return "CNY";
  if (tz.includes("Singapore") || lang.includes("en-sg")) return "SGD";
  if (tz.includes("Kuala_Lumpur") || lang.includes("ms")) return "MYR";
  if (tz.includes("London") || lang.includes("en-gb")) return "GBP";
  if (tz.includes("Tokyo") || lang.includes("ja")) return "JPY";
  if (tz.includes("Sydney") || tz.includes("Melbourne") || lang.includes("en-au")) return "AUD";
  if (
    tz.includes("Berlin") ||
    tz.includes("Paris") ||
    tz.includes("Rome") ||
    tz.includes("Madrid") ||
    lang.startsWith("de") ||
    lang.startsWith("fr") ||
    lang.startsWith("es") ||
    lang.startsWith("it")
  ) {
    return "EUR";
  }
  return "USD";
}

/** `usdAmount` is stored recipe cost in USD. */
export function convertFromUsd(usdAmount: number, currency: CurrencyCode) {
  return usdAmount * FX_FROM_USD[currency];
}

export function formatMoney(usdAmount: number, currency: CurrencyCode) {
  const value = convertFromUsd(usdAmount, currency);
  const meta = CURRENCY_META[currency];
  return new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(value);
}