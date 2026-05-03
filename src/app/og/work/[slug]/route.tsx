import { ImageResponse } from "next/og";
import { loadGeistFonts } from "@/lib/og/load-fonts";
import { projects } from "@/data/projects";

export const runtime = "edge";
export const revalidate = 86400;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) {
    return new Response("Not found", { status: 404 });
  }

  const fonts = await loadGeistFonts();

  // Pick file extension by language — same heuristic the IDE artifact card uses
  const stackLower = project.stack.map((s) => s.toLowerCase());
  const fileExt = stackLower.some((s) => s.includes("python") || s.includes("django") || s.includes("jupyter"))
    ? "py"
    : stackLower.some((s) => s.includes("typescript") || s.includes("next") || s.includes("react"))
    ? "tsx"
    : stackLower.some((s) => s.includes("solidity"))
    ? "sol"
    : "js";
  const filename = `${project.slug.replace(/-/g, "_")}.${fileExt}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "56px 64px",
          background:
            "radial-gradient(ellipse 70% 50% at 90% 10%, rgba(132,255,180,0.18), transparent 60%)," +
            "linear-gradient(135deg, #1a1f1c 0%, #0c0f0d 100%)",
          fontFamily: "Geist",
          color: "#f3f5f3",
          gap: "32px",
        }}
      >
        {/* Top eyebrow */}
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
          <span style={{ color: "#84ffb4" }}>/work</span>
          <span>·</span>
          <span>{project.slug}</span>
        </div>

        {/* IDE window mock */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "#0e1310",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px",
            overflow: "hidden",
            flex: 1,
          }}
        >
          {/* Title bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 16px",
              background: "rgba(0,0,0,0.4)",
              borderBottom: "1px solid rgba(132,255,180,0.18)",
              fontFamily: "Geist Mono",
              fontSize: "14px",
              color: "#9aa39d",
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: 5, background: "#d57464" }} />
            <span style={{ width: 10, height: 10, borderRadius: 5, background: "#d6b76a" }} />
            <span style={{ width: 10, height: 10, borderRadius: 5, background: "#84d6a4" }} />
            <span style={{ marginLeft: "16px" }}>{filename} — {project.name}</span>
          </div>

          {/* Code area */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "24px 28px",
              fontFamily: "Geist Mono",
              fontSize: "20px",
              gap: "8px",
              flex: 1,
            }}
          >
            <div style={{ color: "#5a665e", fontStyle: "italic" }}>// {project.name}</div>
            <div>
              <span style={{ color: "#84ffb4" }}>export const </span>
              <span style={{ color: "#f3f5f3" }}>stack </span>
              <span style={{ color: "#c5cdc7" }}>= [</span>
            </div>
            {project.stack.slice(0, 4).map((s) => (
              <div key={s} style={{ paddingLeft: "24px" }}>
                <span style={{ color: "#d6b76a" }}>{`"${s}"`}</span>
                <span style={{ color: "#c5cdc7" }}>,</span>
              </div>
            ))}
            <div style={{ color: "#c5cdc7" }}>];</div>
          </div>
        </div>

        {/* Bottom name strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "Geist Mono",
            fontSize: "16px",
            color: "#9aa39d",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <span>Abdul Razzaq · {project.category} · {project.year}</span>
          <span style={{ color: "#84ffb4" }}>● {project.visibility}</span>
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
