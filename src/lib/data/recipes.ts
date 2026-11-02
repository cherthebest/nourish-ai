import type { Recipe } from "./types";

export const CONSUMER_GROUPS = [
  {
    id: "weight-management" as const,
    label: "Weight management",
    blurb: "Lower-calorie, high-satiety meals that support steady weight goals.",
  },
  {
    id: "blood-pressure" as const,
    label: "Blood pressure",
    blurb: "DASH-inspired plates with less sodium and more potassium.",
  },
  {
    id: "aging" as const,
    label: "Healthy aging",
    blurb: "Protein, fiber, and bone-supporting nutrients for older adults.",
  },
  {
    id: "mental-health" as const,
    label: "Mood & mind",
    blurb: "Omega-3s, whole grains, and steady energy for mental wellbeing.",
  },
  {
    id: "diabetes-friendly" as const,
    label: "Blood sugar",
    blurb: "Balanced carbs, fiber, and protein to steady glucose response.",
  },
  {
    id: "heart-health" as const,
    label: "Heart health",
    blurb: "Unsaturated fats, legumes, and colorful plants for the heart.",
  },
  {
    id: "general" as const,
    label: "Everyday healthy",
    blurb: "Flexible family meals that simply feel nourishing.",
  },
];

export const recipes: Recipe[] = [
  {
    id: "lentil-ginger-bowl",
    title: "Ginger lentil power bowl",
    summary:
      "Warm red lentils with turmeric, spinach, and lemon — filling, affordable, and gentle on blood pressure.",
    servings: 4,
    prepMinutes: 15,
    cookMinutes: 25,
    difficulty: "easy",
    costPerServing: 1.85,
    groups: ["weight-management", "blood-pressure", "heart-health", "general"],
    tags: ["vegan", "halal", "kosher", "high-fiber", "high-protein", "budget", "dairy-free", "gluten-free"],
    allergens: [],
    cuisine: "Middle Eastern–inspired",
    regionAvailability: ["global pantry", "urban markets", "rural staples"],
    ingredients: [
      { name: "red lentils", amount: "1.5 cups", cost: 1.2 },
      { name: "fresh spinach", amount: "4 cups", cost: 1.5 },
      { name: "onion", amount: "1 medium", cost: 0.4 },
      { name: "garlic", amount: "3 cloves", cost: 0.2 },
      { name: "fresh ginger", amount: "1 tbsp grated", cost: 0.3 },
      { name: "turmeric", amount: "1 tsp", cost: 0.1 },
      { name: "lemon", amount: "1", cost: 0.5 },
      { name: "olive oil", amount: "1 tbsp", cost: 0.3 },
      { name: "cumin", amount: "1 tsp", cost: 0.1 },
    ],
    steps: [
      "Rinse lentils. Sauté onion, garlic, and ginger in olive oil until soft.",
      "Add turmeric, cumin, lentils, and 4 cups water. Simmer 18–20 minutes.",
      "Stir in spinach until wilted. Finish with lemon juice and black pepper.",
      "Portion into bowls. Optional: top with cucumber or tomato for crunch.",
    ],
    nutrients: {
      calories: 320,
      protein: 18,
      carbs: 48,
      fat: 6,
      fiber: 14,
      sodium: 95,
      sugar: 4,
      potassium: 780,
    },
    whyHealthy:
      "Lentils deliver plant protein and soluble fiber that support satiety and cholesterol. Low sodium plus potassium from spinach supports blood-pressure goals. Extremely budget-friendly and halal/vegan by default.",
    alternatives: [
      "Swap spinach for kale if unavailable",
      "Use brown lentils and cook longer if red lentils are scarce",
      "Add brown rice for athletes needing more carbs",
    ],
    imageGradient: "from-emerald-700 via-lime-600 to-amber-200",
  },
  {
    id: "oat-berry-breakfast",
    title: "Overnight oat & berry jar",
    summary:
      "No-cook breakfast with oats, yogurt, berries, and chia — steady energy for mood and focus.",
    servings: 2,
    prepMinutes: 10,
    cookMinutes: 0,
    difficulty: "easy",
    costPerServing: 2.1,
    groups: ["mental-health", "weight-management", "aging", "diabetes-friendly"],
    tags: ["vegetarian", "halal", "high-fiber", "quick", "budget"],
    allergens: ["dairy"],
    cuisine: "Global breakfast",
    regionAvailability: ["supermarkets", "most cities"],
    ingredients: [
      { name: "rolled oats", amount: "1 cup", cost: 0.5 },
      { name: "plain yogurt", amount: "1 cup", cost: 1.2 },
      { name: "mixed berries", amount: "1 cup", cost: 1.8 },
      { name: "chia seeds", amount: "2 tbsp", cost: 0.5 },
      { name: "cinnamon", amount: "1/2 tsp", cost: 0.05 },
      { name: "honey or maple", amount: "1 tsp optional", cost: 0.15 },
    ],
    steps: [
      "Mix oats, yogurt, chia, cinnamon, and a splash of water or milk.",
      "Fold in most berries. Refrigerate overnight (or at least 4 hours).",
      "Top with remaining berries before eating. Skip sweetener if managing sugar.",
    ],
    nutrients: {
      calories: 310,
      protein: 14,
      carbs: 46,
      fat: 8,
      fiber: 9,
      sodium: 70,
      sugar: 12,
      potassium: 420,
    },
    whyHealthy:
      "Beta-glucan fiber from oats supports cholesterol and satiety. Berries add polyphenols linked with cognitive health. Protein from yogurt helps preserve muscle with age. Dairy-free: use soy or coconut yogurt.",
    alternatives: [
      "Dairy-free yogurt for lactose intolerance",
      "Frozen berries when fresh are expensive",
      "Nut-free by default — safe for many school lunches",
    ],
    imageGradient: "from-rose-500 via-fuchsia-400 to-violet-300",
  },
  {
    id: "salmon-greens",
    title: "Lemon herb baked salmon with greens",
    summary:
      "Omega-3 rich salmon with garlicky greens — a mental-health and heart staple.",
    servings: 2,
    prepMinutes: 10,
    cookMinutes: 18,
    difficulty: "easy",
    costPerServing: 6.5,
    groups: ["mental-health", "heart-health", "aging", "blood-pressure"],
    tags: ["halal", "gluten-free", "dairy-free", "high-protein", "low-sodium", "quick"],
    allergens: ["fish"],
    cuisine: "Mediterranean",
    regionAvailability: ["coastal markets", "frozen aisle worldwide"],
    ingredients: [
      { name: "salmon fillets", amount: "2 (120–150g each)", cost: 9 },
      { name: "lemon", amount: "1", cost: 0.5 },
      { name: "garlic", amount: "2 cloves", cost: 0.15 },
      { name: "olive oil", amount: "1 tbsp", cost: 0.3 },
      { name: "broccoli or greens", amount: "3 cups", cost: 1.5 },
      { name: "dill or parsley", amount: "2 tbsp", cost: 0.4 },
    ],
    steps: [
      "Preheat oven to 200°C / 400°F. Place salmon on parchment.",
      "Brush with olive oil, garlic, lemon zest, pepper, and herbs. Bake 12–15 min.",
      "Steam or sauté greens lightly. Serve with lemon wedges.",
    ],
    nutrients: {
      calories: 420,
      protein: 36,
      carbs: 10,
      fat: 26,
      fiber: 4,
      sodium: 110,
      sugar: 3,
      potassium: 900,
      saturatedFat: 5,
    },
    whyHealthy:
      "EPA/DHA omega-3s support mood, brain aging, and heart rhythm. Baking keeps sodium low versus fried fish. Pair with plants for potassium. For budget or pescatarian alternatives, see sardines or flax + tofu bowl.",
    alternatives: [
      "Canned salmon or sardines cut cost dramatically",
      "Trout or mackerel if salmon is scarce",
      "For fish allergy: walnut + flax tofu scramble for plant omega-3s",
    ],
    imageGradient: "from-sky-700 via-teal-500 to-lime-300",
  },
  {
    id: "chickpea-curry",
    title: "Tomato chickpea weeknight curry",
    summary:
      "Pantry curry that stretches across a week — high fiber, vegan, and wallet-friendly.",
    servings: 6,
    prepMinutes: 12,
    cookMinutes: 28,
    difficulty: "easy",
    costPerServing: 1.4,
    groups: ["weight-management", "general", "heart-health", "diabetes-friendly"],
    tags: ["vegan", "halal", "kosher", "budget", "high-fiber", "dairy-free", "gluten-free"],
    allergens: [],
    cuisine: "South Asian–inspired",
    regionAvailability: ["canned goods globally", "dry chickpeas"],
    ingredients: [
      { name: "canned chickpeas", amount: "2 cans drained", cost: 2 },
      { name: "canned tomatoes", amount: "1 large can", cost: 1.2 },
      { name: "onion", amount: "1", cost: 0.4 },
      { name: "garlic", amount: "4 cloves", cost: 0.25 },
      { name: "ginger", amount: "1 tbsp", cost: 0.3 },
      { name: "curry powder or garam masala", amount: "2 tsp", cost: 0.2 },
      { name: "spinach", amount: "3 cups", cost: 1.2 },
      { name: "brown rice", amount: "2 cups cooked", cost: 0.8 },
    ],
    steps: [
      "Sauté onion, garlic, ginger. Bloom spices 30 seconds.",
      "Add tomatoes and chickpeas. Simmer 20 minutes until thick.",
      "Fold in spinach. Serve over brown rice or with whole-wheat flatbread.",
    ],
    nutrients: {
      calories: 380,
      protein: 15,
      carbs: 62,
      fat: 8,
      fiber: 13,
      sodium: 320,
      sugar: 9,
      potassium: 700,
    },
    whyHealthy:
      "Chickpeas provide resistant starch and plant protein that blunt blood-sugar spikes when paired with fiber-rich rice. Batch-cook for resilience when time or motivation is low. Rinse canned beans to cut sodium ~40%.",
    alternatives: [
      "Dry chickpeas soaked overnight for lower cost",
      "Cauliflower rice for lower carbs",
      "Add paneer only if dairy is allowed",
    ],
    imageGradient: "from-orange-700 via-amber-500 to-yellow-200",
  },
  {
    id: "dash-bean-salad",
    title: "DASH three-bean citrus salad",
    summary:
      "No-cook salad built for blood-pressure goals — potassium-forward and portable.",
    servings: 4,
    prepMinutes: 15,
    cookMinutes: 0,
    difficulty: "easy",
    costPerServing: 1.95,
    groups: ["blood-pressure", "heart-health", "weight-management"],
    tags: ["vegan", "halal", "low-sodium", "high-fiber", "quick", "budget", "gluten-free"],
    allergens: [],
    cuisine: "American DASH",
    regionAvailability: ["canned beans nearly everywhere"],
    ingredients: [
      { name: "kidney beans", amount: "1 can rinsed", cost: 1 },
      { name: "black beans", amount: "1 can rinsed", cost: 1 },
      { name: "chickpeas", amount: "1 can rinsed", cost: 1 },
      { name: "orange or lemon juice", amount: "3 tbsp", cost: 0.4 },
      { name: "olive oil", amount: "1 tbsp", cost: 0.3 },
      { name: "celery", amount: "2 stalks", cost: 0.5 },
      { name: "red onion", amount: "1/4", cost: 0.2 },
      { name: "parsley", amount: "1/2 cup", cost: 0.5 },
    ],
    steps: [
      "Rinse beans thoroughly to reduce sodium.",
      "Chop celery, onion, parsley. Toss with beans, citrus, oil, pepper.",
      "Chill 20 minutes. Taste before adding any salt — often none is needed.",
    ],
    nutrients: {
      calories: 290,
      protein: 14,
      carbs: 42,
      fat: 7,
      fiber: 12,
      sodium: 180,
      sugar: 5,
      potassium: 820,
    },
    whyHealthy:
      "Aligns with DASH pattern: legumes, produce, unsaturated fat, restrained sodium. High potassium supports vascular tone. Excellent meal-prep for busy weeks.",
    alternatives: [
      "Frozen edamame instead of one bean type",
      "Lime + cilantro for a Mexican profile",
    ],
    imageGradient: "from-red-700 via-orange-500 to-lime-300",
  },
  {
    id: "tofu-veg-stirfry",
    title: "Crisp tofu & market veg stir-fry",
    summary:
      "Fast wok meal adaptable to local produce — vegan protein without relying on supplements.",
    servings: 3,
    prepMinutes: 15,
    cookMinutes: 12,
    difficulty: "medium",
    costPerServing: 2.75,
    groups: ["general", "weight-management", "aging", "mental-health"],
    tags: ["vegan", "halal", "high-protein", "quick", "dairy-free"],
    allergens: ["soy"],
    cuisine: "East Asian–inspired",
    regionAvailability: ["tofu in cities; tempeh or beans as swap"],
    ingredients: [
      { name: "firm tofu", amount: "400g", cost: 2.5 },
      { name: "mixed vegetables", amount: "4 cups", cost: 3 },
      { name: "garlic", amount: "3 cloves", cost: 0.2 },
      { name: "low-sodium soy sauce", amount: "2 tbsp", cost: 0.3 },
      { name: "sesame oil", amount: "1 tsp", cost: 0.2 },
      { name: "cornstarch", amount: "1 tbsp", cost: 0.1 },
      { name: "brown rice", amount: "3 cups cooked", cost: 0.9 },
    ],
    steps: [
      "Press tofu, cube, toss with cornstarch. Pan-sear until golden.",
      "Stir-fry vegetables hot and fast. Add garlic near the end.",
      "Return tofu, splash soy sauce and sesame oil. Serve over rice.",
    ],
    nutrients: {
      calories: 410,
      protein: 22,
      carbs: 48,
      fat: 14,
      fiber: 7,
      sodium: 390,
      sugar: 6,
    },
    whyHealthy:
      "Tofu offers complete plant protein for muscle maintenance (aging) and satiety. Volume of vegetables aids fullness without excess calories. Use coconut aminos for lower sodium or soy-free needs.",
    alternatives: [
      "Tempeh or chickpeas if soy-allergic",
      "Cauliflower florets when leafy greens are seasonal",
      "Myth check: vegans can gain weight with calorie-dense foods like nuts, oils, grains — not only vegetables",
    ],
    imageGradient: "from-green-800 via-emerald-500 to-yellow-300",
  },
  {
    id: "yogurt-walnut-parfait",
    title: "Walnut yogurt brain parfait",
    summary:
      "Snack or breakfast with walnuts, yogurt, and banana for mood-supporting fats.",
    servings: 1,
    prepMinutes: 5,
    cookMinutes: 0,
    difficulty: "easy",
    costPerServing: 2.4,
    groups: ["mental-health", "aging", "general"],
    tags: ["vegetarian", "halal", "high-protein", "quick"],
    allergens: ["dairy", "tree-nuts"],
    cuisine: "Mediterranean snack",
    regionAvailability: ["widely available"],
    ingredients: [
      { name: "Greek yogurt", amount: "200g", cost: 1.4 },
      { name: "walnuts", amount: "20g", cost: 0.6 },
      { name: "banana", amount: "1/2", cost: 0.25 },
      { name: "cinnamon", amount: "pinch", cost: 0.05 },
    ],
    steps: [
      "Layer yogurt, sliced banana, and chopped walnuts.",
      "Dust with cinnamon. Eat slowly — walnuts are calorie-dense by design.",
    ],
    nutrients: {
      calories: 340,
      protein: 20,
      carbs: 28,
      fat: 16,
      fiber: 4,
      sodium: 65,
      sugar: 16,
    },
    whyHealthy:
      "Walnuts contribute ALA omega-3s. Protein + fat combo stabilizes appetite. Tree-nut allergy? Use pumpkin seeds instead.",
    alternatives: ["Pumpkin seeds for nut allergy", "Soy yogurt for dairy-free"],
    imageGradient: "from-amber-800 via-yellow-600 to-stone-200",
  },
  {
    id: "veggie-egg-scramble",
    title: "Veggie egg scramble plate",
    summary:
      "Protein-forward breakfast for aging muscle and busy mornings.",
    servings: 2,
    prepMinutes: 8,
    cookMinutes: 10,
    difficulty: "easy",
    costPerServing: 1.7,
    groups: ["aging", "weight-management", "general", "diabetes-friendly"],
    tags: ["vegetarian", "halal", "kosher", "high-protein", "quick", "gluten-free", "budget"],
    allergens: ["eggs"],
    cuisine: "Global breakfast",
    regionAvailability: ["eggs widely available"],
    ingredients: [
      { name: "eggs", amount: "4", cost: 1.6 },
      { name: "tomato", amount: "1", cost: 0.5 },
      { name: "spinach", amount: "2 cups", cost: 0.8 },
      { name: "onion", amount: "1/4", cost: 0.15 },
      { name: "olive oil", amount: "1 tsp", cost: 0.15 },
    ],
    steps: [
      "Sauté onion and tomato briefly. Add spinach until wilted.",
      "Beat eggs, pour in, scramble gently on medium-low heat.",
      "Pepper generously; salt lightly if blood pressure is a concern.",
    ],
    nutrients: {
      calories: 260,
      protein: 18,
      carbs: 6,
      fat: 18,
      fiber: 2,
      sodium: 180,
      sugar: 3,
    },
    whyHealthy:
      "Eggs provide leucine-rich protein for older adults. Vegetables add volume. Egg allergy? Use chickpea flour omelette (besan).",
    alternatives: ["Tofu scramble for vegan", "Egg whites if advised by clinician"],
    imageGradient: "from-yellow-600 via-orange-400 to-green-300",
  },
  {
    id: "sweet-potato-black-bean",
    title: "Roasted sweet potato black bean bowls",
    summary:
      "Colorful sheet-pan bowls — filling fiber for weight and blood sugar goals.",
    servings: 4,
    prepMinutes: 15,
    cookMinutes: 35,
    difficulty: "easy",
    costPerServing: 2.2,
    groups: ["diabetes-friendly", "weight-management", "heart-health", "general"],
    tags: ["vegan", "halal", "high-fiber", "gluten-free", "dairy-free", "budget"],
    allergens: [],
    cuisine: "Latin–inspired",
    regionAvailability: ["root vegetables & beans global"],
    ingredients: [
      { name: "sweet potatoes", amount: "2 large", cost: 2 },
      { name: "black beans", amount: "1 can rinsed", cost: 1 },
      { name: "corn", amount: "1 cup", cost: 0.8 },
      { name: "avocado", amount: "1", cost: 1.5 },
      { name: "lime", amount: "1", cost: 0.3 },
      { name: "cumin + paprika", amount: "1 tsp each", cost: 0.15 },
      { name: "olive oil", amount: "1 tbsp", cost: 0.3 },
    ],
    steps: [
      "Cube sweet potatoes, toss with oil and spices, roast 30–35 min at 200°C.",
      "Warm beans with corn. Assemble bowls with avocado and lime.",
    ],
    nutrients: {
      calories: 390,
      protein: 12,
      carbs: 58,
      fat: 13,
      fiber: 14,
      sodium: 210,
      sugar: 10,
      potassium: 950,
    },
    whyHealthy:
      "Resistant starch and fiber slow glucose absorption. Avocado supplies heart-healthy monounsaturated fat. Skip avocado when expensive — use a spoon of olive oil.",
    alternatives: ["Butternut squash instead of sweet potato", "Pinto beans as swap"],
    imageGradient: "from-orange-600 via-rose-400 to-lime-400",
  },
  {
    id: "miso-soup-tofu",
    title: "Gentle miso soup with greens",
    summary:
      "Light, hydrating soup for appetite recovery and mindful evening eating.",
    servings: 2,
    prepMinutes: 5,
    cookMinutes: 10,
    difficulty: "easy",
    costPerServing: 1.6,
    groups: ["mental-health", "aging", "general", "weight-management"],
    tags: ["vegetarian", "quick", "dairy-free", "budget"],
    allergens: ["soy"],
    cuisine: "Japanese",
    regionAvailability: ["Asian groceries; paste keeps months"],
    ingredients: [
      { name: "miso paste", amount: "2 tbsp", cost: 0.6 },
      { name: "soft tofu", amount: "150g", cost: 1.2 },
      { name: "wakame or spinach", amount: "1 cup", cost: 0.8 },
      { name: "green onion", amount: "2", cost: 0.3 },
      { name: "water or light stock", amount: "3 cups", cost: 0.1 },
    ],
    steps: [
      "Warm water — do not boil hard once miso is added.",
      "Dissolve miso off heat. Add tofu and greens. Garnish with onion.",
    ],
    nutrients: {
      calories: 140,
      protein: 11,
      carbs: 10,
      fat: 6,
      fiber: 2,
      sodium: 620,
      sugar: 2,
    },
    whyHealthy:
      "Low-calorie volume supports mindful portions. Fermented miso adds flavor so less salt is needed elsewhere in the day. Note: sodium is moderate — balance with low-sodium meals if BP is high.",
    alternatives: ["Vegetable broth + white beans if miso unavailable"],
    imageGradient: "from-stone-700 via-amber-500 to-green-400",
  },
  {
    id: "quinoa-veg-pilaf",
    title: "Herb quinoa vegetable pilaf",
    summary:
      "Complete plant protein side or main — useful when meat is restricted by faith or ethics.",
    servings: 4,
    prepMinutes: 10,
    cookMinutes: 20,
    difficulty: "easy",
    costPerServing: 2.3,
    groups: ["general", "heart-health", "diabetes-friendly", "aging"],
    tags: ["vegan", "halal", "kosher", "gluten-free", "high-protein", "dairy-free"],
    allergens: [],
    cuisine: "Andean / Mediterranean fusion",
    regionAvailability: ["quinoa in most cities; bulgur as cheaper swap"],
    ingredients: [
      { name: "quinoa", amount: "1 cup dry", cost: 2 },
      { name: "mixed vegetables", amount: "3 cups", cost: 2.5 },
      { name: "olive oil", amount: "1 tbsp", cost: 0.3 },
      { name: "lemon", amount: "1", cost: 0.5 },
      { name: "parsley & mint", amount: "1/2 cup", cost: 0.6 },
    ],
    steps: [
      "Rinse quinoa. Cook in 2 cups water ~15 minutes.",
      "Sauté vegetables. Fluff quinoa with herbs, lemon, oil.",
    ],
    nutrients: {
      calories: 300,
      protein: 10,
      carbs: 45,
      fat: 9,
      fiber: 6,
      sodium: 40,
      sugar: 4,
    },
    whyHealthy:
      "Quinoa is a complete protein — helpful for vegetarians/vegans aiming to maintain or gain weight when paired with nuts and oils. Very low sodium.",
    alternatives: ["Bulgur or brown rice for budget", "Add chickpeas for more protein"],
    imageGradient: "from-lime-700 via-yellow-500 to-amber-200",
  },
  {
    id: "baked-chicken-veg",
    title: "Sheet-pan lemon chicken & roots",
    summary:
      "One-pan protein for families — portion control built in for weight goals.",
    servings: 4,
    prepMinutes: 15,
    cookMinutes: 40,
    difficulty: "easy",
    costPerServing: 3.4,
    groups: ["weight-management", "aging", "general", "diabetes-friendly"],
    tags: ["halal", "kosher", "high-protein", "gluten-free", "dairy-free"],
    allergens: [],
    cuisine: "Home cooking",
    regionAvailability: ["poultry widely available; tofu swap for vegetarian"],
    ingredients: [
      { name: "chicken thighs or breast", amount: "600g", cost: 7 },
      { name: "carrots", amount: "3", cost: 0.8 },
      { name: "potatoes or turnips", amount: "3", cost: 1 },
      { name: "onion", amount: "1", cost: 0.4 },
      { name: "lemon", amount: "1", cost: 0.5 },
      { name: "olive oil", amount: "1.5 tbsp", cost: 0.4 },
      { name: "paprika & herbs", amount: "2 tsp", cost: 0.2 },
    ],
    steps: [
      "Toss vegetables with oil and spices on a sheet pan.",
      "Nestle chicken on top. Roast 35–40 min at 200°C until done.",
      "Rest 5 minutes. Squeeze lemon over everything.",
    ],
    nutrients: {
      calories: 430,
      protein: 34,
      carbs: 28,
      fat: 18,
      fiber: 5,
      sodium: 160,
      sugar: 5,
    },
    whyHealthy:
      "Balanced plate: protein, complex carbs, vegetables. Baking avoids deep-fried takeout. Choose breast for leaner macros; thighs for affordability and satiety.",
    alternatives: [
      "Turkey or firm tofu for variety",
      "Muslims/Jews: ensure certified halal/kosher poultry",
      "No beef — this recipe avoids common religious restrictions on pork/beef variants",
    ],
    imageGradient: "from-amber-800 via-orange-500 to-yellow-300",
  },
];

export function getRecipeById(id: string) {
  return recipes.find((r) => r.id === id);
}

export function filterRecipes(opts: {
  group?: string;
  tag?: string;
  q?: string;
  maxCost?: number;
  excludeAllergens?: string[];
}) {
  return recipes.filter((r) => {
    if (opts.group && opts.group !== "all" && !r.groups.includes(opts.group as never)) {
      return false;
    }
    if (opts.tag && opts.tag !== "all" && !r.tags.includes(opts.tag as never)) {
      return false;
    }
    if (opts.maxCost != null && r.costPerServing > opts.maxCost) return false;
    if (opts.excludeAllergens?.length) {
      if (r.allergens.some((a) => opts.excludeAllergens!.includes(a))) return false;
    }
    if (opts.q) {
      const q = opts.q.toLowerCase();
      const hay = `${r.title} ${r.summary} ${r.cuisine} ${r.ingredients.map((i) => i.name).join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}