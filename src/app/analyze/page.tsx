import { AnalyzeForm } from "@/components/analyze/analyze-form";

export const metadata = {
  title: "Food analysis — NourishAI",
  description: "Check if a food is a strong choice, situational, or best limited — with alternatives.",
};

export default function AnalyzePage() {
  return (
    <div className="mx-auto max-w-4xl px-5 pb-20 pt-28 md:px-8">
      <div className="mb-10 max-w-2xl">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--forest)] md:text-5xl">
          Food & nutrient analysis
        </h1>
        <p className="mt-3 text-[var(--muted-foreground)]">
          See calories, macros, sodium, portion proportion tips, affordability, and healthier
          alternatives — including when takeout habits crowd out recovery without relying on risky
          shortcuts.
        </p>
      </div>
      <AnalyzeForm />
    </div>
  );
}