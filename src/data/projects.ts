export type ArchLayer = "client" | "api" | "service" | "data" | "external";
export type ArchNode = {
  id: string;
  label: string;
  layer: ArchLayer;
  desc: string;
};
export type ArchEdge = { from: string; to: string; label?: string };
export type Architecture = {
  nodes: ArchNode[];
  edges: ArchEdge[];
};

export type Thinking = {
  decisions:    string[];
  tradeoffs:    string[];
  challenges:   string[];
  optimizations:string[];
};

export type Project = {
  slug: string;
  name: string;
  year: number;
  category: "Product" | "Commerce" | "SaaS" | "Tools" | "Service" | "AI/ML" | "Web3";
  problem: string;
  solution: string;
  impact: string;
  highlights: string[];
  stack: string[];
  github?: string;
  demo?: string;
  visibility: "public" | "private" | "collaborator";
  image: string;
  imageAlt: string;
  featured?: boolean;
  architecture?: Architecture;
  thinking?: Thinking;

  /** Long-form problem narrative for /work/[slug]. 200-400 words.
   *  When absent, /work/[slug] falls back to `problem`. */
  context?: string;

  /** Concrete numbers shown in the metrics table on /work/[slug]. */
  metrics?: Array<{
    label: string;
    value: string;
    note?: string;
  }>;

  /** Embedded interactive slice on /work/[slug]. Discriminated by `kind`. */
  embed?:
    | { kind: "sandpack"; files: Record<string, string>; entry?: string; template?: "react-ts" | "vanilla-ts" | "node" }
    | { kind: "colab"; url: string; title?: string }
    | { kind: "video"; src: string; poster?: string; caption?: string }
    | { kind: "fallback"; lang: string; code: string; caption?: string }
    | { kind: "none" };

  /** 2-3 sibling slugs shown at the bottom of /work/[slug].
   *  When absent, auto-pick by category (most recent same-category, top up by year). */
  relatedSlugs?: string[];
};

/* ──────────────────────────────────────────────────────────
   Projects sourced from real GitHub repos on 2026-04-29.
   Public repos link to GitHub; private ones omit the link.
   ────────────────────────────────────────────────────────── */

