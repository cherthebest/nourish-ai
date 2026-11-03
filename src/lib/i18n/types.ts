export type Locale = "en" | "zh-Hant";

export const LOCALES: { id: Locale; label: string; short: string }[] = [
  { id: "en", label: "English", short: "EN" },
  { id: "zh-Hant", label: "繁體中文", short: "繁中" },
];

export const LOCALE_STORAGE_KEY = "nourishai-locale";

export type Dictionary = {
  meta: { title: string; description: string };
  brand: string;
  nav: {
    recipes: string;
    chat: string;
    analyze: string;
    planner: string;
    bmi: string;
    openChat: string;
    menu: string;
    language: string;
  };
  home: {
    headline: string;
    sub: string;
    ctaChat: string;
    ctaRecipes: string;
    constraintsTitle: string;
    constraintsSub: string;
    chatTitle: string;
    chatSub: string;
    chatBullet1: string;
    chatBullet2: string;
    chatBullet3: string;
    featuredTitle: string;
    featuredSub: string;
    viewAll: string;
    planTitle: string;
    planSub: string;
    openPlanner: string;
    openBmi: string;
    openAnalyze: string;
  };
  groups: Record<
    | "weight-management"
    | "blood-pressure"
    | "aging"
    | "mental-health"
    | "diabetes-friendly"
    | "heart-health"
    | "general",
    { label: string; blurb: string }
  >;
  chat: {
    title: string;
    intro: string;
    panelTitle: string;
    panelSub: string;
    badge: string;
    welcome: string;
    placeholder: string;
    retrieving: string;
    send: string;
    error: string;
    limits: string;
    starters: string[];
  };
  recipes: {
    title: string;
    sub: string;
    search: string;
    searchPlaceholder: string;
    consumerGroup: string;
    allGroups: string;
    dietTag: string;
    any: string;
    maxCost: string;
    emptyTitle: string;
    emptySub: string;
    min: string;
    perServing: string;
    whyHealthy: string;
    ingredients: string;
    steps: string;
    nutrientAnalysis: string;
    allergensAvailability: string;
    allergens: string;
    noneListed: string;
    regions: string;
    swaps: string;
    askAbout: string;
    addToPlan: string;
    servings: string;
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    sodium: string;
    sugar: string;
    potassium: string;
  };
  analyze: {
    title: string;
    sub: string;
    placeholder: string;
    analyze: string;
    whyHelp: string;
    watchouts: string;
    alternatives: string;
    verdictStrong: string;
    verdictSituational: string;
    verdictLimit: string;
    verdictUnknown: string;
  };
  planner: {
    title: string;
    sub: string;
    horizon: string;
    day: string;
    week: string;
    month: string;
    focusGroup: string;
    budget: string;
    dietFilters: string;
    excludeAllergies: string;
    regenerate: string;
    monthNote: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
  };
  bmi: {
    title: string;
    sub: string;
    age: string;
    sex: string;
    female: string;
    male: string;
    other: string;
    height: string;
    weight: string;
    activity: string;
    sedentary: string;
    light: string;
    moderate: string;
    active: string;
    medical: string;
    medicalPlaceholder: string;
    update: string;
    yourBmi: string;
    estBmr: string;
    estDaily: string;
    movement: string;
    disclaimer: string;
    buildPlan: string;
    askChat: string;
    categories: Record<
      | "Underweight"
      | "Typical range"
      | "Overweight"
      | "Obesity class I"
      | "Obesity class II"
      | "Obesity class III",
      string
    >;
  };
  footer: { blurb: string };
  common: { loading: string; kcal: string };
  tags: Record<
    | "halal"
    | "kosher"
    | "vegetarian"
    | "vegan"
    | "gluten-free"
    | "dairy-free"
    | "nut-free"
    | "low-sodium"
    | "high-protein"
    | "budget"
    | "quick"
    | "high-fiber",
    string
  >;
};