import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Coins, Users } from "lucide-react";
import { getRecipeById, recipes } from "@/lib/data/recipes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export function generateStaticParams() {
  return recipes.map((r) => ({ id: r.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = getRecipeById(id);
  return {
    title: recipe ? `${recipe.title} — NourishAI` : "Recipe — NourishAI",
    description: recipe?.summary,
  };
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = getRecipeById(id);
  if (!recipe) notFound();

  const n = recipe.nutrients;

  return (
    <div className="pb-20 pt-24">
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

      <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-8 md:grid-cols-[1.4fr_1fr] md:px-8">
        <div className="space-y-8">
          <p className="text-lg text-[var(--muted-foreground)]">{recipe.summary}</p>
          <div className="flex flex-wrap gap-4 text-sm font-medium text-[var(--forest)]">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {recipe.prepMinutes + recipe.cookMinutes} min
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {recipe.servings} servings
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Coins className="h-4 w-4" />
              {formatCurrency(recipe.costPerServing)} / serving
            </span>
            <span className="capitalize">{recipe.difficulty}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {recipe.groups.map((g) => (
              <Badge key={g}>{g.replace(/-/g, " ")}</Badge>
            ))}
            {recipe.tags.map((t) => (
              <Badge key={t} className="bg-[var(--accent-soft)] text-[var(--primary)]">
                {t}
              </Badge>
            ))}
          </div>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--forest)]">
              Why this is a healthier option
            </h2>
            <p className="mt-3 text-[var(--muted-foreground)]">{recipe.whyHealthy}</p>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--forest)]">
              Ingredients
            </h2>
            <ul className="mt-4 space-y-2">
              {recipe.ingredients.map((ing) => (
                <li
                  key={ing.name}
                  className="flex items-center justify-between rounded-xl bg-[var(--card)] px-4 py-3 text-sm border border-[var(--border)]"
                >
                  <span>
                    <span className="font-medium text-[var(--forest)]">{ing.amount}</span>{" "}
                    {ing.name}
                  </span>
                  {ing.cost != null && (
                    <span className="text-[var(--muted-foreground)]">
                      ~{formatCurrency(ing.cost)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--forest)]">
              Steps
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
            <h2 className="font-semibold text-[var(--forest)]">Nutrient analysis / serving</h2>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              {(
                [
                  ["Calories", `${n.calories}`],
                  ["Protein", `${n.protein}g`],
                  ["Carbs", `${n.carbs}g`],
                  ["Fat", `${n.fat}g`],
                  ["Fiber", `${n.fiber}g`],
                  ["Sodium", `${n.sodium}mg`],
                  ["Sugar", `${n.sugar}g`],
                  ["Potassium", n.potassium ? `${n.potassium}mg` : "—"],
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
            <h2 className="font-semibold text-[var(--forest)]">Allergens & availability</h2>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Allergens: {recipe.allergens.length ? recipe.allergens.join(", ") : "none listed"}
            </p>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Regions: {recipe.regionAvailability.join("; ")}
            </p>
          </div>

          {recipe.alternatives && (
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
              <h2 className="font-semibold text-[var(--forest)]">Swaps & alternatives</h2>
              <ul className="mt-2 space-y-2 text-sm text-[var(--muted-foreground)]">
                {recipe.alternatives.map((a) => (
                  <li key={a}>• {a}</li>
                ))}
              </ul>
            </div>
          )}

          <Button asChild className="w-full">
            <Link href="/chat">Ask about this recipe</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/planner">Add ideas to a meal plan</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}