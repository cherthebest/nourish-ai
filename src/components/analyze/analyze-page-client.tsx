"use client";

import { AnalyzeForm } from "@/components/analyze/analyze-form";
import { useI18n } from "@/lib/i18n/provider";
import { FadeIn } from "@/components/motion/apple-press";

export function AnalyzePageClient() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-4xl px-5 pb-20 pt-10 md:px-8">
      <FadeIn className="mb-10 max-w-2xl">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--forest)] md:text-5xl">
          {t.analyze.title}
        </h1>
        <p className="mt-3 text-[var(--muted-foreground)]">{t.analyze.sub}</p>
      </FadeIn>
      <AnalyzeForm />
    </div>
  );
}