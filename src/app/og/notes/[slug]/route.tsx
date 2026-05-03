import { ImageResponse } from "next/og";
import { loadGeistFonts } from "@/lib/og/load-fonts";

export const runtime = "edge";
export const revalidate = 86400;

/**
 * Renders a generic essay OG image. Until Phase 2 adds MDX-backed notes,
 * the title comes from the URL slug (kebab-case → Title Case).
 * Phase 2 will swap this for a fetch of the MDX frontmatter.
 */
function slugToTitle(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const fonts = await loadGeistFonts();
  const title = slugToTitle(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(132,255,180,0.16), transparent 60%)," +
            "linear-gradient(135deg, #1a1f1c 0%, #0c0f0d 100%)",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)," +
            "linear-gradient(135deg, #1a1f1c 0%, #0c0f0d 100%)",
          backgroundSize: "44px 44px, 44px 44px, auto",
          fontFamily: "Geist",
          color: "#f3f5f3",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontFamily: "Geist Mono",
            fontSize: "18px",
            color: "#9aa39d",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#84ffb4" }}>//</span>
          <span style={{ color: "#84ffb4" }}>/notes</span>
          <span>·</span>
          <span>essay</span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "76px",
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
            display: "flex",
          }}
        >
          {title}
          <span style={{ color: "#84ffb4" }}>.</span>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "Geist Mono",
            fontSize: "18px",
            color: "#9aa39d",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            paddingTop: "24px",
          }}
        >
          <span>Abdul Razzaq · Notes</span>
          <span>abdulrazzaq.dev</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fonts && {
        fonts: [
          { name: "Geist", data: fonts.sans, weight: 500, style: "normal" },
          { name: "Geist Mono", data: fonts.mono, weight: 500, style: "normal" },
        ],
      }),
    },
  );
}
