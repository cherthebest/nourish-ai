import { Suspense } from "react";
import { RecipeBrowser } from "@/components/recipes/recipe-browser";

export const metadata = {
  title: "Healthy recipes — NourishAI",
  description: "Filter recipes by consumer group, diet, budget, and goals.",
};

export default function RecipesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-28 md:px-8">
      <div className="mb-10 max-w-2xl">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--forest)] md:text-5xl">
          Recipes for real lives
        </h1>
        <p className="mt-3 text-[var(--muted-foreground)]">
          Each dish includes nutrients, cost per serving, allergen tags, and why it supports
          specific health goals — plus swaps when geography or budgets get in the way.
        </p>
      </div>
      <Suspense fallback={<div className="text-sm text-[var(--muted-foreground)]">Loading recipes…</div>}>
        <RecipeBrowser />
      </Suspense>
    </div>
  );
}