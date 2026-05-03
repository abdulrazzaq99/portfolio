"use client";

import { useMemo, useState } from "react";
import type { Architecture, ArchLayer, ArchNode } from "@/data/projects";
import { cn } from "@/lib/utils";

const LAYERS: ArchLayer[] = ["client", "api", "service", "data", "external"];
const LAYER_LABEL: Record<ArchLayer, string> = {
  client:   "Client",
  api:      "API",
  service:  "Service",
  data:     "Data",
  external: "External",
};

const VB_W = 720;
const VB_H = 320;
const NODE_W = 124;
const NODE_H = 56;

export function ArchitectureDiagram({ arch }: { arch: Architecture }) {
  const [hovered, setHovered] = useState<string | null>(null);

  // Group nodes by layer + compute coordinates
  const positioned = useMemo(() => {
    const byLayer = new Map<ArchLayer, ArchNode[]>();
    for (const n of arch.nodes) {
      const arr = byLayer.get(n.layer) ?? [];
      arr.push(n);
      byLayer.set(n.layer, arr);
    }
    const usedLayers = LAYERS.filter((l) => byLayer.has(l));
    const colW = VB_W / usedLayers.length;

    const out = new Map<string, { x: number; y: number; node: ArchNode; layer: ArchLayer }>();
    usedLayers.forEach((layer, ci) => {
      const items = byLayer.get(layer) ?? [];
      const rowH = (VB_H - 60) / items.length;
      items.forEach((node, ri) => {
        const x = ci * colW + colW / 2 - NODE_W / 2;
        const y = 50 + ri * rowH + rowH / 2 - NODE_H / 2;
        out.set(node.id, { x, y, node, layer });
      });
    });
    return { coords: out, usedLayers, colW };
  }, [arch]);

  const tooltip = hovered ? positioned.coords.get(hovered)?.node : null;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="block w-full"
        role="img"
        aria-label="System architecture diagram"
      >
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="oklch(0.86 0.27 152 / 0.7)" />
          </marker>
          <linearGradient id="arch-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.86 0.27 152 / 0.55)" />
            <stop offset="100%" stopColor="oklch(0.62 0.165 156 / 0.65)" />
          </linearGradient>
        </defs>

        {/* Layer headers */}
        {positioned.usedLayers.map((layer, i) => (
          <text
            key={layer}
            x={i * positioned.colW + positioned.colW / 2}
            y={26}
            fontFamily="ui-monospace"
            fontSize="11"
            fill="oklch(0.62 0.012 158)"
            textAnchor="middle"
            letterSpacing="1.5"
          >
            // {LAYER_LABEL[layer].toUpperCase()}
          </text>
        ))}

        {/* Edges */}
        {arch.edges.map((e, i) => {
          const a = positioned.coords.get(e.from);
          const b = positioned.coords.get(e.to);
          if (!a || !b) return null;
          const x1 = a.x + NODE_W;
          const y1 = a.y + NODE_H / 2;
          const x2 = b.x;
          const y2 = b.y + NODE_H / 2;
          const cx = (x1 + x2) / 2;
          const path = `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
          const isLive = hovered && (hovered === e.from || hovered === e.to);
          return (
            <g key={i}>
              <path
                d={path}
                fill="none"
                stroke={isLive ? "oklch(0.86 0.27 152)" : "url(#arch-line)"}
                strokeWidth={isLive ? 2 : 1.4}
                markerEnd="url(#arrow)"
                opacity={isLive || !hovered ? 1 : 0.30}
                style={{ transition: "all 0.3s ease" }}
              />
              {e.label && (
                <text
                  x={cx}
                  y={(y1 + y2) / 2 - 6}
                  fontFamily="ui-monospace"
                  fontSize="9"
                  fill="oklch(0.62 0.012 158)"
                  textAnchor="middle"
                >
                  {e.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {Array.from(positioned.coords.values()).map(({ x, y, node }) => {
          const isHovered = hovered === node.id;
          return (
            <g
              key={node.id}
              transform={`translate(${x}, ${y})`}
              onMouseEnter={() => setHovered(node.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(node.id)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
              role="button"
              aria-label={`${node.label}: ${node.desc}`}
              style={{ cursor: "pointer", outline: "none" }}
            >
              <rect
                width={NODE_W}
                height={NODE_H}
                rx={10}
                fill={isHovered ? "oklch(0.86 0.27 152 / 0.18)" : "oklch(1 0 0 / 0.04)"}
                stroke={isHovered ? "oklch(0.86 0.27 152)" : "oklch(1 0 0 / 0.14)"}
                strokeWidth={1.2}
                style={{ transition: "fill 0.3s ease, stroke 0.3s ease" }}
              />
              <text
                x={NODE_W / 2}
                y={NODE_H / 2 + 4}
                fontFamily="ui-monospace"
                fontSize="12"
                fontWeight="500"
                fill={isHovered ? "oklch(0.86 0.27 152)" : "oklch(0.92 0.005 150)"}
                textAnchor="middle"
                style={{ transition: "fill 0.3s ease", pointerEvents: "none" }}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      <div
        className={cn(
          "mt-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-elevated)] px-4 py-3 text-[13px] backdrop-blur-md transition-all duration-300",
          tooltip ? "opacity-100" : "opacity-60",
        )}
      >
        {tooltip ? (
          <>
            <span className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-[0.18em] text-[var(--color-primary-glow)]">
              ↳ {LAYER_LABEL[positioned.coords.get(tooltip.id)!.layer]}
            </span>
            <div className="mt-1 font-semibold tracking-tight">{tooltip.label}</div>
            <p className="mt-1 leading-relaxed text-[var(--color-ink-soft)]">{tooltip.desc}</p>
          </>
        ) : (
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--color-muted)]">
            ↳ Hover or focus a node to see what it does
          </span>
        )}
      </div>
    </div>
  );
}
