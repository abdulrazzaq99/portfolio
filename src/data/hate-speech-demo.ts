/**
 * Hate Speech Detection — demo data for the multi-model comparison grid.
 *
 * ⚠️  SAMPLE OUTPUTS. The predictions below are illustrative — they show
 *     the *kind* of disagreement that classical vs. transformer models
 *     exhibit on borderline text, but they are NOT the actual outputs of
 *     Abdul's trained models. Replace each `predictions` block with real
 *     numbers exported from `Multi-Model-Hate-Speech-Detection/notebooks/`
 *     when ready (see the README in that repo for the export format).
 *
 * The examples are real-world borderline phrasings — chosen to demonstrate
 * where keyword-based classifiers tend to fail and where transformers
 * tend to recover.
 */

export type Verdict = "clean" | "abuse";

export type ModelKey = "logreg" | "svm" | "distilbert" | "roberta-ft";

export type ModelInfo = { key: ModelKey; label: string; arch: string };

export const MODELS: ModelInfo[] = [
  { key: "logreg",     label: "Logistic Regression", arch: "TF-IDF + LR (sklearn)" },
  { key: "svm",        label: "Linear SVM",          arch: "TF-IDF + LinearSVC" },
  { key: "distilbert", label: "DistilBERT",          arch: "frozen + linear head" },
  { key: "roberta-ft", label: "RoBERTa fine-tuned",  arch: "full fine-tune, 3 epochs" },
];

export type Example = {
  id: string;
  text: string;
  groundTruth: Verdict;
  category: "clean" | "borderline" | "abuse";
  predictions: Record<ModelKey, { verdict: Verdict; confidence: number }>;
  /** Why the models disagree on this one. Shown under the grid. */
  note?: string;
};

/* ──────────────────────────────────────────────────────────
   SAMPLE EXAMPLES — replace `predictions` with real model outputs.
   ────────────────────────────────────────────────────────── */
