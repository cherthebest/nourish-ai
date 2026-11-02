# NourishAI

Conversational nutrition assistant for real-world eating problems: weight management, blood pressure, healthy aging, mood-supportive habits, allergies, faith-based diets, and tight budgets.

## What you get

- **Healthy recipes** tagged by consumer group, culture/diet, allergens, cost, and nutrients
- **Ask Nourish chatbot** with **RAG** over a curated knowledge base + recipe documents (local TF–IDF retrieval; optional OpenAI for fluent generation)
- **Food analysis** — is it a strong choice, situational, or best limited, with alternatives
- **Meal planner** for day / week / month with budget and allergy filters
- **BMI & body analysis** with energy estimates and cautious activity suggestions

Educational only — not medical advice. Suggestions can be wrong; allergies, prescriptions, and culture always win.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43123](http://127.0.0.1:43123).

### Optional LLM upgrade

Copy `.env.example` to `.env.local` and set `OPENAI_API_KEY`. Without a key, the chatbot still answers using retrieved sources (local RAG mode).

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, Radix-based UI primitives.