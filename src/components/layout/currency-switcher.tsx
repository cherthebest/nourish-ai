"use client";

import { useCurrency } from "@/lib/i18n/currency-provider";
import { CURRENCY_META, type CurrencyCode } from "@/lib/currency";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

const OPTIONS: CurrencyCode[] = [
  "HKD",
  "MOP",
  "TWD",
  "CNY",
  "SGD",
  "MYR",
  "USD",
  "JPY",
  "KRW",
  "THB",
  "IDR",
  "PHP",
  "VND",
  "INR",
  "AED",
  "SAR",
  "EUR",
  "GBP",
  "AUD",
  "CAD",
  "NZD",
  "CHF",
];

export function CurrencySwitcher({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "onDark";
}) {
  const { currency, setCurrency } = useCurrency();
  const { locale } = useI18n();

  return (
    <select
      aria-label={locale === "zh-Hant" ? "貨幣" : "Currency"}
      className={cn(
        "h-9 max-w-[9.5rem] rounded-full border px-2 text-xs font-semibold outline-none transition focus:ring-2 focus:ring-[var(--ring)]",
        tone === "onDark"
          ? "border-white/25 bg-white/15 text-white"
          : "border-[var(--border)] bg-white/70 text-[var(--forest)]",
        className,
      )}
      value={currency}
      onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
    >
      {OPTIONS.map((code) => (
        <option key={code} value={code} className="text-[var(--forest)]">
          {code} · {locale === "zh-Hant" ? CURRENCY_META[code].labelZh : CURRENCY_META[code].label}
        </option>
      ))}
    </select>
  );
}
