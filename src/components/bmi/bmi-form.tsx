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

export function BmiForm() {
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
  const moves = activitySuggestions({ age, bmi, medicalNotes });

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <form
        className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          setShow(true);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
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
            <Label htmlFor="sex">Sex</Label>
            <select
              id="sex"
              className="flex h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 text-sm"
              value={sex}
              onChange={(e) => setSex(e.target.value as typeof sex)}
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other / prefer not to say</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
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
            <Label htmlFor="weight">Weight (kg)</Label>
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
          <Label htmlFor="activity">Activity level</Label>
          <select
            id="activity"
            className="flex h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 text-sm"
            value={activity}
            onChange={(e) => setActivity(e.target.value as typeof activity)}
          >
            <option value="sedentary">Sedentary</option>
            <option value="light">Light (1–3 days/week)</option>
            <option value="moderate">Moderate (3–5 days)</option>
            <option value="active">Active (daily)</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="medical">Medical notes (optional)</Label>
          <Textarea
            id="medical"
            value={medicalNotes}
            onChange={(e) => setMedicalNotes(e.target.value)}
            placeholder="e.g. high blood pressure, knee pain, recovering from illness"
          />
        </div>
        <Button type="submit">Update analysis</Button>
      </form>

      {show && bmi != null && category && (
        <div className="space-y-4 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
          <div>
            <p className="text-sm text-[var(--muted-foreground)]">Your BMI</p>
            <p className="font-[family-name:var(--font-display)] text-5xl text-[var(--forest)]">
              {bmi}
            </p>
            <p className="mt-1 font-medium text-[var(--primary)]">{category}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[var(--muted)] p-4">
              <p className="text-xs text-[var(--muted-foreground)]">Est. BMR</p>
              <p className="text-2xl font-semibold text-[var(--forest)]">{bmr} kcal</p>
            </div>
            <div className="rounded-2xl bg-[var(--muted)] p-4">
              <p className="text-xs text-[var(--muted-foreground)]">Est. daily needs</p>
              <p className="text-2xl font-semibold text-[var(--forest)]">{tdee} kcal</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-[var(--forest)]">Movement ideas (minor guidance)</h3>
            <ul className="mt-2 space-y-2 text-sm text-[var(--muted-foreground)]">
              {moves.map((m) => (
                <li key={m}>• {m}</li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-[var(--muted-foreground)]">
            BMI ignores muscle and some ethnic differences. Estimates are educational, not diagnoses.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="soft">
              <Link href="/planner">Build a meal plan</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/chat">Ask the chatbot</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}