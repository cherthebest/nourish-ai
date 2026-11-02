"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/recipes", label: "Recipes" },
  { href: "/chat", label: "Ask Nourish" },
  { href: "/analyze", label: "Food analysis" },
  { href: "/planner", label: "Meal planner" },
  { href: "/bmi", label: "BMI & body" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md transition group-hover:scale-105">
            <Leaf className="h-4 w-4" />
          </span>
          <span className="font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--forest)] md:text-2xl">
            NourishAI
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-medium text-[var(--forest)]/80 transition hover:bg-white/50 hover:text-[var(--forest)]",
                pathname === l.href && "bg-white/70 text-[var(--forest)]",
              )}
            >
              {l.label}
            </Link>
          ))}
          <Button asChild size="sm" className="ml-2">
            <Link href="/chat">Open chatbot</Link>
          </Button>
        </nav>

        <button
          type="button"
          className="rounded-xl border border-[var(--border)] bg-white/70 p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="mx-5 mb-4 animate-in rounded-2xl border border-[var(--border)] bg-white/95 p-3 shadow-lg backdrop-blur md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-3 text-sm font-medium text-[var(--forest)] hover:bg-[var(--muted)]"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}