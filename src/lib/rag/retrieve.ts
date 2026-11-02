import { knowledgeBase } from "../data/knowledge";
import type { KnowledgeDoc } from "../data/types";

const STOP = new Set(
  "a an the and or but if in on at to for of is are was were be been being with without from by as it its this that these those you your we our they their i me my can could should would will just about into over under again further then once here there when where why how all each few more most other some such no nor not only own same so than too very".split(
    " ",
  ),
);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+\s%-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

type Index = {
  docs: KnowledgeDoc[];
  df: Map<string, number>;
  tf: Map<string, Map<string, number>>;
  docTokens: Map<string, string[]>;
};

let cached: Index | null = null;

function buildIndex(): Index {
  const df = new Map<string, number>();
  const tf = new Map<string, Map<string, number>>();
  const docTokens = new Map<string, string[]>();

  for (const doc of knowledgeBase) {
    const tokens = tokenize(`${doc.title} ${doc.category} ${doc.tags.join(" ")} ${doc.content}`);
    docTokens.set(doc.id, tokens);
    const counts = new Map<string, number>();
    for (const t of tokens) counts.set(t, (counts.get(t) || 0) + 1);
    tf.set(doc.id, counts);
    const uniq = new Set(tokens);
    for (const t of uniq) df.set(t, (df.get(t) || 0) + 1);
  }

  return { docs: knowledgeBase, df, tf, docTokens };
}

function getIndex() {
  if (!cached) cached = buildIndex();
  return cached;
}

function scoreDoc(queryTokens: string[], docId: string, index: Index): number {
  const counts = index.tf.get(docId)!;
  const N = index.docs.length;
  let score = 0;
  const seen = new Set<string>();
  for (const q of queryTokens) {
    const tfv = counts.get(q) || 0;
    if (!tfv) continue;
    const idf = Math.log(1 + N / (1 + (index.df.get(q) || 0)));
    score += (1 + Math.log(tfv)) * idf;
    seen.add(q);
  }
  // mild boost for title/tag hits
  const doc = index.docs.find((d) => d.id === docId)!;
  const titleTokens = new Set(tokenize(`${doc.title} ${doc.tags.join(" ")}`));
  for (const q of seen) {
    if (titleTokens.has(q)) score *= 1.15;
  }
  return score;
}

export interface RetrievedChunk {
  doc: KnowledgeDoc;
  score: number;
}

export function retrieve(query: string, k = 5): RetrievedChunk[] {
  const index = getIndex();
  const qTokens = tokenize(query);
  if (!qTokens.length) {
    return index.docs.slice(0, k).map((doc) => ({ doc, score: 0 }));
  }

  const scored = index.docs
    .map((doc) => ({ doc, score: scoreDoc(qTokens, doc.id, index) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length >= k) return scored.slice(0, k);

  // fallback: partial stem-ish includes
  const extras = index.docs
    .filter((d) => !scored.some((s) => s.doc.id === d.id))
    .map((doc) => {
      const hay = `${doc.title} ${doc.content}`.toLowerCase();
      const hits = qTokens.filter((t) => hay.includes(t)).length;
      return { doc, score: hits * 0.1 };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return [...scored, ...extras].slice(0, k);
}

export function buildContext(chunks: RetrievedChunk[]): string {
  return chunks
    .map(
      (c, i) =>
        `[Source ${i + 1}: ${c.doc.title} | ${c.doc.category}]\n${c.doc.content}`,
    )
    .join("\n\n");
}