"use client";

import { useMemo, useState } from "react";
import {
  activitySuggestions,
  calcBmi,
  categorizeBmi,
  estimateBmr,
  estimateTdee,
} from "@/lib/bmi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import { FadeIn } from "@/components/motion/apple-press";

export function BmiForm() {
  const { t, locale } = useI18n();
  const [age, setAge] = useState(35);
  const [sex, setSex] = useState<"female" | "male" | "other">("female");
  const [heightCm, setHeightCm] = useState(165);
  const [weightKg, setWeightKg] = useState(72);
  const [activity, setActivity] = useState<"sedentary" | "light" | "moderate" | "active">(
    "light",
  );
  const [medicalNotes, setMedicalNotes] = useState("");
  const [show, setShow] = useState(true);

  const bmi = useMemo(() => calcBmi(weightKg, heightCm), [weightKg, heightCm]);
  const category = bmi != null ? categorizeBmi(bmi) : null;
  const bmr = estimateBmr(weightKg, heightCm, age, sex);
  const tdee = estimateTdee(bmr, activity);
  const moves = activitySuggestions({ age, bmi, medicalNotes, locale });

  return (
    <FadeIn className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <form
        className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--card)]/95 p-6 shadow-sm backdrop-blur-sm"
        onSubmit={(e) => {
          e.preventDefault();
          setShow(true);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="age">{t.bmi.age}</Label>
            <Input
              id="age"
              type="number"
              min={1}
              max={120}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sex">{t.bmi.sex}</Label>
            <select
              id="sex"
              className="flex h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 text-sm"
              value={sex}
              onChange={(e) => setSex(e.target.value as typeof sex)}
            >
              <option value="female">{t.bmi.female}</option>
              <option value="male">{t.bmi.male}</option>
              <option value="other">{t.bmi.other}</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">{t.bmi.height}</Label>
            <Input
              id="height"
              type="number"
              min={80}
              max={250}
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">{t.bmi.weight}</Label>
            <Input
              id="weight"
              type="number"
              min={20}
              max={400}
              step="0.1"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="activity">{t.bmi.activity}</Label>
          <select
            id="activity"
            className="flex h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 text-sm"
            value={activity}
            onChange={(e) => setActivity(e.target.value as typeof activity)}
          >
            <option value="sedentary">{t.bmi.sedentary}</option>
            <option value="light">{t.bmi.light}</option>
            <option value="moderate">{t.bmi.moderate}</option>
            <option value="active">{t.bmi.active}</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="medical">{t.bmi.medical}</Label>
          <Textarea
            id="medical"
            value={medicalNotes}
            onChange={(e) => setMedicalNotes(e.target.value)}
            placeholder={t.bmi.medicalPlaceholder}
          />
        </div>
        <Button type="submit">{t.bmi.update}</Button>
      </form>

      {show && bmi != null && category && (
        <div className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--card)]/95 p-6 shadow-sm backdrop-blur-sm">
          <div>
            <p className="text-sm text-[var(--muted-foreground)]">{t.bmi.yourBmi}</p>
            <p className="font-[family-name:var(--font-display)] text-5xl text-[var(--forest)]">
              {bmi}
            </p>
            <p className="mt-1 font-medium text-[var(--primary)]">
              {t.bmi.categories[category]}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[var(--muted)] p-4">
              <p className="text-xs text-[var(--muted-foreground)]">{t.bmi.estBmr}</p>
              <p className="text-2xl font-semibold text-[var(--forest)]">
                {bmr} {t.common.kcal}
              </p>
            </div>
            <div className="rounded-2xl bg-[var(--muted)] p-4">
              <p className="text-xs text-[var(--muted-foreground)]">{t.bmi.estDaily}</p>
              <p className="text-2xl font-semibold text-[var(--forest)]">
                {tdee} {t.common.kcal}
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--forest)]">{t.bmi.movement}</h3>
            <ul className="mt-2 space-y-2 text-sm text-[var(--muted-foreground)]">
              {moves.map((m) => (
                <li key={m}>• {m}</li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">{t.bmi.disclaimer}</p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="soft">
              <Link href="/planner">{t.bmi.buildPlan}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/chat">{t.bmi.askChat}</Link>
            </Button>
          </div>
        </div>
      )}
    </FadeIn>
  );
}