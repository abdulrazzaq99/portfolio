type Props = {
  lang: string;
  code: string;
  caption?: string;
};

export function EmbedFallback({ lang, code, caption }: Props) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-terminal)]">
      <header className="flex items-center justify-between border-b border-[var(--color-line)] px-4 py-2">
        <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
          ↳ {lang}
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-primary-glow)]">
          ● snippet
        </span>
      </header>
      <pre className="overflow-x-auto p-5 font-[family-name:var(--font-mono)] text-[12.5px] leading-relaxed text-[var(--color-ink-soft)]">
        <code>{code}</code>
      </pre>
      {caption && (
        <figcaption className="border-t border-[var(--color-line)] px-4 py-3 text-[12.5px] leading-relaxed text-[var(--color-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
