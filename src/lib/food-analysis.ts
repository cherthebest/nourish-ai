import { recipes } from "./data/recipes";
import type { NutrientProfile, Recipe } from "./data/types";

export interface FoodAnalysis {
  query: string;
  matched: Recipe | null;
  verdict: "strong choice" | "situational" | "limit often" | "unknown";
  summary: string;
  nutrients: NutrientProfile | null;
  pros: string[];
  cons: string[];
  alternatives: { title: string; id: string; reason: string }[];
  portionNote: string;
  affordability: string | null;
}

const JUNK_HINTS =
  /fried|deep.?fry|soda|cola|candy|biscuit|cookie|chips|nugget|burger|pizza|ice cream|hot dog|processed meat|sausage/i;

export function analyzeFood(raw: string): FoodAnalysis {
  const query = raw.trim();
  if (!query) {
    return {
      query,
      matched: null,
      verdict: "unknown",
      summary: "Enter a food or recipe name to analyze.",
      nutrients: null,
      pros: [],
      cons: [],
      alternatives: [],
      portionNote: "",
      affordability: null,
    };
  }

  const q = query.toLowerCase();
  const matched =
    recipes.find((r) => r.title.toLowerCase().includes(q) || q.includes(r.title.toLowerCase())) ||
    recipes.find((r) =>
      r.ingredients.some((i) => q.includes(i.name.toLowerCase()) || i.name.toLowerCase().includes(q)),
    ) ||
    null;

  if (matched) {
    const n = matched.nutrients;
    const pros = [
      matched.whyHealthy.split(".")[0] + ".",
      `Provides ${n.protein}g protein and ${n.fiber}g fiber per serving.`,
      matched.tags.includes("budget")
        ? `Budget-friendly at about $${matched.costPerServing.toFixed(2)}/serving.`
        : `Cuisine: ${matched.cuisine}.`,
    ];
    const cons: string[] = [];
    if (n.sodium > 500) cons.push("Sodium is relatively high — balance with lower-sodium meals.");
    if (n.sugar > 15) cons.push("Sugar is moderate-high for a single item — watch add-ons.");
    if (matched.allergens.length)
      cons.push(`Contains allergens: ${matched.allergens.join(", ")}.`);
    if (!cons.length) cons.push("Still depends on total daily calories and your medical context.");

    const alternatives = (matched.alternatives || [])
      .slice(0, 2)
      .map((reason, i) => {
        const alt = recipes[(recipes.indexOf(matched) + i + 1) % recipes.length];
        return { title: alt.title, id: alt.id, reason };
      });

    return {
      query,
      matched,
      verdict:
        n.fiber >= 8 || (n.protein >= 15 && n.sodium < 400)
          ? "strong choice"
          : n.sodium > 600 || n.sugar > 20
            ? "limit often"
            : "situational",
      summary: `${matched.title} fits goals around ${matched.groups.map((g) => g.replace(/-/g, " ")).join(", ")}.`,
      nutrients: n,
      pros,
      cons,
      alternatives,
      portionNote: `Plate proportion tip: treat this as ~${Math.round((n.calories / 2000) * 100)}% of a 2000 kcal reference day. Pair with vegetables if the dish is protein/carb heavy.`,
      affordability: `About $${matched.costPerServing.toFixed(2)} per serving; total ingredient ballpark $${matched.ingredients.reduce((s, i) => s + (i.cost || 0), 0).toFixed(2)} for ${matched.servings} servings.`,
    };
  }

  if (JUNK_HINTS.test(query)) {
    const alts = recipes
      .filter((r) => r.tags.includes("high-fiber") || r.groups.includes("heart-health"))
      .slice(0, 3)
      .map((r) => ({
        title: r.title,
        id: r.id,
        reason: "Higher fiber / lower processing than typical fried or sugary options",
      }));
    return {
      query,
      matched: null,
      verdict: "limit often",
      summary: `"${query}" often packs refined carbs, sodium, or fried fats that are easy to over-consume relative to nutrients.`,
      nutrients: null,
      pros: ["Can fit occasionally inside an otherwise balanced week."],
      cons: [
        "Usually energy-dense with less fiber/protein per calorie.",
        "Frequent intake links with weight gain and blood-pressure strain.",
      ],
      alternatives: alts,
      portionNote:
        "If you choose it, shrink the portion, add a large salad or broth soup first, and skip sugary drinks.",
      affordability:
        "Takeout often costs more per nutrient than beans, eggs, or sheet-pan meals.",
    };
  }

  // generic heuristic for free text
  const healthyHints = /salad|bean|lentil|oat|fish|veg|fruit|yogurt|tofu|quinoa|soup|steam|grill|bake/i.test(
    query,
  );
  return {
    query,
    matched: null,
    verdict: healthyHints ? "situational" : "unknown",
    summary: healthyHints
      ? `"${query}" sounds like it can be a solid base — check cooking method (baked/steamed > deep-fried) and sauces for sodium/sugar.`
      : `We don't have a direct match for "${query}". Describe cooking method, portion, and sauces for a sharper read — or browse recipes.`,
    nutrients: null,
    pros: healthyHints
      ? ["Plant/protein cues suggest better micronutrient density.", "Ask the chatbot for a RAG-backed breakdown."]
      : ["Use the chatbot to retrieve related nutrition notes."],
    cons: [
      "Without a label, sodium, oil, and sugar are unknown.",
      "Allergies and cultural rules still apply.",
    ],
    alternatives: recipes.slice(0, 3).map((r) => ({
      title: r.title,
      id: r.id,
      reason: "Curated option with full nutrient profile",
    })),
    portionNote:
      "Volume check: fill half the plate with non-starchy vegetables, a quarter protein, a quarter carbs.",
    affordability: null,
  };
}