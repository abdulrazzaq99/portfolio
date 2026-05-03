export type Proficiency = "Advanced" | "Intermediate" | "Practical";

export type Skill = {
  name: string;
  level: Proficiency;
  note?: string;
};

export type SkillGroup = {
  id: string;
  title: string;
  blurb: string;
  items: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    blurb: "Component systems, motion, accessibility — interfaces that feel designed, not assembled.",
    items: [
      { name: "React",        level: "Advanced", note: "19 + Server Components" },
      { name: "Next.js",      level: "Advanced", note: "App Router, RSC, Edge" },
      { name: "TypeScript",   level: "Advanced" },
      { name: "Tailwind CSS", level: "Advanced", note: "v4, design tokens" },
      { name: "Motion",       level: "Intermediate", note: "framer-motion" },
      { name: "GSAP",         level: "Intermediate" },
      { name: "Vue / Nuxt",   level: "Practical" },
    ],
  },
  {
    id: "backend",
    title: "Backend",
    blurb: "APIs that age well, schemas that survive contact with reality.",
    items: [
      { name: "Node.js",     level: "Advanced" },
      { name: "Express",     level: "Advanced" },
      { name: "MongoDB",     level: "Advanced", note: "+ Mongoose, aggregation" },
      { name: "PostgreSQL",  level: "Intermediate", note: "+ pgvector" },
      { name: "Redis",       level: "Intermediate" },
      { name: "GraphQL",     level: "Intermediate" },
      { name: "NestJS",      level: "Practical" },
    ],
  },
  {
    id: "ai-ml",
    title: "AI / ML",
    blurb: "LLM application engineering — RAG, agents, streaming, evals.",
    items: [
      { name: "OpenAI SDK",   level: "Advanced" },
      { name: "Vercel AI",    level: "Intermediate", note: "streaming, tools" },
      { name: "LangChain",    level: "Intermediate" },
      { name: "pgvector",     level: "Intermediate" },
      { name: "Python",       level: "Intermediate", note: "FastAPI, pandas" },
      { name: "Embeddings",   level: "Practical" },
    ],
  },
  {
    id: "tools",
    title: "Platform & Tools",
    blurb: "Localhost to live. CI, containers, observability — and the discipline to ship small.",
    items: [
      { name: "Docker",         level: "Intermediate" },
      { name: "GitHub Actions", level: "Intermediate" },
      { name: "Vercel",         level: "Advanced" },
      { name: "AWS",            level: "Practical", note: "S3, Lambda, CloudFront" },
      { name: "Sentry",         level: "Intermediate" },
      { name: "Figma",          level: "Intermediate" },
    ],
  },
];
