/**
 * Convert an OKLCH color string into a #RRGGBB hex.
 * Supports the formats:
 *   "oklch(0.62 0.165 156)"
 *   "oklch(0.62 0.165 156 / 0.5)"
 * Alpha is dropped (the swatch shows the alpha separately).
 *
 * Math reference: https://bottosson.github.io/posts/oklab/
 *
 * Returns null for unparseable input — callers render a placeholder.
 */
export function oklchToHex(input: string): string | null {
  const m = input.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+)?\s*\)/);
  if (!m) return null;

  const L = Number(m[1]);
  const C = Number(m[2]);
  const hDeg = Number(m[3]);
  const h = (hDeg * Math.PI) / 180;

  // OKLCH -> OKLab
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  // OKLab -> linear sRGB (Bjorn Ottosson's matrix)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l3 = l_ ** 3;
  const m3 = m_ ** 3;
  const s3 = s_ ** 3;

  let r =  4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  // Linear -> sRGB gamma
  const toSrgb = (x: number) => {
    const c = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
    return Math.max(0, Math.min(1, c));
  };

  const R = Math.round(toSrgb(r) * 255);
  const G = Math.round(toSrgb(g) * 255);
  const B = Math.round(toSrgb(bl) * 255);

  const hex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${hex(R)}${hex(G)}${hex(B)}`;
}
