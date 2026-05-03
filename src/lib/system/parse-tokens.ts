import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { oklchToHex } from "./oklch-to-hex";

export type Token = {
  /** CSS variable name including the leading `--`, e.g. `--color-primary` */
  name: string;
  /** Raw value as written, e.g. `oklch(0.62 0.165 156)` */
  raw: string;
  /** Computed hex if the value is OKLCH and parseable, otherwise null */
  hex: string | null;
  /** Group label inferred from the comment block above the token */
  group: string;
};

/**
 * Parse the @theme block out of src/app/globals.css and return the tokens
 * grouped by section comment. Runs at module load — when imported from a
 * Server Component, this happens during static generation.
 */
export function parseTokens(): Token[] {
  const cssPath = join(process.cwd(), "src", "app", "globals.css");
  const css = readFileSync(cssPath, "utf-8");

  // Slice out the @theme { ... } block (the first one).
  const themeMatch = css.match(/@theme\s*\{([\s\S]*?)\n\}/);
  if (!themeMatch) return [];

  const block = themeMatch[1];
  const lines = block.split("\n");

  const tokens: Token[] = [];
  let currentGroup = "Tokens";

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Group header from a comment block like `/* ── Surfaces ─── */`
    const groupMatch = line.match(/\/\*[\s─\-]*([A-Za-z][^*]*?)[\s─\-]*\*\//);
    if (groupMatch) {
      currentGroup = groupMatch[1].trim();
      continue;
    }

    // Skip other comments
    if (line.startsWith("/*") || line.startsWith("//")) continue;

    // Token line: `--name: value;` (value may itself contain colons, e.g. var())
    const tokenMatch = line.match(/^(--[a-z0-9-]+)\s*:\s*([^;]+);?\s*(?:\/\*.*\*\/)?$/i);
    if (!tokenMatch) continue;

    const name = tokenMatch[1];
    const raw = tokenMatch[2].trim();

    // Only color tokens are interesting for the swatch grid; skip type/motion vars.
    if (!name.startsWith("--color-")) continue;

    tokens.push({
      name,
      raw,
      hex: oklchToHex(raw),
      group: currentGroup,
    });
  }

  return tokens;
}
