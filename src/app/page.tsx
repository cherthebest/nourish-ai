import Link from "next/link";
import { ArrowRight, MessageCircle, Salad, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { ChatPanel } from "@/components/chat/chat-panel";
import { recipes, CONSUMER_GROUPS } from "@/lib/data/recipes";

export default function HomePage() {
  const featured = recipes.slice(0, 3);

  return (
    <>
      <section className="relative min-h-[100svh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(105deg, rgba(20,53,47,0.88) 0%, rgba(20,53,47,0.55) 42%, rgba(20,53,47,0.25) 100%), url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="hero-sheen absolute inset-0 opacity-30 mix-blend-soft-light" />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-8 md:pb-24">
          <p className="animate-rise font-[family-name:var(--font-display)] text-5xl text-white sm:text-6xl md:text-7xl lg:text-8xl">
            NourishAI
          </p>
          <h1 className="animate-rise-delay mt-4 max-w-xl text-2xl font-medium leading-snug text-white/95 sm:text-3xl md:text-4xl">
            Eat for your body, culture, and budget — with a chatbot that actually retrieves the why.
          </h1>
          <p className="animate-rise-delay mt-4 max-w-lg text-base text-white/80 md:text-lg">
            Recipes and RAG guidance for weight, blood pressure, aging, mood, allergies, and
            everyday “what should I cook?” moments.
          </p>
          <div className="animate-rise-delay mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-white text-[var(--forest)] hover:bg-[var(--mist)]">
              <Link href="/chat">
                Ask the nutrition chatbot <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20"
            >
              <Link href="/recipes">Browse healthy recipes</Link>
            </Button>
          </div>
        </div>
        <div className="animate-drift pointer-events-none absolute bottom-10 right-8 hidden h-28 w-28 rounded-full bg-white/10 blur-2xl md:block" />
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <div className="max-w-2xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--forest)] md:text-4xl">
            Built for real constraints
          </h2>
          <p className="mt-3 text-[var(--muted-foreground)]">
            Obesity risk, blood pressure, aging, mood, faith rules, allergies, tight budgets, and
            empty fridges — pick a lane and cook from there.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONSUMER_GROUPS.map((g, i) => (
            <Link
              key={g.id}
              href={`/recipes?group=${g.id}`}
              className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--forest)]">
                {g.label}
              </h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">{g.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-white/50 py-20">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-5 md:grid-cols-2 md:px-8">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--forest)] md:text-4xl">
              Find what you should be looking for
            </h2>
            <p className="mt-3 text-[var(--muted-foreground)]">
              The Ask Nourish agent retrieves curated nutrition notes and recipes (RAG), then answers
              in plain language — including healthier swaps and cultural filters.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-[var(--forest)]">
              <li className="flex gap-2">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                Nutrient analysis & “is this healthy for me?” checks
              </li>
              <li className="flex gap-2">
                <Salad className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                Alternatives when takeout or drugs-as-shortcuts feel tempting
              </li>
              <li className="flex gap-2">
                <Scale className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                Ties into BMI, affordability, and meal planning tools
              </li>
            </ul>
          </div>
          <ChatPanel compact />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--forest)]">
              Featured recipes
            </h2>
            <p className="mt-2 text-[var(--muted-foreground)]">
              Costed, tagged for allergens & faith diets, with nutrient breakdowns.
            </p>
          </div>
          <Button asChild variant="soft">
            <Link href="/recipes">View all</Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featured.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-[var(--forest)] px-8 py-12 text-white md:px-12">
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl">
            Plan a day, a week, or a month
          </h2>
          <p className="mt-3 max-w-2xl text-white/75">
            Generate meal outlines that respect budget, allergies, and goals — then open any dish
            for steps, cost, and why it’s a healthier option.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-white text-[var(--forest)] hover:bg-[var(--mist)]">
              <Link href="/planner">Open meal planner</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              <Link href="/bmi">BMI & body analysis</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              <Link href="/analyze">Analyze a food</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}