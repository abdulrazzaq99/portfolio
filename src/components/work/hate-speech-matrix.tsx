"use client";

import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { MODELS, examples, type Example, type ModelKey, type Verdict } from "@/data/hate-speech-demo";
import { cn } from "@/lib/utils";

/**
 * HateSpeechMatrix — interactive "try it" widget for the multi-model hate
 * speech detection case study.
 *
 * Visitor picks an example sentence; the grid shows what each of the four
 * trained models predicted, with confidence + agreement-with-ground-truth.
 * Pure client-side — no inference, no API calls. Predictions are looked up
 * from a static file (src/data/hate-speech-demo.ts) so the widget is
 * cost-free to host and instant to render.
 *
 * The point is the comparison story: where classical bag-of-words models
 * disagree with transformers, and why.
 */
export function HateSpeechMatrix() {
  const [activeId, setActiveId] = useState<string>(examples[0]?.id ?? "");
  const active = useMemo(
    () => examples.find((e) => e.id === activeId) ?? examples[0],
    [activeId],
  );
  if (!active) return null;

  const allAgree = MODELS.every(
    (m) => active.predictions[m.key].verdict === active.groundTruth,
  );
  const disagreeCount = MODELS.filter(
    (m) => active.predictions[m.key].verdict !== active.groundTruth,
  ).length;

  return (
    <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg)]/40 p-5 sm:p-7">
      {/* Header strip */}
      <div className="mb-5 flex items-baseline justify-between border-b border-[var(--color-line)] pb-3 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
        <span>
          <span className="text-[var(--color-primary-glow)]">●</span>
          <span className="ml-2">PLATE · COMPARE</span>
        </span>
        <span>{MODELS.length} models · {examples.length} examples</span>
      </div>

      {/* Example picker */}
      <fieldset>
        <legend className="mb-2 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
          ↳ Pick an example
        </legend>
        <select
          value={active.id}
          onChange={(e) => setActiveId(e.target.value)}
          className="w-full border border-[var(--color-line-strong)] bg-[var(--color-bg)] px-3 py-2.5 font-[family-name:var(--font-mono)] text-[12.5px] text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-primary-glow)]"
        >
          {(["clean", "borderline", "abuse"] as const).map((cat) => (
            <optgroup
              key={cat}
              label={`── ${cat.toUpperCase()} ──`}
            >
              {examples
                .filter((e) => e.category === cat)
                .map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.text}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </fieldset>

      {/* Active sentence + ground truth */}
      <div className="mt-5 border border-[var(--color-line)] bg-[var(--color-bg)] p-4">
        <div className="flex items-center justify-between font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted-2)]">
          <span>INPUT</span>
          <span>
            <span>GROUND TRUTH · </span>
            <span
              className={cn(
                active.groundTruth === "abuse"
                  ? "text-[oklch(0.75_0.18_25)]"
                  : "text-[var(--color-primary-glow)]",
              )}
            >
              {active.groundTruth.toUpperCase()}
            </span>
          </span>
        </div>
        <p className="mt-2 text-[15px] italic leading-relaxed text-[var(--color-ink)]">
          “{active.text}”
        </p>
      </div>

      {/* Model grid */}
      <div className="mt-5 overflow-hidden border border-[var(--color-line)]">
        <div className="hidden border-b border-[var(--color-line)] bg-[var(--color-bg-2)] px-4 py-2.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)] md:grid md:grid-cols-[1.4fr_0.8fr_1.4fr_0.4fr] md:gap-4">
          <span>Model</span>
          <span>Verdict</span>
          <span>Confidence</span>
          <span aria-hidden />
        </div>
        <ul className="divide-y divide-[var(--color-line)]">
          {MODELS.map((model) => {
            const pred = active.predictions[model.key];
            const agrees = pred.verdict === active.groundTruth;
            return (
              <li
                key={model.key}
                className="grid grid-cols-[1fr_auto] gap-3 px-4 py-4 md:grid-cols-[1.4fr_0.8fr_1.4fr_0.4fr] md:items-center md:gap-4"
              >
                {/* Model name + arch */}
                <div className="min-w-0">
                  <div className="text-[14px] font-medium tracking-tight text-[var(--color-ink)]">
                    {model.label}
                  </div>
                  <div className="mt-0.5 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted-2)]">
                    {model.arch}
                  </div>
                </div>

                {/* Verdict pill */}
                <div className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] md:order-none">
                  <VerdictPill verdict={pred.verdict} />
                </div>

                {/* Confidence bar */}
                <div className="col-span-2 mt-2 md:col-span-1 md:mt-0">
                  <ConfidenceBar value={pred.confidence} verdict={pred.verdict} />
                </div>

                {/* Agree indicator */}
                <div className="hidden md:flex md:items-center md:justify-end">
                  {agrees ? (
                    <Check size={14} className="text-[var(--color-primary-glow)]" />
                  ) : (
                    <X size={14} className="text-[oklch(0.65_0.18_25)]" />
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer: agreement summary + optional note */}
      <div className="mt-4 space-y-3">
        <p className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
          {allAgree ? (
            <>
              <span className="text-[var(--color-primary-glow)]">●</span>{" "}
              All {MODELS.length} models agree with ground truth.
            </>
          ) : (
            <>
              <span className="text-[oklch(0.7_0.18_25)]">●</span>{" "}
              {disagreeCount} of {MODELS.length}{" "}
              {disagreeCount === 1 ? "model disagrees" : "models disagree"} with ground truth.
            </>
          )}
        </p>
        {active.note && (
          <p className="border-l-2 border-[var(--color-primary-glow)] pl-4 text-[13.5px] italic leading-relaxed text-[var(--color-ink-soft)]">
            {active.note}
          </p>
        )}
      </div>

      {/* Sample-data disclosure */}
      <p className="mt-5 font-[family-name:var(--font-mono)] text-[9.5px] uppercase tracking-[0.22em] text-[var(--color-muted-2)]">
        ↳ Sample predictions for illustration · swap with notebook outputs in
        <span className="text-[var(--color-muted)]"> src/data/hate-speech-demo.ts</span>
      </p>
    </div>
  );
}

function VerdictPill({ verdict }: { verdict: Verdict }) {
  const isAbuse = verdict === "abuse";
  return (
    <span
      className={cn(
        "inline-flex items-center border px-2 py-1",
        isAbuse
          ? "border-[oklch(0.65_0.18_25_/_0.45)] text-[oklch(0.75_0.18_25)]"
          : "border-[var(--color-primary-glow)]/45 text-[var(--color-primary-glow)]",
      )}
    >
      {verdict}
    </span>
  );
}

function ConfidenceBar({ value, verdict }: { value: number; verdict: Verdict }) {
  const pct = Math.round(value * 100);
  const isAbuse = verdict === "abuse";
  return (
    <div className="space-y-1">
      <div className="relative h-1.5 w-full overflow-hidden bg-[var(--color-line)]">
        <div
          className={cn(
            "absolute inset-y-0 left-0 transition-[width] duration-300",
            isAbuse ? "bg-[oklch(0.65_0.18_25)]" : "bg-[var(--color-primary-glow)]",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="font-[family-name:var(--font-mono)] text-[10.5px] tracking-tight tabular-nums text-[var(--color-muted)]">
        {pct}%
      </div>
    </div>
  );
}
