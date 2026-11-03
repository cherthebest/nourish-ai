import { Suspense } from "react";
import { RecipesPageClient } from "@/components/recipes/recipes-page-client";

export const metadata = {
  title: "Healthy recipes — NourishAI",
  description: "Filter recipes by goal, diet, budget, and preferences.",
};

export default function RecipesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-5 pb-20 pt-10 text-sm text-[var(--muted-foreground)] md:px-8">
          Loading…
        </div>
      }
    >
      <RecipesPageClient />
    </Suspense>
  );
}