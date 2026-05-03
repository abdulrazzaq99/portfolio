export type Experience = {
  start: string;
  end: string;
  role: string;
  org: string;
  location: string;
  impact: string[];
};

export const experiences: Experience[] = [
  {
    start: "Oct 2025",
    end: "Now",
    role: "Full Stack Developer",
    org: "Infinitiv AI",
    location: "Remote",
    impact: [
      "Building full-stack applications with a focus on AI-driven product features.",
      "Working across the stack — TypeScript / Next.js on the client, Python and Node services on the backend.",
    ],
  },
  {
    start: "Sep 2025",
    end: "Oct 2025",
    role: "Full Stack Developer",
    org: "Nexterse",
    location: "Remote",
    impact: [
      "Short-term contract delivering full-stack features end-to-end.",
      "Owned both UI surfaces and backing services on a tight timeline.",
    ],
  },
  {
    start: "Apr 2025",
    end: "Aug 2025",
    role: "Full Stack Developer · Internship",
    org: "Motorlytix",
    location: "Remote · Collaborator on muneebdev47/motorlytix-app",
    impact: [
      "Internship working on the Motorlytix application — automotive analytics product.",
      "Collaborator on the production codebase, shipping features alongside the core team.",
    ],
  },
];
