import { ChatPanel } from "@/components/chat/chat-panel";

export const metadata = {
  title: "Ask Nourish — NourishAI chatbot",
  description: "RAG-powered nutrition and recipe chatbot.",
};

export default function ChatPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 pb-20 pt-28 md:px-8">
      <div className="mb-8 max-w-2xl">
        <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--forest)] md:text-5xl">
          Ask Nourish
        </h1>
        <p className="mt-3 text-[var(--muted-foreground)]">
          Conversational help for food analysis, healthier alternatives, cultural constraints, and
          meal ideas. Answers are grounded with retrieval over our knowledge base (RAG). Optional
          OpenAI key upgrades fluency; local retrieval always works offline-style.
        </p>
      </div>
      <ChatPanel />
      <p className="mt-6 text-xs text-[var(--muted-foreground)]">
        Limits we design around: imperfect adherence, inaccurate edge cases, language gaps, allergies,
        religion/culture, appetite, time, money, and food availability. Not medical advice.
      </p>
    </div>
  );
}