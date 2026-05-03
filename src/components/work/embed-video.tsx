type Props = {
  src: string;
  poster?: string;
  caption?: string;
};

export function EmbedVideo({ src, poster, caption }: Props) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-terminal)]">
      <video
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        className="block h-auto w-full"
      />
      {caption && (
        <figcaption className="border-t border-[var(--color-line)] px-4 py-3 text-[12.5px] leading-relaxed text-[var(--color-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
