export type ConsumerGroup =
  | "weight-management"
  | "blood-pressure"
  | "aging"
  | "mental-health"
  | "general"
  | "diabetes-friendly"
  | "heart-health";

export type DietTag =
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
  | "high-fiber";

export type Allergy =
  | "peanuts"
  | "tree-nuts"
  | "dairy"
  | "eggs"
  | "shellfish"
  | "fish"
  | "soy"
  | "wheat"
  | "sesame";

export interface NutrientProfile {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  sugar: number;
  potassium?: number;
  saturatedFat?: number;
}

export interface Recipe {
  id: string;
  title: string;
  summary: string;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  difficulty: "easy" | "medium" | "hard";
  costPerServing: number;
  groups: ConsumerGroup[];
  tags: DietTag[];
  allergens: Allergy[];
  cuisine: string;
  regionAvailability: string[];
  ingredients: { name: string; amount: string; cost?: number }[];
  steps: string[];
  nutrients: NutrientProfile;
  whyHealthy: string;
  alternatives?: string[];
  imageGradient: string;
  /** Public image URL (Unsplash etc.) */
  imageUrl?: string;
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  category: string;
  tags: string[];
  content: string;
}

export interface UserProfile {
  name: string;
  age: number;
  sex: "female" | "male" | "other";
  heightCm: number;
  weightKg: number;
  activity: "sedentary" | "light" | "moderate" | "active";
  goals: string[];
  medicalNotes: string;
  allergies: Allergy[];
  dietPrefs: DietTag[];
  budgetPerDay: number;
  cultureNotes: string;
}