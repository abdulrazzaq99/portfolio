import { SectionWrapper } from "@/components/layout/section-wrapper";

const strengths = [
  {
    title: "Design-led engineering",
    body: "I prototype in the browser early. Every pixel choice is paired with a runtime cost — and I think about both.",
  },
  {
    title: "Owner mindset",
    body: "From schemas to splines. I take problems through end-to-end, talk to users, and ship small often.",
  },
];

/**
 * About — single editorial column. No glass card, no orb, no comment-bracket
 * trick. The hero set the typographic tone; About continues it with calmer
 * weight. Content is unchanged — only the chrome was stripped.
 */
export function About() {
  return (
    <SectionWrapper id="about" eyebrow={{ num: "01", label: "About" }}>
      <div className="grid gap-16 lg:grid-cols-[2fr_1fr] lg:gap-24">
        {/* Main column — narrative */}
        <div>
          <h2 className="text-balance font-[family-name:var(--font-display)] text-[clamp(36px,5vw,72px)] font-normal leading-[1.05] tracking-[-0.02em] text-[var(--color-ink)]">
            I treat the browser like a{" "}
            <span className="italic">stage</span> — every motion, every margin, on purpose.
          </h2>

          <div className="mt-12 max-w-[60ch] space-y-6 text-[15.5px] leading-[1.7] text-[var(--color-ink-soft)] sm:text-[17px]">
            <p>
              Two years deep, still chasing the same thing: interfaces that
              feel{" "}
              <em className="font-medium text-[var(--color-ink)] not-italic">
                inevitable
              </em>
              . I work the full stack — schemas to splines, queries to curves —
              with a bias toward motion, accessibility and the small details
              that compound across releases.
            </p>
            <p>
              My favourite kind of project: a real product, real users, and the
              freedom to sweat the last 10% — because that's where premium
              lives.
            </p>
          </div>
        </div>

        {/* Side column — strengths as text rows, not cards */}
        <div className="space-y-10 lg:pt-2">
          {strengths.map((s, i) => (
            <div
              key={s.title}
              className="border-t border-[var(--color-line)] pt-5"
            >
              <div className="flex items-baseline gap-3 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                <span className="text-[var(--color-primary-glow)]">
                  0{i + 1}
                </span>
                <span>{s.title}</span>
              </div>
              <p className="mt-3 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
