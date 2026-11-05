# NourishAI

**Live site:** [https://nourish-ai-olive.vercel.app](https://nourish-ai-olive.vercel.app)

Conversational nutrition assistant for real-world eating: weight goals, blood pressure, healthy aging, mood-supportive habits, allergies, faith-based diets, and tight budgets.

Supports **English** and **繁體中文**, with currency that follows your location (HKD / TWD / CNY / USD / …).

## What you get

- **Healthy recipes** with photos, nutrients, per-serving cost in your currency, allergens, and culture/diet tags
- **Chat coach** with step-by-step consult questions, keyword answers (diabetes, BP, budget…), and one-tap recipe links
- **Food check** for everyday foods (apple, rice, fried chicken, bubble tea, hot pot…) with localized guidance
- **Meal planner** for day / week / month with budget and allergy filters
- **BMI & body tools** with energy estimates and cautious activity tips

Educational only — not medical advice.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

### Deploy on Vercel (auto-updates)

Repo: [github.com/cherthebest/nourish-ai](https://github.com/cherthebest/nourish-ai)

Push to `main` updates the public site. Optional: set `OPENAI_API_KEY` for freer chat wording; without it, the built-in coach still answers.

## Stack

Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, Radix UI primitives.
