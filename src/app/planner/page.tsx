import { PlannerPageClient } from "@/components/planner/planner-page-client";

export const metadata = {
  title: "Meal plan — NourishAI",
  description: "Plan healthy meals for a day, week, or month.",
};

export default function PlannerPage() {
  return <PlannerPageClient />;
}