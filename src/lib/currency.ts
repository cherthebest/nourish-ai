export type CurrencyCode =
  | "USD"
  | "HKD"
  | "TWD"
  | "CNY"
  | "SGD"
  | "MYR"
  | "GBP"
  | "EUR"
  | "AUD"
  | "JPY"
  | "KRW"
  | "THB"
  | "IDR"
  | "PHP"
  | "VND"
  | "INR"
  | "CAD"
  | "NZD"
  | "CHF"
  | "AED"
  | "SAR"
  | "MOP";

/** Approximate FX vs USD for display (not live rates). */
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
  KRW: 1350,
  THB: 35,
  IDR: 15800,
  PHP: 58,
  VND: 25400,
  INR: 84,
  CAD: 1.38,
  NZD: 1.68,
  CHF: 0.88,
  AED: 3.67,
  SAR: 3.75,
  MOP: 8.0,
};

export const CURRENCY_META: Record<
  CurrencyCode,
  { label: string; labelZh: string; locale: string }
> = {
  USD: { label: "US Dollar", labelZh: "美元", locale: "en-US" },
  HKD: { label: "Hong Kong Dollar", labelZh: "港幣", locale: "zh-HK" },
  MOP: { label: "Macanese Pataca", labelZh: "澳門幣", locale: "zh-MO" },
  TWD: { label: "New Taiwan Dollar", labelZh: "新台幣", locale: "zh-TW" },
  CNY: { label: "Chinese Yuan", labelZh: "人民幣", locale: "zh-CN" },
  SGD: { label: "Singapore Dollar", labelZh: "新加坡元", locale: "en-SG" },
  MYR: { label: "Malaysian Ringgit", labelZh: "馬幣", locale: "ms-MY" },
  GBP: { label: "British Pound", labelZh: "英鎊", locale: "en-GB" },
  EUR: { label: "Euro", labelZh: "歐元", locale: "de-DE" },
  AUD: { label: "Australian Dollar", labelZh: "澳幣", locale: "en-AU" },
  JPY: { label: "Japanese Yen", labelZh: "日圓", locale: "ja-JP" },
  KRW: { label: "South Korean Won", labelZh: "韓圓", locale: "ko-KR" },
  THB: { label: "Thai Baht", labelZh: "泰銖", locale: "th-TH" },
  IDR: { label: "Indonesian Rupiah", labelZh: "印尼盾", locale: "id-ID" },
  PHP: { label: "Philippine Peso", labelZh: "菲律賓披索", locale: "en-PH" },
  VND: { label: "Vietnamese Dong", labelZh: "越南盾", locale: "vi-VN" },
  INR: { label: "Indian Rupee", labelZh: "印度盧比", locale: "en-IN" },
  CAD: { label: "Canadian Dollar", labelZh: "加幣", locale: "en-CA" },
  NZD: { label: "New Zealand Dollar", labelZh: "紐幣", locale: "en-NZ" },
  CHF: { label: "Swiss Franc", labelZh: "瑞士法郎", locale: "de-CH" },
  AED: { label: "UAE Dirham", labelZh: "阿聯酋迪拉姆", locale: "ar-AE" },
  SAR: { label: "Saudi Riyal", labelZh: "沙特里亞爾", locale: "ar-SA" },
};

export const CURRENCY_STORAGE_KEY = "nourishai-currency";

const ZERO_DECIMAL: CurrencyCode[] = ["JPY", "KRW", "VND", "IDR"];

export function detectCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "USD";
  const saved = window.localStorage.getItem(CURRENCY_STORAGE_KEY) as CurrencyCode | null;
  if (saved && saved in FX_FROM_USD) return saved;

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const lang = (navigator.language || "").toLowerCase();

  if (tz.includes("Hong_Kong") || lang.includes("zh-hk")) return "HKD";
  if (tz.includes("Macau") || lang.includes("zh-mo")) return "MOP";
  if (tz.includes("Taipei") || lang.includes("zh-tw")) return "TWD";
  if (tz.includes("Shanghai") || tz.includes("Beijing") || lang.includes("zh-cn")) return "CNY";
  if (tz.includes("Singapore") || lang.includes("en-sg")) return "SGD";
  if (tz.includes("Kuala_Lumpur") || lang.includes("ms")) return "MYR";
  if (tz.includes("Seoul") || lang.startsWith("ko")) return "KRW";
  if (tz.includes("Bangkok") || lang.startsWith("th")) return "THB";
  if (tz.includes("Jakarta") || lang.startsWith("id")) return "IDR";
  if (tz.includes("Manila") || lang.includes("fil") || lang.includes("tl")) return "PHP";
  if (tz.includes("Ho_Chi_Minh") || tz.includes("Hanoi") || lang.startsWith("vi")) return "VND";
  if (tz.includes("Kolkata") || tz.includes("Mumbai") || lang.startsWith("hi") || lang.includes("en-in"))
    return "INR";
  if (tz.includes("Dubai") || lang.includes("ar-ae")) return "AED";
  if (tz.includes("Riyadh") || lang.includes("ar-sa")) return "SAR";
  if (tz.includes("Toronto") || tz.includes("Vancouver") || lang.includes("en-ca")) return "CAD";
  if (tz.includes("Auckland") || lang.includes("en-nz")) return "NZD";
  if (tz.includes("Zurich") || lang.includes("de-ch") || lang.includes("fr-ch")) return "CHF";
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

export function convertFromUsd(usdAmount: number, currency: CurrencyCode) {
  return usdAmount * FX_FROM_USD[currency];
}

export function formatMoney(usdAmount: number, currency: CurrencyCode) {
  const value = convertFromUsd(usdAmount, currency);
  const meta = CURRENCY_META[currency];
  return new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency,
    maximumFractionDigits: ZERO_DECIMAL.includes(currency) ? 0 : 2,
  }).format(value);
}
