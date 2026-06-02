/**
 * Hero artifact — small "PLATE · 01" cataloging card with a custom SVG.
 *
 * The graphic is a stylized 5-node system topology (CLIENT → API → DB,
 * with QUEUE branching from API and CACHE feeding DB). Picked because it
 * literally illustrates the "backend instinct" framing in the About copy
 * — and reads as code/infra without being generic.
 */
export function HeroArtifact() {
  return (
    <figure className="relative border border-[var(--color-line-strong)] bg-[var(--color-bg)] p-5 sm:p-6">
      {/* + register marks */}
      <span aria-hidden className="pointer-events-none absolute -left-1 -top-1 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-primary-glow)]">+</span>
      <span aria-hidden className="pointer-events-none absolute -right-1 -top-1 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-primary-glow)]">+</span>
      <span aria-hidden className="pointer-events-none absolute -left-1 -bottom-1 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-primary-glow)]">+</span>
      <span aria-hidden className="pointer-events-none absolute -right-1 -bottom-1 font-[family-name:var(--font-mono)] text-[10px] text-[var(--color-primary-glow)]">+</span>

      {/* Top strip */}
      <header className="flex items-center justify-between border-b border-[var(--color-line)] pb-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
        <span>
          <span className="text-[var(--color-primary-glow)]">▸</span>
          <span className="ml-2">PLATE · 01</span>
        </span>
        <span>FIG. 01 / TOPOLOGY</span>
      </header>

      {/* Topology SVG */}
      <div className="my-5 flex items-center justify-center">
        <TopologySvg />
      </div>

      {/* Bottom strip */}
      <footer className="flex items-baseline justify-between border-t border-[var(--color-line)] pt-3 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
        <span>EDITION</span>
        <span className="text-[20px] font-semibold leading-none tracking-tight text-[var(--color-ink)]">
          26
        </span>
      </footer>
    </figure>
  );
}

function TopologySvg() {
  // Drawing area: 240 x 200. Five nodes arranged on a 3-column grid with
  // QUEUE/CACHE on the bottom row.
  const nodeW = 64;
  const nodeH = 26;
  const stroke = "currentColor";
  const muted = "var(--color-muted-2)";

  // Node positions (top-left)
  const nodes = {
    client: { x: 12,  y: 30, label: "CLIENT" },
    api:    { x: 88,  y: 30, label: "API",   accent: true },
    db:     { x: 164, y: 30, label: "DB" },
    queue:  { x: 88,  y: 130, label: "QUEUE" },
    cache:  { x: 164, y: 130, label: "CACHE" },
  } as const;

  function center(n: { x: number; y: number }) {
    return { cx: n.x + nodeW / 2, cy: n.y + nodeH / 2 };
  }
  const c = {
    client: center(nodes.client),
    api: center(nodes.api),
    db: center(nodes.db),
    queue: center(nodes.queue),
    cache: center(nodes.cache),
  };

  return (
    <svg
      viewBox="0 0 240 180"
      width="100%"
      className="h-auto max-w-[260px] text-[var(--color-ink-soft)]"
      role="img"
      aria-label="System topology: client to API to database with queue and cache"
    >
      {/* Edges */}
      {/* client → api */}
      <line x1={nodes.client.x + nodeW} y1={c.client.cy} x2={nodes.api.x} y2={c.api.cy} stroke={stroke} strokeWidth="1" />
      <Arrow x={nodes.api.x} y={c.api.cy} dir="right" />
      {/* api → db */}
      <line x1={nodes.api.x + nodeW} y1={c.api.cy} x2={nodes.db.x} y2={c.db.cy} stroke={stroke} strokeWidth="1" />
      <Arrow x={nodes.db.x} y={c.db.cy} dir="right" />
      {/* api ↓ queue */}
      <line x1={c.api.cx} y1={nodes.api.y + nodeH} x2={c.api.cx} y2={nodes.queue.y} stroke={stroke} strokeWidth="1" />
      <Arrow x={c.api.cx} y={nodes.queue.y} dir="down" />
      {/* db ↓ cache (cache feeds db, so arrow points up) */}
      <line x1={c.db.cx} y1={nodes.db.y + nodeH} x2={c.db.cx} y2={nodes.cache.y} stroke={muted} strokeWidth="1" strokeDasharray="2 2" />
      <Arrow x={c.db.cx} y={nodes.db.y + nodeH} dir="up" muted />

      {/* Nodes */}
      {Object.entries(nodes).map(([key, n]) => {
        const isAccent = "accent" in n && n.accent;
        return (
          <g key={key}>
            <rect
              x={n.x}
              y={n.y}
              width={nodeW}
              height={nodeH}
              fill="var(--color-bg)"
              stroke={isAccent ? "var(--color-primary-glow)" : stroke}
              strokeWidth={isAccent ? 1.5 : 1}
            />
            <text
              x={n.x + nodeW / 2}
              y={n.y + nodeH / 2 + 3}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="9"
              letterSpacing="1.2"
              fill={isAccent ? "var(--color-primary-glow)" : "var(--color-ink)"}
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Arrow({ x, y, dir, muted }: { x: number; y: number; dir: "right" | "down" | "up"; muted?: boolean }) {
  const color = muted ? "var(--color-muted-2)" : "currentColor";
  if (dir === "right") {
    return (
      <polyline
        points={`${x - 4},${y - 3} ${x},${y} ${x - 4},${y + 3}`}
        fill="none"
        stroke={color}
        strokeWidth="1"
      />
    );
  }
  if (dir === "down") {
    return (
      <polyline
        points={`${x - 3},${y - 4} ${x},${y} ${x + 3},${y - 4}`}
        fill="none"
        stroke={color}
        strokeWidth="1"
      />
    );
  }
  return (
    <polyline
      points={`${x - 3},${y + 4} ${x},${y} ${x + 3},${y + 4}`}
      fill="none"
      stroke={color}
      strokeWidth="1"
    />
  );
}
