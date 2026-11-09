import type { Locale } from "./types";
import type { Recipe } from "@/lib/data/types";
import { getRecipeById } from "@/lib/data/recipes";
import { translateAmount, translateIngredientName } from "./ingredient-locale";
import { CATALOG_RECIPE_ZH } from "./catalog-recipe-locale";

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
  ...(CATALOG_RECIPE_ZH as unknown as Record<string, RecipeCopy>),
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
      "燕麥的可溶性纖維有助膽固醇與飽足。莓果植化素與認知健康相關。優格蛋白質有助樂齡肌肉維持。乳糖不耐可用豆漿／椰奶優格。",
    alternatives: ["乳糖不耐改用植物優格", "新鮮莓果貴時用冷凍", "預設無堅果，較適合學校便當"],
    steps: [
      "混合燕麥、優格、奇亞、肉桂與少許水或奶。",
      "拌入大部分莓果，冷藏隔夜（或至少 4 小時）。",
      "食用前再放剩餘莓果。控糖可省略甜味劑。",
    ],
  },
  "salmon-greens": {
    title: "香草檸檬烤鮭魚配綠蔬",
    summary: "富含優質脂肪酸的鮭魚搭配蒜香綠蔬——情緒與心臟的常備搭配。",
    cuisine: "地中海",
    regionAvailability: ["沿海市場", "全球冷凍區"],
    whyHealthy:
      "鮭魚的優質脂肪有助情緒、腦部老化與心律。烘烤比油炸更低鈉。搭配蔬菜補充鉀。預算有限可用沙丁魚，或以亞麻＋豆腐取得植物性優質脂肪。",
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
    title: "三豆柑橘沙拉（血壓友善）",
    summary: "免煮沙拉，為血壓目標設計——高鉀、方便外帶。",
    cuisine: "美式家常",
    regionAvailability: ["幾乎各地都有罐頭豆"],
    whyHealthy:
      "豆類、蔬果、不飽和脂肪、控制鈉——偏血壓管理方向。高鉀支持血管張力。非常適合忙碌週的備餐。",
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
      "核桃提供植物性優質脂肪。蛋白質＋脂肪組合穩定食慾。堅果過敏可改南瓜籽。",
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
  "tomato-egg-rice": {
    title: "番茄炒蛋蓋飯",
    summary: "粵式家常經典——快速、平價，配飯與蔬菜更均衡。",
    cuisine: "粵式家常",
    regionAvailability: ["香港、台灣、新加坡及多數亞洲市場"],
    whyHealthy: "雞蛋蛋白質搭配蔬菜與控制份量的飯，比油膩外食更穩妥。",
    alternatives: ["可加菠菜", "低碳水可用花椰菜米"],
    steps: ["蛋炒至嫩熟盛起。", "番茄煮出汁，略調味。", "倒回蛋略拌，淋飯上撒蔥花。"],
    ingredients: [
      { name: "雞蛋", amount: "3 顆" },
      { name: "番茄", amount: "2 顆" },
      { name: "白飯", amount: "2 碗" },
      { name: "青蔥", amount: "2 支" },
      { name: "油", amount: "1 湯匙" },
    ],
  },
  "congee-ginger-fish": {
    title: "薑絲魚片粥",
    summary: "溫和魚粥——適合消化力弱、樂齡或食慾不佳的日子。",
    cuisine: "中式",
    regionAvailability: ["街市與亞洲超市"],
    whyHealthy: "好入口、補水、瘦肉蛋白——食慾低時很實用。",
    alternatives: ["可改雞肉粥", "魚過敏改豆腐粥"],
    steps: ["米加水熬至綿稠。", "接近完成加薑片與薄魚片煮熟。", "撒蔥花；血壓需注意則少鹽。"],
  },
  "steamed-veg-tofu": {
    title: "清蒸豆腐青菜",
    summary: "清蒸豆腐配綠蔬——對血糖與心臟友善的高體積餐。",
    cuisine: "東亞",
    regionAvailability: ["豆腐與青菜容易取得"],
    whyHealthy: "高體積、熱量可控、植物蛋白，不需油炸。",
    alternatives: ["可改天貝", "低鈉可用椰子胺基"],
    steps: ["豆腐與青菜蒸至剛好。", "蒜蓉加少許醬油與油淋上。"],
  },
  "avocado-toast-egg": {
    title: "酪梨吐司配蛋",
    summary: "忙碌早晨的快速早餐——健康脂肪加蛋白質。",
    cuisine: "咖啡館經典",
    regionAvailability: ["多數城市"],
    whyHealthy: "纖維＋蛋白質＋不飽和脂肪，比甜麵包早餐更有飽足感。",
    alternatives: ["無麩質可用米餅", "純素可改鷹嘴豆泥"],
    steps: ["烤吐司，壓酪梨加檸檬。", "放上嫩蛋與胡椒。"],
  },
  "greek-salad-chickpea": {
    title: "鷹嘴豆希臘風沙拉",
    summary: "免煮午餐：鷹嘴豆、黃瓜、番茄——有助血糖穩定。",
    cuisine: "地中海",
    regionAvailability: ["全球乾貨"],
    whyHealthy: "纖維與植物蛋白有助緩和血糖波動，幾乎不用開火。",
    alternatives: ["可接受乳製品再加菲達起司", "可換白豆"],
    steps: ["切蔬菜，與鷹嘴豆、油、檸檬、奧勒岡、胡椒拌勻。"],
  },
  "banana-oat-pancakes": {
    title: "香蕉燕麥鬆餅",
    summary: "用燕麥與香蕉做的鬆餅——週末也能有纖維。",
    cuisine: "家常早餐",
    regionAvailability: ["燕麥與香蕉易得"],
    whyHealthy: "比餐廳鬆餅更多纖維與蛋白質；甜味主要來自香蕉。",
    alternatives: ["純素可用亞麻蛋", "配莓果代替糖漿"],
    steps: ["燕麥、香蕉、蛋、肉桂攪打。", "少油平底鍋煎成小片。"],
  },
  "turkey-lettuce-wraps": {
    title: "火雞生菜包",
    summary: "體重與血糖友善的清爽包——高蛋白、低油炸。",
    cuisine: "融合料理",
    regionAvailability: ["火雞肉糜或雞肉糜易得"],
    whyHealthy: "以生菜取代油炸餅皮，蛋白質清楚、負擔較低。",
    alternatives: ["素食可改豆腐碎", "生菜貴可用高麗菜葉"],
    steps: ["炒香洋蔥蒜與肉至熟。", "略調味，舀入生菜。"],
  },
  "spinach-dal": {
    title: "菠菜扁豆咖哩",
    summary: "一鍋扁豆配菠菜——平價、有鐵質與纖維。",
    cuisine: "南亞",
    regionAvailability: ["扁豆與菠菜全球易得"],
    whyHealthy: "植物蛋白與纖維，搭配高鉀綠葉，非常適合日常主食。",
    alternatives: ["配糙米", "加檸檬有助鐵吸收"],
    steps: ["炒香料與辛香料。", "加扁豆與水燉軟。", "拌入菠菜。"],
  },
  "grilled-veg-couscous": {
    title: "烤蔬菜库斯库斯碗",
    summary: "家庭晚餐的彩色碗——無麩質可改藜麥。",
    cuisine: "地中海",
    regionAvailability: ["多數城市有库斯库斯"],
    whyHealthy: "蔬菜為主、油脂可控——比奶油外食碗更好。",
    alternatives: ["無麩質改藜麥", "加鷹嘴豆補蛋白"],
    steps: ["烤或煎蔬菜。", "库斯库斯以檸檬與油拌鬆，鋪上蔬菜。"],
  },
  "apple-cinnamon-porridge": {
    title: "蘋果肉桂燕麥粥",
    summary: "溫熱燕麥配蘋果——顧血糖意識與舒適感的早餐。",
    cuisine: "全球早餐",
    regionAvailability: ["燕麥與蘋果易得"],
    whyHealthy: "燕麥與蘋果纖維，比含糖穀片更能穩定能量。",
    alternatives: ["不過敏可加花生醬", "可用莓果代替蘋果"],
    steps: ["燕麥、蘋果丁與肉桂煮至綿稠。"],
  },
  "shrimp-garlic-broccoli": {
    title: "蒜香蝦仁青花菜",
    summary: "快速平底鍋晚餐——瘦海鮮蛋白；甲殼過敏請避開。",
    cuisine: "家常快炒",
    regionAvailability: ["冷凍蝦全球常見"],
    whyHealthy: "高蛋白、大量蔬菜、烹煮快——比油炸海鮮好。",
    alternatives: ["海鮮過敏改雞柳", "可加辣椒"],
    steps: ["蒜爆香，下蝦與青花菜炒熟。", "多加胡椒，少鹽。"],
  },
  "mushroom-barley-soup": {
    title: "蘑菇大麥湯",
    summary: "涼爽夜晚的暖胃湯——高纖、平價，適合批次煮。",
    cuisine: "歐式家常",
    regionAvailability: ["大麥與蘑菇易得"],
    whyHealthy: "清湯為主，大麥可溶性纖維——有飽足感又不太油。",
    alternatives: ["無麩質可改糙米"],
    steps: ["炒蔬菜與蘑菇。", "加大麥與高湯燉軟。"],
  },
};

