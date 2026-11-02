import { BmiForm } from "@/components/bmi/bmi-form";

export const metadata = {
  title: "BMI & body analysis — NourishAI",
  description: "BMI calculator with energy estimates and gentle activity suggestions.",
};

export default function BmiPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 pb-20 pt-28 md:px-8">
      <div className="mb-10 max-w-2xl">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--forest)] md:text-5xl">
          BMI & body analysis
        </h1>
        <p className="mt-3 text-[var(--muted-foreground)]">
          Estimate BMI, resting and daily calorie needs, then get cautious activity ideas based on
          age, weight, and optional medical notes. Pair results with recipes and the chatbot.
        </p>
      </div>
      <BmiForm />
    </div>
  );
}