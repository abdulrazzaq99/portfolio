import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Projects } from "@/components/sections/projects";
import { Experience } from "@/components/sections/experience";
import { Activity } from "@/components/sections/activity";
import { Footer } from "@/components/layout/footer";

const Contact = dynamic(() => import("@/components/sections/contact").then((m) => m.Contact));

export default function HomePage() {
  return (
    <main className="relative overflow-x-hidden">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Activity />
      <Contact />
      <Footer />
    </main>
  );
}