function translateCuisine(cuisine: string): string {
  const map: Record<string, string> = {
    "Home / HK everyday": "港式／家常",
    "Cantonese home cooking": "粵式家常",
    Chinese: "中式",
    "Middle Eastern–inspired": "中東靈感",
    Mediterranean: "地中海",
    "Global breakfast": "全球早餐",
    "Café classic": "咖啡館經典",
    "Home breakfast": "家常早餐",
    Fusion: "融合料理",
    "South Asian": "南亞",
    "European home": "歐式家常",
    "East Asian": "東亞",
    "American DASH": "美式血壓友善",
  };
  return map[cuisine] || cuisine.replace("Home / HK everyday", "港式／家常");
}

export function localizeRecipe(recipe: Recipe, locale: Locale): Recipe {
  if (locale === "en") return recipe;
  const copy = zhRecipes[recipe.id];
  const ingredients = recipe.ingredients.map((ing, i) => ({
    ...ing,
    name: copy?.ingredients?.[i]?.name ?? translateIngredientName(ing.name),
    amount: copy?.ingredients?.[i]?.amount ?? translateAmount(ing.amount),
  }));
  if (!copy) {
    return {
      ...recipe,
      cuisine: translateCuisine(recipe.cuisine),
      ingredients,
      steps: recipe.steps, // keep EN only if no locale entry; prefer adding zh entries
    };
  }
  return {
    ...recipe,
    title: copy.title,
    summary: copy.summary,
    cuisine: copy.cuisine || translateCuisine(recipe.cuisine),
    regionAvailability: copy.regionAvailability,
    whyHealthy: copy.whyHealthy,
    steps: copy.steps,
    alternatives: copy.alternatives ?? recipe.alternatives,
    ingredients,
  };
}

export function localizeRecipeById(id: string, locale: Locale) {
  const base = getRecipeById(id);
  if (!base) return undefined;
  return localizeRecipe(base, locale);
}