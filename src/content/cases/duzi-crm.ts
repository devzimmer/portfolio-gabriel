import type { CaseCopy, CaseStudy } from "./types";

// Copy is authored in Portuguese; en/es reuse it until the translation pass.
// Content rules: no usage numbers; the Meta Tech Provider approval may be cited.
const pt: CaseCopy = {
  title: "Duzi CRM",
  lede: "Um CRM de WhatsApp em que cada empresa traz o próprio número e nunca enxerga os dados de outra.",
  card: {
    summary:
      "Um CRM de WhatsApp multi-inquilino sobre a Cloud API oficial da Meta, aprovado como Tech Provider. O isolamento entre empresas é garantido no Postgres e conferido por ~2.300 asserções pgTAP; o assistente de IA somente leitura tirou 30/30 na avaliação.",
    stack: "Supabase · Postgres RLS · Deno · React",
    meta: "2026 · Solo · No ar",
  },
  facts: [
    { label: "Papel", value: "Solo, do produto à produção" },
    { label: "Período", value: "Set — Nov 2026 · 119 PRs" },
    { label: "Status", value: "No ar · Tech Provider aprovado pela Meta" },
    { label: "Stack", value: "Supabase · Postgres · Deno · React 19 · Cloudflare" },
  ],
  media: [
    {
      label: "[Screenshot: a caixa de entrada compartilhada no layout Foco, na conta demo]",
      caption:
        "Vários atendentes no mesmo número, em tempo real, com a janela de 24 horas garantida no servidor.",
    },
  ],
  problem: {
    lead: "Pequenas empresas vendem pelo WhatsApp, mas o app do celular não dá conta de vários atendentes, campanhas, funil de vendas nem métricas. A API oficial dá, desde que você opere um app Meta aprovado, um token por cliente, webhooks e limites de envio.",
    body: "O Duzi CRM opera um único app Meta aprovado como Tech Provider. Cada empresa conecta a própria conta e o próprio número pelo Embedded Signup, e continua usando o WhatsApp Business no celular ao mesmo tempo.",
  },
  built: [
    {
      title: "Onboarding autoatendido",
      body: "Embedded Signup com coexistência: a empresa conecta o número em poucos cliques, e o token dela vai para o Vault, um por conexão.",
    },
    {
      title: "O CRM em volta",
      body: "Caixa de entrada compartilhada, contatos e listas, funis de vendas, campanhas de WhatsApp e e-mail, lucro por UTM, formulários e automações “quando → se → faça”.",
    },
    {
      title: "Gab, um assistente de IA somente leitura",
      body: "Responde com as permissões de quem pergunta, cita as fontes, filtra links contra exfiltração por prompt injection e é avaliado num conjunto de 30 casos.",
    },
  ],
  diagram: {
    ascii: `  navegador ──▶ Cloudflare Worker ──▶ app React
                                        │  JWT do usuário
                  ┌─────────────────────┴──────────────┐
                  ▼                                    ▼
       Postgres + RLS (org_id)              Edge Functions (Deno)
                                                       │  membership ✓
                                                       ▼
                                  duzi_server ──▶ private.* ──▶ Vault
                                                       um token por cliente`,
    label:
      "O navegador carrega um app React por um Cloudflare Worker. Com o JWT do usuário, ele lê o Postgres sob row-level security por organização ou chama Edge Functions em Deno. Elas conferem a membership no banco e agem por um papel Postgres dedicado, que só executa funções privadas de servidor; só essas funções leem o token Meta de cada cliente no Vault.",
    caption:
      "Três barreiras ficam antes de um token da Meta: o JWT do usuário, a membership conferida no banco e um papel Postgres dedicado que só executa funções de servidor. O papel de serviço padrão da plataforma nunca toca o Vault.",
  },
  decisions: [
    {
      title: "Um papel de banco dedicado para os segredos",
      body: "Uma revisão de segurança mostrou que o service role do Supabase lê o Vault inteiro e não pode ser revogado. Criei um papel de login sem tabelas, filas nem acesso ao Vault, que só executa funções de servidor, garantido por uma checagem do catálogo do banco no CI.",
    },
    {
      title: "Gravar e enfileirar antes de responder à Meta",
      body: "Cada evento do webhook é gravado e enfileirado na mesma transação antes de o 200 voltar. Nada fica só em memória; se o banco falha, a Meta reenvia. O custo é uma resposta mais lenta.",
    },
    {
      title: "Recomeçar limpo em vez de crescer um fork",
      body: "A primeira versão era um fork open source endurecido, para um único cliente. Ao virar multi-inquilino, o modelo de token e de inquilino dele não servia mais; recomecei e portei as partes provadas, módulo a módulo. Desde então, toda migration tem rollback, testado up, down e up de novo no CI.",
    },
  ],
  highlight: {
    title: "Prova, não promessa",
    figure: "~2.300",
    figureCaption: "asserções pgTAP no banco",
    line: "O isolamento entre empresas é testado, não presumido.",
    body: "Uma matriz entre inquilinos quebra o build quando uma tabela nova com id de organização não é registrada. Uma checagem do catálogo barra tabelas sem row-level security e policies que sempre passam. Cerca de 945 testes em Deno cobrem as Edge Functions, e um job de concorrência roda dois workers contra o ledger de limite de envio em todo pull request.",
  },
  ai: {
    stats: [
      { figure: "210 / 221", caption: "commits em coautoria com o Claude Code" },
      {
        figure: "30 / 30",
        caption: "na avaliação do assistente, incluindo os dois casos de prompt injection",
      },
    ],
    notes: [
      "AGENTS.md com 13 regras de segurança, 21 registros de decisão e um plano por fase, aprovado por mim antes de qualquer código.",
      "Todo pull request que toca autenticação, tokens, RLS ou webhooks passa por uma revisão de segurança dedicada, feita por subagentes; os achados viram correções e testes.",
    ],
  },
  next: "Passar a Content Security Policy de report-only para bloqueio assim que o fluxo de signup da Meta rodar limpo, criar alertas para eventos mortos do webhook e separar staging de produção.",
};

export const duziCrm: CaseStudy = {
  slug: "duzi-crm",
  copy: { pt, en: pt, es: pt },
};
