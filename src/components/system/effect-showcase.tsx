type Effect = {
  name: string;
  className: string;
  description: string;
};

const EFFECTS: Effect[] = [
  { name: "glass",           className: "glass",           description: "Subtle wash on the page surface. 14px blur. Quiet." },
  { name: "glass-elevated",  className: "glass-elevated",  description: "Stronger wash for elevated controls (toggles, ghost buttons)." },
];

export function EffectShowcase() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {EFFECTS.map((e) => (
        <div key={e.name} className="space-y-3">
          <div
            className={`${e.className} relative h-32 rounded-2xl p-4 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] text-[var(--color-ink-soft)]`}
          >
            .{e.name}
          </div>
          <p className="text-[12.5px] leading-relaxed text-[var(--color-muted)]">
            {e.description}
          </p>
        </div>
      ))}
    </div>
  );
}
