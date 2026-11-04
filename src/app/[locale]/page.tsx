import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
    </main>
  );
}
