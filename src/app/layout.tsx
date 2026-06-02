import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SiteShell } from "@/components/layout/site-shell";
import { themeInitScript } from "@/components/ui/theme-toggle";
import { personal } from "@/data/personal";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: `${personal.name} — ${personal.role}`,
    template: `%s — ${personal.name}`,
  },
  description: personal.tagline,
  keywords: [
    "Abdul Razzaq",
    "Full Stack Developer",
    "Next.js",
    "React",
    "MERN",
    "Karachi",
    "Software Engineer",
    "Portfolio",
  ],
  authors: [{ name: personal.name }],
  creator: personal.name,
  openGraph: {
    type: "website",
    title: "Abdul Razzaq — Full Stack & AI Application Developer",
    description:
      "Backend-leaning full-stack engineer. Django, Node, Next.js, AI/ML. Currently at Infinitiv AI, open for new work.",
    url: "/",
    siteName: "Abdul Razzaq",
    images: [
      {
        url: "/og/default",
        width: 1200,
        height: 630,
        alt: "Abdul Razzaq — Engineering systems that just keep running",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abdul Razzaq — Full Stack & AI Application Developer",
    description:
      "Backend-leaning full-stack engineer. Currently at Infinitiv AI, open for new work.",
    images: ["/og/default"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2EDE0" },
    { media: "(prefers-color-scheme: dark)",  color: "#0E0E0E" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="grain antialiased">
        {/* Theme init — runs synchronously before paint to prevent FOUC */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
