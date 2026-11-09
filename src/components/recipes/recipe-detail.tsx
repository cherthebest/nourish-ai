"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Coins, ExternalLink, Users } from "lucide-react";
import type { Recipe } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import { useCurrency } from "@/lib/i18n/currency-provider";
import { localizeRecipe } from "@/lib/i18n/recipe-locale";
import { storesForCurrency } from "@/lib/ingredient-stores";
import { FadeIn } from "@/components/motion/apple-press";

const ALLERGEN_ZH: Record<string, string> = {
  peanuts: "花生",
  "tree-nuts": "樹堅果",
  dairy: "乳製品",
  eggs: "雞蛋",
  shellfish: "甲殼類海鮮",
  fish: "魚",
  soy: "大豆",
  wheat: "小麥",
  sesame: "芝麻",
};

export function RecipeDetail({ recipe: base }: { recipe: Recipe }) {
  const { t, locale } = useI18n();
  const { money, currency } = useCurrency();
  const recipe = localizeRecipe(base, locale);
  const n = recipe.nutrients;
  const zh = locale === "zh-Hant";
  const stores = storesForCurrency(currency);

  return (
    <div className="pb-20">
      <div className={`relative h-64 overflow-hidden bg-gradient-to-br ${recipe.imageGradient} md:h-80`}>
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-black/10 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium text-[var(--forest)]/80">{recipe.cuisine}</p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--forest)] md:text-5xl">
              {recipe.title}
            </h1>
          </div>
        </div>
      </div>

      <FadeIn className="mx-auto grid max-w-6xl gap-10 px-5 pt-8 md:grid-cols-[1.4fr_1fr] md:px-8">
        <div className="space-y-8">
          <p className="text-lg text-[var(--muted-foreground)]">{recipe.summary}</p>
          <div className="flex flex-wrap gap-4 text-sm font-medium text-[var(--forest)]">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {recipe.prepMinutes + recipe.cookMinutes} {t.recipes.min}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {recipe.servings} {t.recipes.servings}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Coins className="h-4 w-4" />
              {money(recipe.costPerServing)} {t.recipes.perServing}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {recipe.groups.map((g) => (
              <Badge key={g}>{t.groups[g]?.label ?? g}</Badge>
            ))}
            {recipe.tags.map((tag) => (
              <Badge key={tag} className="bg-[var(--accent-soft)] text-[var(--primary)]">
                {t.tags[tag as keyof typeof t.tags] ?? tag}
              </Badge>
            ))}
          </div>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--forest)]">
              {t.recipes.whyHealthy}
            </h2>
            <p className="mt-3 text-[var(--muted-foreground)]">{recipe.whyHealthy}</p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--forest)]">
              {t.recipes.ingredients}
            </h2>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              {zh
                ? "點食材名稱可到常見超市搜尋（連結僅供參考，價格以店家為準）。"
                : "Tap an ingredient to search common grocery sites (informational links; prices vary)."}
            </p>
            <ul className="mt-4 space-y-2">
              {recipe.ingredients.map((ing) => {
                const primary = stores[0];
                const searchName = zh ? ing.name : ing.name;
                return (
                  <li
                    key={ing.name}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm transition hover:bg-[var(--muted)]"
                  >
                    <span>
                      <span className="font-medium text-[var(--forest)]">{ing.amount}</span> {ing.name}
                    </span>
                    <span className="flex flex-wrap items-center gap-2">
                      {ing.cost != null && (
                        <span className="text-[var(--muted-foreground)]">~{money(ing.cost)}</span>
                      )}
                      {primary && (
                        <a
                          href={primary.url(searchName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-[var(--primary)] hover:underline"
                        >
                          {zh ? primary.labelZh : primary.labelEn}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </span>
                    <span className="flex w-full flex-wrap gap-2 border-t border-[var(--border)]/60 pt-2">
                      {stores.slice(1).map((s) => (
                        <a
                          key={s.id}
                          href={s.url(searchName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:underline"
                        >
                          {zh ? s.labelZh : s.labelEn}
                        </a>
                      ))}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--forest)]">
              {t.recipes.steps}
            </h2>
            <ol className="mt-4 space-y-3">
              {recipe.steps.map((step, i) => (
                <li key={`${i}-${step.slice(0, 12)}`} className="flex gap-3 text-[var(--muted-foreground)]">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
            <h2 className="font-semibold text-[var(--forest)]">{t.recipes.nutrientAnalysis}</h2>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              {(
                [
                  [t.recipes.calories, `${n.calories}`],
                  [t.recipes.protein, `${n.protein}g`],
                  [t.recipes.carbs, `${n.carbs}g`],
                  [t.recipes.fat, `${n.fat}g`],
                  [t.recipes.fiber, `${n.fiber}g`],
                  [t.recipes.sodium, `${n.sodium}mg`],
                  [t.recipes.sugar, `${n.sugar}g`],
                  [t.recipes.potassium, n.potassium ? `${n.potassium}mg` : "—"],
                ] as const
              ).map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-[var(--muted)] px-3 py-3">
                  <dt className="text-xs text-[var(--muted-foreground)]">{k}</dt>
                  <dd className="text-lg font-semibold text-[var(--forest)]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
            <h2 className="font-semibold text-[var(--forest)]">{t.recipes.allergensAvailability}</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              {t.recipes.allergens}:{" "}
              {recipe.allergens.length
                ? recipe.allergens.map((a) => (zh ? ALLERGEN_ZH[a] || a : a)).join(zh ? "、" : ", ")
                : t.recipes.noneListed}
            </p>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              {t.recipes.regions}: {recipe.regionAvailability.join(zh ? "；" : "; ")}
            </p>
          </div>

          {recipe.alternatives && (
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
              <h2 className="font-semibold text-[var(--forest)]">{t.recipes.swaps}</h2>
              <ul className="mt-2 space-y-2 text-sm text-[var(--muted-foreground)]">
                {recipe.alternatives.map((a) => (
                  <li key={a}>• {a}</li>
                ))}
              </ul>
            </div>
          )}

          <Button asChild className="w-full">
            <Link href="/chat">{t.recipes.askAbout}</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/planner">{t.recipes.addToPlan}</Link>
          </Button>
        </aside>
      </FadeIn>
    </div>
  );
}
