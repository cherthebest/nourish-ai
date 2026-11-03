"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--forest)] text-[var(--mist)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl">{t.brand}</p>
          <p className="mt-2 max-w-md text-sm text-white/70">{t.footer.blurb}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-white/80">
          <Link href="/chat" className="transition hover:text-white">
            {t.nav.chat}
          </Link>
          <Link href="/recipes" className="transition hover:text-white">
            {t.nav.recipes}
          </Link>
          <Link href="/planner" className="transition hover:text-white">
            {t.nav.planner}
          </Link>
          <Link href="/bmi" className="transition hover:text-white">
            {t.nav.bmi}
          </Link>
        </div>
      </div>
    </footer>
  );
}