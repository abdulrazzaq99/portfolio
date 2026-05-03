type Effect = {
  name: string;
  className: string;
  description: string;
};

const EFFECTS: Effect[] = [
  { name: "glass",           className: "glass",           description: "Subtle white wash on dark, 18px blur, soft inset highlight." },
  { name: "glass-elevated",  className: "glass-elevated",  description: "Stronger wash, 24px blur — used for cards lifted above ambient." },
  { name: "gradient-border", className: "gradient-border", description: "Animated 1px conic-style border. Brightens on hover." },
  { name: "shimmer",         className: "shimmer",         description: "Diagonal sweep on hover. Hover the tile to see it." },
  { name: "neon-glow",       className: "neon-glow",       description: "Outer + spread shadow in neon emerald. The hero CTA's hover state." },
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
