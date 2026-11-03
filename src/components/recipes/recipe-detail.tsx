"use client";

import Link from "next/link";
import { Clock, Coins, Users } from "lucide-react";
import type { Recipe } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/provider";
import { localizeRecipe } from "@/lib/i18n/recipe-locale";
import { FadeIn } from "@/components/motion/apple-press";

export function RecipeDetail({ recipe: base }: { recipe: Recipe }) {
  const { t, locale } = useI18n();
  const recipe = localizeRecipe(base, locale);
  const n = recipe.nutrients;

  return (
    <div className="pb-20">
      <div className={`relative h-64 bg-gradient-to-br ${recipe.imageGradient} md:h-80`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_50%)]" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--background)] to-transparent p-5 md:p-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium text-[var(--forest)]/70">{recipe.cuisine}</p>
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
              {formatCurrency(recipe.costPerServing)} {t.recipes.perServing}
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
            <ul className="mt-4 space-y-2">
              {recipe.ingredients.map((ing) => (
                <li
                  key={ing.name}
                  className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm transition hover:bg-[var(--muted)]"
                >
                  <span>
                    <span className="font-medium text-[var(--forest)]">{ing.amount}</span> {ing.name}
                  </span>
                  {ing.cost != null && (
                    <span className="text-[var(--muted-foreground)]">~{formatCurrency(ing.cost)}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--forest)]">
              {t.recipes.steps}
            </h2>
            <ol className="mt-4 space-y-3">
              {recipe.steps.map((step, i) => (
                <li key={step} className="flex gap-3 text-[var(--muted-foreground)]">
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
              {recipe.allergens.length ? recipe.allergens.join(", ") : t.recipes.noneListed}
            </p>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              {t.recipes.regions}: {recipe.regionAvailability.join("; ")}
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