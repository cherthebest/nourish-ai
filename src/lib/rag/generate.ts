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

type Profile = {
  goal?: string;
  allergy?: string;
  culture?: string;
  budget?: "low" | "mid" | "any";
};

function scanProfile(history: ChatMessage[], query: string): Profile {
  const text = [...history.map((h) => h.content), query].join(" \n ").toLowerCase();
  const profile: Profile = {};

  if (/diabetes|blood sugar|血糖|糖尿病|胰島素|胰岛素/.test(text)) profile.goal = "diabetes";
  else if (/blood pressure|hypertension|血壓|高血压|高血壓/.test(text)) profile.goal = "bp";
  else if (/weight|lose weight|肥胖|減肥|减重|瘦|體重|体重/.test(text)) profile.goal = "weight";
  else if (/aging|elderly|樂齡|乐龄|長者|长者|老人/.test(text)) profile.goal = "aging";
  else if (/mood|stress|anxiety|情緒|压力|壓力|焦慮|焦虑|憂鬱|抑郁/.test(text)) profile.goal = "mood";
  else if (/heart|膽固醇|胆固醇|心脏|心臟/.test(text)) profile.goal = "heart";
  else if (/healthier|healthy|健康|均衡|吃得健康/.test(text)) profile.goal = "general";

  if (
    /peanut|nut allergy|dairy|lactose|shellfish|egg allergy|大豆過敏|花生|堅果過敏|乳糖|海鮮過敏|雞蛋過敏/.test(
      text,
    )
  ) {
    profile.allergy = "noted";
  }
  if (/no allergy|沒有過敏|无过敏|不過敏|没有过敏|none/.test(text)) profile.allergy = "none";

  if (/halal|muslim|清真|穆斯林/.test(text)) profile.culture = "halal";
  else if (/kosher|猶太|犹太|洁食|潔食/.test(text)) profile.culture = "kosher";
  else if (/vegan|純素|全素/.test(text)) profile.culture = "vegan";
  else if (/vegetarian|素食|蛋奶素/.test(text)) profile.culture = "vegetarian";
  else if (/cantonese|粵式|粤式|港式|中式|chinese|hong kong|香港/.test(text)) profile.culture = "hk";
  else if (/indian|南亞|印式|咖喱|curry culture/.test(text)) profile.culture = "south-asian";
  else if (/japanese|日式|和食/.test(text)) profile.culture = "japanese";
  else if (/korean|韓式|韩式/.test(text)) profile.culture = "korean";
  else if (/no restriction|沒有限制|没有限制|不限|any culture|不拘/.test(text)) profile.culture = "any";

  if (/budget|cheap|平價|便宜|預算|穷|窮|省錢|钱不多|錢不多|小預算|要平價/.test(text))
    profile.budget = "low";
  else if (
    /normal budget|any budget|預算還好|不限預算|一般|normal/.test(text) ||
    (/一般/.test(text) && profile.goal)
  )
    profile.budget = "any";

  return profile;
}

function alreadyAsked(history: ChatMessage[], needle: RegExp) {
  return history.some((h) => h.role === "assistant" && needle.test(h.content));
}

function alreadyRecommended(history: ChatMessage[]) {
  return history.some(
    (h) =>
      h.role === "assistant" &&
      (/推薦你看看|Try:|tap a name|點下面|點一下就能|Tap any recipe/i.test(h.content) ||
        /「.+」/.test(h.content)),
  );
}

function rotate<T>(arr: T[], seed: number): T[] {
  if (!arr.length) return arr;
  const offset = seed % arr.length;
  return [...arr.slice(offset), ...arr.slice(0, offset)];
}

