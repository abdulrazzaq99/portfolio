import { ImageResponse } from "next/og";
import { loadGeistFonts } from "@/lib/og/load-fonts";

export const runtime = "edge";
export const revalidate = 86400; // 1 day cache

export async function GET() {
  const fonts = await loadGeistFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background:
            "linear-gradient(135deg, #1a1f1c 0%, #0f1310 100%)",
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(132,255,180,0.18), transparent 60%)," +
            "radial-gradient(ellipse 50% 40% at 20% 80%, rgba(0,170,100,0.16), transparent 70%)," +
            "linear-gradient(135deg, #1a1f1c 0%, #0f1310 100%)",
          fontFamily: "Geist",
          color: "#f3f5f3",
        }}
      >
        {/* Top: prompt-style eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontFamily: "Geist Mono",
            fontSize: "20px",
            color: "#9aa39d",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "#84ffb4" }}>$</span>
          <span>cat /etc/abdul.profile</span>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              fontSize: "92px",
              fontWeight: 500,
              lineHeight: 0.98,
              letterSpacing: "-0.04em",
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <span>Engineering</span>
            <span style={{ color: "#84ffb4" }}>systems</span>
            <span>that just</span>
            <span style={{ fontStyle: "italic", fontWeight: 300 }}>keep running.</span>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "Geist Mono",
            fontSize: "20px",
            color: "#9aa39d",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            paddingTop: "20px",
          }}
        >
          <span>Abdul Razzaq</span>
          <span>· Full Stack & AI Application Developer</span>
          <span style={{ color: "#84ffb4" }}>● open</span>
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