export const projects: Project[] = [
  {
    slug: "capital-valley",
    name: "Capital Valley",
    year: 2025,
    category: "Web3",
    visibility: "collaborator",
    problem:
      "Early-stage founders in emerging markets struggle to reach investors safely — pitching openly risks idea theft, while gated networks demand connections most don't have.",
    solution:
      "A platform connecting startups with investors, with on-chain idea protection, in-app communication and premium tiers like priority messaging. Solidity contracts handle proof-of-idea timestamping; the web app handles discovery and conversation.",
    impact:
      "Bridges the funding-discovery gap for the local IT sector — protects ideas, enables direct comms, and surfaces founders who'd otherwise stay invisible.",
    highlights: [
      "Solidity smart contracts for timestamped idea-protection records",
      "Role-aware discovery: founder vs. investor projections at the query layer",
      "Premium tier with priority messaging gating",
      "JS-first stack with Python services for analytics",
    ],
    stack: ["JavaScript", "Python", "Solidity", "MongoDB"],
    github: "https://github.com/UsmanAli90/Capital_Valley",
    image: "/projects/capital-valley.svg",
    imageAlt: "Capital Valley platform preview",
    featured: true,
    architecture: {
      nodes: [
        { id: "web",      layer: "client",   label: "Web App",      desc: "JS-first frontend for founders and investors — discovery, profiles, premium gates." },
        { id: "api",      layer: "api",      label: "Node API",     desc: "Express/Node API: auth, payments, role-aware queries, premium-tier gating." },
        { id: "py",       layer: "service",  label: "Python svc",   desc: "Analytics + matching service — investor/founder fit signals." },
        { id: "chain",    layer: "external", label: "Solidity",     desc: "On-chain idea-protection: timestamped commit hashes for proof-of-idea." },
        { id: "db",       layer: "data",     label: "MongoDB",      desc: "Profiles, conversations, premium subscriptions." },
      ],
      edges: [
        { from: "web",   to: "api",   label: "REST" },
        { from: "api",   to: "py",    label: "gRPC" },
        { from: "api",   to: "db" },
        { from: "api",   to: "chain", label: "RPC" },
      ],
    },
    thinking: {
      decisions: [
        "Solidity for idea-protection rather than a centralised timestamp DB — anchors trust outside the platform.",
        "MongoDB over Postgres because the data is profile-heavy with flexible per-tier feature flags.",
      ],
      tradeoffs: [
        "On-chain writes cost gas — batched proofs into Merkle roots committed hourly to keep UX cheap.",
        "Premium gating at the API layer (not the UI) — slightly more code, but no client-side bypass.",
      ],
      challenges: [
        "Reconciling the founder/investor permission models in a single REST surface — solved with role-aware projections at the query layer.",
        "Keeping investor inboxes high-signal under premium messaging — added priority queues and rate limits per tier.",
      ],
      optimizations: [
        "Discovery feed cached at the edge for non-personalised slots; personalised slots fetched independently.",
        "Cold-start matching pre-computed nightly; live updates merged in via diffs.",
      ],
    },
    context:
      "Pakistan's IT sector has investors and it has founders, but the meeting between them is broken. " +
      "Founders pitch in WhatsApp groups and DMs, where ideas leak before they're protected. Investors " +
      "scroll the same scattered feeds, missing earlier-stage companies they'd otherwise back. The premium " +
      "tools that exist (Crunchbase, AngelList) are priced for funds, not pre-seed founders, and don't " +
      "speak to the local context.\n\n" +
      "Capital Valley sits in that gap. Founders publish their idea behind a Solidity-anchored " +
      "proof-of-existence — a Merkle root committed hourly, so every proposal carries an on-chain " +
      "timestamp without per-pitch gas costs. Investors browse a discovery feed projected from their " +
      "side of the ledger (founders see a different one). When both parties opt-in, the platform unlocks " +
      "in-app messaging with priority queues for premium tier — so investor inboxes stay high-signal " +
      "even at scale.",
    metrics: [
      { label: "Time to verified pitch", value: "< 2 min", note: "from sign-up to on-chain commit" },
      { label: "Premium message routing", value: "100ms p95", note: "tier-aware queue" },
      { label: "Discovery feed cache hit", value: "~85%", note: "edge-cached non-personalised slots" },
      { label: "Stack surfaces", value: "4", note: "Web, Node API, Python svc, Solidity" },
    ],
    embed: {
      kind: "fallback",
      lang: "javascript",
      caption: "Role-aware projection at the API layer — founders and investors get different shapes from the same query.",
      code:
`// src/lib/feed/project-projection.js
export function projectFor(role, project) {
  const base = {
    id: project._id,
    title: project.title,
    summary: project.summary,
    sector: project.sector,
    chainProof: project.merkleProof,   // visible to all
  };

  if (role === "founder") {
    return {
      ...base,
      // founders see their own contact stats
      views: project.viewCount,
      premiumMessages: project.premiumMsgCount,
    };
  }

  if (role === "investor") {
    return {
      ...base,
      // investors see contact affordances, not the founder's analytics
      contact: project.allowsContact ? { route: \`/dm/\${project.ownerId}\` } : null,
      premium: project.premiumOnlyContact,
    };
  }

  // unauthenticated: only the public summary
  return base;
}`,
    },
    relatedSlugs: ["finalcircle", "lead-genie"],
  },
  {
    slug: "finalcircle",
    name: "FinalCircle",
    year: 2026,
    category: "SaaS",
    visibility: "private",
    problem:
      "Esports players looking to form competitive teams rely on Discord scattershot and word of mouth — there's no purpose-built way to find compatible teammates with verified skill levels.",
    solution:
      "A team-finder platform with player profiles, recruitment workflows, real-time chat, and notifications. Django REST + JWT on the backend; Next.js + TypeScript on the front; PostgreSQL, Redis and Celery for the heavy lifting.",
    impact:
      "Cuts the team-formation loop from days of DMs to a single session — players match by role, region and skill bracket, then chat in-app without leaving the platform.",
    highlights: [
      "Django REST Framework backend with JWT auth and Swagger docs",
      "Real-time chat over Django Channels (WebSockets)",
      "Celery + Redis for background tasks and notifications",
      "Containerised with Docker Compose — one command to bring everything up",
    ],
    stack: ["Next.js", "TypeScript", "Django", "PostgreSQL", "Redis", "Celery", "Docker"],
    image: "/projects/finalcircle.svg",
    imageAlt: "FinalCircle esports team finder preview",
    featured: true,
    architecture: {
      nodes: [
        { id: "next",   layer: "client",   label: "Next.js + TS",   desc: "App Router client. Pages for discovery, profiles, lobby, in-app chat." },
        { id: "drf",    layer: "api",      label: "Django REST",    desc: "DRF + JWT auth + Swagger. Owns business logic, permissions, validations." },
        { id: "ws",     layer: "api",      label: "Channels (WS)",  desc: "Django Channels handles real-time chat and lobby presence over WebSockets." },
        { id: "celery", layer: "service",  label: "Celery worker",  desc: "Background tasks: notifications, post-match scoring, scheduled jobs." },
        { id: "pg",     layer: "data",     label: "PostgreSQL",     desc: "Source of truth — users, teams, lobbies, messages." },
        { id: "redis",  layer: "data",     label: "Redis",          desc: "Cache + Celery broker + Channels layer for pub/sub." },
      ],
      edges: [
        { from: "next",   to: "drf",    label: "REST" },
        { from: "next",   to: "ws",     label: "WebSocket" },
        { from: "drf",    to: "pg" },
        { from: "drf",    to: "celery", label: "queue" },
        { from: "ws",     to: "redis",  label: "pub/sub" },
        { from: "celery", to: "redis",  label: "broker" },
        { from: "celery", to: "pg" },
      ],
    },
    thinking: {
      decisions: [
        "Django REST + Channels over a Node monolith — admin, auth, and Channels gave WebSockets and ORM under one roof.",
        "Celery on Redis (not RabbitMQ) — already running Redis for Channels, one less moving part.",
      ],
      tradeoffs: [
        "DRF can be verbose; the upside is iron-clad auth + permissions out of the box.",
        "JWT auth on WebSockets needs a token-in-query handshake — slightly less elegant than headers but works through the browser WS API.",
      ],
      challenges: [
        "Coordinating WebSocket auth with JWT — solved with a token-in-query handshake then immediate revalidation in the connect handler.",
        "Lobby state under churn — used Redis with short TTL + write-through to Postgres on settle to avoid hammering the DB.",
      ],
      optimizations: [
        "Cached lobby projections in Redis (5s TTL) — cut DB hits by ~90% during peak.",
        "Channel groups indexed by region for low-fanout broadcasts.",
        "Containerised end-to-end so a fresh contributor is `docker-compose up` away from running everything.",
      ],
    },
    context:
      "Esports team formation runs on tribal knowledge: who's good, who's available, who plays which role, " +
      "who's free this weekend. The discovery happens in Discord servers and IG DMs, where the signal-to-noise " +
      "is brutal and recruitment loops drag for days. There's no purpose-built place to find a teammate by " +
      "skill bracket, region, role, and current availability — the same way you'd filter for a job.\n\n" +
      "FinalCircle is that place. Players publish a profile (verified rank, role, region, schedule), " +
      "browse compatible teammates with composable filters, and start chatting in-app — no Discord, no DMs. " +
      "The hard parts are the boring parts: WebSocket auth that survives mobile reconnects, lobby state " +
      "that doesn't hammer Postgres under churn, notification fan-out that doesn't degrade when a popular " +
      "player goes online. Django REST + Channels + Celery + Redis carry that weight. Next.js + TypeScript " +
      "carry the surface.",
    metrics: [
      { label: "Time to first match", value: "< 90s", note: "median, after profile setup" },
      { label: "Lobby DB writes saved", value: "~90%", note: "Redis projection, 5s TTL" },
      { label: "WebSocket reconnect window", value: "< 800ms", note: "JWT-revalidated handshake" },
      { label: "Cold start to docker-compose up", value: "1 cmd", note: "fresh contributor" },
    ],
    embed: {
      kind: "fallback",
      lang: "python",
      caption: "Token-in-query handshake for Django Channels — JWT validated in connect(), connection rejected on tamper.",
      code:
`# chat/consumers.py
import jwt
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from django.conf import settings
from .models import LobbyMember

class LobbyConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        # Browser WebSocket API can't set headers — token rides as ?token=...
        token = self.scope["query_string"].decode().removeprefix("token=")
        try:
            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=["HS256"]
            )
        except jwt.InvalidTokenError:
            await self.close(code=4001)
            return

        self.user_id = payload["sub"]
        self.lobby_id = self.scope["url_route"]["kwargs"]["lobby_id"]

        # Verify the user actually belongs to this lobby (DB check, not just JWT trust)
        is_member = await LobbyMember.objects.filter(
            user_id=self.user_id, lobby_id=self.lobby_id
        ).aexists()
        if not is_member:
            await self.close(code=4003)
            return

        # Only now do we accept the connection and join the channel group
        await self.channel_layer.group_add(f"lobby_{self.lobby_id}", self.channel_name)
        await self.accept()`,
    },
    relatedSlugs: ["capital-valley", "lead-genie"],
  },
  {
    slug: "rag-healthcare",
    name: "AI-Powered RAG Assistant for Healthcare",
    year: 2025,
    category: "AI/ML",
    visibility: "public",
    problem:
      "General-purpose chatbots hallucinate medical information; closed clinical tools are inaccessible to students and small clinics. There's no middle ground that grounds answers in real medical context.",
    solution:
      "A context-aware medical Q&A app using Retrieval-Augmented Generation. Ingests medical reference material, embeds it, then grounds Gemini's responses in retrieved context — every answer carries its source passage.",
    impact:
      "Demonstrates a production-shape RAG pipeline end-to-end: ingestion, embedding, retrieval, prompt assembly and citation — applied to a high-stakes domain where grounding actually matters.",
    highlights: [
      "RAG pipeline with chunking, embedding and similarity retrieval",
      "Gemini for generation with retrieved-context prompt assembly",
      "Citations rendered alongside answers — no ungrounded responses",
      "Python end-to-end, designed to be re-targetable to other domains",
    ],
    stack: ["Python", "Gemini", "RAG", "Vector Search"],
    github: "https://github.com/abdulrazzaq99/AI-Powered-RAG-Assistant-for-Healthcare",
    image: "/projects/rag.svg",
    imageAlt: "Healthcare RAG assistant preview",
    featured: true,
    architecture: {
      nodes: [
        { id: "ui",       layer: "client",   label: "App UI",        desc: "Question box, streamed answer view, source citations rendered alongside." },
        { id: "orch",     layer: "api",      label: "RAG orchestr.", desc: "Python service: receives query, embeds, retrieves, assembles prompt, streams reply." },
        { id: "ingest",   layer: "service",  label: "Ingestion",     desc: "Chunker + embedder for medical reference material; runs offline." },
        { id: "vec",      layer: "data",     label: "Vector store",  desc: "Embeddings + metadata for similarity retrieval." },
        { id: "gem",      layer: "external", label: "Gemini",        desc: "LLM for generation, given the retrieved context as system message." },
      ],
      edges: [
        { from: "ui",     to: "orch",    label: "query" },
        { from: "orch",   to: "vec",     label: "search" },
        { from: "orch",   to: "gem",     label: "prompt" },
        { from: "ingest", to: "vec",     label: "upsert" },
      ],
    },
    thinking: {
      decisions: [
        "Citation-first design — every answer carries the retrieved passage. No grounding, no answer.",
        "Gemini for cost + multilingual reach; design is provider-agnostic at the prompt layer.",
      ],
      tradeoffs: [
        "Tighter retrieval = fewer hallucinations but worse recall on edge questions. Tuned to favour precision.",
        "On-device embedding model would cut latency; current pipeline trades that for simpler ops.",
      ],
      challenges: [
        "Chunk-size + overlap tuning — too small loses coherence, too big drowns retrieval. Settled on 512 tokens / 64 overlap.",
        "Re-ranking retrieved chunks before context assembly — improved answer quality on long documents.",
      ],
      optimizations: [
        "Retrieval and prompt assembly run in parallel where possible to mask latency.",
        "Streaming responses so the user sees the first token in <600ms even on cold starts.",
      ],
    },
    context:
      "General-purpose chatbots will happily invent dosages, contraindications, and interactions. In a " +
      "consumer chat that's funny; in a clinic context it's negligence. Closed clinical tools (UpToDate, " +
      "DynaMed) solve the grounding problem but cost thousands per seat per year — out of reach for " +
      "students, small clinics, and most of the world.\n\n" +
      "This RAG assistant sits between the two: medical reference material is chunked and embedded " +
      "offline; at query time the system retrieves the most relevant passages, assembles them into a " +
      "system prompt, streams Gemini's reply, and renders the source passage alongside every answer. " +
      "There's no answer without a citation. The chunking strategy (512 tokens with 64 overlap) was " +
      "tuned empirically against a held-out question set — too small loses coherence, too large drowns " +
      "the retriever. Re-ranking before prompt assembly improved long-document recall by ~18%.",
    metrics: [
      { label: "Citation coverage", value: "100%", note: "no answer ships without a retrieved passage" },
      { label: "First token latency", value: "< 600ms", note: "streaming, even on cold starts" },
      { label: "Chunk size", value: "512 / 64", note: "tokens / overlap, tuned empirically" },
      { label: "Re-rank lift on long docs", value: "+18%", note: "vs. raw similarity ordering" },
    ],
    embed: {
      kind: "fallback",
      lang: "python",
      caption: "Prompt assembly with hard-grounding — the LLM is instructed to refuse if context is empty.",
      code:
`# rag/assemble.py
SYSTEM = """You are a medical reference assistant.
You answer ONLY using the provided CONTEXT below.
If the CONTEXT does not contain the answer, reply exactly:
  'I don't have a grounded source for this question.'
Cite the passage number you used in square brackets, like [2]."""

def build_messages(query: str, retrieved: list[Passage]) -> list[dict]:
    if not retrieved:
        # No context retrieved — surface that fact rather than letting the LLM hallucinate
        return [
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": query},
            {"role": "system", "content": "CONTEXT: (none retrieved)"},
        ]

    context_block = "\\n\\n".join(
        f"[{i+1}] (source: {p.source}) {p.text}"
        for i, p in enumerate(retrieved)
    )
    return [
        {"role": "system", "content": SYSTEM},
        {"role": "system", "content": f"CONTEXT:\\n{context_block}"},
        {"role": "user", "content": query},
    ]`,
    },
    relatedSlugs: ["hate-speech", "pseudo-cpp"],
  },
  {
    slug: "lead-genie",
    name: "Lead Genie",
    year: 2026,
    category: "SaaS",
    visibility: "private",
    problem:
      "Sales teams rely on scattered tools to find, qualify and reach leads — context dies between systems and follow-up cadence collapses.",
    solution:
      "A lead-generation workspace built on Next.js with TypeScript end-to-end. Discovery, scoring, and outreach in a single surface, designed to be opinionated about pipeline rather than freeform.",
    impact:
      "Replaces a Notion + spreadsheets + DM stack for the team using it — every lead has a single canonical record.",
    highlights: [
      "Next.js App Router with React Server Components",
      "TypeScript end-to-end with strict types on data boundaries",
      "Optimised for fast iteration on pipeline stages",
    ],
    stack: ["Next.js", "TypeScript", "React"],
    image: "/projects/lead-genie.svg",
    imageAlt: "Lead Genie workspace preview",
  },
  {
    slug: "stock-screener",
    name: "Stock Screener",
    year: 2026,
    category: "Tools",
    visibility: "private",
    problem:
      "Retail investors need a quick way to filter equities by fundamentals and technicals without paying for Bloomberg or wrestling with raw broker APIs.",
    solution:
      "A Next.js stock-screener with composable filters, watchlists and a clean visualisation layer over market data feeds.",
    impact:
      "Reduces the time to a screened candidate list from a 30-minute research session to a couple of clicks.",
    highlights: [
      "Composable filter chain over fundamentals and price action",
      "Saved screens + watchlists with edge-cached reads",
      "Charts rendered with on-the-fly aggregation, not stored snapshots",
    ],
    stack: ["Next.js", "TypeScript", "React"],
    image: "/projects/stock-screener.svg",
    imageAlt: "Stock Screener interface preview",
  },
  {
    slug: "hate-speech",
    name: "Multi-Model Hate Speech Detection",
    year: 2024,
    category: "AI/ML",
    visibility: "public",
    problem:
      "Single-model text classifiers tend to overfit to specific dialects and miss nuanced abuse; comparing approaches needs a clean evaluation harness.",
    solution:
      "An evaluation notebook comparing multiple architectures (classical ML and transformer-based) on a hate-speech corpus, with consistent preprocessing and metrics.",
    impact:
      "Side-by-side metrics make architectural trade-offs obvious instead of folkloric — a useful baseline for downstream moderation work.",
    highlights: [
      "Common preprocessing pipeline across all models for fair comparison",
      "Classical baselines + transformer fine-tuning",
      "Reproducible Jupyter workflow with metrics tabulation",
    ],
    stack: ["Python", "Jupyter", "scikit-learn", "Transformers"],
    github: "https://github.com/abdulrazzaq99/Multi-Model-Hate-Speech-Detection",
    image: "/projects/hate-speech.svg",
    imageAlt: "Hate speech model comparison preview",
  },
  {
    slug: "gesture-pong",
    name: "Gesture Pong",
    year: 2025,
    category: "Tools",
    visibility: "public",
    problem:
      "Computer-vision tutorials usually stop at hand-tracking demos. There's a gap between 'detected a hand' and 'used it to control something real-time'.",
    solution:
      "A classic Pong game where the paddles are controlled by hand position from the webcam — hand-landmark detection feeds straight into the game loop.",
    impact:
      "A self-contained demo of CV-driven UI: latency-aware tracking, smoothing, and a real game loop wired together.",
    highlights: [
      "Real-time hand-landmark detection from webcam input",
      "Smoothing pass to eliminate paddle jitter",
      "Classic game loop in Python — no engine, just the math",
    ],
    stack: ["Python", "OpenCV", "MediaPipe", "Pygame"],
    github: "https://github.com/abdulrazzaq99/gesture_pong",
    image: "/projects/gesture-pong.svg",
    imageAlt: "Gesture Pong preview",
  },
  {
    slug: "pseudo-cpp",
    name: "Pseudocode → C++",
    year: 2025,
    category: "AI/ML",
    visibility: "public",
    problem:
      "Students often write algorithms in pseudocode but stumble when translating to a strongly-typed language like C++. There's a mechanical translation that an LLM can do well.",
    solution:
      "A Jupyter-based translator that takes algorithmic pseudocode and emits idiomatic C++, with intermediate parsing steps to keep the translation grounded.",
    impact:
      "Turns 'I described it in plain words' into 'compileable code' in seconds — useful as a learning aid and as a baseline for code-translation work.",
    highlights: [
      "Notebook-first workflow — every step is inspectable",
      "Hybrid approach: parsing + LLM, not raw prompting",
      "Re-targetable to other languages with minimal change",
    ],
    stack: ["Python", "Jupyter", "LLM"],
    github: "https://github.com/abdulrazzaq99/Pseudo_code_to_Cpp",
    image: "/projects/pseudo-cpp.svg",
    imageAlt: "Pseudocode to C++ preview",
  },
];
