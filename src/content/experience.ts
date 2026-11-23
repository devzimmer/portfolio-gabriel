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

// Sources: C:\dev\portfolio-extracts (git-based) and Gabriel's own corrections
// of 2026-11-11. Aceleraí and the PL campaign were outsourced through Aurea Tech.
const pt: ExperienceEntry[] = [
  {
    period: "Jan 2026 — Hoje",
    role: "Founder & Product Engineer",
    org: "Duzi Tecnologia",
    location: "Igrejinha, RS · Remoto",
    summary:
      "Minha empresa de software. Cuido de produto, arquitetura, segurança e operação, e construo com agentes de IA, da spec ao deploy.",
    highlights: [
      {
        name: "EngPocket",
        text: "Agente de IA na API oficial do WhatsApp que faz a papelada de obra de engenheiros civis. Sou cofundador e único engenheiro; são mais de 150 assinaturas vendidas.",
      },
      {
        name: "Duzi CRM",
        text: "CRM de WhatsApp multi-tenant, aprovado pela Meta como Tech Provider. O isolamento entre empresas fica no PostgreSQL (RLS) e é coberto por cerca de 2.300 testes.",
      },
      {
        name: "Lumuviz",
        text: "Modelador 3D com motor de geometria próprio em TypeScript e render com IA para arquitetos. Lançamento em 2026.",
      },
    ],
    stack: ["TypeScript", "React", "Next.js", "Supabase", "PostgreSQL", "Deno", "Cloudflare", "OpenAI", "three.js"],
  },
  {
    period: "Jan — Nov 2026",
    role: "AI-Native Full Stack Developer · Project Lead",
    org: "Aceleraí",
    engagement: "Terceirizado pela Aurea Tech",
    location: "São Paulo · Remoto",
    summary:
      "Prestei serviço pela Aurea Tech num time de 10 devs. Construí sistemas do anúncio ao pós-venda para uma operação com mais de 40 vendedores e milhares de leads por dia, e fui Project Lead de quatro deles.",
    highlights: [
      {
        name: "Aurea Flow",
        text: "Motor de automações em TypeScript que substitui o n8n. Deduplica o lead, valida o CNPJ e distribui entre os vendedores em rodízio no PostgreSQL.",
      },
      {
        name: "Aurea Pages",
        text: "Landing pages criadas e editadas por IA, com o design system de cada produto e formulários ligados ao CRM. Substituiu o GreatPages.",
      },
      {
        name: "Aurea Cloud",
        text: "BI que cruza Meta Ads e CRM pela UTM e mostra quanto cada campanha e cada criativo custou e vendeu.",
      },
      {
        name: "Disparos",
        text: "WhatsApp em massa pela API oficial para dezenas de milhares de leads, com templates, saúde dos números e aviso ao vendedor quando o lead clica.",
      },
      {
        name: "Allana",
        text: "Agente de IA na API oficial do WhatsApp que marca, remarca e cancela os onboardings de clientes.",
      },
    ],
    stack: ["TypeScript", "React", "Next.js", "Supabase", "PostgreSQL", "PL/pgSQL", "Hono", "Cloudflare Workers", "Meta Ads API"],
  },
  {
    period: "Ago — Out 2026",
    role: "AI-Native Full Stack Developer",
    org: "Partido Liberal · Eleições 2026",
    engagement: "Terceirizado pela Aurea Tech",
    location: "Remoto",
    summary:
      "No 1º turno, construí sistemas com IA para a comunicação da campanha do PL, incluindo a presidencial. O time tinha cinco devs, os prazos eram de horas e tudo rodava ao vivo.",
    highlights: [
      {
        name: "Esteira de cortes",
        text: "Gravador, seleção de cortes por LLM, reenquadramento vertical, render em 7 formatos e o editor onde a equipe aprovava cada corte. O site da TV Celular fechou o turno com 12.844 cortes no ar e 98 mil downloads.",
      },
      {
        name: "Agente de WhatsApp",
        text: "Assistente com RAG em pgvector que respondia candidatos e jornalistas, com troca automática entre Anthropic e OpenAI. O prompt caching cortou 64% do custo por chamada.",
      },
      {
        name: "Santinho Digital",
        text: "Painel em que a equipe revisava a pronúncia da voz sintetizada por IA para 1.576 candidatos antes do lip sync.",
      },
    ],
    stack: ["Python", "FastAPI", "pgvector", "Next.js", "Cloudflare D1/R2", "faster-whisper", "FFmpeg"],
  },
  {
    period: "Fev 2025 — Set 2026",
    role: "AI Automation & Backend Developer → AI-Native Full Stack Developer",
    org: "Aurea Tech",
    location: "São Paulo · Remoto",
    summary:
      "Comecei com automações de IA em n8n e cuidando da infraestrutura. Em janeiro de 2026 a empresa passou a construir tudo com agentes de IA, e eu passei a liderar sistemas full stack.",
    highlights: [
      {
        name: "Infraestrutura",
        text: "n8n self-hosted em VPS, em modo fila com Redis, PostgreSQL e Docker. Quando um pico de acesso derrubou o serviço, reestruturei as filas e a operação voltou no mesmo dia.",
      },
      {
        name: "Qualificação de leads",
        text: "Bot de WhatsApp com LLM e RAG que filtrava os leads das campanhas antes de chegarem ao comercial. Virou o principal filtro do funil.",
      },
      {
        name: "Edição de vídeo por voz",
        text: "A pessoa fala o que quer mudar, um LLM com tool calling escolhe a edição e o vídeo atualiza na tela.",
      },
    ],
    stack: ["n8n", "JavaScript", "PostgreSQL", "Redis", "Docker", "OpenAI", "Anthropic"],
  },
];

export const experience: Record<Locale, ExperienceEntry[]> = { pt };
