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

function localAnswer(query: string, chunks: RetrievedChunk[], locale: Locale): string {
  const q = query.toLowerCase();
  const zh = locale === "zh-Hant";
  const contextBits = chunks.slice(0, 4);
  const recipeIds = extractRecipeIds(chunks);
  const matchedRecipes = recipeIds
    .map((id) => recipes.find((r) => r.id === id))
    .filter(Boolean)
    .map((r) => localizeRecipe(r!, locale));

  const lines: string[] = [];

  if (/bmi|body mass|overweight|underweight|身體質量|過重|過輕/.test(q)) {
    lines.push(
      zh
        ? "BMI＝體重(公斤)÷身高(公尺)²。可用 NourishAI 的 BMI 工具計算。範圍：低於 18.5 過輕、18.5–24.9 一般、25–29.9 過重、30 以上為肥胖分級。BMI 看不出肌肉量——把它當篩檢，不是判決。"
        : "BMI is weight(kg) ÷ height(m)². Use the BMI tool in NourishAI for a calculated result. Ranges: under 18.5 underweight, 18.5–24.9 typical, 25–29.9 overweight, 30+ obesity classes. BMI misses muscle mass—treat it as a screen, not a verdict.",
    );
  }

  if (/blood pressure|hypertension|sodium|dash|血壓|高血壓|鈉/.test(q)) {
    lines.push(
      zh
        ? "血壓管理優先：少鈉、多鉀（豆類、綠葉菜、香蕉），採 DASH 風格餐盤。多用香草與柑橘代替鹽罐。食物可輔助藥物——但不能取代處方。"
        : "For blood pressure, prioritize lower sodium, higher potassium foods (beans, greens, bananas), and DASH-style plates. Herbs and citrus beat the salt shaker. Food supports medication—it does not replace it.",
    );
  }

  if (/obes|lose weight|weight loss|fat loss|calorie|減肥|體重|熱量/.test(q)) {
    lines.push(
      zh
        ? "體重目標請優先高體積、高纖、每餐有蛋白質的餐點，比較容易吃飽。豆子、蔬菜、燕麥與雞蛋是平價核心。失手後下一餐回到節奏，比追求完美更重要。"
        : "For weight goals, favor high-volume, high-fiber, protein-anchored meals so you stay full. Beans, vegetables, oats, and eggs are affordable anchors. Consistency beats perfection after slip-ups.",
    );
  }

  if (/mental|mood|depress|anxi|stress|brain|情緒|壓力|憂鬱|焦慮/.test(q)) {
    lines.push(
      zh
        ? "規律進食、Omega-3（魚、核桃、亞麻）、穩定碳水有助情緒。飲食是輔助——不能取代心理健康專業照護。"
        : "Regular meals, omega-3 sources (fish, walnuts, flax), and steady carbs support mood. Diet complements—but does not replace—mental health care.",
    );
  }

  if (/vegan|vegetarian|gain weight|muscle|純素|素食|增重|肌肉/.test(q)) {
    lines.push(
      zh
        ? "純素也能增重與補充營養：堅果、種子、油脂、芝麻醬、穀物、大豆、酪梨——不是只吃葉子。全天平均分配蛋白質。"
        : "Vegans can gain weight and build nourishment with calorie-dense plants: nuts, seeds, oils, tahini, grains, soy, avocados—not leaves alone. Pair protein across the day.",
    );
  }

  if (/halal|kosher|muslim|beef|pork|religion|allerg|清真|猶太|穆斯林|過敏|牛肉|豬肉/.test(q)) {
    lines.push(
      zh
        ? "請先依信仰與過敏篩選。許多 NourishAI 食譜已標示清真／猶太潔食／純素／無堅果。安全限制永遠優先於營養密度。"
        : "Always filter by faith and allergy first. Many NourishAI recipes are already tagged halal/kosher/vegan/nut-free. Never prioritize a nutrient over a safety constraint.",
    );
  }

  if (/budget|cheap|afford|cost|expensive|economic|預算|便宜|平價|貴/.test(q)) {
    lines.push(
      zh
        ? "平價高手：扁豆、鷹嘴豆、雞蛋、燕麥、高麗菜、胡蘿蔔、冷凍蔬菜、香蕉、罐裝番茄。到各食譜卡比較每份成本。"
        : "Budget heroes: lentils, chickpeas, eggs, oats, cabbage, carrots, frozen vegetables, bananas, canned tomatoes. Compare cost per serving on each recipe card.",
    );
  }

  if (/meal plan|week|month|day plan|what should i eat|餐點|一週|一個月|今天吃/.test(q)) {
    lines.push(
      zh
        ? "簡單框架：每餐蛋白質＋纖維，一週批次做 3 頓晚餐，多的冷凍。打開「餐點規劃」依你的限制產生一天／一週／一個月大綱。"
        : "Try a simple frame: protein + fiber each meal, batch 3 dinners weekly, freeze extras. Open Meal Planner to generate a day/week/month outline from your constraints.",
    );
  }

  if (/exercise|workout|activity|walk|gym|運動|走路|健身/.test(q)) {
    lines.push(
      zh
        ? "活動提示（非處方）：在醫師許可下，可從走路與溫和肌力開始。BMI 偏高或關節疼痛→游泳／騎車；樂齡→平衡＋阻力訓練。強度需配合病史。"
        : "Activity tip (not a prescription): start with walking and gentle strength if cleared by your clinician. Higher BMI or joint pain → swimming/cycling; aging → balance + resistance. Match intensity to medical history.",
    );
  }

  if (!lines.length) {
    lines.push(
      zh
        ? "根據我們的營養筆記與食譜，針對你的問題整理如下："
        : "Here’s what our nutrition notes and recipes suggest for your question:",
    );
  }

  if (contextBits.length) {
    lines.push("");
    lines.push(zh ? "相關指引：" : "Helpful guidance:");
    for (const c of contextBits) {
      const snippet = c.doc.content.split(/(?<=\.)\s+/).slice(0, 2).join(" ");
      lines.push(`• ${c.doc.title}: ${snippet}`);
    }
  }

  if (matchedRecipes.length) {
    lines.push("");
    lines.push(zh ? "符合主題的食譜：" : "Recipes that fit this topic:");
    for (const r of matchedRecipes.slice(0, 3)) {
      lines.push(
        `• ${r.title} — $${r.costPerServing.toFixed(2)}${zh ? "/份" : "/serving"}, ${r.nutrients.calories} ${zh ? "大卡" : "kcal"}, ${zh ? "標籤" : "tags"}: ${r.tags.slice(0, 4).join(", ")}`,
      );
    }
  }

  lines.push("");
  lines.push(
    zh
      ? "聲明：NourishAI 提供教育性建議，可能不準確，且非醫療建議。過敏、文化與處方優先。"
      : "Disclaimer: NourishAI offers educational suggestions based on curated nutrition notes and recipes. It can be inaccurate and is not medical advice. Allergies, culture, and prescriptions come first.",
  );

  return lines.join("\n");
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
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content: `You are NourishAI, a careful nutrition and healthy-recipe assistant. Answer using ONLY the retrieved context when possible. Respect allergies, religion/culture, budget, and medical caveats. Never tell users to stop prescribed medication. Keep answers practical and concise. Cite source titles inline like (Source: title). End with a one-line disclaimer.
Respond in ${locale === "zh-Hant" ? "Traditional Chinese (繁體中文)" : "natural US English, like a mainstream American health website"}.

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