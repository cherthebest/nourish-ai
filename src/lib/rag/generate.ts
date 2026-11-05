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
  budget?: "low" | "mid" | "any";
};

function scanProfile(history: ChatMessage[], query: string): Profile {
  const text = [...history.map((h) => h.content), query].join(" \n ").toLowerCase();
  const profile: Profile = {};

  if (/diabetes|blood sugar|血糖|糖尿病|胰島素/.test(text)) profile.goal = "diabetes";
  else if (/blood pressure|hypertension|血壓|高血壓/.test(text)) profile.goal = "bp";
  else if (/weight|lose weight|肥胖|減肥|瘦|體重/.test(text)) profile.goal = "weight";
  else if (/aging|elderly|樂齡|長者|老人/.test(text)) profile.goal = "aging";
  else if (/mood|stress|anxiety|情緒|壓力|焦慮|憂鬱/.test(text)) profile.goal = "mood";
  else if (/heart|膽固醇|心脏|心臟/.test(text)) profile.goal = "heart";

  if (/peanut|nut allergy|dairy|lactose|shellfish|egg allergy|大豆過敏|花生|堅果過敏|乳糖|海鮮過敏|雞蛋過敏|過敏/.test(text)) {
    profile.allergy = "noted";
  }
  if (/no allergy|沒有過敏|无过敏|不過敏|没有过敏/.test(text)) profile.allergy = "none";

  if (/budget|cheap|平價|便宜|預算|穷|窮|省錢|钱不多|錢不多|小預算|要平價/.test(text)) profile.budget = "low";
  else if (/any budget|預算還好|不限預算|一般/.test(text) && /budget|預算|一般|normal/.test(text))
    profile.budget = "any";

  return profile;
}

function recommendIds(profile: Profile): string[] {
  let pool = [...recipes];
  if (profile.goal === "diabetes")
    pool = pool.filter((r) => r.groups.includes("diabetes-friendly") || r.tags.includes("high-fiber"));
  else if (profile.goal === "bp")
    pool = pool.filter((r) => r.groups.includes("blood-pressure") || r.tags.includes("low-sodium"));
  else if (profile.goal === "weight") pool = pool.filter((r) => r.groups.includes("weight-management"));
  else if (profile.goal === "aging") pool = pool.filter((r) => r.groups.includes("aging"));
  else if (profile.goal === "mood") pool = pool.filter((r) => r.groups.includes("mental-health"));
  else if (profile.goal === "heart") pool = pool.filter((r) => r.groups.includes("heart-health"));

  if (profile.budget === "low") pool = pool.filter((r) => r.costPerServing <= 2.5);
  if (profile.allergy === "noted") {
    pool = pool.filter((r) => r.allergens.length === 0 || r.tags.includes("vegan"));
  }
  if (!pool.length) pool = recipes.filter((r) => r.tags.includes("budget"));
  return pool.slice(0, 3).map((r) => r.id);
}

