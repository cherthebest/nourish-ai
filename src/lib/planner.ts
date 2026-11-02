import { recipes } from "./data/recipes";
import type { Allergy, DietTag, Recipe } from "./data/types";

export type PlanHorizon = "day" | "week" | "month";

export interface PlanOptions {
  horizon: PlanHorizon;
  groups?: string[];
  allergies?: Allergy[];
  dietPrefs?: DietTag[];
  maxCostPerServing?: number;
  budgetPerDay?: number;
}

export interface PlannedMeal {
  slot: "breakfast" | "lunch" | "dinner" | "snack";
  recipe: Recipe;
}

export interface PlanDay {
  dayLabel: string;
  meals: PlannedMeal[];
  totalCost: number;
  totalCalories: number;
}

function eligible(opts: PlanOptions): Recipe[] {
  return recipes.filter((r) => {
    if (opts.allergies?.some((a) => r.allergens.includes(a))) return false;
    if (opts.maxCostPerServing != null && r.costPerServing > opts.maxCostPerServing) {
      return false;
    }
    if (opts.dietPrefs?.length) {
      const must = opts.dietPrefs.filter((t) =>
        ["vegan", "vegetarian", "halal", "kosher", "gluten-free", "dairy-free", "nut-free"].includes(t),
      );
      if (must.some((t) => !r.tags.includes(t))) return false;
    }
    if (opts.groups?.length && opts.groups[0] !== "all") {
      if (!opts.groups.some((g) => r.groups.includes(g as never))) return false;
    }
    return true;
  });
}

function pick(pool: Recipe[], prefer: string[], used: Set<string>): Recipe {
  const ranked = [...pool].sort((a, b) => {
    const as = prefer.reduce((n, g) => n + (a.groups.includes(g as never) ? 1 : 0), 0);
    const bs = prefer.reduce((n, g) => n + (b.groups.includes(g as never) ? 1 : 0), 0);
    if (as !== bs) return bs - as;
    return a.costPerServing - b.costPerServing;
  });
  const fresh = ranked.find((r) => !used.has(r.id)) || ranked[0] || recipes[0];
  used.add(fresh.id);
  return fresh;
}

function buildDay(
  label: string,
  pool: Recipe[],
  prefer: string[],
  used: Set<string>,
): PlanDay {
  const breakfastPool = pool.filter((r) =>
    /oat|yogurt|egg|parfait|scramble|miso|breakfast/i.test(r.title + r.summary) ||
    r.tags.includes("quick"),
  );
  const lunchDinner = pool.length ? pool : recipes;
  const snackPool = pool.filter((r) => r.cookMinutes <= 10);

  const meals: PlannedMeal[] = [
    { slot: "breakfast", recipe: pick(breakfastPool.length ? breakfastPool : lunchDinner, prefer, used) },
    { slot: "lunch", recipe: pick(lunchDinner, prefer, used) },
    { slot: "dinner", recipe: pick(lunchDinner, prefer, used) },
    { slot: "snack", recipe: pick(snackPool.length ? snackPool : lunchDinner, prefer, used) },
  ];

  return {
    dayLabel: label,
    meals,
    totalCost: meals.reduce((s, m) => s + m.recipe.costPerServing, 0),
    totalCalories: meals.reduce((s, m) => s + m.recipe.nutrients.calories, 0),
  };
}

export function buildMealPlan(opts: PlanOptions): PlanDay[] {
  const pool = eligible(opts);
  const prefer = opts.groups?.length ? opts.groups : ["general"];
  const used = new Set<string>();
  const days =
    opts.horizon === "day" ? 1 : opts.horizon === "week" ? 7 : 28;

  const out: PlanDay[] = [];
  for (let i = 0; i < days; i++) {
    if (i % 4 === 0) used.clear();
    const label =
      opts.horizon === "day"
        ? "Today"
        : opts.horizon === "week"
          ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]
          : `Day ${i + 1}`;
    const day = buildDay(label, pool.length ? pool : recipes, prefer, used);
    if (opts.budgetPerDay && day.totalCost > opts.budgetPerDay * 1.15) {
      // replace dinner with cheapest eligible
      const cheapest = [...(pool.length ? pool : recipes)].sort(
        (a, b) => a.costPerServing - b.costPerServing,
      )[0];
      day.meals[2] = { slot: "dinner", recipe: cheapest };
      day.totalCost = day.meals.reduce((s, m) => s + m.recipe.costPerServing, 0);
      day.totalCalories = day.meals.reduce((s, m) => s + m.recipe.nutrients.calories, 0);
    }
    out.push(day);
  }
  return out;
}