"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CONSUMER_GROUPS, filterRecipes } from "@/lib/data/recipes";
import { RecipeCard } from "./recipe-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n/provider";
import { useCurrency } from "@/lib/i18n/currency-provider";
import { localizeRecipe } from "@/lib/i18n/recipe-locale";
import { FadeIn } from "@/components/motion/apple-press";

export function RecipeBrowser() {
  const { t, locale } = useI18n();
  const { money } = useCurrency();
  const searchParams = useSearchParams();
  const initialGroup = searchParams.get("group") || "all";
  const [group, setGroup] = useState(initialGroup);
  const [q, setQ] = useState("");
  /** USD base — display converts via money() */
  const [maxCost, setMaxCost] = useState(10);
  const [tag, setTag] = useState("all");

  const list = useMemo(() => {
    const base = filterRecipes({
      group,
      q: "", // search after localization so 繁中 titles match
      maxCost,
      tag,
    }).map((r) => localizeRecipe(r, locale));
    const needle = q.trim().toLowerCase();
    if (!needle) return base;
    return base.filter((r) => {
      const hay = `${r.title} ${r.summary} ${r.cuisine} ${r.ingredients.map((i) => i.name).join(" ")}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [group, q, maxCost, tag, locale]);

  return (
    <FadeIn className="space-y-8">
      <div className="grid gap-4 rounded-3xl border border-[var(--border)] bg-[var(--card)]/90 p-5 shadow-sm backdrop-blur-sm md:grid-cols-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="search">{t.recipes.search}</Label>
          <Input
            id="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.recipes.searchPlaceholder}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="group">{t.recipes.consumerGroup}</Label>
          <select
            id="group"
            className="flex h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          >
            <option value="all">{t.recipes.allGroups}</option>
            {CONSUMER_GROUPS.map((g) => (
              <option key={g.id} value={g.id}>
                {t.groups[g.id].label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tag">{t.recipes.dietTag}</Label>
          <select
            id="tag"
            className="flex h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          >
            <option value="all">{t.recipes.any}</option>
            {Object.entries(t.tags).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2 md:col-span-4">
          <Label htmlFor="cost">
            {t.recipes.maxCost}: {money(maxCost)}
          </Label>
          <input
            id="cost"
            type="range"
            min={1}
            max={10}
            step={0.25}
            value={maxCost}
            onChange={(e) => setMaxCost(Number(e.target.value))}
            className="w-full accent-[var(--primary)]"
          />
        </div>
      </div>

      {list.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white/60 px-6 py-16 text-center">
          <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--forest)]">
            {t.recipes.emptyTitle}
          </p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">{t.recipes.emptySub}</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </FadeIn>
  );
}
