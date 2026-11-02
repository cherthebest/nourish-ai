import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--forest)] text-[var(--mist)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl">NourishAI</p>
          <p className="mt-2 max-w-md text-sm text-white/70">
            Conversational nutrition guidance with RAG over recipes and evidence-informed notes.
            Educational only — not a substitute for clinical care.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-white/80">
          <Link href="/chat" className="hover:text-white">
            Chatbot
          </Link>
          <Link href="/recipes" className="hover:text-white">
            Recipes
          </Link>
          <Link href="/planner" className="hover:text-white">
            Planner
          </Link>
          <Link href="/bmi" className="hover:text-white">
            BMI
          </Link>
        </div>
      </div>
    </footer>
  );
}