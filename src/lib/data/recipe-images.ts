/** Unsplash food photos for recipes (costPerServing stays USD). */
export const RECIPE_IMAGES: Record<string, string> = {
  "lentil-ginger-bowl":
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
  "oat-berry-breakfast":
    "https://images.unsplash.com/photo-1517093602195-b40af968f9d6?auto=format&fit=crop&w=1200&q=80",
  "salmon-greens":
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80",
  "chickpea-curry":
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80",
  "dash-bean-salad":
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
  "tofu-veg-stirfry":
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
  "yogurt-walnut-parfait":
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
  "veggie-egg-scramble":
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80",
  "sweet-potato-black-bean":
    "https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&fit=crop&w=1200&q=80",
  "miso-soup-tofu":
    "https://images.unsplash.com/photo-1547592166-23acba624cba?auto=format&fit=crop&w=1200&q=80",
  "quinoa-veg-pilaf":
    "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1200&q=80",
  "baked-chicken-veg":
    "https://images.unsplash.com/photo-1598103442097-8b704736f0e0?auto=format&fit=crop&w=1200&q=80",
  "tomato-egg-rice":
    "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1200&q=80",
  "congee-ginger-fish":
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80",
  "steamed-veg-tofu":
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
  "avocado-toast-egg":
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80",
  "greek-salad-chickpea":
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
  "banana-oat-pancakes":
    "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=1200&q=80",
  "turkey-lettuce-wraps":
    "https://images.unsplash.com/photo-1555939596-39c62ce0a1b1?auto=format&fit=crop&w=1200&q=80",
  "spinach-dal":
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80",
  "grilled-veg-couscous":
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=80",
  "apple-cinnamon-porridge":
    "https://images.unsplash.com/photo-1495214783159-240b8f3a7c5c?auto=format&fit=crop&w=1200&q=80",
  "shrimp-garlic-broccoli":
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80",
  "mushroom-barley-soup":
    "https://images.unsplash.com/photo-1547592166-23acba624cba?auto=format&fit=crop&w=1200&q=80",
};

export function recipeImage(id: string, fallbackGradient?: string) {
  return {
    url: RECIPE_IMAGES[id],
    gradient: fallbackGradient || "from-emerald-700 via-lime-600 to-amber-200",
  };
}