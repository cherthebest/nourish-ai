import type { KnowledgeDoc } from "./types";
import { recipes } from "./recipes";

const baseDocs: KnowledgeDoc[] = [
  {
    id: "kb-obesity",
    title: "Obesity and everyday eating",
    category: "conditions",
    tags: ["obesity", "weight", "calories", "satiety", "fiber"],
    content: `Obesity risk rises when calorie intake consistently exceeds energy use, but food quality matters. High-fiber meals (legumes, vegetables, oats) increase satiety so people feel full on fewer calories. Protein at each meal preserves muscle during weight loss. Ultra-processed snacks are easy to overeat. Practical steps: measure portions once to learn volume, plan weekly meals, keep affordable staples (beans, eggs, frozen veg) at home. Dishonesty with tracking and low resilience after setbacks are common — restart the next meal, not next Monday. Exercise helps but cannot outrun a constant surplus. This is education, not a diagnosis; clinicians guide medical treatment.`,
  },
  {
    id: "kb-bp",
    title: "Blood pressure and the DASH pattern",
    category: "conditions",
    tags: ["blood pressure", "sodium", "potassium", "DASH", "hypertension"],
    content: `High blood pressure responds to lower sodium, higher potassium, and overall DASH-style eating: vegetables, fruit, legumes, low-fat dairy if tolerated, nuts, and limited red/processed meat. Rinse canned beans. Flavor with herbs, citrus, garlic, vinegar instead of salt. Alcohol and excess body weight raise BP. Medications may still be essential — food supports but does not replace prescribed drugs. Sudden extreme low-sodium diets without medical advice can be unsafe for some people.`,
  },
  {
    id: "kb-aging",
    title: "Nutrition for healthy aging",
    category: "conditions",
    tags: ["aging", "protein", "muscle", "bone", "appetite"],
    content: `Aging adults often need more protein per kilogram than younger adults to slow sarcopenia — roughly emphasizing protein at breakfast and lunch helps. Calcium, vitamin D (sunlight/food/supplements as advised), fiber for constipation, and hydration matter. Smaller appetites mean nutrient-dense choices: eggs, dairy or fortified alternatives, fish, legumes, colorful plants. Soft textures and soups help when chewing is hard. Loneliness and low appetite are real barriers — simple shared meals and batch cooking improve adherence.`,
  },
  {
    id: "kb-mental",
    title: "Mental health and eating patterns",
    category: "conditions",
    tags: ["mental health", "mood", "omega-3", "blood sugar", "habits"],
    content: `Diet is not a cure for depression or anxiety, but regular meals, omega-3 rich foods (fatty fish, walnuts, flax), whole grains, and limiting ultra-processed patterns associate with better mood outcomes in research. Skipping meals causes blood-sugar swings that worsen irritability. Cooking can be hard when motivation is low — keep 3 emergency meals (oats, eggs, frozen stir-fry). Seek professional mental health care; food is complementary.`,
  },
  {
    id: "kb-analyze",
    title: "How to judge if a food is healthy",
    category: "analysis",
    tags: ["food analysis", "nutrients", "labels", "portions"],
    content: `A food is "healthier" relative to goals, not absolutely. Check: energy density (calories per volume), protein, fiber, added sugar, saturated fat, sodium, and micronutrients. A nutritious food can still be wrong for someone with an allergy. Volume matters — a large salad with oil can exceed a small rice bowl in calories. Proportion on the plate: half vegetables, quarter protein, quarter carbs is a useful default. Ultra-processed products often hide sodium and sugar. Fresh is not always healthier than frozen vegetables.`,
  },
  {
    id: "kb-nutrients",
    title: "Core nutrient roles",
    category: "analysis",
    tags: ["protein", "carbs", "fat", "fiber", "vitamins", "minerals"],
    content: `Protein builds and repairs tissue. Carbohydrates fuel the brain; prefer whole grains and legumes. Fats carry vitamins and support hormones — favor olive oil, nuts, seeds, fish over frequent deep-fried foods. Fiber feeds gut microbes and steadies glucose. Potassium (bananas, beans, greens) supports blood pressure. Iron from meat or plant sources with vitamin C helps energy. Excess of any nutrient including "healthy" oils can cause weight gain.`,
  },
  {
    id: "kb-mealplan",
    title: "Planning meals for a day week or month",
    category: "planning",
    tags: ["meal plan", "week", "month", "batch cook", "time"],
    content: `Day plan: breakfast with protein+fiber, lunch with vegetables+legumes or fish, dinner similar but lighter if evenings are sedentary, fruit or yogurt snacks. Week plan: pick 3 dinners to batch, 2 flexible nights, leftover lunches. Month: rotate staple proteins (beans, eggs, chicken/tofu, fish) and seasonal produce to control cost and boredom. Time scarcity is the top failure mode — freeze portions. Lack of resilience after "cheat" days is normal; resume planned meals without punishment.`,
  },
  {
    id: "kb-geo",
    title: "Geography availability and agriculture",
    category: "context",
    tags: ["geography", "seasonal", "local", "availability", "environment"],
    content: `What you can cook depends on climate, markets, and supply chains. Coastal areas access fish more easily; inland regions lean on legumes, dairy, poultry. Seasonal produce is cheaper and often fresher. Frozen and canned foods reduce waste and geographic limits. Environmental factors (drought, import costs) raise prices — keep flexible recipe templates (stir-fry, soup, salad) that swap ingredients. Urban food deserts need pantry strategies: rice, beans, eggs, peanut butter (if no allergy), fortified cereals.`,
  },
  {
    id: "kb-afford",
    title: "Affordable healthy eating",
    category: "context",
    tags: ["budget", "cost", "cheap", "economics", "affordable"],
    content: `Healthy food is not always expensive. Cost leaders: dried beans/lentils, eggs, oats, seasonal vegetables, cabbage, carrots, frozen veg, bananas, canned tomatoes, tofu where cheap. Cost per nutrient beats cost per calorie marketing. Buy store brands. Cook once, eat twice. Avoid assuming organic is required. "Cheap skate" strategies that only buy junk food trade short-term savings for long-term health costs. Compare cost per serving in NourishAI recipes.`,
  },
  {
    id: "kb-alternatives",
    title: "Healthy alternatives and avoiding harmful self-medication",
    category: "guidance",
    tags: ["alternatives", "drugs", "supplements", "swaps"],
    content: `Food patterns can support blood pressure, mood, and weight alongside — never instead of — prescribed medication unless a clinician changes the plan. Dangerous self-medication and unregulated "fat burner" drugs can harm the liver and heart. Food swaps: soda → sparkling water + citrus; fried takeout → sheet-pan roast; candy → fruit + yogurt; salty chips → roasted chickpeas. Supplements fill gaps; they do not replace meals.`,
  },
  {
    id: "kb-culture",
    title: "Religion culture allergies and beliefs",
    category: "constraints",
    tags: ["halal", "kosher", "vegan", "allergy", "culture", "religion"],
    content: `Muslims avoid pork and need halal meat; many avoid alcohol in cooking. Jewish kosher rules separate meat/dairy and restrict certain animals. Hindus may avoid beef. Vegans exclude animal products — they can gain weight with nuts, oils, grains, avocados, and soy; the belief that "only vegetables" means no weight gain is false. Allergies (peanut, shellfish, dairy) override nutritional density — never push a "superfood" that risks anaphylaxis. Always ask about constraints before suggesting recipes.`,
  },
  {
    id: "kb-bmi",
    title: "BMI body analysis and limits",
    category: "tools",
    tags: ["BMI", "body", "weight", "height", "limitations"],
    content: `BMI = weight(kg) / height(m)^2. Under 18.5 underweight; 18.5–24.9 typical range; 25–29.9 overweight; 30+ obesity classes. BMI ignores muscle mass, bone, ethnicity nuances, and fat distribution. Athletes may score high with low risk. Waist circumference and clinical labs add context. Use BMI as a screening signal, not a moral judgment or sole prescription.`,
  },
  {
    id: "kb-exercise",
    title: "Suitable activity based on body profile",
    category: "tools",
    tags: ["exercise", "activity", "age", "weight", "medical"],
    content: `Minor guidance only: sedentary adults often start with walking 10–20 minutes. Joint pain or high BMI: swimming, cycling, chair strength. Aging: balance + resistance 2x/week. Blood pressure: avoid sudden maximal heavy lifts until cleared. Mental health: outdoor walks help many people. Medical records and symptoms require clinician clearance before intense programs. Nutrition and movement work together.`,
  },
  {
    id: "kb-honesty",
    title: "Why suggestions can fail",
    category: "limits",
    tags: ["limits", "inaccurate", "language", "adherence", "appetite"],
    content: `Unavoidable limits: users may not follow plans; appetite and stress override knowledge; suggestions can be inaccurate for rare conditions; bilingual gaps cause misunderstanding; economic and time barriers persist; agriculture and environment constrain supply. NourishAI uses retrieved nutrition knowledge and recipes but is not a doctor. Verify with qualified professionals for medical decisions.`,
  },
  {
    id: "kb-portions",
    title: "Volume and proportion of food",
    category: "analysis",
    tags: ["volume", "portion", "proportion", "plate"],
    content: `Volume eating uses high-water, high-fiber foods (soups, salads, vegetables) to feel full. Proportion: visualize a plate — half non-starchy vegetables, one quarter protein, one quarter whole grains or starchy veg, plus optional fruit/dairy. Restaurant portions are often 2+ servings. Measuring cups for a week calibrates eyes. For weight gain (including many vegans), increase energy-dense proportions: nuts, oils, tahini, dried fruit, grains.`,
  },
];