function recommendIds(profile: Profile, seed: number): string[] {
  let pool = [...recipes];
  if (profile.goal === "diabetes")
    pool = pool.filter((r) => r.groups.includes("diabetes-friendly") || r.tags.includes("high-fiber"));
  else if (profile.goal === "bp")
    pool = pool.filter((r) => r.groups.includes("blood-pressure") || r.tags.includes("low-sodium"));
  else if (profile.goal === "weight") pool = pool.filter((r) => r.groups.includes("weight-management"));
  else if (profile.goal === "aging") pool = pool.filter((r) => r.groups.includes("aging"));
  else if (profile.goal === "mood") pool = pool.filter((r) => r.groups.includes("mental-health"));
  else if (profile.goal === "heart") pool = pool.filter((r) => r.groups.includes("heart-health"));

  if (profile.culture === "halal") pool = pool.filter((r) => r.tags.includes("halal"));
  else if (profile.culture === "kosher") pool = pool.filter((r) => r.tags.includes("kosher"));
  else if (profile.culture === "vegan") pool = pool.filter((r) => r.tags.includes("vegan"));
  else if (profile.culture === "vegetarian")
    pool = pool.filter((r) => r.tags.includes("vegetarian") || r.tags.includes("vegan"));
  else if (profile.culture === "hk")
    pool = pool.filter((r) =>
      /steamed-fish|congee|wonton|choy-sum|tomato-egg|mapo|pork-congee|chicken-shiitake|winter-melon|pak-choi|fried-rice|poached-chicken|ginger/i.test(
        r.id,
      ),
    );
  else if (profile.culture === "south-asian")
    pool = pool.filter((r) => /dal|lentil|chickpea|tikka|curry|spinach/i.test(`${r.id} ${r.title}`));
  else if (profile.culture === "japanese")
    pool = pool.filter((r) => /miso|soba|mackerel|edamame|tofu/i.test(`${r.id} ${r.title}`));
  else if (profile.culture === "korean")
    pool = pool.filter((r) => /bibimbap|kimchi|korean/i.test(`${r.id} ${r.title} ${r.cuisine}`) || r.id.includes("bibimbap"));

  if (profile.budget === "low") pool = pool.filter((r) => r.costPerServing <= 2.8);
  if (profile.allergy === "noted") {
    pool = pool.filter((r) => r.allergens.length === 0 || r.tags.includes("vegan"));
  }
  if (!pool.length) pool = recipes.filter((r) => r.tags.includes("budget") || r.costPerServing <= 3);
  if (!pool.length) pool = [...recipes];

  return rotate(pool, seed)
    .slice(0, 3)
    .map((r) => r.id);
}

