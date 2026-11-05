import type { CaseCopy, CaseStudy } from "./types";

// Copy is authored in Portuguese; en/es reuse it until the translation pass.
// Content rules: only traction number is "150+ assinaturas"; never name the
// co-founder; office and budgeting modules are "em desenvolvimento".
const pt: CaseCopy = {
  title: "EngPocket",
  lede: "Gestão de obras para engenheiros civis, feita de dentro de uma conversa no WhatsApp.",
  card: {
    summary:
      "Um agente de IA na API oficial do WhatsApp que cuida da papelada de obra para engenheiros civis: diário de obra por áudio, despesas por foto. Em produção desde janeiro de 2026, com mais de 150 assinaturas vendidas.",
    stack: "Next.js · Supabase · OpenAI · WhatsApp API",
    meta: "2026 · Cofundador, único engenheiro · No ar",
  },
  facts: [
    { label: "Papel", value: "Cofundador, único engenheiro" },
    { label: "Período", value: "Janeiro de 2026 — hoje" },
    { label: "Tração", value: "150+ assinaturas vendidas" },
    {
      label: "Stack",
      value: "Next.js 16 · Supabase · Deno · OpenAI · WhatsApp Cloud API",
    },
  ],
  media: [
    {
      label: "[Gravação de tela: um áudio no WhatsApp vira o diário de obra]",
      caption:
        "O produto vive no WhatsApp; o app web organiza o que o agente registra.",
    },
  ],
  problem: {
    lead: "Engenheiros civis perdem horas com papelada repetitiva: diário de obra, lançamento de despesas, consulta a normas, levantamento de quantitativos. Eles já vivem no WhatsApp, então o produto precisava estar lá.",
    body: "O EngPocket deixa esse trabalho ser feito por texto, áudio ou foto, e guarda os registros num app web com obras, financeiro e relatórios mensais. Construí o produto com um sócio engenheiro civil, que cuida do domínio e das vendas; o produto e toda a tecnologia são meus.",
  },
  built: [
    {
      title: "Um agente no WhatsApp com 11 ferramentas",
      body: "Function calling sobre a OpenAI, com transcrição de áudio e visão: escreve o diário de obra a partir de áudios, lança despesas pela foto do comprovante, consulta normas técnicas e diagnostica patologias por imagem.",
    },
    {
      title: "Um backend serverless",
      body: "23 Edge Functions no Supabase e jobs no pg_cron substituíram um servidor n8n próprio. A cobrança roda por webhooks de três plataformas de checkout.",
    },
    {
      title: "Um escritório de agentes",
      tag: "Em desenvolvimento",
      body: "Seis agentes em sequência analisam os arquivos de um cliente e redigem relatórios. O modelo lê e escreve; preços e cálculos ficam no código.",
    },
  ],
  diagram: {
    ascii: `  WhatsApp ──> Meta Cloud API ──> webhook ──> [ fila de entrada ]
                                 HMAC ok · 200         │
                                       pg_cron 5s · 7s de silêncio
                                                       v
  resposta <── WhatsApp <──── bot-agente ──> 11 tools ──> OpenAI
                                 │
                                 v
                         Postgres + RLS <──── app Next.js`,
    label:
      "As mensagens saem do WhatsApp, passam por um webhook verificado e entram numa fila no Postgres. Um cron de 5 segundos agrupa a rajada de cada remetente depois de 7 segundos de silêncio e entrega ao agente, que chama suas ferramentas e a OpenAI e responde no WhatsApp. O app web lê o mesmo Postgres com row-level security.",
    caption:
      "As pessoas mandam mensagens em rajadas. O webhook só verifica e enfileira, então responde à Meta na hora; um cron agrupa a rajada de cada remetente depois de 7 segundos de silêncio e entrega ao agente como um único turno.",
  },
  decisions: [
    {
      title: "Levar todas as automações do n8n para código versionado",
      body: "Cada função entrou primeiro em modo sombra: registrava o que faria, sem escrever nada. Uma flag a colocava no ar, e um único update fazia o rollback. A cobrança e o bot seguiram funcionando o tempo todo, e o servidor dedicado foi desligado.",
    },
    {
      title: "Fila e debounce no Postgres",
      body: "Idempotente pelo id da mensagem, com lotes travados recuperados. O custo é uma resposta que espera pelo menos 7 segundos, em troca de uma resposta coerente em vez de cinco fragmentos.",
    },
    {
      title: "Manter o gateway do WhatsApp atrás de um único módulo",
      body: "Envio e recebimento nunca vazaram para o agente, as ferramentas ou a cobrança. Foi essa fronteira que transformou o incidente abaixo numa correção de cinco dias, e não numa reescrita.",
    },
  ],
  highlight: {
    title: "O incidente",
    figure: "5 dias",
    figureCaption: "do banimento à API oficial em produção",
    line: "O bot rodava num gateway não oficial de WhatsApp, e o número foi banido.",
    body: "Escrevi o plano de migração no mesmo dia e entreguei em três fases: um webhook assinado, envio pela Graph API e templates aprovados para mensagens fora da janela de 24 horas. O agente, as ferramentas, a fila e a cobrança não mudaram. A lição que levo para todo projeto: escolher a API oficial cedo e manter dependências externas atrás de uma interface.",
  },
  ai: {
    stats: [
      { figure: "156 / 206", caption: "commits em coautoria com o Claude Code" },
    ],
    notes: [
      "Nove documentos de sistema escritos para agentes e para pessoas, atualizados na mesma mudança que o código.",
      "Planos em fases antes do código, trabalho no banco via MCP e uma branch de staging que só chega à produção quando eu decido.",
    ],
  },
  next: "Testes automatizados na cobrança e nas ferramentas do agente, headers de segurança globais e rate limiting; depois, lançar o escritório de agentes e o módulo de orçamentos.",
};

export const engpocket: CaseStudy = {
  slug: "engpocket",
  copy: { pt, en: pt, es: pt },
};
