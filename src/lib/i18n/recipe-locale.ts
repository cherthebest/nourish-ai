import type { Locale } from "./types";
import type { Recipe } from "@/lib/data/types";
import { getRecipeById } from "@/lib/data/recipes";

type RecipeCopy = {
  title: string;
  summary: string;
  whyHealthy: string;
  steps: string[];
  alternatives?: string[];
  cuisine: string;
  regionAvailability: string[];
  ingredients?: { name: string; amount: string }[];
};

const zhRecipes: Record<string, RecipeCopy> = {
  "lentil-ginger-bowl": {
    title: "薑黃扁豆能量碗",
    summary: "溫熱紅扁豆搭配薑黃、菠菜與檸檬——飽足、平價，也較溫和於血壓管理。",
    cuisine: "中東靈感",
    regionAvailability: ["全球乾貨", "城市市場", "鄉村主食"],
    whyHealthy:
      "扁豆提供植物蛋白與可溶性纖維，有助飽足與膽固醇管理。低鈉加上菠菜的鉀，支持血壓目標。極為平價，預設即為清真／純素。",
    alternatives: ["沒有菠菜可換成羽衣甘藍", "買不到紅扁豆可用褐扁豆並延長烹煮", "運動者可加糙米補碳水"],
    steps: [
      "沖洗扁豆。以橄欖油炒香洋蔥、蒜與薑。",
      "加入薑黃、孜然、扁豆與 4 杯水，燉煮 18–20 分鐘。",
      "拌入菠菜至萎軟，以檸檬汁與黑胡椒收尾。",
      "分裝入碗。可加黃瓜或番茄增加口感。",
    ],
  },
  "oat-berry-breakfast": {
    title: "隔夜燕麥莓果杯",
    summary: "免煮早餐：燕麥、優格、莓果與奇亞籽——為情緒與專注提供穩定能量。",
    cuisine: "全球早餐",
    regionAvailability: ["超市", "多數城市"],
    whyHealthy:
      "燕麥的 β-葡聚醣有助膽固醇與飽足。莓果多酚與認知健康相關。優格蛋白質有助樂齡肌肉維持。乳糖不耐可用豆漿／椰奶優格。",
    alternatives: ["乳糖不耐改用植物優格", "新鮮莓果貴時用冷凍", "預設無堅果，較適合學校便當"],
    steps: [
      "混合燕麥、優格、奇亞、肉桂與少許水或奶。",
      "拌入大部分莓果，冷藏隔夜（或至少 4 小時）。",
      "食用前再放剩餘莓果。控糖可省略甜味劑。",
    ],
  },
  "salmon-greens": {
    title: "香草檸檬烤鮭魚配綠蔬",
    summary: "富含 Omega-3 的鮭魚搭配蒜香綠蔬——情緒與心臟的常備搭配。",
    cuisine: "地中海",
    regionAvailability: ["沿海市場", "全球冷凍區"],
    whyHealthy:
      "EPA/DHA Omega-3 支持情緒、腦部老化與心律。烘烤比油炸更低鈉。搭配蔬菜補充鉀。預算有限可用沙丁魚，或以亞麻＋豆腐取得植物 Omega-3。",
    alternatives: ["罐頭鮭魚或沙丁魚大幅降成本", "買不到鮭魚可用鱒魚或鯖魚", "魚過敏：核桃＋亞麻豆腐炒"],
    steps: [
      "烤箱預熱 200°C。鮭魚放在烘焙紙上。",
      "刷橄欖油、蒜、檸檬皮、胡椒與香草，烤 12–15 分鐘。",
      "蒸或快炒綠蔬，擠檸檬汁一起上桌。",
    ],
  },
  "chickpea-curry": {
    title: "番茄鷹嘴豆週間咖哩",
    summary: "用乾貨就能做、可吃一整週——高纖、純素又省錢。",
    cuisine: "南亞靈感",
    regionAvailability: ["全球罐頭乾貨", "乾鷹嘴豆"],
    whyHealthy:
      "鷹嘴豆提供抗性澱粉與植物蛋白，搭配高纖米飯有助緩和血糖波動。批次料理可在沒時間、沒動力時撐住。沖洗罐頭豆可減少約 40% 鈉。",
    alternatives: ["隔夜泡乾豆更省", "低碳水可用花椰菜米", "可接受乳製品再加帕尼爾"],
    steps: [
      "炒香洋蔥、蒜、薑，再爆香香料約 30 秒。",
      "加入番茄與鷹嘴豆，燉 20 分鐘至濃稠。",
      "拌入菠菜，配糙米或全麥餅食用。",
    ],
  },
  "dash-bean-salad": {
    title: "DASH 三豆柑橘沙拉",
    summary: "免煮沙拉，為血壓目標設計——高鉀、方便外帶。",
    cuisine: "美式 DASH",
    regionAvailability: ["幾乎各地都有罐頭豆"],
    whyHealthy:
      "符合 DASH：豆類、蔬果、不飽和脂肪、控制鈉。高鉀支持血管張力。非常適合忙碌週的備餐。",
    alternatives: ["其中一種豆可改冷凍毛豆", "萊姆＋香菜做成墨西哥風味"],
    steps: [
      "徹底沖洗豆子以降低鈉。",
      "切芹菜、洋蔥、香菜，與豆子、柑橘汁、油、胡椒拌勻。",
      "冷藏 20 分鐘。先試味道再決定要不要加鹽——常常完全不需要。",
    ],
  },
  "tofu-veg-stirfry": {
    title: "香煎豆腐時蔬快炒",
    summary: "可依在地蔬菜調整的快炒——不必依賴保健品也能獲得植物蛋白。",
    cuisine: "東亞靈感",
    regionAvailability: ["城市易買豆腐；可用天貝或豆類替換"],
    whyHealthy:
      "豆腐提供完整植物蛋白，有助樂齡肌力與飽足。大量蔬菜增加體積卻不暴增熱量。需更低鈉或無大豆可用椰子胺基。",
    alternatives: ["大豆過敏改天貝或鷹嘴豆", "葉菜季節不對可用花椰菜", "迷思澄清：純素也能靠堅果、油、穀物增重——不是只吃葉子"],
    steps: [
      "壓乾豆腐切塊，裹少許太白粉，煎至金黃。",
      "大火快炒蔬菜，接近完成再加蒜。",
      "回鍋豆腐，淋低鈉醬油與少許芝麻油，配飯。",
    ],
  },
  "yogurt-walnut-parfait": {
    title: "核桃優格腦力杯",
    summary: "點心或早餐：核桃、優格與香蕉，提供支持情緒的脂肪。",
    cuisine: "地中海點心",
    regionAvailability: ["取得容易"],
    whyHealthy:
      "核桃提供 ALA Omega-3。蛋白質＋脂肪組合穩定食慾。堅果過敏可改南瓜籽。",
    alternatives: ["堅果過敏用南瓜籽", "無乳製品用大豆優格"],
    steps: ["優格、香蕉片與切碎核桃分層。", "灑肉桂。慢慢吃——核桃熱量密度本來就高。"],
  },
  "veggie-egg-scramble": {
    title: "蔬菜炒蛋盤",
    summary: "高蛋白早餐，照顧樂齡肌力與忙碌早晨。",
    cuisine: "全球早餐",
    regionAvailability: ["雞蛋容易取得"],
    whyHealthy:
      "雞蛋提供富含白胺酸的蛋白質。蔬菜增加體積。雞蛋過敏可用鷹嘴豆粉煎餅（印度 Besan）。",
    alternatives: ["純素改豆腐炒", "醫師建議時可用蛋清"],
    steps: [
      "先炒洋蔥與番茄，再加菠菜至萎軟。",
      "打蛋倒入，以中小火溫和炒散。",
      "多加胡椒；若血壓需注意則少鹽。",
    ],
  },
  "sweet-potato-black-bean": {
    title: "烤地瓜黑豆碗",
    summary: "色彩豐富的烤盤碗——高纖，適合體重與血糖目標。",
    cuisine: "拉丁靈感",
    regionAvailability: ["根莖與豆類全球易得"],
    whyHealthy:
      "抗性澱粉與纖維延緩葡萄糖吸收。酪梨提供心臟友善單元不飽和脂肪。酪梨太貴可改一匙橄欖油。",
    alternatives: ["地瓜可換南瓜", "黑豆可換花豆"],
    steps: [
      "地瓜切塊，拌油與香料，200°C 烤 30–35 分鐘。",
      "溫熱黑豆與玉米，加上酪梨與萊姆組碗。",
    ],
  },
  "miso-soup-tofu": {
    title: "溫和味噌豆腐湯",
    summary: "清爽補水湯品，適合食慾恢復與正念晚間進食。",
    cuisine: "日式",
    regionAvailability: ["亞洲超市；味噌醬可久放"],
    whyHealthy:
      "低熱量高體積支持正念份量。發酵味噌提味，讓一天其他餐可少放鹽。注意：鈉中等——若血壓偏高，請與低鈉餐平衡。",
    alternatives: ["沒有味噌可用清湯＋白豆"],
    steps: [
      "溫熱水——加入味噌後不要劇烈沸騰。",
      "離火溶解味噌，加入豆腐與青菜，撒蔥花。",
    ],
  },
  "quinoa-veg-pilaf": {
    title: "香草藜麥蔬菜飯",
    summary: "完整植物蛋白主食或配菜——信仰或倫理限制肉類時很有用。",
    cuisine: "安地斯／地中海融合",
    regionAvailability: ["多數城市有藜麥；更省可用碎麥"],
    whyHealthy:
      "藜麥是完整蛋白——素食／純素者若搭配堅果與油脂，有助維持或增加體重。鈉極低。",
    alternatives: ["預算考量改碎麥或糙米", "加鷹嘴豆提高蛋白質"],
    steps: ["沖洗藜麥，以 2 杯水煮約 15 分鐘。", "炒蔬菜，將藜麥與香草、檸檬、油拌鬆。"],
  },
  "baked-chicken-veg": {
    title: "檸檬烤雞與根菜烤盤",
    summary: "家庭友善的一盤蛋白質——內建份量感，支援體重目標。",
    cuisine: "家常料理",
    regionAvailability: ["禽肉易得；素食可改豆腐"],
    whyHealthy:
      "均衡餐盤：蛋白質、複合碳水、蔬菜。烘烤避免油炸外食。胸肉更瘦；腿肉更省且更飽。",
    alternatives: [
      "可換火雞或老豆腐",
      "穆斯林／猶太：確認清真／潔食認證禽肉",
      "本食譜避開常見宗教限制的豬肉／牛肉變體",
    ],
    steps: [
      "根菜拌油與香料舖在烤盤。",
      "放上雞肉，200°C 烤 35–40 分鐘至熟。",
      "靜置 5 分鐘，擠檸檬汁。",
    ],
  },
};

export function localizeRecipe(recipe: Recipe, locale: Locale): Recipe {
  if (locale === "en") return recipe;
  const copy = zhRecipes[recipe.id];
  if (!copy) return recipe;
  return {
    ...recipe,
    title: copy.title,
    summary: copy.summary,
    cuisine: copy.cuisine,
    regionAvailability: copy.regionAvailability,
    whyHealthy: copy.whyHealthy,
    steps: copy.steps,
    alternatives: copy.alternatives ?? recipe.alternatives,
    ingredients: recipe.ingredients.map((ing, i) => ({
      ...ing,
      name: copy.ingredients?.[i]?.name ?? ing.name,
      amount: copy.ingredients?.[i]?.amount ?? ing.amount,
    })),
  };
}

export function localizeRecipeById(id: string, locale: Locale) {
  const base = getRecipeById(id);
  if (!base) return undefined;
  return localizeRecipe(base, locale);
}