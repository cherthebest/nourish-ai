export type BmiCategory =
  | "Underweight"
  | "Typical range"
  | "Overweight"
  | "Obesity class I"
  | "Obesity class II"
  | "Obesity class III";

export function calcBmi(weightKg: number, heightCm: number) {
  const m = heightCm / 100;
  if (m <= 0 || weightKg <= 0) return null;
  const bmi = weightKg / (m * m);
  return Math.round(bmi * 10) / 10;
}

export function categorizeBmi(bmi: number): BmiCategory {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Typical range";
  if (bmi < 30) return "Overweight";
  if (bmi < 35) return "Obesity class I";
  if (bmi < 40) return "Obesity class II";
  return "Obesity class III";
}

export function estimateBmr(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: "female" | "male" | "other",
) {
  // Mifflin-St Jeor; "other" uses average of male/female coefficients
  const s = sex === "male" ? 5 : sex === "female" ? -161 : (5 - 161) / 2;
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + s);
}

const ACTIVITY = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
} as const;

export function estimateTdee(
  bmr: number,
  activity: keyof typeof ACTIVITY,
) {
  return Math.round(bmr * ACTIVITY[activity]);
}

export function activitySuggestions(input: {
  age: number;
  bmi: number | null;
  medicalNotes: string;
  locale?: "en" | "zh-Hant";
}): string[] {
  const notes = input.medicalNotes.toLowerCase();
  const zh = input.locale === "zh-Hant";
  const tips: string[] = [];

  if (/chest pain|cardiac|heart failure|胸痛|心臟|心脏/.test(notes)) {
    tips.push(
      zh
        ? "開始任何新運動前，請先取得醫師許可。"
        : "Get clinician clearance before any new exercise program.",
    );
  }
  if (
    /blood pressure|hypertension|血壓|高血压|高血壓/.test(notes) ||
    (input.bmi && input.bmi >= 30)
  ) {
    tips.push(
      zh
        ? "可優先選擇步行、騎車或游泳；在醫師許可前，避免突然做極重阻力訓練。"
        : "Prefer walking, cycling, or swimming; avoid sudden maximal heavy lifts until cleared.",
    );
  }
  if (input.age >= 60) {
    tips.push(
      zh
        ? "每週加入平衡訓練（扶穩桌邊單腳站）與輕阻力練習 2 次。"
        : "Add balance work (stand on one foot near a counter) and light resistance 2×/week.",
    );
  }
  if (input.bmi && input.bmi >= 35) {
    tips.push(
      zh
        ? "關節較友善的活動：水中運動、坐姿肌力、短而多次的步行。"
        : "Joint-friendly movement: water exercise, seated strength, short frequent walks.",
    );
  }
  if (!tips.length) {
    tips.push(
      zh
        ? "多數日子先從快走 10–20 分鐘開始，再加上每週 2 次短肌力訓練。"
        : "Start with 10–20 minutes of brisk walking most days, plus 2 short strength sessions.",
    );
  }
  tips.push(
    zh
      ? "運動後搭配較有蛋白質的餐點，有助恢復——可在站內食譜找靈感。"
      : "Pair movement with protein-forward meals from NourishAI for better recovery.",
  );
  return tips;
}
