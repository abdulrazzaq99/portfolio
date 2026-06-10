import type { Project } from "@/data/projects";

/**
 * IDE-style artifact visual for a project. Pure SVG, server component.
 * Used by both the compact ProjectCard and the ProjectModal.
 */
export function ProjectVisual({ project }: { project: Project }) {
  // Pick a representative file extension based on the dominant language in the stack
  const stackLower = project.stack.map((s) => s.toLowerCase());
  const fileExt = stackLower.some(
    (s) => s.includes("python") || s.includes("django") || s.includes("jupyter"),
  )
    ? "py"
    : stackLower.some(
        (s) => s.includes("typescript") || s.includes("next") || s.includes("react"),
      )
    ? "tsx"
    : stackLower.some((s) => s.includes("solidity"))
    ? "sol"
    : "js";

  const slugFile = project.slug.replace(/-/g, "_");
  const filename = `${slugFile}.${fileExt}`;

  // Build code lines (faux-snippet) — keyword-tinted to feel like a real
  // editor. Syntax follows the file extension so a .py tab shows Python.
  type Tok = { t: string; c: "kw" | "fn" | "str" | "num" | "cm" | "id" | "op" };
  type Line = { tokens: Tok[] };

  const stackLines: Line[] = project.stack.slice(0, 3).map((s) => ({
    tokens: [
      { t: "  ", c: "id" as const },
      { t: `"${s}"`, c: "str" as const },
      { t: ",", c: "op" as const },
    ],
  }));

  const lines: Line[] =
    fileExt === "py"
      ? [
          { tokens: [{ t: "# ", c: "cm" }, { t: project.name, c: "cm" }] },
          {
            tokens: [
              { t: "from ", c: "kw" },
              { t: slugFile, c: "id" },
              { t: " import ", c: "kw" },
              { t: "pipeline", c: "id" },
            ],
          },
          { tokens: [] },
          {
            tokens: [
              { t: "stack ", c: "id" },
              { t: "= ", c: "op" },
              { t: "[", c: "op" },
            ],
          },
          ...stackLines,
          { tokens: [{ t: "]", c: "op" }] },
          { tokens: [] },
          {
            tokens: [
              { t: "async ", c: "kw" },
              { t: "def ", c: "kw" },
              { t: "build", c: "fn" },
              { t: "():", c: "op" },
            ],
          },
          {
            tokens: [
              { t: "    ", c: "id" },
              { t: "return ", c: "kw" },
              { t: "await ", c: "kw" },
              { t: "pipeline", c: "id" },
              { t: ".", c: "op" },
              { t: "run", c: "fn" },
              { t: "(stack)", c: "op" },
            ],
          },
        ]
      : [
          { tokens: [{ t: "// ", c: "cm" }, { t: project.name, c: "cm" }] },
          {
            tokens: [
              { t: "import ", c: "kw" },
              { t: "{ ", c: "op" },
              { t: "pipeline", c: "id" },
              { t: " } ", c: "op" },
              { t: "from ", c: "kw" },
              { t: `"./${slugFile}"`, c: "str" },
            ],
          },
          { tokens: [] },
          {
            tokens: [
              { t: "export ", c: "kw" },
              { t: "const ", c: "kw" },
              { t: "stack ", c: "id" },
              { t: "= ", c: "op" },
              { t: "[", c: "op" },
            ],
          },
          ...stackLines,
          { tokens: [{ t: "]", c: "op" }] },
          { tokens: [] },
          {
            tokens: [
              { t: "async ", c: "kw" },
              { t: "function ", c: "kw" },
              { t: "build", c: "fn" },
              { t: "(): ", c: "op" },
              { t: "Promise", c: "fn" },
              { t: "<", c: "op" },
              { t: "Result", c: "fn" },
              { t: "> {", c: "op" },
            ],
          },
          {
            tokens: [
              { t: "  ", c: "id" },
              { t: "return ", c: "kw" },
              { t: "pipeline", c: "id" },
              { t: ".", c: "op" },
              { t: "run", c: "fn" },
              { t: "({ stack });", c: "op" },
            ],
          },
          { tokens: [{ t: "}", c: "op" }] },
        ];

  const tokenColor = (c: "kw" | "fn" | "str" | "num" | "cm" | "id" | "op") => {
    switch (c) {
      case "kw":  return "oklch(0.86 0.27 152)";       // neon emerald — keywords
      case "fn":  return "oklch(0.78 0.165 200)";      // cool cyan — functions
      case "str": return "oklch(0.82 0.090 78)";       // warm amber — strings
      case "num": return "oklch(0.82 0.140 30)";       // coral — numbers
      case "cm":  return "oklch(0.50 0.012 158)";      // dim — comments
      case "op":  return "oklch(0.78 0.012 158)";      // soft white — operators
      case "id":  return "oklch(0.92 0.005 150)";      // ink — identifiers
    }
  };

  // File tree entries
  const tree = [
    { name: "src/", kind: "dir" as const, indent: 0, active: false },
    { name: filename, kind: "file" as const, indent: 1, active: true },
    { name: "lib/", kind: "dir" as const, indent: 1, active: false },
    { name: fileExt === "py" ? "schema.py" : "schema.ts", kind: "file" as const, indent: 2, active: false },
    { name: "README.md", kind: "file" as const, indent: 0, active: false },
    { name: ".env", kind: "file" as const, indent: 0, active: false },
  ];

  return (
    <svg
      viewBox="0 0 800 500"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-label={project.imageAlt}
      role="img"
    >
      <defs>
        <linearGradient id={`bg-${project.slug}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.135 0.018 158)" />
          <stop offset="100%" stopColor="oklch(0.105 0.012 158)" />
        </linearGradient>
        <radialGradient id={`glow-${project.slug}`} cx="0.85" cy="0" r="0.7">
          <stop offset="0%" stopColor="oklch(0.86 0.27 152 / 0.18)" />
          <stop offset="100%" stopColor="oklch(0.86 0.27 152 / 0)" />
        </radialGradient>
        <pattern id={`grid-${project.slug}`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="oklch(1 0 0 / 0.025)" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Background */}
      <rect width="800" height="500" fill={`url(#bg-${project.slug})`} />
      <rect width="800" height="500" fill={`url(#grid-${project.slug})`} />
      <rect width="800" height="500" fill={`url(#glow-${project.slug})`} />

      {/* IDE window */}
      <g>
        {/* Title bar */}
        <rect x="40" y="46" width="720" height="32" rx="6" fill="oklch(0.085 0.012 158)" stroke="oklch(1 0 0 / 0.06)" />
        <circle cx="58" cy="62" r="4.5" fill="oklch(0.62 0.18 28)" />
        <circle cx="74" cy="62" r="4.5" fill="oklch(0.78 0.14 78)" />
        <circle cx="90" cy="62" r="4.5" fill="oklch(0.78 0.16 152)" />
        <text x="400" y="66" fontFamily="ui-monospace" fontSize="11" fill="oklch(0.55 0.012 158)" textAnchor="middle">
          {filename} — {project.name.length > 28 ? project.name.slice(0, 28) + "…" : project.name}
        </text>

        {/* Editor frame */}
        <rect x="40" y="78" width="720" height="380" rx="0" fill="oklch(0.115 0.015 158)" stroke="oklch(1 0 0 / 0.05)" />

        {/* File tree column */}
        <rect x="40" y="78" width="180" height="380" fill="oklch(0.095 0.012 158)" />
        <line x1="220" y1="78" x2="220" y2="458" stroke="oklch(1 0 0 / 0.06)" />

        <text x="56" y="106" fontFamily="ui-monospace" fontSize="10" fill="oklch(0.55 0.012 158)" letterSpacing="1.5">
          EXPLORER
        </text>
        <text x="200" y="106" fontFamily="ui-monospace" fontSize="10" fill="oklch(0.40 0.012 158)" textAnchor="end">
          {project.visibility === "private"
            ? "● PRIVATE"
            : project.visibility === "collaborator"
            ? "● COLLAB"
            : "● PUBLIC"}
        </text>

        {tree.map((t, i) => {
          const y = 134 + i * 26;
          const x = 56 + t.indent * 12;
          return (
            <g key={t.name}>
              {t.active && (
                <>
                  <rect x="40" y={y - 13} width="180" height="22" fill="oklch(0.86 0.27 152 / 0.10)" />
                  <rect x="40" y={y - 13} width="2" height="22" fill="oklch(0.86 0.27 152)" />
                </>
              )}
              <text
                x={x}
                y={y}
                fontFamily="ui-monospace"
                fontSize="11"
                fill={
                  t.active
                    ? "oklch(0.86 0.27 152)"
                    : t.kind === "dir"
                    ? "oklch(0.78 0.012 158)"
                    : "oklch(0.62 0.012 158)"
                }
              >
                {t.kind === "dir" ? "▸ " : ""}
                {t.name}
              </text>
            </g>
          );
        })}

        {/* Bottom status strip in tree (commit hash) */}
        <text x="56" y="438" fontFamily="ui-monospace" fontSize="9.5" fill="oklch(0.45 0.012 158)" letterSpacing="1">
          GIT · main
        </text>
        <text x="200" y="438" fontFamily="ui-monospace" fontSize="9.5" fill="oklch(0.45 0.012 158)" textAnchor="end">
          {project.slug.slice(0, 7)}
        </text>

        {/* Editor pane — code */}
        <g transform="translate(232, 100)">
          {lines.map((line, i) => {
            const y = i * 22;
            const ln = String(i + 1).padStart(2, "0");
            return (
              <g key={i} transform={`translate(0, ${y})`}>
                <text x="0" y="14" fontFamily="ui-monospace" fontSize="10.5" fill="oklch(0.30 0.012 158)" textAnchor="end" dx="22">
                  {ln}
                </text>
                <text x="34" y="14" fontFamily="ui-monospace" fontSize="12" xmlSpace="preserve">
                  {line.tokens.map((tok, j) => (
                    <tspan key={j} fill={tokenColor(tok.c)}>
                      {tok.t}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}

          {/* Cursor blink on the active line — line 9 (index 8) */}
          <rect x="34" y={8 * 22 + 2} width="1.5" height="14">
            <animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite" />
          </rect>
        </g>

        {/* Bottom status bar */}
        <rect x="40" y="430" width="720" height="28" fill="oklch(0.06 0.010 158)" />
        <text x="56" y="448" fontFamily="ui-monospace" fontSize="10" fill="oklch(0.86 0.27 152)" letterSpacing="0.5">
          ✓ build · pass
        </text>
        <text x="170" y="448" fontFamily="ui-monospace" fontSize="10" fill="oklch(0.55 0.012 158)" letterSpacing="0.5">
          {project.year} · {project.category}
        </text>
        <text x="744" y="448" fontFamily="ui-monospace" fontSize="10" fill="oklch(0.55 0.012 158)" textAnchor="end" letterSpacing="0.5">
          {fileExt.toUpperCase()} · UTF-8 · LF
        </text>
        <text x="630" y="448" fontFamily="ui-monospace" fontSize="10" fill="oklch(0.55 0.012 158)" textAnchor="end" letterSpacing="0.5">
          Ln 9, Col 24
        </text>
      </g>
    </svg>
  );
}
