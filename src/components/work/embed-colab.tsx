type Props = {
  url: string;
  title?: string;
};

export function EmbedColab({ url, title }: Props) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-terminal)]">
      <header className="flex items-center justify-between border-b border-[var(--color-line)] px-4 py-2">
        <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
          ↳ google colab notebook
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-primary-glow)] hover:underline"
        >
          open in colab →
        </a>
      </header>
      <iframe
        src={url}
        title={title ?? "Colab notebook"}
        className="h-[520px] w-full border-0"
        sandbox="allow-scripts allow-same-origin allow-popups"
        loading="lazy"
      />
    </figure>
  );
}
