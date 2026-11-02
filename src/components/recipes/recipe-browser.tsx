"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CONSUMER_GROUPS, filterRecipes } from "@/lib/data/recipes";
import { RecipeCard } from "./recipe-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RecipeBrowser() {
  const searchParams = useSearchParams();
  const initialGroup = searchParams.get("group") || "all";
  const [group, setGroup] = useState(initialGroup);
  const [q, setQ] = useState("");
  const [maxCost, setMaxCost] = useState(10);
  const [tag, setTag] = useState("all");

  const list = useMemo(
    () =>
      filterRecipes({
        group,
        q,
        maxCost,
        tag,
      }),
    [group, q, maxCost, tag],
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm md:grid-cols-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ingredient, cuisine, goal…"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="group">Consumer group</Label>
          <select
            id="group"
            className="flex h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
          >
            <option value="all">All groups</option>
            {CONSUMER_GROUPS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tag">Diet tag</Label>
          <select
            id="tag"
            className="flex h-11 w-full rounded-xl border border-[var(--border)] bg-white px-3 text-sm"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          >
            <option value="all">Any</option>
            <option value="halal">Halal</option>
            <option value="kosher">Kosher</option>
            <option value="vegan">Vegan</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="budget">Budget</option>
            <option value="quick">Quick</option>
            <option value="gluten-free">Gluten-free</option>
            <option value="high-protein">High protein</option>
            <option value="low-sodium">Low sodium</option>
          </select>
        </div>
        <div className="space-y-2 md:col-span-4">
          <Label htmlFor="cost">Max cost per serving: ${maxCost.toFixed(2)}</Label>
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
            No recipes match
          </p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Loosen the budget filter or clear search — or ask the chatbot for swaps.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}