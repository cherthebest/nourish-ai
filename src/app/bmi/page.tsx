import { BmiPageClient } from "@/components/bmi/bmi-page-client";

export const metadata = {
  title: "BMI & body check — NourishAI",
  description: "BMI calculator with energy estimates and gentle activity suggestions.",
};

export default function BmiPage() {
  return <BmiPageClient />;
}