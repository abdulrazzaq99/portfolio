/**
 * Fetch Geist Sans + Geist Mono font binaries for Satori.
 * Cached per-fetch by Next; results memoised here for the lifetime of the route module.
 *
 * Failure mode: if Google Fonts is unreachable at request time, the OG route
 * falls back to Satori's bundled Inter — image still generates, off-brand but readable.
 */

let cache: { sans: ArrayBuffer; mono: ArrayBuffer } | null = null;

export async function loadGeistFonts(): Promise<{ sans: ArrayBuffer; mono: ArrayBuffer } | null> {
  if (cache) return cache;

  // The CSS endpoint is the only way to get the actual font binary URL.
  // For Geist we hit the canonical Google Fonts CSS, then extract the .ttf URL.
  const cssEndpoints = {
    sans: "https://fonts.googleapis.com/css2?family=Geist:wght@500&display=swap",
    mono: "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@500&display=swap",
  };

  try {
    const fetchFontBinary = async (cssUrl: string): Promise<ArrayBuffer> => {
      const cssRes = await fetch(cssUrl, {
        // Pretend to be a browser so Google returns ttf, not woff2 (Satori needs ttf/otf)
        headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
      });
      const css = await cssRes.text();
      const m = css.match(/url\((https:\/\/[^)]+\.(?:ttf|otf))\)/);
      if (!m) throw new Error("font url not found in CSS");
      const fontRes = await fetch(m[1]);
      if (!fontRes.ok) throw new Error("font fetch failed");
      return fontRes.arrayBuffer();
    };

    const [sans, mono] = await Promise.all([
      fetchFontBinary(cssEndpoints.sans),
      fetchFontBinary(cssEndpoints.mono),
    ]);
    cache = { sans, mono };
    return cache;
  } catch (e) {
    console.warn("OG font load failed, using Satori default:", e);
    return null;
  }
}
