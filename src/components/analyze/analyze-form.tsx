"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { analyzeFood } from "@/lib/food-analysis";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AnalyzeForm() {
  const [q, setQ] = useState("fried chicken");
  const [submitted, setSubmitted] = useState("fried chicken");
  const result = useMemo(() => analyzeFood(submitted), [submitted]);

  const verdictColor =
    result.verdict === "strong choice"
      ? "bg-emerald-100 text-emerald-900"
      : result.verdict === "limit often"
        ? "bg-amber-100 text-amber-950"
        : result.verdict === "situational"
          ? "bg-sky-100 text-sky-950"
          : "bg-stone-100 text-stone-800";

  return (
    <div className="space-y-8">
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
          placeholder="e.g. lentil bowl, soda, salmon, pizza"
          aria-label="Food to analyze"
        />
        <Button type="submit">Analyze</Button>
      </form>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--forest)]">
            {result.matched?.title || result.query || "Result"}
          </h2>
          <Badge className={verdictColor}>{result.verdict}</Badge>
        </div>
        <p className="mt-3 text-[var(--muted-foreground)]">{result.summary}</p>

        {result.nutrients && (
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(
              [
                ["Calories", `${result.nutrients.calories} kcal`],
                ["Protein", `${result.nutrients.protein}g`],
                ["Fiber", `${result.nutrients.fiber}g`],
                ["Sodium", `${result.nutrients.sodium}mg`],
                ["Carbs", `${result.nutrients.carbs}g`],
                ["Fat", `${result.nutrients.fat}g`],
                ["Sugar", `${result.nutrients.sugar}g`],
                ["Potassium", result.nutrients.potassium ? `${result.nutrients.potassium}mg` : "—"],
              ] as const
            ).map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-[var(--muted)] px-3 py-3">
                <dt className="text-xs text-[var(--muted-foreground)]">{k}</dt>
                <dd className="text-lg font-semibold text-[var(--forest)]">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-[var(--forest)]">Why it can help</h3>
            <ul className="mt-2 space-y-2 text-sm text-[var(--muted-foreground)]">
              {result.pros.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--forest)]">Watch-outs</h3>
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
            <h3 className="font-semibold text-[var(--forest)]">Healthier alternatives</h3>
            <ul className="mt-3 space-y-2">
              {result.alternatives.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/recipes/${a.id}`}
                    className="font-medium text-[var(--primary)] hover:underline"
                  >
                    {a.title}
                  </Link>
                  <span className="text-sm text-[var(--muted-foreground)]"> — {a.reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}