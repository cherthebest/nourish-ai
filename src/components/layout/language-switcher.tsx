"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/provider";
import { LOCALES, type Locale } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  className,
  tone = "default",
}: {
  className?: string;
  tone?: "default" | "onDark";
}) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className={cn(
        "relative inline-flex items-center rounded-full border p-1 shadow-sm backdrop-blur-xl",
        tone === "onDark"
          ? "border-white/25 bg-white/15"
          : "border-[var(--border)]/80 bg-white/55",
        className,
      )}
      role="group"
      aria-label={t.nav.language}
    >
      {LOCALES.map((item) => {
        const active = locale === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setLocale(item.id as Locale)}
            className={cn(
              "relative z-10 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide transition-colors",
              tone === "onDark"
                ? active
                  ? "text-[var(--forest)]"
                  : "text-white/80 hover:text-white"
                : active
                  ? "text-[var(--forest)]"
                  : "text-[var(--muted-foreground)] hover:text-[var(--forest)]",
            )}
            aria-pressed={active}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-full bg-white shadow-[0_1px_2px_rgba(20,53,47,0.12)]"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            {item.short}
          </button>
        );
      })}
    </div>
  );
}