const recipeDocs: KnowledgeDoc[] = recipes.map((r) => ({
  id: `recipe-${r.id}`,
  title: `Recipe: ${r.title}`,
  category: "recipe",
  tags: [...r.groups, ...r.tags, r.cuisine, ...r.allergens],
  content: `${r.title}. ${r.summary} Cuisine: ${r.cuisine}. Servings ${r.servings}. Prep ${r.prepMinutes} min, cook ${r.cookMinutes} min. Cost about $${r.costPerServing.toFixed(2)} per serving. Groups: ${r.groups.join(", ")}. Tags: ${r.tags.join(", ")}. Allergens: ${r.allergens.length ? r.allergens.join(", ") : "none listed"}. Ingredients: ${r.ingredients.map((i) => `${i.amount} ${i.name}`).join("; ")}. Nutrients per serving: ${r.nutrients.calories} kcal, protein ${r.nutrients.protein}g, carbs ${r.nutrients.carbs}g, fat ${r.nutrients.fat}g, fiber ${r.nutrients.fiber}g, sodium ${r.nutrients.sodium}mg, sugar ${r.nutrients.sugar}g. Why healthy: ${r.whyHealthy} Alternatives: ${(r.alternatives || []).join("; ")}. Steps: ${r.steps.join(" ")} Region: ${r.regionAvailability.join(", ")}.`,
}));

export const knowledgeBase: KnowledgeDoc[] = [...baseDocs, ...recipeDocs];