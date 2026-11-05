"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Leaf } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { CurrencySwitcher } from "@/components/layout/currency-switcher";
import { useI18n } from "@/lib/i18n/provider";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  const links = [
    { href: "/recipes", label: t.nav.recipes },
    { href: "/chat", label: t.nav.chat },
    { href: "/analyze", label: t.nav.analyze },
    { href: "/planner", label: t.nav.planner },
    { href: "/bmi", label: t.nav.bmi },
  ];

  const onHome = pathname === "/";

  return (
    <header className="sticky top-0 z-40">
      <div
        className={cn(
          "border-b transition-[background,border-color,backdrop-filter] duration-300",
          onHome
            ? "border-transparent bg-transparent"
            : "border-[var(--border)]/60 bg-white/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/55",
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3.5 md:px-8">
          <Link href="/" className="group flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md transition duration-300 group-hover:scale-105 group-active:scale-95">
              <Leaf className="h-4 w-4" />
            </span>
            <span
              className={cn(
                "font-[family-name:var(--font-display)] text-xl tracking-tight md:text-2xl",
                onHome ? "text-white drop-shadow-sm" : "text-[var(--forest)]",
              )}
            >
              {t.brand}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition duration-300",
                  onHome
                    ? "text-white/85 hover:bg-white/15 hover:text-white"
                    : "text-[var(--forest)]/75 hover:bg-black/[0.04] hover:text-[var(--forest)]",
                  pathname === l.href &&
                    (onHome ? "bg-white/20 text-white" : "bg-black/[0.06] text-[var(--forest)]"),
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <CurrencySwitcher
              tone={onHome ? "onDark" : "default"}
              className="max-w-[7.5rem] sm:max-w-[9.5rem]"
            />
            <LanguageSwitcher tone={onHome ? "onDark" : "default"} />
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/chat">{t.nav.openChat}</Link>
            </Button>
            <button
              type="button"
              className={cn(
                "rounded-xl border p-2 transition active:scale-95 lg:hidden",
                onHome
                  ? "border-white/30 bg-white/15 text-white"
                  : "border-[var(--border)] bg-white/70 text-[var(--forest)]",
              )}
              onClick={() => setOpen((v) => !v)}
              aria-label={t.nav.menu}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mx-5 mb-3 overflow-hidden rounded-2xl border border-[var(--border)] bg-white/95 p-2 shadow-lg backdrop-blur-xl lg:hidden"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-3 text-sm font-medium text-[var(--forest)] transition hover:bg-[var(--muted)] active:scale-[0.99]"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/chat"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-xl bg-[var(--primary)] px-3 py-3 text-center text-sm font-semibold text-white"
            >
              {t.nav.openChat}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}