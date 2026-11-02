import { PlannerForm } from "@/components/planner/planner-form";

export const metadata = {
  title: "Meal planner — NourishAI",
  description: "Plan healthy meals for a day, week, or month with budget and allergy filters.",
};

export default function PlannerPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-20 pt-28 md:px-8">
      <div className="mb-10 max-w-2xl">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--forest)] md:text-5xl">
          Plan your meals
        </h1>
        <p className="mt-3 text-[var(--muted-foreground)]">
          Day, week, or month outlines that respect faith diets, allergies, focus groups, and how
          much you can spend — built for busy weeks and imperfect adherence.
        </p>
      </div>
      <PlannerForm />
    </div>
  );
}