function keywordAnswer(
  query: string,
  locale: Locale,
  seed: number,
): { text: string; recipeIds: string[]; key: string } | null {
  const q = query.toLowerCase();
  const zh = locale === "zh-Hant";

  const rules: { key: string; re: RegExp; en: string[]; zh: string[]; ids: string[] }[] = [
    {
      key: "diabetes",
      re: /diabetes|blood sugar|血糖|糖尿病|胰島素|胰岛素/,
      en: [
        "For blood sugar, keep meals steady: protein + fiber each time, and go easy on sugary drinks.",
        "Another angle on blood sugar: build the plate half vegetables, then protein, then a measured carb—skip sweet drinks.",
        "If blood sugar is the focus, beans, oats, tofu, and steamed greens usually beat fried takeout.",
      ],
      zh: [
        "血糖方面，重點是讓每一餐穩定：有蛋白質、有纖維，少碰含糖飲料。",
        "再換一個角度：半盤蔬菜、一份蛋白質、一份適量主食，比油炸外食穩得多。",
        "顧血糖可多選豆類、燕麥、豆腐與清蒸青菜，少喝手搖甜飲。",
      ],
      ids: ["greek-salad-chickpea", "apple-cinnamon-porridge", "spinach-dal", "steamed-veg-tofu", "mapo-tofu-light"],
    },
    {
      key: "bp",
      re: /blood pressure|hypertension|血壓|高血压|高血壓/,
      en: [
        "For blood pressure, cook with herbs and lemon instead of heavy salt.",
        "Potassium-rich vegetables and beans help more than cutting salt alone—still go easy on sauces.",
      ],
      zh: [
        "血壓方面，多用香草與檸檬取代重鹹。",
        "多吃含鉀蔬菜與豆類，同時少沾濃醬，通常比只喊「少鹽」更實際。",
      ],
      ids: ["dash-bean-salad", "miso-soup-tofu", "steamed-veg-tofu", "garlic-choy-sum", "winter-melon-soup"],
    },
    {
      key: "budget",
      re: /budget|cheap|affordable|平價|便宜|省錢|穷|窮|錢不多|钱不多/,
      en: [
        "Budget plates that still nourish: lentils, eggs, oats, cabbage, tofu, and beans.",
        "Cook once, eat twice—egg rice, congee, and lentil soup stretch further than takeout.",
      ],
      zh: [
        "平價又能吃得像樣：扁豆、雞蛋、燕麥、高麗菜、豆腐、豆類。",
        "一次多煮一點分兩餐：番茄炒蛋、粥、扁豆湯，通常比外賣更省。",
      ],
      ids: ["lentil-ginger-bowl", "tomato-egg-rice", "spinach-dal", "lean-pork-congee", "steamed-egg-custard"],
    },
    {
      key: "halal",
      re: /halal|muslim|清真|穆斯林/,
      en: ["These picks are tagged halal-friendly. Tell me if you also need dairy-free or nut-free."],
      zh: ["下面這些有清真友善標籤。若還有乳製品或堅果限制也可以跟我說。"],
      ids: ["lentil-ginger-bowl", "chickpea-curry", "tomato-egg-rice", "spinach-dal", "chicken-brown-rice-bowl"],
    },
    {
      key: "hk",
      re: /cantonese|港式|粵式|粤式|茶餐廳|兩餸|两餸|香港/,
      en: [
        "For Hong Kong–style everyday eating, lean on steamed fish, congee, greens, and home versions of cha chaan teng classics.",
      ],
      zh: ["港式日常可以多選清蒸魚、粥、青菜，以及改良版茶餐廳經典（少油少糖）。"],
      ids: ["steamed-fish-ginger", "lean-pork-congee", "garlic-choy-sum", "tomato-egg-rice", "homemade-wonton-soup"],
    },
    {
      key: "weight",
      re: /weight|lose weight|diet|減肥|减重|瘦身|肥胖|體重|体重/,
      en: ["For weight goals, fill the plate with vegetables and protein first; bake or steam instead of deep-fry."],
      zh: ["體重目標先求吃得飽：蔬菜打底、再加蛋白質，烘烤清蒸比油炸好。"],
      ids: ["turkey-lettuce-wraps", "tofu-veg-stirfry", "chicken-broccoli-stirfry", "steamed-veg-tofu"],
    },
    {
      key: "bubble",
      re: /bubble tea|boba|珍珠|奶茶|手搖/,
      en: ["Bubble tea is usually dessert-level sugar—keep it occasional; day to day choose water or unsweetened tea."],
      zh: ["珍珠奶茶糖分很高，比較像甜點。日常改喝水或不加糖茶；想喝就選少糖小杯。"],
      ids: ["less-sugar-lemon-tea", "apple-cinnamon-porridge", "mango-yogurt-smoothie"],
    },
    {
      key: "fried",
      re: /fried chicken|炸雞|炸鸡|junk|垃圾食物|薯條|薯条/,
      en: ["Fried food is fine occasionally. Day to day, bake chicken with vegetables or try lighter wraps."],
      zh: ["油炸食物偶爾可以。平常可改焗雞配蔬菜，或生菜包——一樣有咬感但負擔小。"],
      ids: ["baked-chicken-veg", "baked-chicken-wings-light", "turkey-lettuce-wraps"],
    },
  ];

  for (const rule of rules) {
    if (rule.re.test(q)) {
      const texts = zh ? rule.zh : rule.en;
      const text = texts[seed % texts.length];
      const ids = rotate(rule.ids, seed).slice(0, 3);
      return { text, recipeIds: ids, key: rule.key };
    }
  }
  return null;
}

