import { recipes } from "./data/recipes";
import { findFood } from "./data/foods";
import type { NutrientProfile, Recipe } from "./data/types";
import type { Locale } from "./i18n/types";
import { localizeRecipe } from "./i18n/recipe-locale";
import { dictionaries } from "./i18n/dictionaries";

const ALLERGEN_ZH: Record<string, string> = {
  peanuts: "花生",
  "tree-nuts": "樹堅果",
  dairy: "乳製品",
  eggs: "雞蛋",
  shellfish: "甲殼類海鮮",
  fish: "魚",
  soy: "大豆",
  wheat: "小麥",
  sesame: "芝麻",
};

export interface FoodAnalysis {
  query: string;
  matched: Recipe | null;
  verdict: "strong choice" | "situational" | "limit often" | "unknown";
  summary: string;
  nutrients: NutrientProfile | null;
  pros: string[];
  cons: string[];
  alternatives: { title: string; id: string; reason: string }[];
  portionNote: string;
  affordability: string | null;
}

export function analyzeFood(raw: string, locale: Locale = "en"): FoodAnalysis {
  const zh = locale === "zh-Hant";
  const query = raw.trim();
  if (!query) {
    return {
      query,
      matched: null,
      verdict: "unknown",
      summary: zh ? "請輸入食物或食譜名稱。" : "Enter a food or recipe name to analyze.",
      nutrients: null,
      pros: [],
      cons: [],
      alternatives: [],
      portionNote: "",
      affordability: null,
    };
  }

  const food = findFood(query);
  if (food) {
    const alts = (food.suggestRecipeIds || [])
      .map((id) => recipes.find((r) => r.id === id))
      .filter(Boolean)
      .slice(0, 3)
      .map((r) => {
        const loc = localizeRecipe(r!, locale);
        return {
          title: loc.title,
          id: loc.id,
          reason: zh ? "更穩妥的日常替代／搭配" : "A steadier everyday option",
        };
      });

    return {
      query,
      matched: null,
      verdict: food.verdict,
      summary: zh ? food.summaryZh : food.summaryEn,
      nutrients: food.nutrients || null,
      pros: zh ? food.prosZh : food.prosEn,
      cons: zh ? food.consZh : food.consEn,
      alternatives: alts,
      portionNote: zh ? food.portionZh : food.portionEn,
      affordability: null,
    };
  }

  const q = query.toLowerCase();
  const matched =
    recipes.find((r) => {
      const loc = localizeRecipe(r, locale);
      const titles = [r.title, loc.title].map((t) => t.toLowerCase());
      return titles.some((t) => t.includes(q) || q.includes(t));
    }) ||
    recipes.find((r) => {
      const loc = localizeRecipe(r, locale);
      return [...r.ingredients, ...loc.ingredients].some(
        (i) => q.includes(i.name.toLowerCase()) || i.name.toLowerCase().includes(q),
      );
    }) ||
    null;

  if (matched) {
    const loc = localizeRecipe(matched, locale);
    const n = matched.nutrients;
    const pros = [
      loc.whyHealthy.split(/[。.]/)[0] + (zh ? "。" : "."),
      zh
        ? `每份約含蛋白質 ${n.protein}g、纖維 ${n.fiber}g。`
        : `Provides ${n.protein}g protein and ${n.fiber}g fiber per serving.`,
    ];
    const cons: string[] = [];
    if (n.sodium > 500)
      cons.push(zh ? "鈉偏高——請與低鈉餐平衡。" : "Sodium is relatively high — balance with lower-sodium meals.");
    if (n.sugar > 15)
      cons.push(zh ? "糖分中高——注意額外加糖。" : "Sugar is moderate-high — watch add-ons.");
    if (matched.allergens.length)
      cons.push(
        zh
          ? `含過敏原：${matched.allergens.map((a) => ALLERGEN_ZH[a] || a).join("、")}。`
          : `Contains allergens: ${matched.allergens.join(", ")}.`,
      );
    if (!cons.length)
      cons.push(
        zh
          ? "仍要看整天總熱量與個人健康狀況。"
          : "Still depends on total daily calories and your medical context.",
      );

    const alternatives = (matched.alternatives || []).slice(0, 2).map((reason, i) => {
      const alt = recipes[(recipes.indexOf(matched) + i + 1) % recipes.length];
      const altLoc = localizeRecipe(alt, locale);
      return { title: altLoc.title, id: alt.id, reason: zh ? "可參考的替換方向" : reason };
    });

    const groupLabels = matched.groups.map(
      (g) => dictionaries[locale].groups[g]?.label ?? g.replace(/-/g, " "),
    );

    return {
      query,
      matched: loc,
      verdict:
        n.fiber >= 8 || (n.protein >= 15 && n.sodium < 400)
          ? "strong choice"
          : n.sodium > 600 || n.sugar > 20
            ? "limit often"
            : "situational",
      summary: zh
        ? `${loc.title}較適合：${groupLabels.join("、")}相關目標。`
        : `${loc.title} fits goals around ${groupLabels.join(", ")}.`,
      nutrients: n,
      pros,
      cons,
      alternatives,
      portionNote: zh
        ? `份量提示：以 2000 大卡參考日估算，約佔 ${Math.round((n.calories / 2000) * 100)}%。若偏重蛋白質／碳水，請多配蔬菜。`
        : `Plate tip: ~${Math.round((n.calories / 2000) * 100)}% of a 2000 kcal reference day. Pair with vegetables if needed.`,
      affordability: zh
        ? `約每份成本（以美元為基準）${matched.costPerServing.toFixed(2)}；頁面會依你選的貨幣顯示。`
        : `About $${matched.costPerServing.toFixed(2)} per serving (USD base; shown in your selected currency).`,
    };
  }

  return {
    query,
    matched: null,
    verdict: "unknown",
    summary: zh
      ? `目前資料庫還沒有「${query}」的專屬條目。你可以換更常見名稱（例如：蘋果、雞蛋、白飯、炸雞、珍珠奶茶），或直接問對話助手。`
      : `We don’t have a direct entry for “${query}” yet. Try a common name (apple, egg, rice, fried chicken, bubble tea) or ask the chat.`,
    nutrients: null,
    pros: [
      zh ? "試著用更簡單的食物名稱再查一次。" : "Try a simpler food name.",
      zh ? "也可以打開對話，用白話描述你想吃的東西。" : "Or describe it in chat in plain language.",
    ],
    cons: [
      zh ? "沒有標籤時，鈉、油、糖都不確定。" : "Without a label, sodium, oil, and sugar are unknown.",
    ],
    alternatives: recipes.slice(0, 3).map((r) => {
      const loc = localizeRecipe(r, locale);
      return {
        title: loc.title,
        id: r.id,
        reason: zh ? "站內有完整營養資料的食譜" : "Recipe with a full nutrient profile",
      };
    }),
    portionNote: zh
      ? "盤面原則：一半非澱粉蔬菜、四分之一蛋白質、四分之一主食。"
      : "Plate guide: half non-starchy vegetables, a quarter protein, a quarter carbs.",
    affordability: null,
  };
}