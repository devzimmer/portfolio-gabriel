import type { Locale } from "next-intl";

export type ExperienceEntry = {
  period: string;
  title: string;
  description: string;
  location: string;
  placeholder?: boolean;
};

// Copy is authored in Portuguese; en/es reuse it until the translation pass.
const pt: ExperienceEntry[] = [
  {
    period: "2026 — Hoje",
    title: "Fundador e engenheiro · Duzi Tecnologia",
    description:
      "Produto, arquitetura, segurança e operação do software da empresa. Coloquei o Duzi CRM em produção como Tech Provider aprovado pela Meta e construí a linha Lumuviz para arquitetos, com lançamento previsto para 2026.",
    location: "Brasil · Remoto",
  },
  {
    period: "Jan 2026 — Hoje",
    title: "Cofundador e único engenheiro · EngPocket",
    description:
      "Construo e mantenho a plataforma inteira: um agente de IA no WhatsApp, um app em Next.js e um backend serverless. Mais de 150 assinaturas vendidas; tirei todas as automações de um servidor próprio e levei para código versionado.",
    location: "Brasil · Remoto",
  },
  {
    period: "[Período]",
    title: "[Cargo anterior] · [Empresa]",
    description: "[Escopo, stack e resultado, em uma ou duas frases.]",
    location: "[Local]",
    placeholder: true,
  },
];

export const experience: Record<Locale, ExperienceEntry[]> = {
  pt,
  en: pt,
  es: pt,
};