function keywordAnswer(query: string, locale: Locale): { text: string; recipeIds: string[] } | null {
  const q = query.toLowerCase();
  const zh = locale === "zh-Hant";

  const rules: { re: RegExp; en: string; zh: string; ids: string[] }[] = [
    {
      re: /diabetes|blood sugar|血糖|糖尿病|胰島素|胰岛素/,
      en: "For blood sugar, keep meals steady: protein + fiber each time you eat, and go easy on sugary drinks. Beans, vegetables, oats, and baked proteins beat fried takeout. This isn’t medical advice—just practical food ideas.",
      zh: "血糖方面，重點是讓每一餐穩定：有蛋白質、有纖維，少碰含糖飲料。豆類、蔬菜、燕麥、烘烤蛋白質通常比油炸外食友善。這不能取代醫師建議，只是幫你找日常吃法。",
      ids: ["greek-salad-chickpea", "apple-cinnamon-porridge", "spinach-dal", "steamed-veg-tofu"],
    },
    {
      re: /blood pressure|hypertension|血壓|高血压|高血壓|dash/,
      en: "For blood pressure, cook with herbs and lemon instead of heavy salt, and lean on vegetables, beans, and potassium-rich foods. Tap a recipe below for low-sodium-friendly ideas.",
      zh: "血壓方面，多用香草與檸檬取代重鹹，並多吃蔬菜、豆類與含鉀食物。下面幾道都偏這個方向，可直接點開。",
      ids: ["dash-bean-salad", "miso-soup-tofu", "steamed-veg-tofu", "mushroom-barley-soup"],
    },
    {
      re: /cholesterol|膽固醇|胆固醇/,
      en: "For cholesterol-friendly eating, favor oats, beans, vegetables, and olive oil or nuts if safe for you. Bake more, deep-fry less.",
      zh: "想顧膽固醇，可多選燕麥、豆類、蔬菜，以及橄欖油等不飽和脂肪（若你不過敏）。少油炸、多烘烤。",
      ids: ["lentil-ginger-bowl", "oat-berry-breakfast", "spinach-dal", "dash-bean-salad"],
    },
    {
      re: /constipat|便秘/,
      en: "For constipation, gradually increase fiber with oats, beans, vegetables, and fruit, and drink water through the day.",
      zh: "便秘時可慢慢增加纖維：燕麥、豆類、蔬菜、水果，並全天補水。一次暴增纖維反而可能不適。",
      ids: ["apple-cinnamon-porridge", "dash-bean-salad", "mushroom-barley-soup"],
    },
    {
      re: /anemia|iron|貧血|贫血|缺鐵|缺铁/,
      en: "For iron-conscious eating, include eggs, legumes, leafy greens, and pair plant iron with vitamin C foods like tomato or citrus.",
      zh: "想多注意鐵質，可吃蛋、豆類、深綠色葉菜，植物性鐵搭配番茄或柑橘類維生素 C 更佳。",
      ids: ["veggie-egg-scramble", "spinach-dal", "tomato-egg-rice"],
    },
    {
      re: /bubble tea|boba|珍珠|奶茶|手搖/,
      en: "Bubble tea is usually dessert-level sugar. Keep it occasional—day to day, choose water or unsweetened tea.",
      zh: "珍珠奶茶通常糖分很高，比較像甜點。日常改喝水或不加糖茶會穩很多；想喝就選少糖小杯。",
      ids: ["apple-cinnamon-porridge", "miso-soup-tofu"],
    },
    {
      re: /weight|lose weight|diet|減肥|减重|瘦身|肥胖|體重|体重/,
      en: "For weight goals, build plates that fill you up: vegetables first, then protein, then a measured carb. Baking and steaming beat deep-frying. Here are practical starting recipes.",
      zh: "體重目標先求吃得飽：蔬菜打底、再加蛋白質、碳水控制份量。烘烤清蒸比油炸好。下面這些可以先試。",
      ids: ["turkey-lettuce-wraps", "tofu-veg-stirfry", "greek-salad-chickpea", "baked-chicken-veg"],
    },
    {
      re: /stress|anxiety|mood|sleep|情緒|压力|壓力|焦慮|焦虑|失眠|憂鬱|抑郁/,
      en: "When stress is high, steady meals help more than skipping food. Include protein, whole grains, and colorful plants—and keep caffeine and sugar from swinging too hard late day.",
      zh: "壓力大時，穩定吃飯往往比空腹硬撐好。每餐有蛋白質、全穀與蔬菜，晚上少讓咖啡因與甜食拉太大波動。",
      ids: ["salmon-greens", "oat-berry-breakfast", "yogurt-walnut-parfait", "banana-oat-pancakes"],
    },
    {
      re: /aging|elderly|senior|樂齡|乐龄|長者|长者|老人|骨質|骨质疏松/,
      en: "For healthy aging, protect protein at each meal, add colorful plants, and choose softer textures when appetite is low—congee, eggs, tofu, and fish are practical.",
      zh: "樂齡飲食重點是每餐有蛋白質、多一點蔬菜水果；食慾差時可選好入口的粥、蛋、豆腐、魚。",
      ids: ["congee-ginger-fish", "veggie-egg-scramble", "miso-soup-tofu", "steamed-veg-tofu"],
    },
    {
      re: /budget|cheap|affordable|平價|便宜|省錢|穷|窮|錢不多|钱不多|窮鬼|穷鬼/,
      en: "Budget plates that still nourish: lentils, eggs, oats, cabbage, tofu, and beans. Cook once, eat twice. Here are low-cost recipes you can open now.",
      zh: "平價又能吃得像樣：扁豆、雞蛋、燕麥、高麗菜、豆腐、豆類。一次多煮一點分兩餐。下面都偏省。",
      ids: ["lentil-ginger-bowl", "tomato-egg-rice", "spinach-dal", "chickpea-curry"],
    },
    {
      re: /halal|muslim|清真|穆斯林|回教/,
      en: "I can stick to halal-friendly tags—say if you also need dairy-free or nut-free. Meanwhile these recipes are marked halal-friendly in our library.",
      zh: "我可以依清真友善標籤幫你挑。若還有乳製品或堅果限制也可以跟我說。下面這些在站內有清真友善標籤。",
      ids: ["lentil-ginger-bowl", "chickpea-curry", "tomato-egg-rice", "spinach-dal"],
    },
    {
      re: /vegan|vegetarian|純素|素食|蛋奶素/,
      en: "Plant-forward picks with solid protein: lentils, chickpeas, tofu, and beans. Tell me if you need fully vegan (no eggs/dairy).",
      zh: "植物性又有蛋白質的選擇：扁豆、鷹嘴豆、豆腐、豆類。若要全純素（無蛋奶）跟我說一聲。",
      ids: ["lentil-ginger-bowl", "tofu-veg-stirfry", "chickpea-curry", "steamed-veg-tofu"],
    },
    {
      re: /breakfast|早餐|早上吃/,
      en: "Easy breakfasts with staying power: oats, eggs, yogurt with fruit, or banana oat pancakes—better than only pastry and coffee.",
      zh: "比較有續航的早餐：燕麥、蛋、優格配水果，或香蕉燕麥鬆餅——比只吃麵包配咖啡穩。",
      ids: ["oat-berry-breakfast", "veggie-egg-scramble", "apple-cinnamon-porridge", "banana-oat-pancakes"],
    },
    {
      re: /lunch|dinner|晚餐|午餐|今晚吃|中午/,
      en: "For lunch or dinner, build half vegetables, a palm of protein, and a measured carb. These recipes follow that pattern.",
      zh: "午晚餐可以照「半盤菜、一份掌心蛋白、一份適量主食」來配。這些食譜大致這個方向。",
      ids: ["baked-chicken-veg", "tofu-veg-stirfry", "shrimp-garlic-broccoli", "greek-salad-chickpea"],
    },
    {
      re: /fried chicken|炸雞|炸鸡|垃圾食物|junk/,
      en: "Fried chicken is an occasional treat. Day to day, bake chicken with vegetables or try turkey lettuce wraps for a lighter crunch.",
      zh: "炸雞當偶爾享受就好。平常可改烤雞配蔬菜，或火雞生菜包——一樣有咬感但負擔小。",
      ids: ["baked-chicken-veg", "turkey-lettuce-wraps", "tofu-veg-stirfry"],
    },
    {
      re: /protein|蛋白質|蛋白质|增肌|肌肉/,
      en: "Spread protein across the day—eggs, fish, tofu, beans, yogurt, or lean poultry. Pair with vegetables so the meal still feels complete.",
      zh: "蛋白質建議分散在一天：蛋、魚、豆腐、豆類、優格或瘦禽肉，再配蔬菜會更完整。",
      ids: ["salmon-greens", "veggie-egg-scramble", "turkey-lettuce-wraps", "tofu-veg-stirfry"],
    },
    {
      re: /what.*(eat|cook)|不知道吃|吃什麼|吃什么|recommend|建議食譜|推荐|幫我配|帮我配|今晚|menu/,
      en: "I can help pick meals—tell me your main goal (weight, blood pressure, blood sugar, energy), any allergies, and whether you need budget-friendly options.",
      zh: "我可以幫你配餐——先告訴我主要目標（體重、血壓、血糖、精神），有沒有過敏，以及要不要偏平價。",
      ids: [],
    },
  ];

  for (const rule of rules) {
    if (rule.re.test(q)) return { text: zh ? rule.zh : rule.en, recipeIds: rule.ids };
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
  const keyed = keywordAnswer(query, locale);

  const wantsFood =
    /eat|cook|meal|recipe|吃|餐|食譜|配|建議|recommend|what should|幫我|帮我/i.test(query) ||
    history.some((h) => h.role === "user");

  if (wantsFood && !profile.goal && !(keyed && keyed.recipeIds.length)) {
    return {
      text: zh
        ? "好，我先問清楚一點，之後才能給你準的食譜。你現在最想照顧的是哪一件：體重、血壓、血糖，還是單純想吃得健康一點？"
        : "Sure—quick check so I can recommend well. What’s your main focus right now: weight, blood pressure, blood sugar, or just eating healthier overall?",
      recipeIds: [],
    };
  }

  if (wantsFood && profile.goal && profile.allergy == null) {
    return {
      text: zh
        ? "了解。有沒有食物過敏或信仰飲食限制（例如清真、純素、乳製品）？沒有的話跟我說「沒有過敏」就好。"
        : "Got it. Any food allergies or faith-based limits (halal, vegan, dairy-free)? If none, just say “no allergies.”",
      recipeIds: [],
    };
  }

  if (wantsFood && profile.goal && profile.allergy != null && !profile.budget) {
    return {
      text: zh
        ? "最後一個：預算希望偏省，還是一般即可？回我「要平價」或「一般」就行，我馬上給你可以點開看的食譜。"
        : "Last one: budget-friendly or normal budget? Reply “budget” or “normal” and I’ll give you tap-ready recipes.",
      recipeIds: [],
    };
  }

  const ids =
    (keyed && keyed.recipeIds.length ? keyed.recipeIds : null) ||
    (profile.goal ? recommendIds(profile) : extractRecipeIds(chunks).slice(0, 3));

  const localized = ids
    .map((id) => recipes.find((r) => r.id === id))
    .filter(Boolean)
    .map((r) => localizeRecipe(r!, locale))
    .slice(0, 3);

  let text = keyed?.text || "";
  if (!text) {
    if (profile.goal === "bp") {
      text = zh
        ? "血壓友善的方向是少鹽、多鉀，多用香草與蔬菜。下面幾道都可以直接點開看步驟。"
        : "For blood pressure, think less salt, more potassium, herbs, and vegetables. Here are dishes you can open in one tap.";
    } else if (profile.goal === "diabetes") {
      text = zh
        ? "血糖友善通常靠「蛋白質＋纖維」、少含糖飲料。這些食譜偏這個方向，點一下就能看詳情。"
        : "Blood-sugar friendlier plates usually pair protein with fiber and skip sugary drinks. Tap any recipe below.";
    } else if (profile.goal === "weight") {
      text = zh
        ? "體重目標先求吃得飽又不太油：蔬菜體積、蛋白質、少油炸。這些可以先試。"
        : "For weight goals, prioritize filling plates—vegetables, protein, less deep-frying. Start with these.";
    } else {
      text = zh
        ? "根據你剛說的，我建議先從這些日常餐著手，點開就能看食材與做法。"
        : "Based on what you shared, start with these everyday meals—tap to see ingredients and steps.";
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
        temperature: 0.55,
        messages: [
          {
            role: "system",
            content: `You are NourishAI, a warm human nutrition coach.
Speak naturally. Answer the user's actual question.
If details are missing for a meal recommendation, ask 1 clarifying question at a time (goal → allergies → budget), then recommend 2–3 concrete recipes by Chinese or English name matching the UI language.
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