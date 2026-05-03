export type QA = {
  q: string;
  a: string;
  /** Optional follow-up CTA */
  cta?: { label: string; href: string };
  category: "Work" | "Stack" | "Process" | "Hiring";
};

export const qa: QA[] = [
  {
    category: "Work",
    q: "What kind of work are you looking for?",
    a:
      "Full-stack engineering on real products — ideally with an AI/ML or real-time angle. I'm comfortable owning a feature end-to-end (schema → API → UI → ship) and I'm at my best on small teams that ship weekly. Open to remote roles, contracts, and async collaboration across timezones.",
    cta: { label: "Get in touch", href: "#contact" },
  },
  {
    category: "Stack",
    q: "You list both Django and Next.js — when do you pick which?",
    a:
      "Django when the product is data-heavy, needs an admin out of the box, or has complex permission rules — DRF + Django's batteries beat reinventing them. Next.js when the experience is the product: fast, animated, SEO-sensitive, or edge-cached. I've shipped them together (FinalCircle: Next.js client, Django REST + Channels backend) when each side wins on its strengths.",
  },
  {
    category: "Stack",
    q: "What's your most interesting AI project?",
    a:
      "The Healthcare RAG assistant. End-to-end retrieval pipeline — chunking, embeddings, similarity retrieval, prompt assembly with Gemini — applied to a domain where ungrounded answers genuinely matter. Every response renders its source passage. The architecture is re-targetable to any reference-heavy domain.",
    cta: { label: "See the repo", href: "https://github.com/abdulrazzaq99/AI-Powered-RAG-Assistant-for-Healthcare" },
  },
  {
    category: "Process",
    q: "How do you ship fast without breaking things?",
    a:
      "Three rules. (1) Small commits, deploy on green — every push goes to a preview URL. (2) Performance and accessibility are release-gates, not chores: Lighthouse + a11y audits run in CI. (3) Treat the schema as the contract — once it's stable, both sides move independently. The boring work is the speed.",
  },
  {
    category: "Process",
    q: "Performance is mentioned a lot — give me a concrete example.",
    a:
      "Sure. On the Nimbus dashboard I custom-rendered a chart layer in Canvas after the React + recharts version dropped frames at ~5k points. Switched to a flat typed-array data model + offscreen-canvas rendering, RAF batching, and only re-rendered changed regions. P95 paint dropped from ~280ms to ~38ms; held 60fps with 50k points.",
  },
  {
    category: "Stack",
    q: "Why both Python and TypeScript?",
    a:
      "Different tools for different jobs. Python for data, ML, scraping, anything where the ecosystem is in pandas/sklearn/torch. TypeScript for the surface — UI, API contracts, anything that benefits from end-to-end types. The sweet spot is a TS frontend talking to a Python service for the AI parts and a TS service for the rest.",
  },
  {
    category: "Hiring",
    q: "Are you available for short engagements?",
    a:
      "Yes — short well-scoped projects are a great fit. Examples: a 2-week perf audit, a one-month RSC migration, a contained AI feature with a clear acceptance test. I prefer projects where the bar is 'production', not 'prototype'.",
    cta: { label: "Email me", href: "mailto:abdulrazzaq.dev@gmail.com" },
  },
  {
    category: "Hiring",
    q: "Where are you based, and how do you work async?",
    a:
      "Karachi, Pakistan (UTC+5). Most of my work is async with US/EU/GCC clients — I write things down, prefer PR-driven decisions, and overlap a few hours daily for sync calls. Mornings here are afternoons in Europe and the start of the day in the GCC.",
  },
];
