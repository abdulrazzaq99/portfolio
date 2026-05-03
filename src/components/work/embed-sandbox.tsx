"use client";

import { Sandpack } from "@codesandbox/sandpack-react";

type Props = {
  files: Record<string, string>;
  entry?: string;
  /** Sandpack template — defaults to "vanilla-ts" since most embeds are short snippets, not React apps. */
  template?: "react-ts" | "vanilla-ts" | "node";
};

export function EmbedSandbox({ files, entry, template = "vanilla-ts" }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-line)]">
      <Sandpack
        template={template}
        files={files}
        options={{
          showLineNumbers: true,
          showTabs: true,
          editorHeight: 420,
          showRefreshButton: true,
          activeFile: entry,
        }}
        theme={{
          colors: {
            surface1: "oklch(0.115 0.015 158)",
            surface2: "oklch(0.155 0.015 158)",
            surface3: "oklch(0.235 0.020 158)",
            clickable: "oklch(0.640 0.012 158)",
            base: "oklch(0.870 0.012 150)",
            disabled: "oklch(0.480 0.014 158)",
            hover: "oklch(0.86 0.27 152)",
            accent: "oklch(0.86 0.27 152)",
            error: "oklch(0.62 0.18 28)",
            errorSurface: "oklch(0.20 0.05 28)",
          },
          syntax: {
            plain: "oklch(0.870 0.012 150)",
            comment: { color: "oklch(0.50 0.012 158)", fontStyle: "italic" },
            keyword: "oklch(0.86 0.27 152)",
            tag: "oklch(0.86 0.27 152)",
            punctuation: "oklch(0.78 0.012 158)",
            definition: "oklch(0.78 0.165 200)",
            property: "oklch(0.78 0.165 200)",
            static: "oklch(0.82 0.090 78)",
            string: "oklch(0.82 0.090 78)",
          },
          font: {
            body: "var(--font-sans)",
            mono: "var(--font-mono)",
            size: "13px",
            lineHeight: "1.6",
          },
        }}
      />
    </div>
  );
}
