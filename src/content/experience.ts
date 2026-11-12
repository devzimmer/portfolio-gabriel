import type { Locale } from "next-intl";

export type ExperienceHighlight = {
  name: string;
  text: string;
};

export type ExperienceEntry = {
  period: string;
  role: string;
  org: string;
  /** How the work was contracted, e.g. outsourced through another company. */
  engagement?: string;
  location: string;
  summary: string;
  highlights: ExperienceHighlight[];
  stack: string[];
};

// Copy is authored in Portuguese; en/es reuse it until the translation pass.
// Sources: C:\dev\portfolio-extracts (git-based) and Gabriel's own corrections
// of 2026-11-11. Aceleraí and the PL campaign were outsourced through Aurea Tech.
const pt: ExperienceEntry[] = [
  {
    period: "Jan 2026 — Hoje",
    role: "Founder & Product Engineer",
    org: "Duzi Tecnologia",
    location: "Igrejinha, RS · Remoto",
    summary:
      "Minha empresa de software. Decido o que construir, desenho a arquitetura e coloco em produção com agentes de IA, do spec ao deploy.",
    highlights: [
      {
        name: "EngPocket",
        text: "Agente no WhatsApp que cuida da papelada de obra de engenheiros civis. Cofundei e sou o único engenheiro; mais de 150 assinaturas vendidas.",
      },
      {
        name: "Duzi CRM",
        text: "CRM multi-inquilino na API oficial do WhatsApp, aprovado pela Meta como Tech Provider. O isolamento entre empresas é testado no banco.",
      },
      {
        name: "Lumuviz",
        text: "Modelador 3D com motor de geometria próprio e render com IA para arquitetos. Lançamento em 2026.",
      },
    ],
    stack: ["TypeScript", "Next.js", "Supabase", "Postgres", "Deno", "Cloudflare", "OpenAI"],
  },
  {
    period: "Jan — Nov 2026",
    role: "AI-Native Full Stack Developer · Project Lead",
    org: "Aceleraí",
    engagement: "Terceirizado pela Aurea Tech",
    location: "São Paulo · Remoto",
    summary:
      "Construí os sistemas que levam o lead do anúncio ao pós-venda numa empresa com mais de 40 vendedores e milhares de leads por dia. Liderei quatro produtos num time de 10 devs.",
    highlights: [
      {
        name: "Aurea Flow",
        text: "Motor de automações em TypeScript que substitui o n8n. Leva cada lead da landing page ao CRM sem duplicar, com a rotação de vendedores feita no Postgres.",
      },
      {
        name: "Aurea Pages",
        text: "Landing pages criadas e editadas por IA, com o design system de cada produto e formulários ligados ao CRM. Substituiu o GreatPages.",
      },
      {
        name: "Aurea Cloud",
        text: "Painel que cruza Meta Ads e CRM pela UTM e mostra quanto cada campanha custou e vendeu.",
      },
      {
        name: "Disparos",
        text: "WhatsApp em massa pela API oficial para bases de dezenas de milhares de leads, com saúde dos números e aviso ao vendedor quando o lead clica.",
      },
      {
        name: "Allana",
        text: "Agente de IA na API oficial do WhatsApp que marca, remarca e cancela os onboardings de clientes.",
      },
    ],
    stack: ["Next.js", "TypeScript", "Supabase", "PL/pgSQL", "Hono", "Meta Cloud API", "Cloudflare Workers"],
  },
  {
    period: "Ago — Out 2026",
    role: "AI-Native Full Stack Developer",
    org: "Partido Liberal · Eleições 2026",
    engagement: "Terceirizado pela Aurea Tech",
    location: "Remoto",
    summary:
      "No primeiro turno, construí sistemas com IA para a comunicação da campanha do PL, incluindo a presidencial, num time de cinco pessoas e com prazos de dias.",
    highlights: [
      {
        name: "Esteira de cortes",
        text: "As lives da TV Celular eram gravadas em blocos de 10 minutos, um LLM escolhia e pontuava os cortes, a equipe aprovava no editor e o render saía em 7 formatos. O site fechou o turno com 12.844 cortes no ar e 98 mil downloads.",
      },
      {
        name: "Agente de WhatsApp",
        text: "Assistente com RAG que respondia candidatos e jornalistas no estilo do marqueteiro da campanha. O cache de prompt cortou 64% do custo por chamada.",
      },
      {
        name: "Santinho Digital",
        text: "Painel onde a equipe revisava a pronúncia da voz clonada para 1.576 candidatos antes do lip sync.",
      },
    ],
    stack: ["Python", "FastAPI", "pgvector", "faster-whisper", "FFmpeg", "Next.js", "Cloudflare D1/R2"],
  },
  {
    period: "Fev 2025 — Set 2026",
    role: "AI Automation & Backend Developer → AI-Native Full Stack Developer",
    org: "Aurea Tech",
    location: "São Paulo · Remoto",
    summary:
      "Comecei com automações em n8n e mantendo a infraestrutura. Em janeiro de 2026 a empresa passou a construir tudo com agentes de IA, e eu passei a liderar sistemas full stack.",
    highlights: [
      {
        name: "Infraestrutura",
        text: "n8n self-hosted em VPS, em modo fila com workers, Redis e Postgres. Reestruturei as filas depois de uma queda por pico de acesso.",
      },
      {
        name: "Qualificação de leads",
        text: "Bot de WhatsApp com LLM e RAG que filtrava os leads das campanhas antes de chegarem ao comercial. Virou um dos produtos de maior sucesso da empresa.",
      },
      {
        name: "Edição de vídeo por voz",
        text: "O editor fala o que quer mudar; um LLM com tool calling escolhe a edição e o vídeo atualiza na hora.",
      },
    ],
    stack: ["n8n", "JavaScript", "Postgres", "Redis", "OpenAI", "Anthropic"],
  },
];

export const experience: Record<Locale, ExperienceEntry[]> = {
  pt,
  en: pt,
  es: pt,
};
