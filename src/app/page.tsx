import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TechStack } from "@/components/tech-stack";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo" className="flex-1">
        <Hero />
        <TechStack />
      </main>
      <SiteFooter />
    </>
  );
}
