import { buildContext, retrieve, type RetrievedChunk } from "./retrieve";
import { recipes } from "../data/recipes";
import { localizeRecipe } from "../i18n/recipe-locale";
import type { Locale } from "../i18n/types";

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

function firstSentences(text: string, n = 2): string {
  return text
    .split(/(?<=[。.!？?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, n)
    .join(text.includes("。") ? "" : " ");
}

function pickAdvice(query: string, locale: Locale): string[] {
  const q = query.toLowerCase();
  const zh = locale === "zh-Hant";
  const tips: string[] = [];

  if (/bmi|body mass|overweight|underweight|身體質量|過重|過輕/.test(q)) {
    tips.push(
      zh
        ? "你可以先用網站裡的 BMI 工具看個大概數字。記得 BMI 只是篩檢，看不出肌肉量，別把它當成最終判決。"
        : "You can start with the BMI tool on the site for a quick snapshot. BMI is only a screen—it doesn’t show muscle—so don’t treat it like a final verdict.",
    );
  }
  if (/blood pressure|hypertension|sodium|dash|血壓|高血壓|鈉/.test(q)) {
    tips.push(
      zh
        ? "若你在顧血壓，日常可先朝「少鹽、多鉀」走：豆類、綠葉菜、香蕉都友善；香草、薑蒜、柑橘比一直加鹽更好。若你有在吃藥，飲食是輔助，不要自行停藥。"
        : "If blood pressure is on your mind, lean toward less salt and more potassium—beans, leafy greens, bananas help. Herbs, garlic, and citrus beat the salt shaker. If you’re on meds, food supports your plan—don’t stop prescriptions on your own.",
    );
  }
  if (/obes|lose weight|weight loss|fat loss|calorie|減肥|瘦|體重|熱量/.test(q)) {
    tips.push(
      zh
        ? "想穩穩照顧體重，優先選吃得飽的組合：蔬菜體積大、纖維多，再配蛋白質（蛋、豆、豆腐、魚）。豆子、燕麥、雞蛋通常也比較省。哪天吃多了，下一餐回來就好，不必等「下週一」。"
        : "For steadier weight goals, build meals that actually fill you up—lots of vegetables, fiber, and a clear protein (eggs, beans, tofu, fish). Beans, oats, and eggs keep costs down. If one meal goes off track, just come back at the next one.",
    );
  }
  if (/mental|mood|depress|anxi|stress|brain|情緒|壓力|憂鬱|焦慮/.test(q)) {
    tips.push(
      zh
        ? "情緒緊繃時，規律吃飯本身就有幫助；魚、核桃、亞麻這類 Omega-3，加上全穀，很多人會覺得比較穩。飲食是輔助，若情緒很辛苦，還是值得找專業支持。"
        : "When stress is high, regular meals already help. Omega-3 foods like fish, walnuts, or flax, plus whole grains, support steadier energy for many people. Food is a support—not a replacement for mental health care when you need it.",
    );
  }
  if (/vegan|vegetarian|gain weight|muscle|純素|素食|增重|肌肉/.test(q)) {
    tips.push(
      zh
        ? "純素也能吃得夠、甚至增重：堅果、種子、好油、芝麻醬、穀物、大豆、酪梨這些熱量密度較高。別只靠葉子菜；蛋白質記得分散在各餐。"
        : "You can eat well on a vegan pattern—and even gain if that’s the goal—with nuts, seeds, oils, tahini, grains, soy, and avocado. Leaves alone won’t get you there; spread protein across the day.",
    );
  }
  if (/halal|kosher|muslim|beef|pork|religion|allerg|清真|猶太|穆斯林|過敏|牛肉|豬肉/.test(q)) {
    tips.push(
      zh
        ? "先把信仰與過敏條件放最前面。網站很多食譜已標清真、猶太潔食、純素或無堅果——安全永遠比「看起來營養」重要。"
        : "Lead with faith and allergy needs. Plenty of recipes here are already marked halal, kosher, vegan, or nut-free—safety always beats a “superfood” that doesn’t fit you.",
    );
  }
  if (/budget|cheap|afford|cost|expensive|economic|預算|便宜|平價|貴/.test(q)) {
    tips.push(
      zh
        ? "預算緊也有路：扁豆、鷹嘴豆、雞蛋、燕麥、高麗菜、胡蘿蔔、冷凍蔬菜、香蕉、罐裝番茄都很務實。看食譜時可直接對「每份成本」。"
        : "On a tighter budget, lean on lentils, chickpeas, eggs, oats, cabbage, carrots, frozen vegetables, bananas, and canned tomatoes. Check cost per serving on each recipe card.",
    );
  }
  if (/meal plan|week|month|day plan|what should i eat|餐點|一週|一個月|今天吃|吃什麼/.test(q)) {
    tips.push(
      zh
        ? "你可以先用這個節奏：每餐都有蛋白質和纖維；一週先批次做兩三頓晚餐，多的冷凍。想省事也可直接開「餐點規劃」產生一天或一週的草稿。"
        : "A simple rhythm helps: protein and fiber at each meal, batch two or three dinners for the week, freeze extras. Or open Meal Plan and generate a day or week draft in one click.",
    );
  }
  if (/exercise|workout|activity|walk|gym|運動|走路|健身/.test(q)) {
    tips.push(
      zh
        ? "活動上，在身體狀況允許時，可先從每天走路開始，再慢慢加一點肌力。關節不適或體重較高可考慮游泳、騎車；年長一點可多練平衡。有病史先問過醫師再加強強度。"
        : "For movement, start with walking if you’re cleared for it, then add light strength. Swimming or cycling is kinder on joints; older adults often benefit from balance work. Check with a clinician before pushing intensity if you have medical conditions.",
    );
  }
  if (/hong kong|asia|cantonese|濕貨|街市|香港|粵|中式/.test(q)) {
    tips.push(
      zh
        ? "在香港或華人廚房很常有的選擇：豆腐、蛋、菜心／白菜、番茄、黃瓜、魚、糙米或雜糧飯。蒸、煮、少油快炒通常比油炸友善；醬油可選低鈉，再用薑蒜辣椒提味。"
        : "In a Hong Kong or broader Asian kitchen, tofu, eggs, greens, tomatoes, cucumber, fish, and mixed rice are easy anchors. Steam, boil, or lightly stir-fry more often than deep-fry, and lean on ginger, garlic, and chili instead of heavy sauces.",
    );
  }

  return tips;
}

function localAnswer(query: string, chunks: RetrievedChunk[], locale: Locale): string {
  const zh = locale === "zh-Hant";
  const tips = pickAdvice(query, locale);
  const recipeIds = extractRecipeIds(chunks);
  const matchedRecipes = recipeIds
    .map((id) => recipes.find((r) => r.id === id))
    .filter(Boolean)
    .map((r) => localizeRecipe(r!, locale))
    .slice(0, 2);

  const knowledgeBits = chunks
    .filter((c) => !c.doc.id.startsWith("recipe-"))
    .slice(0, 2)
    .map((c) => firstSentences(c.doc.content, 2))
    .filter(Boolean);

  const parts: string[] = [];

  if (tips.length) {
    parts.push(tips.join(zh ? "" : " "));
  } else if (knowledgeBits.length) {
    parts.push(
      zh
        ? `就你剛提到的，我建議可以這樣想：${knowledgeBits.join("")}`
        : `Based on what you wrote, here’s a practical take: ${knowledgeBits.join(" ")}`,
    );
  } else {
    parts.push(
      zh
        ? "我明白你的問題。先從「蛋白質 + 蔬菜 + 不太鹹」的方向調整，通常最容易開始；你也可以告訴我預算、過敏或血壓／體重目標，我再幫你收窄。"
        : "Got it. A simple place to start is protein + vegetables with less salt. Tell me your budget, allergies, or goals like blood pressure or weight, and I’ll narrow it down.",
    );
  }

  if (matchedRecipes.length) {
    if (zh) {
      const names = matchedRecipes
        .map(
          (r) =>
            `「${r.title}」（大約 $${r.costPerServing.toFixed(2)}/份）`,
        )
        .join("、");
      parts.push(`若要立刻有得煮，可以看看${names}，點開就能看步驟與營養。`);
    } else {
      const names = matchedRecipes
        .map((r) => `${r.title} (about $${r.costPerServing.toFixed(2)}/serving)`)
        .join(" or ");
      parts.push(`If you want something concrete to cook, try ${names}—tap through for steps and nutrition.`);
    }
  }

  parts.push(
    zh
      ? "以上只是一般飲食建議，不能取代醫生或營養師的判斷。"
      : "This is general food guidance, not a medical diagnosis or a substitute for your clinician.",
  );

  return parts.join(zh ? "" : " ");
}

async function llmAnswer(
  query: string,
  history: ChatMessage[],
  context: string,
  locale: Locale,
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
        temperature: 0.5,
        messages: [
          {
            role: "system",
            content: `You are NourishAI, a warm, practical nutrition guide for everyday people.
Answer in natural spoken language like a helpful human coach—not a textbook, not a search report.
Never say RAG, retrieval, knowledge base, sources, citations, or “related guidance.”
Do not use section headers like "Helpful guidance" / "相關指引" / bullet dumps of document titles.
Use the internal notes below only to inform your answer; weave them into plain speech.
Respect allergies, culture/religion, budget, and medical caveats. Never tell users to stop prescribed medication.
Keep it concise (about 2–5 short paragraphs or short paragraphs in Chinese).
End with one gentle line that this is educational, not medical advice.
Respond in ${locale === "zh-Hant" ? "natural Traditional Chinese (繁體中文口語，但清楚專業)" : "natural US English, like a friendly American health coach"}.

INTERNAL NOTES (do not mention these labels to the user):
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
  locale: Locale = "en",
): Promise<RagResult> {
  const chunks = retrieve(query, 6);
  const context = buildContext(chunks);
  const recipeIds = extractRecipeIds(chunks);

  const llm = await llmAnswer(query, history, context, locale);
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
    answer: localAnswer(query, chunks, locale),
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