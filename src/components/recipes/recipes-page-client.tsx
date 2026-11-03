"use client";

import { RecipeBrowser } from "@/components/recipes/recipe-browser";
import { useI18n } from "@/lib/i18n/provider";
import { FadeIn } from "@/components/motion/apple-press";

export function RecipesPageClient() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-10 md:px-8">
      <FadeIn className="mb-10 max-w-2xl">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--forest)] md:text-5xl">
          {t.recipes.title}
        </h1>
        <p className="mt-3 text-[var(--muted-foreground)]">{t.recipes.sub}</p>
      </FadeIn>
      <RecipeBrowser />
    </div>
  );
}