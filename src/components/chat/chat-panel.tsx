"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { Loader2, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { getRecipeById } from "@/lib/data/recipes";

type Msg = {
  role: "user" | "assistant";
  content: string;
  sources?: { id: string; title: string; category: string; score: number }[];
  recipeIds?: string[];
  mode?: string;
};

const STARTERS = [
  "I have high blood pressure — what should I eat this week?",
  "Suggest affordable vegan meals to help me feel full.",
  "Is fried chicken healthy? What are better alternatives?",
  "Plan a day of meals for someone managing weight and stress.",
  "I'm Muslim and allergic to dairy — recipe ideas?",
];

export function ChatPanel({ compact = false }: { compact?: boolean }) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi — I'm NourishAI. Tell me your goals, allergies, budget, culture, or medical context (like blood pressure). I'll retrieve recipe and nutrition knowledge with RAG and suggest practical next steps.",
    },
  ]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pending]);

  function send(text: string) {
    const message = text.trim();
    if (!message || pending) return;
    setError(null);
    const nextMessages: Msg[] = [...messages, { role: "user", content: message }];
    setMessages(nextMessages);
    setInput("");

    startTransition(async () => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            history: nextMessages.slice(0, -1).map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Request failed");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.answer,
            sources: data.sources,
            recipeIds: data.recipeIds,
            mode: data.mode,
          },
        ]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I couldn't complete that answer. Check your connection and try a shorter question.",
          },
        ]);
      }
    });
  }

  return (
    <div
      className={
        compact
          ? "flex h-[540px] flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-lg"
          : "flex min-h-[70vh] flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-lg"
      }
    >
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--primary)]">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="font-semibold text-[var(--forest)]">Ask Nourish</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              RAG over recipes & nutrition notes
            </p>
          </div>
        </div>
        <Badge className="bg-[var(--accent-soft)] text-[var(--primary)]">Local RAG ready</Badge>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-auto max-w-[90%] rounded-2xl rounded-br-md bg-[var(--primary)] px-4 py-3 text-sm text-[var(--primary-foreground)]"
                : "mr-auto max-w-[95%] rounded-2xl rounded-bl-md bg-[var(--muted)] px-4 py-3 text-sm text-[var(--foreground)]"
            }
          >
            <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
            {m.sources && m.sources.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.sources.slice(0, 5).map((s) => (
                  <Badge key={s.id} className="bg-white/80 text-[10px]">
                    {s.title}
                  </Badge>
                ))}
                {m.mode && (
                  <Badge className="bg-[var(--forest)] text-[10px] text-white">{m.mode}</Badge>
                )}
              </div>
            )}
            {m.recipeIds && m.recipeIds.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {m.recipeIds.slice(0, 3).map((id) => {
                  const r = getRecipeById(id);
                  if (!r) return null;
                  return (
                    <Link
                      key={id}
                      href={`/recipes/${id}`}
                      className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-[var(--primary)] underline-offset-2 hover:underline"
                    >
                      {r.title}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
        {pending && (
          <div className="inline-flex items-center gap-2 rounded-2xl bg-[var(--muted)] px-4 py-3 text-sm text-[var(--muted-foreground)]">
            <Loader2 className="h-4 w-4 animate-spin" /> Retrieving knowledge…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length < 3 && (
        <div className="flex gap-2 overflow-x-auto border-t border-[var(--border)] px-4 py-3">
          {STARTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="shrink-0 rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-left text-xs text-[var(--forest)] hover:bg-[var(--muted)]"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        className="flex gap-2 border-t border-[var(--border)] p-4"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about recipes, nutrients, BMI context, budget, allergies…"
          className="min-h-[52px] resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
        />
        <Button type="submit" size="icon" disabled={pending || !input.trim()} aria-label="Send">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
      {error && <p className="px-4 pb-3 text-xs text-red-700">{error}</p>}
    </div>
  );
}