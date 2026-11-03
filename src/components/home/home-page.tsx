"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle, Salad, Scale } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { ChatPanel } from "@/components/chat/chat-panel";
import { recipes, CONSUMER_GROUPS } from "@/lib/data/recipes";
import { useI18n } from "@/lib/i18n/provider";
import { localizeRecipe } from "@/lib/i18n/recipe-locale";
import { FadeIn } from "@/components/motion/apple-press";

export function HomePage() {
  const { t, locale } = useI18n();
  const featured = recipes.slice(0, 3).map((r) => localizeRecipe(r, locale));

  return (
    <>
      <section className="relative -mt-[4.25rem] min-h-[100svh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(105deg, rgba(20,53,47,0.88) 0%, rgba(20,53,47,0.55) 42%, rgba(20,53,47,0.25) 100%), url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=2000&q=80')",
          }}
        />
        <div className="hero-sheen absolute inset-0 opacity-30 mix-blend-soft-light" />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-8 md:pb-24">
          <FadeIn>
            <p className="font-[family-name:var(--font-display)] text-5xl text-white sm:text-6xl md:text-7xl lg:text-8xl">
              {t.brand}
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <h1 className="mt-4 max-w-xl text-2xl font-medium leading-snug text-white/95 sm:text-3xl md:text-4xl">
              {t.home.headline}
            </h1>
          </FadeIn>
          <FadeIn delay={0.14}>
            <p className="mt-4 max-w-lg text-base text-white/80 md:text-lg">{t.home.sub}</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-white text-[var(--forest)] hover:bg-[var(--mist)]">
                <Link href="/chat">
                  {t.home.ctaChat} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20"
              >
                <Link href="/recipes">{t.home.ctaRecipes}</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
        <div className="pointer-events-none absolute bottom-10 right-8 hidden h-28 w-28 rounded-full bg-white/10 blur-2xl md:block motion-safe:animate-drift" />
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <FadeIn>
          <div className="max-w-2xl">
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--forest)] md:text-4xl">
              {t.home.constraintsTitle}
            </h2>
            <p className="mt-3 text-[var(--muted-foreground)]">{t.home.constraintsSub}</p>
          </div>
        </FadeIn>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONSUMER_GROUPS.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={`/recipes?group=${g.id}`}
                className="block rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md active:scale-[0.99]"
              >
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--forest)]">
                  {t.groups[g.id].label}
                </h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{t.groups[g.id].blurb}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-white/50 py-20">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-5 md:grid-cols-2 md:px-8">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--forest)] md:text-4xl">
              {t.home.chatTitle}
            </h2>
            <p className="mt-3 text-[var(--muted-foreground)]">{t.home.chatSub}</p>
            <ul className="mt-6 space-y-3 text-sm text-[var(--forest)]">
              <li className="flex gap-2">
                <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                {t.home.chatBullet1}
              </li>
              <li className="flex gap-2">
                <Salad className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                {t.home.chatBullet2}
              </li>
              <li className="flex gap-2">
                <Scale className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                {t.home.chatBullet3}
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
              {t.home.featuredTitle}
            </h2>
            <p className="mt-2 text-[var(--muted-foreground)]">{t.home.featuredSub}</p>
          </div>
          <Button asChild variant="soft">
            <Link href="/recipes">{t.home.viewAll}</Link>
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
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl">{t.home.planTitle}</h2>
          <p className="mt-3 max-w-2xl text-white/75">{t.home.planSub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-white text-[var(--forest)] hover:bg-[var(--mist)]">
              <Link href="/planner">{t.home.openPlanner}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              <Link href="/bmi">{t.home.openBmi}</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white/10"
            >
              <Link href="/analyze">{t.home.openAnalyze}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}