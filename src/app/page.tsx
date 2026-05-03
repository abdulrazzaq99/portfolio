import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/hero";
import { SignalStrip } from "@/components/sections/signal-strip";
import { About } from "@/components/sections/about";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { Footer } from "@/components/layout/footer";
import { SectionRail } from "@/components/layout/section-rail";

// Lazy-load Contact (the only client-only section that follows the fold)
const Contact = dynamic(() => import("@/components/sections/contact").then((m) => m.Contact));

export default function HomePage() {
  return (
    <main className="relative overflow-x-hidden">
      <SectionRail />
      <Hero />
      <SignalStrip />
      <About />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </main>
  );
}
