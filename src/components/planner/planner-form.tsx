"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { buildMealPlan, type PlanHorizon } from "@/lib/planner";
import { CONSUMER_GROUPS } from "@/lib/data/recipes";
import type { Allergy, DietTag } from "@/lib/data/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/provider";
import { useCurrency } from "@/lib/i18n/currency-provider";
import { localizeRecipe } from "@/lib/i18n/recipe-locale";
import { FX_FROM_USD } from "@/lib/currency";
import { FadeIn } from "@/components/motion/apple-press";

const ALLERGIES: Allergy[] = [
  "peanuts",
  "tree-nuts",
  "dairy",
  "eggs",
  "shellfish",
  "fish",
  "soy",
  "wheat",
  "sesame",
];

const ALLERGEN_LABEL: Record<Allergy, { en: string; zh: string }> = {
  peanuts: { en: "peanuts", zh: "花生" },
  "tree-nuts": { en: "tree nuts", zh: "樹堅果" },
  dairy: { en: "dairy", zh: "乳製品" },
  eggs: { en: "eggs", zh: "雞蛋" },
  shellfish: { en: "shellfish", zh: "甲殼類海鮮" },
  fish: { en: "fish", zh: "魚" },
  soy: { en: "soy", zh: "大豆" },
  wheat: { en: "wheat", zh: "小麥" },
  sesame: { en: "sesame", zh: "芝麻" },
};

const DIETS: DietTag[] = ["halal", "kosher", "vegetarian", "vegan", "gluten-free", "dairy-free"];

export function PlannerForm() {
  const { t, locale } = useI18n();
  const { money, currency } = useCurrency();
  const [horizon, setHorizon] = useState<PlanHorizon>("week");
  const [group, setGroup] = useState("general");
  /** Display-currency daily budget. */
  const [budget, setBudget] = useState(0);
  const budgetReady = useRef(false);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  /** Empty = no culture filter forced (friendlier default). */
  const [diets, setDiets] = useState<DietTag[]>([]);
  const [token, setToken] = useState(0);

  useEffect(() => {
    // Keep ~USD 12 equivalent when currency changes so HKD/JPY budgets stay realistic.
    setBudget(Math.round(12 * (FX_FROM_USD[currency] || 1)));
    budgetReady.current = true;
  }, [currency]);

  const budgetUsd = budget / (FX_FROM_USD[currency] || 1);
  const minBudget = Math.max(1, Math.round(3 * (FX_FROM_USD[currency] || 1)));

  const plan = useMemo(
    () =>
      buildMealPlan({
        horizon,
        groups: [group],
        allergies,
        dietPrefs: diets,
        budgetPerDay: budgetUsd,
        locale,
      }).map((day) => ({
        ...day,
        meals: day.meals.map((m) => ({
          ...m,
          recipe: localizeRecipe(m.recipe, locale),
        })),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [horizon, group, budgetUsd, allergies, diets, token, locale],
  );

  const visible = horizon === "month" ? plan.slice(0, 7) : plan;
  const monthNote = horizon === "month";
  const avgCost =
    visible.reduce((s, d) => s + d.totalCost, 0) / Math.max(1, visible.length);
  const overBudget = avgCost > budgetUsd * 1.05;

  function toggleAllergy(a: Allergy) {
    setAllergies((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }
  function toggleDiet(d: DietTag) {
    setDiets((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }

  const slotLabel = {
    breakfast: t.planner.breakfast,
    lunch: t.planner.lunch,
    dinner: t.planner.dinner,
    snack: t.planner.snack,
  };

  return (
    <FadeIn className="space-y-8">
      <div className="grid gap-6 rounded-3xl border border-[var(--border)] bg-[var(--card)]/95 p-6 shadow-sm backdrop-blur-sm lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t.planner.horizon}</Label>
            <div className="flex flex-wrap gap-2">
              {(["day", "week", "month"] as PlanHorizon[]).map((h) => (
                <Button
                  key={h}
                  type="button"
                  size="sm"
                  variant={horizon === h ? "default" : "outline"}
                  onClick={() => setHorizon(h)}
                >
                  {t.planner[h]}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="group">{t.planner.focusGroup}</Label>
            <select
              id="group"
              className="flex h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            >
              {CONSUMER_GROUPS.map((g) => (
                <option key={g.id} value={g.id}>
                  {t.groups[g.id].label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">
              {locale === "zh-Hant"
                ? `每日食物預算（${currency}）`
                : `Daily food budget (${currency})`}
            </Label>
            <Input
              id="budget"
              type="number"
              min={minBudget}
              step={currency === "JPY" || currency === "KRW" || currency === "VND" ? 100 : 1}
              value={budget || ""}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
            <p className="text-xs text-[var(--muted-foreground)]">
              {locale === "zh-Hant"
                ? `目前計畫平均約 ${money(avgCost)}／日（約等於 ${budgetUsd.toFixed(1)} 美元基準）。`
                : `Plan averages about ${money(avgCost)} / day (≈ $${budgetUsd.toFixed(1)} USD base).`}
            </p>
            {overBudget && (
              <p className="text-xs text-amber-800">
                {locale === "zh-Hant"
                  ? "有些日子略超預算——可再調低預算、改選平價標籤，或放寬目標族群。"
                  : "Some days run a bit over—lower the budget, enable “budget” recipes, or widen the goal."}
              </p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label>{t.planner.dietFilters}</Label>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              {locale === "zh-Hant"
                ? "預設不強制任何信仰／文化標籤。需要清真、猶太潔食或素食時再點選。"
                : "Nothing forced by default. Tap only the faith/culture tags you need."}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {DIETS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDiet(d)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition active:scale-95 ${
                    diets.includes(d)
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--muted)] text-[var(--forest)]"
                  }`}
                >
                  {t.tags[d] ?? d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>{t.planner.excludeAllergies}</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {ALLERGIES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAllergy(a)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition active:scale-95 ${
                    allergies.includes(a)
                      ? "bg-amber-800 text-white"
                      : "bg-[var(--muted)] text-[var(--forest)]"
                  }`}
                >
                  {locale === "zh-Hant" ? ALLERGEN_LABEL[a].zh : ALLERGEN_LABEL[a].en}
                </button>
              ))}
            </div>
          </div>
          <Button type="button" onClick={() => setToken((n) => n + 1)}>
            {t.planner.regenerate}
          </Button>
        </div>
      </div>

      {monthNote && (
        <p className="text-sm text-[var(--muted-foreground)]">{t.planner.monthNote}</p>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((day) => (
          <article
            key={day.dayLabel}
            className="rounded-3xl border border-[var(--border)] bg-[var(--card)]/95 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--forest)]">
                {day.dayLabel}
              </h3>
              <Badge>
                {money(day.totalCost)} · {day.totalCalories} {t.common.kcal}
              </Badge>
            </div>
            <ul className="mt-4 space-y-3">
              {day.meals.map((m) => (
                <li key={m.slot} className="text-sm">
                  <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                    {slotLabel[m.slot]}
                  </p>
                  <Link
                    href={`/recipes/${m.recipe.id}`}
                    className="font-medium text-[var(--primary)] transition hover:underline"
                  >
                    {m.recipe.title}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </FadeIn>
  );
}
