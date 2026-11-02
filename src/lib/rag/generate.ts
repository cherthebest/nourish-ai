import { buildContext, retrieve, type RetrievedChunk } from "./retrieve";
import { recipes } from "../data/recipes";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface RagResult {
  answer: string;
  sources: { id: string; title: string; category: string; score: number }[];
  recipeIds: string[];
  mode: "local-rag" | "llm-rag";
}

function extractRecipeIds(chunks: RetrievedChunk[]): string[] {
  return chunks
    .map((c) => c.doc.id)
    .filter((id) => id.startsWith("recipe-"))
    .map((id) => id.replace(/^recipe-/, ""))
    .filter((id, i, arr) => arr.indexOf(id) === i);
}

function localAnswer(query: string, chunks: RetrievedChunk[]): string {
  const q = query.toLowerCase();
  const contextBits = chunks.slice(0, 4);
  const recipeIds = extractRecipeIds(chunks);
  const matchedRecipes = recipeIds
    .map((id) => recipes.find((r) => r.id === id))
    .filter(Boolean);

  const lines: string[] = [];

  if (/bmi|body mass|am i overweight|underweight/.test(q)) {
    lines.push(
      "BMI is weight(kg) ÷ height(m)². Use the BMI tool in NourishAI for a calculated result. Ranges: under 18.5 underweight, 18.5–24.9 typical, 25–29.9 overweight, 30+ obesity classes. BMI misses muscle mass — treat it as a screen, not a verdict.",
    );
  }

  if (/blood pressure|hypertension|sodium|dash/.test(q)) {
    lines.push(
      "For blood pressure, prioritize lower sodium, higher potassium foods (beans, greens, bananas), and DASH-style plates. Herbs and citrus beat the salt shaker. Food supports medication — it does not replace it.",
    );
  }

  if (/obes|lose weight|weight loss|fat loss|calorie/.test(q)) {
    lines.push(
      "For weight goals, favor high-volume, high-fiber, protein-anchored meals so you stay full. Beans, vegetables, oats, and eggs are affordable anchors. Consistency beats perfection after slip-ups.",
    );
  }

  if (/mental|mood|depress|anxi|stress|brain/.test(q)) {
    lines.push(
      "Regular meals, omega-3 sources (fish, walnuts, flax), and steady carbs support mood. Diet complements — but does not replace — mental health care.",
    );
  }

  if (/vegan|vegetarian|gain weight|muscle/.test(q)) {
    lines.push(
      "Vegans can gain weight and build nourishment with calorie-dense plants: nuts, seeds, oils, tahini, grains, soy, avocados — not leaves alone. Pair protein across the day.",
    );
  }

  if (/halal|kosher|muslim|beef|pork|religion|allerg/.test(q)) {
    lines.push(
      "Always filter by faith and allergy first. Many NourishAI recipes are already tagged halal/kosher/vegan/nut-free. Never prioritize a nutrient over a safety constraint.",
    );
  }

  if (/budget|cheap|afford|cost|expensive|economic/.test(q)) {
    lines.push(
      "Budget heroes: lentils, chickpeas, eggs, oats, cabbage, carrots, frozen vegetables, bananas, canned tomatoes. Compare cost per serving on each recipe card.",
    );
  }

  if (/meal plan|week|month|day plan|what should i eat/.test(q)) {
    lines.push(
      "Try a simple frame: protein + fiber each meal, batch 3 dinners weekly, freeze extras. Open Meal Planner to generate a day/week/month outline from your constraints.",
    );
  }

  if (/exercise|workout|excrete|activity|walk|gym/.test(q)) {
    lines.push(
      "Activity tip (not a prescription): start with walking and gentle strength if cleared by your clinician. High BMI or joint pain → swimming/cycling; aging → balance + resistance. Match intensity to medical history.",
    );
  }

  if (!lines.length) {
    lines.push(
      "Here is what our nutrition knowledge base suggests for your question, grounded in retrieved sources:",
    );
  }

  if (contextBits.length) {
    lines.push("");
    lines.push("Retrieved guidance:");
    for (const c of contextBits) {
      const snippet = c.doc.content.split(/(?<=\.)\s+/).slice(0, 2).join(" ");
      lines.push(`• ${c.doc.title}: ${snippet}`);
    }
  }

  if (matchedRecipes.length) {
    lines.push("");
    lines.push("Recipes that fit this topic:");
    for (const r of matchedRecipes.slice(0, 3)) {
      lines.push(
        `• ${r!.title} — $${r!.costPerServing.toFixed(2)}/serving, ${r!.nutrients.calories} kcal, tags: ${r!.tags.slice(0, 4).join(", ")}`,
      );
    }
  }

  lines.push("");
  lines.push(
    "Disclaimer: NourishAI offers educational suggestions via RAG over curated nutrition notes and recipes. It can be inaccurate and is not medical advice. Allergies, culture, and prescriptions come first.",
  );

  return lines.join("\n");
}

async function llmAnswer(
  query: string,
  history: ChatMessage[],
  context: string,
): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content: `You are NourishAI, a careful nutrition and healthy-recipe assistant. Answer using ONLY the retrieved context when possible. Respect allergies, religion/culture, budget, and medical caveats. Never tell users to stop prescribed medication. Be bilingual-friendly: reply in the user's language if they write non-English. Keep answers practical and concise. Cite source titles inline like (Source: title). End with a one-line disclaimer.

RETRIEVED CONTEXT:
${context}`,
          },
          ...history.slice(-6),
          { role: "user", content: query },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return data.choices?.[0]?.message?.content || null;
  } catch {
    return null;
  }
}

export async function answerWithRag(
  query: string,
  history: ChatMessage[] = [],
): Promise<RagResult> {
  const chunks = retrieve(query, 6);
  const context = buildContext(chunks);
  const recipeIds = extractRecipeIds(chunks);

  const llm = await llmAnswer(query, history, context);
  if (llm) {
    return {
      answer: llm,
      sources: chunks.map((c) => ({
        id: c.doc.id,
        title: c.doc.title,
        category: c.doc.category,
        score: Number(c.score.toFixed(3)),
      })),
      recipeIds,
      mode: "llm-rag",
    };
  }

  return {
    answer: localAnswer(query, chunks),
    sources: chunks.map((c) => ({
      id: c.doc.id,
      title: c.doc.title,
      category: c.doc.category,
      score: Number(c.score.toFixed(3)),
    })),
    recipeIds,
    mode: "local-rag",
  };
}