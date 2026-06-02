import { SectionWrapper } from "@/components/layout/section-wrapper";
import { SectionHeader } from "@/components/layout/section-header";

const principles = [
  { title: "Backend instinct", body: "Schemas, queues, contracts. The infrastructure thinks first; the UI follows." },
  { title: "Ship in slices", body: "Small, frequent merges over heroic releases. Every PR moves the needle by inches." },
  { title: "Editor over canvas", body: "Code is the artifact. The product is the proof. Polish at the margin compounds." },
];

export function About() {
  return (
    <SectionWrapper id="about" containerSize="wide">
      <SectionHeader
        num="01"
        section="SECTION"
        keywords={["PROFILE", "BIO", "INDEX"]}
        title={{ left: "ABOUT", right: "ME" }}
        subSpec={{ num: "01", label: "PROFILE", meta: "three principles · backend, slices, editor" }}
      />

      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
        {/* Narrative column */}
        <div>
          <h3 className="text-balance text-[clamp(28px,3.6vw,48px)] font-bold leading-[1.05] tracking-[-0.025em] text-[var(--color-ink)]">
            Backend-leaning full-stack engineer<span className="text-[var(--color-primary-glow)]">.</span>
          </h3>

          <div className="mt-8 max-w-[60ch] space-y-5 text-[15.5px] leading-[1.7] text-[var(--color-ink-soft)] sm:text-[16.5px]">
            <p>
              ~3 years building applications that ship. Django and Node on the
              server, Next.js on the client, with a soft spot for AI/ML and
              real-time systems.
            </p>
            <p>
              Currently full-stack at Infinitiv AI in Karachi. Previously
              shipped end-to-end features at Nexterse and Motorlytix. Always
              picking up the boring parts of the stack first — auth, schemas,
              caching, observability — because that's where the deltas live.
            </p>
          </div>
        </div>

        {/* Principles list */}
        <div>
          <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
            ↳ Operating principles
          </span>
          <ol className="mt-4 divide-y divide-[var(--color-line)] border-y border-[var(--color-line)]">
            {principles.map((p, i) => (
              <li key={p.title} className="grid grid-cols-[40px_1fr] gap-4 py-5">
                <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-primary-glow)]">
                  N°{String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="text-[14.5px] font-semibold tracking-tight text-[var(--color-ink)]">
                    {p.title}
                  </h4>
                  <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-ink-soft)]">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </SectionWrapper>
  );
}
