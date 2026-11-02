"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { buildMealPlan, type PlanHorizon } from "@/lib/planner";
import { CONSUMER_GROUPS } from "@/lib/data/recipes";
import type { Allergy, DietTag } from "@/lib/data/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

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

const DIETS: DietTag[] = ["halal", "kosher", "vegetarian", "vegan", "gluten-free", "dairy-free"];

export function PlannerForm() {
  const [horizon, setHorizon] = useState<PlanHorizon>("week");
  const [group, setGroup] = useState("weight-management");
  const [budget, setBudget] = useState(12);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [diets, setDiets] = useState<DietTag[]>(["halal"]);
  const [token, setToken] = useState(0);

  const plan = useMemo(
    () =>
      buildMealPlan({
        horizon,
        groups: [group],
        allergies,
        dietPrefs: diets,
        budgetPerDay: budget,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [horizon, group, budget, allergies, diets, token],
  );

  const visible = horizon === "month" ? plan.slice(0, 7) : plan;
  const monthNote = horizon === "month";

  function toggleAllergy(a: Allergy) {
    setAllergies((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }
  function toggleDiet(d: DietTag) {
    setDiets((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Horizon</Label>
            <div className="flex flex-wrap gap-2">
              {(["day", "week", "month"] as PlanHorizon[]).map((h) => (
                <Button
                  key={h}
                  type="button"
                  size="sm"
                  variant={horizon === h ? "default" : "outline"}
                  onClick={() => setHorizon(h)}
                >
                  {h}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="group">Focus group</Label>
            <select
              id="group"
              className="flex h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            >
              {CONSUMER_GROUPS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">Daily food budget (USD)</Label>
            <Input
              id="budget"
              type="number"
              min={4}
              step="0.5"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label>Diet & culture filters</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {DIETS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDiet(d)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                    diets.includes(d)
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--muted)] text-[var(--forest)]"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Exclude allergies</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {ALLERGIES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAllergy(a)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                    allergies.includes(a)
                      ? "bg-amber-800 text-white"
                      : "bg-[var(--muted)] text-[var(--forest)]"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <Button type="button" onClick={() => setToken((t) => t + 1)}>
            Regenerate plan
          </Button>
        </div>
      </div>

      {monthNote && (
        <p className="text-sm text-[var(--muted-foreground)]">
          Showing the first 7 days of a 28-day rotation — the same pattern repeats with ingredient
          swaps for season and budget.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((day) => (
          <article
            key={day.dayLabel}
            className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--forest)]">
                {day.dayLabel}
              </h3>
              <Badge>
                {formatCurrency(day.totalCost)} · {day.totalCalories} kcal
              </Badge>
            </div>
            <ul className="mt-4 space-y-3">
              {day.meals.map((m) => (
                <li key={m.slot} className="text-sm">
                  <p className="text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                    {m.slot}
                  </p>
                  <Link
                    href={`/recipes/${m.recipe.id}`}
                    className="font-medium text-[var(--primary)] hover:underline"
                  >
                    {m.recipe.title}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}