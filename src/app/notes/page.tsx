import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/container";
import { publishedNotes } from "@/content/notes";

export const metadata: Metadata = {
  title: "Notes — Abdul Razzaq",
  description: "Essays on engineering, design systems, and the work that compounds.",
  openGraph: {
    title: "Notes — Abdul Razzaq",
    description: "Essays on engineering, design systems, and the work that compounds.",
    images: ["/og/default"],
  },
};

export default function NotesIndexPage() {
  const notes = publishedNotes();

  return (
    <main className="relative pt-32 pb-32 sm:pt-40 sm:pb-44">
      <Container>
        {/* Eyebrow */}
        <div className="mb-8 flex items-center gap-3 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.16em] text-[var(--color-muted)]">
          <span className="text-[var(--color-primary-glow)]">N°</span>
          <span className="text-[var(--color-ink)]">05</span>
          <span className="text-[var(--color-muted-2)]">—</span>
          <span className="uppercase">Notes</span>
          <span className="ml-2 inline-block h-px flex-1 max-w-[120px] bg-gradient-to-r from-[var(--color-line-strong)] to-transparent" />
        </div>

        {/* Title */}
        <h1 className="text-balance font-[family-name:var(--font-display)] text-[clamp(48px,7vw,108px)] font-normal leading-[0.96] tracking-[-0.02em] text-[var(--color-ink)]">
          Notes
          <span
            className="text-[var(--color-primary-glow)]"
            style={{ textShadow: "0 0 18px oklch(0.86 0.27 152 / 0.5)" }}
          >.</span>
        </h1>

        <p className="mt-6 max-w-[60ch] text-[17px] leading-[1.6] text-[var(--color-ink-soft)] sm:text-[18px]">
          Essays on engineering, the design system behind this site, and the
          work that compounds. Short, irregular, written when something is
          worth saying.
        </p>

        {/* List */}
        {notes.length > 0 ? (
          <ul className="mt-20 flex flex-col">
            {notes.map((note) => (
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
          <div className="mt-20 border-t border-[var(--color-line)] pt-10">
            <p className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              ↳ No published notes yet — drafts in flight.
            </p>
          </div>
        )}
      </Container>
    </main>
  );
}
