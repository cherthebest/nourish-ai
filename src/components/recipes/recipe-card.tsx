import Link from "next/link";
import { Clock, Coins } from "lucide-react";
import type { Recipe } from "@/lib/data/types";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group block overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div
        className={`relative h-40 bg-gradient-to-br ${recipe.imageGradient} transition duration-500 group-hover:scale-[1.03]`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_45%)]" />
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1.5">
          {recipe.groups.slice(0, 2).map((g) => (
            <Badge key={g} className="bg-white/85 backdrop-blur">
              {g.replace(/-/g, " ")}
            </Badge>
          ))}
        </div>
      </div>
      <div className="space-y-3 p-5">
        <h3 className="font-[family-name:var(--font-display)] text-xl leading-tight text-[var(--forest)]">
          {recipe.title}
        </h3>
        <p className="line-clamp-2 text-sm text-[var(--muted-foreground)]">{recipe.summary}</p>
        <div className="flex items-center gap-4 text-xs font-medium text-[var(--forest)]/70">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {recipe.prepMinutes + recipe.cookMinutes} min
          </span>
          <span className="inline-flex items-center gap-1">
            <Coins className="h-3.5 w-3.5" />
            {formatCurrency(recipe.costPerServing)}/serving
          </span>
          <span>{recipe.nutrients.calories} kcal</span>
        </div>
      </div>
    </Link>
  );
}