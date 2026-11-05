import { AtAGlance } from "@/components/sections/at-a-glance";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Process } from "@/components/sections/process";
import { SelectedWork } from "@/components/sections/selected-work";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <AtAGlance />
      <SelectedWork />
      <Process />
      <Experience />
      <Contact />
    </main>
  );
}