export const examples: Example[] = [
  // ─── Clear clean ───────────────────────────────────────
  {
    id: "ex-01",
    text: "I love this song, the chorus is perfect.",
    groundTruth: "clean",
    category: "clean",
    predictions: {
      "logreg":     { verdict: "clean", confidence: 0.97 },
      "svm":        { verdict: "clean", confidence: 0.96 },
      "distilbert": { verdict: "clean", confidence: 0.99 },
      "roberta-ft": { verdict: "clean", confidence: 0.99 },
    },
  },
  {
    id: "ex-02",
    text: "I disagree with you but appreciate the thoughtful argument.",
    groundTruth: "clean",
    category: "clean",
    predictions: {
      "logreg":     { verdict: "clean", confidence: 0.93 },
      "svm":        { verdict: "clean", confidence: 0.92 },
      "distilbert": { verdict: "clean", confidence: 0.98 },
      "roberta-ft": { verdict: "clean", confidence: 0.98 },
    },
  },

  // ─── Classical models false-positive on innocent uses of "hate" ──
  {
    id: "ex-03",
    text: "I hate Mondays so much.",
    groundTruth: "clean",
    category: "borderline",
    predictions: {
      "logreg":     { verdict: "abuse", confidence: 0.71 },
      "svm":        { verdict: "abuse", confidence: 0.68 },
      "distilbert": { verdict: "clean", confidence: 0.86 },
      "roberta-ft": { verdict: "clean", confidence: 0.94 },
    },
    note: "Classical models trigger on the keyword \"hate\"; transformers see Monday is the object, not a group.",
  },
  {
    id: "ex-04",
    text: "Oh great, another Monday — just what I needed.",
    groundTruth: "clean",
    category: "borderline",
    predictions: {
      "logreg":     { verdict: "clean", confidence: 0.55 },
      "svm":        { verdict: "clean", confidence: 0.51 },
      "distilbert": { verdict: "clean", confidence: 0.83 },
      "roberta-ft": { verdict: "clean", confidence: 0.91 },
    },
    note: "Sarcasm. Bag-of-words has no signal; pretrained models pick up the construction.",
  },

  // ─── Borderline / coded ────────────────────────────────
  {
    id: "ex-05",
    text: "These tourists are ruining the neighborhood.",
    groundTruth: "abuse",
    category: "borderline",
    predictions: {
      "logreg":     { verdict: "clean", confidence: 0.62 },
      "svm":        { verdict: "clean", confidence: 0.59 },
      "distilbert": { verdict: "clean", confidence: 0.71 },
      "roberta-ft": { verdict: "abuse", confidence: 0.66 },
    },
    note: "Out-group framing without slurs. Only the fine-tuned transformer catches it as borderline xenophobic.",
  },
  {
    id: "ex-06",
    text: "He plays football like a girl.",
    groundTruth: "abuse",
    category: "borderline",
    predictions: {
      "logreg":     { verdict: "clean", confidence: 0.78 },
      "svm":        { verdict: "clean", confidence: 0.72 },
      "distilbert": { verdict: "abuse", confidence: 0.61 },
      "roberta-ft": { verdict: "abuse", confidence: 0.81 },
    },
    note: "Sexist comparison. Classical models miss the implication; transformers learned the pattern from training data.",
  },
  {
    id: "ex-07",
    text: "OK boomer, sit down.",
    groundTruth: "abuse",
    category: "borderline",
    predictions: {
      "logreg":     { verdict: "clean", confidence: 0.81 },
      "svm":        { verdict: "clean", confidence: 0.79 },
      "distilbert": { verdict: "abuse", confidence: 0.54 },
      "roberta-ft": { verdict: "abuse", confidence: 0.58 },
    },
    note: "Generational dismissal — split verdict reflects genuine disagreement in human annotators.",
  },
  {
    id: "ex-08",
    text: "Stop being such a snowflake.",
    groundTruth: "abuse",
    category: "borderline",
    predictions: {
      "logreg":     { verdict: "clean", confidence: 0.85 },
      "svm":        { verdict: "clean", confidence: 0.82 },
      "distilbert": { verdict: "abuse", confidence: 0.63 },
      "roberta-ft": { verdict: "abuse", confidence: 0.77 },
    },
    note: "Coded pejorative. The token \"snowflake\" is innocuous in isolation but contextually charged.",
  },

  // ─── Clear abuse ───────────────────────────────────────
  {
    id: "ex-09",
    text: "You are completely worthless.",
    groundTruth: "abuse",
    category: "abuse",
    predictions: {
      "logreg":     { verdict: "abuse", confidence: 0.94 },
      "svm":        { verdict: "abuse", confidence: 0.92 },
      "distilbert": { verdict: "abuse", confidence: 0.97 },
      "roberta-ft": { verdict: "abuse", confidence: 0.99 },
    },
  },
  {
    id: "ex-10",
    text: "If I see you again I'll make you regret it.",
    groundTruth: "abuse",
    category: "abuse",
    predictions: {
      "logreg":     { verdict: "clean", confidence: 0.51 },
      "svm":        { verdict: "abuse", confidence: 0.56 },
      "distilbert": { verdict: "abuse", confidence: 0.89 },
      "roberta-ft": { verdict: "abuse", confidence: 0.95 },
    },
    note: "Veiled threat — no slurs, no obvious abuse tokens. Classical models split; transformers parse intent.",
  },
  {
    id: "ex-11",
    text: "Go back where you came from.",
    groundTruth: "abuse",
    category: "abuse",
    predictions: {
      "logreg":     { verdict: "clean", confidence: 0.67 },
      "svm":        { verdict: "clean", confidence: 0.60 },
      "distilbert": { verdict: "abuse", confidence: 0.79 },
      "roberta-ft": { verdict: "abuse", confidence: 0.93 },
    },
    note: "Xenophobic dog-whistle. The phrase is benign word-by-word — transformers learn the pattern.",
  },
  {
    id: "ex-12",
    text: "All of them are the same, you can't trust any.",
    groundTruth: "abuse",
    category: "abuse",
    predictions: {
      "logreg":     { verdict: "clean", confidence: 0.72 },
      "svm":        { verdict: "clean", confidence: 0.70 },
      "distilbert": { verdict: "abuse", confidence: 0.55 },
      "roberta-ft": { verdict: "abuse", confidence: 0.74 },
    },
    note: "Generalization without naming the group. Classical models see no slur and pass; transformers flag the framing.",
  },
];
