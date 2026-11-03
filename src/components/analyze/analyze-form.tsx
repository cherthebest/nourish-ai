"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { analyzeFood } from "@/lib/food-analysis";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n/provider";
import { localizeRecipeById } from "@/lib/i18n/recipe-locale";
import { FadeIn } from "@/components/motion/apple-press";

export function AnalyzeForm() {
  const { t, locale } = useI18n();
  const [q, setQ] = useState("fried chicken");
  const [submitted, setSubmitted] = useState("fried chicken");
  const result = useMemo(() => analyzeFood(submitted), [submitted]);

  const verdictLabel =
    result.verdict === "strong choice"
      ? t.analyze.verdictStrong
      : result.verdict === "limit often"
        ? t.analyze.verdictLimit
        : result.verdict === "situational"
          ? t.analyze.verdictSituational
          : t.analyze.verdictUnknown;

  const verdictColor =
    result.verdict === "strong choice"
      ? "bg-emerald-100 text-emerald-900"
      : result.verdict === "limit often"
        ? "bg-amber-100 text-amber-950"
        : result.verdict === "situational"
          ? "bg-sky-100 text-sky-950"
          : "bg-stone-100 text-stone-800";

  const matched = result.matched
    ? localizeRecipeById(result.matched.id, locale) ?? result.matched
    : null;

  return (
    <FadeIn className="space-y-8">
      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(q);
        }}
      >
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.analyze.placeholder}
          aria-label={t.analyze.title}
        />
        <Button type="submit">{t.analyze.analyze}</Button>
      </form>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)]/95 p-6 shadow-sm backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--forest)]">
            {matched?.title || result.query || "Result"}
          </h2>
          <Badge className={verdictColor}>{verdictLabel}</Badge>
        </div>
        <p className="mt-3 text-[var(--muted-foreground)]">
          {matched ? matched.summary : result.summary}
        </p>

        {result.nutrients && (
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(
              [
                [t.recipes.calories, `${result.nutrients.calories} ${t.common.kcal}`],
                [t.recipes.protein, `${result.nutrients.protein}g`],
                [t.recipes.fiber, `${result.nutrients.fiber}g`],
                [t.recipes.sodium, `${result.nutrients.sodium}mg`],
                [t.recipes.carbs, `${result.nutrients.carbs}g`],
                [t.recipes.fat, `${result.nutrients.fat}g`],
                [t.recipes.sugar, `${result.nutrients.sugar}g`],
                [
                  t.recipes.potassium,
                  result.nutrients.potassium ? `${result.nutrients.potassium}mg` : "—",
                ],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-[var(--muted)] px-3 py-3 transition hover:bg-[var(--accent-soft)]">
                <dt className="text-xs text-[var(--muted-foreground)]">{k}</dt>
                <dd className="text-lg font-semibold text-[var(--forest)]">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-[var(--forest)]">{t.analyze.whyHelp}</h3>
            <ul className="mt-2 space-y-2 text-sm text-[var(--muted-foreground)]">
              {(matched ? [matched.whyHealthy] : result.pros).map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--forest)]">{t.analyze.watchouts}</h3>
            <ul className="mt-2 space-y-2 text-sm text-[var(--muted-foreground)]">
              {result.cons.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
          </div>
        </div>

        {result.portionNote && (
          <p className="mt-6 rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--forest)]">
            {result.portionNote}
          </p>
        )}
        {result.affordability && (
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">{result.affordability}</p>
        )}

        {result.alternatives.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-[var(--forest)]">{t.analyze.alternatives}</h3>
            <ul className="mt-3 space-y-2">
              {result.alternatives.map((a) => {
                const loc = localizeRecipeById(a.id, locale);
                return (
                  <li key={a.id}>
                    <Link
                      href={`/recipes/${a.id}`}
                      className="font-medium text-[var(--primary)] transition hover:underline"
                    >
                      {loc?.title ?? a.title}
                    </Link>
                    <span className="text-sm text-[var(--muted-foreground)]"> — {a.reason}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </FadeIn>
  );
}