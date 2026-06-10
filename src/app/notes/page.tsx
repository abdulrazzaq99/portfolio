import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { publishedNotes, type Note } from "@/content/notes";

export const metadata: Metadata = {
  title: "Notes",
  description: "Essays on engineering, design systems, and the work that compounds.",
  openGraph: {
    title: "Notes — Abdul Razzaq",
    description: "Essays on engineering, design systems, and the work that compounds.",
    images: ["/og/default"],
  },
};

export default function NotesIndexPage() {
  const notes = publishedNotes();
  // Take the first published note as the featured callout (if it has an excerpt).
  const featured = notes[0]?.meta.excerpt ? notes[0] : undefined;
  const rest = featured ? notes.slice(1) : notes;

  return (
    <main className="relative pt-32 pb-32 sm:pt-40 sm:pb-44">
      <Container>
        <SectionHeader
          num="07"
          section="SECTION"
          keywords={["WRITING", "FEED", "INDEX"]}
          title={{ left: "WRITING", right: "NOTES" }}
          subSpec={{
            num: "07",
            label: "NOTES",
            meta: `${notes.length} ${notes.length === 1 ? "essay" : "essays"} · short, irregular`,
          }}
        />

        <p className="-mt-8 mb-16 max-w-[60ch] text-[17px] leading-[1.6] text-[var(--color-ink-soft)] sm:text-[18px]">
          Essays on engineering, the design system behind this site, and the
          work that compounds. Short, irregular, written when something is
          worth saying.
        </p>

        {featured && <FeaturedNote note={featured} />}

        {/* List */}
        {rest.length > 0 ? (
          <ul className="mt-10 flex flex-col">
            {rest.map((note) => (
              <li key={note.meta.slug}>
                <Link
                  href={`/notes/${note.meta.slug}`}
                  className="group grid gap-3 border-t border-[var(--color-line)] py-8 last:border-b sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-12"
                >
                  <div>
                    <h2 className="text-[22px] font-medium tracking-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-primary-glow)] sm:text-[26px]">
                      {note.meta.title}
                    </h2>
                    <p className="mt-2 max-w-[64ch] text-[14.5px] leading-relaxed text-[var(--color-ink-soft)] sm:text-[15.5px]">
                      {note.meta.dek}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    <span>{note.meta.readTime}</span>
                    <ArrowUpRight
                      size={14}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          !featured && (
            <div className="mt-20 border-t border-[var(--color-line)] pt-10">
              <p className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                ↳ No published notes yet — drafts in flight.
              </p>
            </div>
          )
        )}
      </Container>
    </main>
  );
}

/**
 * Featured note — top of the index. Title + dek + a pull-quote excerpt with
 * an emerald left bar (the only place excerpts surface).
 */
function FeaturedNote({ note }: { note: Note }) {
  const dateLabel = new Date(note.meta.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return (
    <Link
      href={`/notes/${note.meta.slug}`}
      className="group block border border-[var(--color-line-strong)] bg-[var(--color-bg)] p-7 transition-colors hover:border-[var(--color-primary-glow)]/60 sm:p-9"
    >
      {/* Featured strip */}
      <div className="flex items-center justify-between font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
        <span className="inline-flex items-center gap-2">
          <span className="text-[var(--color-primary-glow)]">▸</span>
          <span className="text-[var(--color-primary-glow)]">FEATURED</span>
          <span className="text-[var(--color-muted-2)]">·</span>
          <span>OPENING</span>
        </span>
        <span>
          {dateLabel}
          <span className="mx-2 text-[var(--color-muted-2)]">·</span>
          {note.meta.readTime} read
        </span>
      </div>

      {/* Title */}
      <h2 className="mt-6 text-balance text-[28px] font-semibold tracking-tight text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-primary-glow)] sm:text-[34px]">
        {note.meta.title}
      </h2>

      {/* Pull-quote excerpt */}
      {note.meta.excerpt && (
        <blockquote className="mt-6 border-l-2 border-[var(--color-primary-glow)] pl-5">
          <p className="text-[15.5px] italic leading-[1.65] text-[var(--color-ink-soft)] sm:text-[17px]">
            {note.meta.excerpt}
          </p>
          <footer className="mt-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted-2)]">
            § Excerpt
          </footer>
        </blockquote>
      )}

      {/* Footer CTA */}
      <div className="mt-6 inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-ink-soft)] transition-colors group-hover:text-[var(--color-primary-glow)]">
        <span className="border-b border-[var(--color-line-strong)] pb-0.5 group-hover:border-[var(--color-primary-glow)]">
          Read the essay
        </span>
        <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