function consultOrAnswer(
  query: string,
  history: ChatMessage[],
  chunks: RetrievedChunk[],
  locale: Locale,
): { text: string; recipeIds: string[] } {
  const zh = locale === "zh-Hant";
  const profile = scanProfile(history, query);
  const seed = history.filter((h) => h.role === "user").length + query.length;
  const keyed = keywordAnswer(query, locale, seed);
  const userTurns = history.filter((h) => h.role === "user").length;
  const recommendedBefore = alreadyRecommended(history);

  const wantsFood =
    /eat|cook|meal|recipe|吃|餐|食譜|配|建議|recommend|what should|幫我|帮我|不知道/i.test(query) ||
    Boolean(profile.goal) ||
    userTurns > 0;

  // Direct keyword with recipes: answer once with variation; don't force consult if user already answered follow-ups elsewhere
  const skipConsult =
    recommendedBefore ||
    (keyed && keyed.recipeIds.length > 0 && (profile.allergy != null || profile.budget || userTurns >= 2));

  if (wantsFood && !profile.goal && !(keyed && keyed.recipeIds.length) && !recommendedBefore) {
    if (alreadyAsked(history, /最想照顧|main focus|體重、血壓、血糖/)) {
      // User didn't pick a goal clearly — offer general healthy picks instead of looping
      profile.goal = "general";
    } else {
      return {
        text: zh
          ? "好，我先問清楚一點。你現在最想照顧的是哪一件：體重、血壓、血糖，還是單純想吃得健康一點？也可以直接說「港式／清真／素食」等偏好。"
          : "Sure—quick check. What’s your main focus: weight, blood pressure, blood sugar, or just eating healthier? You can also say a culture preference (e.g. Hong Kong–style, halal, vegetarian).",
        recipeIds: [],
      };
    }
  }

  if (wantsFood && profile.goal && profile.allergy == null && !skipConsult) {
    if (!alreadyAsked(history, /過敏|allergies|信仰/)) {
      return {
        text: zh
          ? "了解。有沒有食物過敏或信仰／文化飲食限制（例如清真、猶太潔食、純素、港式家常）？沒有的話回「沒有過敏」或「不限」就好。"
          : "Got it. Any allergies or faith/culture food limits (halal, kosher, vegan, Hong Kong–style home cooking)? If none, say “no allergies” or “any culture.”",
        recipeIds: [],
      };
    }
    profile.allergy = "none";
    profile.culture = profile.culture || "any";
  }

  if (wantsFood && profile.goal && profile.allergy != null && !profile.budget && !skipConsult) {
    if (!alreadyAsked(history, /預算|budget-friendly|要平價|一般即可/)) {
      return {
        text: zh
          ? "最後一個：預算希望偏省，還是一般即可？回「要平價」或「一般」就行。"
          : "Last one: budget-friendly or normal budget? Reply “budget” or “normal.”",
        recipeIds: [],
      };
    }
    profile.budget = "any";
  }

  // Follow-up after recommendations: rotate picks — never paste the same block again
  if (recommendedBefore) {
    const more = recommendIds(
      {
        ...profile,
        budget: profile.budget || (/平價|budget|cheap/i.test(query) ? "low" : profile.budget),
        culture:
          profile.culture ||
          (/港式|香港|粵/i.test(query)
            ? "hk"
            : /清真|halal/i.test(query)
              ? "halal"
              : profile.culture),
      },
      seed + 11,
    );
    const localizedMore = more
      .map((id) => recipes.find((r) => r.id === id))
      .filter(Boolean)
      .map((r) => localizeRecipe(r!, locale))
      .slice(0, 3);
    const lead = keyed?.text
      ? `${keyed.text}${zh ? "" : " "}`
      : zh
        ? "好，換一批給你試試："
        : "Here are a fresh few to try: ";
    const text = zh
      ? `${lead}${localizedMore.map((r) => `「${r.title}」`).join("、")}。想更貼近某種文化口味（港式、南亞、日式、清真）也可以直接說。以上是一般飲食建議，不能取代醫生判斷。`
      : `${lead}${localizedMore.map((r) => r.title).join(", ")}. Tell me a culture preference (Hong Kong–style, South Asian, Japanese, halal) if you want a tighter fit. General guidance only—not medical advice.`;
    return { text, recipeIds: localizedMore.map((r) => r.id) };
  }

  const ids =
    (keyed && keyed.recipeIds.length ? rotate(keyed.recipeIds, seed).slice(0, 3) : null) ||
    (profile.goal ? recommendIds(profile, seed) : extractRecipeIds(chunks).slice(0, 3));

  const localized = ids
    .map((id) => recipes.find((r) => r.id === id))
    .filter(Boolean)
    .map((r) => localizeRecipe(r!, locale))
    .slice(0, 3);

  let text = keyed?.text || "";
  if (!text) {
    if (profile.goal === "bp") {
      text = zh
        ? "血壓友善的方向是少鹽、多鉀，多用香草與蔬菜。"
        : "For blood pressure, think less salt, more potassium, herbs, and vegetables.";
    } else if (profile.goal === "diabetes") {
      text = zh
        ? "血糖友善通常靠「蛋白質＋纖維」、少含糖飲料。"
        : "Blood-sugar friendlier plates usually pair protein with fiber and skip sugary drinks.";
    } else if (profile.goal === "weight") {
      text = zh
        ? "體重目標先求吃得飽又不太油：蔬菜體積、蛋白質、少油炸。"
        : "For weight goals, prioritize filling plates—vegetables, protein, less deep-frying.";
    } else if (profile.culture === "hk") {
      text = zh
        ? "依你偏港式口味，我先挑清蒸、粥與家常青菜方向。"
        : "Going Hong Kong–style: steamed dishes, congee, and simple greens first.";
    } else {
      text = zh
        ? "根據你剛說的，我建議先從這些日常餐著手。"
        : "Based on what you shared, start with these everyday meals.";
    }
  }

  if (localized.length) {
    text += zh
      ? `推薦你看看：${localized.map((r) => `「${r.title}」`).join("、")}。直接點下面的名稱就能進去。`
      : ` Try: ${localized.map((r) => r.title).join(", ")}. Tap a name below to open it.`;
  }

  text += zh
    ? "以上是一般飲食建議，不能取代醫生判斷。"
    : " This is general food guidance, not medical advice.";

  return { text, recipeIds: localized.map((r) => r.id) };
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
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `You are NourishAI, a warm human nutrition coach.
Speak naturally. Answer the user's actual question—never repeat the exact same reply you already gave in this chat.
Vary recipe suggestions across turns. Respect culture and faith diets (halal, kosher, Hindu vegetarian, Chinese/HK home cooking, etc.) without defaulting to one culture.
If details are missing for a meal recommendation, ask 1 clarifying question at a time (goal → allergies/culture → budget), then recommend 2–3 concrete recipes matching the UI language.
Never mention RAG, retrieval, knowledge base, or sources.
Do not mix English into Traditional Chinese answers—fully Chinese when locale is zh-Hant.
End with a brief educational disclaimer.
Respond in ${locale === "zh-Hant" ? "fully Traditional Chinese only" : "natural US English"}.

INTERNAL NOTES:
${context}`,
          },
          ...history.slice(-8),
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
  const local = consultOrAnswer(query, history, chunks, locale);

  const llm = await llmAnswer(query, history, context, locale);
  if (llm) {
    return {
      answer: llm,
      sources: [],
      recipeIds: local.recipeIds.length ? local.recipeIds : extractRecipeIds(chunks).slice(0, 3),
      mode: "llm-rag",
    };
  }

  return {
    answer: local.text,
    sources: [],
    recipeIds: local.recipeIds,
    mode: "local-rag",
  };
}
