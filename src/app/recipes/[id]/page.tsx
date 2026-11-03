import { notFound } from "next/navigation";
import { getRecipeById, recipes } from "@/lib/data/recipes";
import { RecipeDetail } from "@/components/recipes/recipe-detail";

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
  return <RecipeDetail recipe={recipe} />;
}