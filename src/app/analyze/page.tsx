import { AnalyzePageClient } from "@/components/analyze/analyze-page-client";

export const metadata = {
  title: "Food check — NourishAI",
  description: "Check whether a food is a strong choice, situational, or best limited.",
};

export default function AnalyzePage() {
  return <AnalyzePageClient />;
}