import type { CaseCopy, CaseStudy } from "./types";

// Copy is authored in Portuguese; en/es reuse it until the translation pass.
// Content rules: Gabriel authorised naming the PL campaign (presidential race
// included) but no people's names. 12.844 / 98 mil are the TV Celular site's
// totals and are always phrased as the platform's numbers. Infra, serverless
// rendering scale-out and the cloud recorder were other team members' work.
const pt: CaseCopy = {
  title: "TV Celular",
  lede: "Lives de horas viravam cortes no ar no mesmo dia, escolhidos por um LLM e aprovados por gente.",
  card: {
    summary:
      "Na campanha do PL em 2026, construí a esteira que transformava as lives diárias da TV Celular em cortes verticais: gravação em blocos, escolha dos momentos por LLM, aprovação humana e render em 7 formatos. O site fechou o 1º turno com 12.844 cortes no ar.",
    stack: "Python · faster-whisper · FFmpeg · LLM · Next.js",
    meta: "2026 · Time de 5 · Eleições",
  },
  facts: [
    { label: "Papel", value: "AI-Native Full Stack Developer, terceirizado pela Aurea Tech" },
    { label: "Período", value: "Ago — Out 2026 · 1º turno" },
    { label: "Contexto", value: "Campanha do PL, incluindo a presidencial" },
    {
      label: "Stack",
      value: "Python · FastAPI · faster-whisper · MediaPipe · FFmpeg · Next.js · Cloudflare",
    },
  ],
  media: [
    {
      label: "[Recriação com dados fictícios: o editor de corte, com a linha do tempo e os trechos removidos]",
      caption:
        "A IA propõe o corte; a equipe ajusta início e fim, tira trechos internos e aprova. Só o que é aprovado vai para o render.",
    },
  ],
  problem: {
    lead: "A TV Celular, canal da campanha, fazia lives diárias de várias horas. A militância queria cortes curtos, prontos para postar, no mesmo dia, e a equipe não tinha acesso direto ao material gravado no estúdio.",
    body: "Construí a esteira da live ao corte publicado: captação, transcrição, escolha dos melhores momentos por LLM, aprovação humana e render. Também fiz o agente de WhatsApp que respondia candidatos e jornalistas com RAG. Tudo num time de cinco pessoas, com prazos de dias e rodando ao vivo.",
  },
  built: [
    {
      kicker: "Captação",
      title: "Um gravador operado por agente",
      body: "Gravava a live em blocos de 10 minutos com FFmpeg e entregava cada um numa pasta que a esteira vigiava. Um agente no Claude Code operava a gravação: acompanhava o monitor, religava quando caía e preenchia buracos pelo DVR do YouTube.",
    },
    {
      kicker: "Autocut",
      title: "Do bloco ao corte em 7 formatos",
      body: "Transcrição com faster-whisper, detecção de cenas, escolha dos momentos por LLM com nota de conteúdo, gancho e retenção, reenquadramento vertical com MediaPipe e render com FFmpeg.",
    },
    {
      kicker: "Curadoria",
      title: "Um editor para a equipe decidir",
      body: "A esteira para no plano e espera. No editor, a equipe ajusta início e fim, tira trechos internos e aprova. Só o corte aprovado é renderizado e publicado no site.",
    },
  ],
  diagram: {
    ascii: `  live ──> gravador (blocos de 10 min) ──> pasta vigiada
                                                 │
                                                 v
                             autocut: transcrição, cenas e nota do LLM
                                                 │
                                                 v
                                 editor: a equipe ajusta e aprova
                                                 │
                                                 v
  site <── publicar <───────────────── render em 7 formatos`,
    label:
      "A live é gravada em blocos de 10 minutos e cai numa pasta vigiada. O autocut transcreve, detecta as cenas e pede a um LLM que dê nota aos melhores momentos, montando um plano de cortes. A equipe ajusta e aprova cada corte no editor; só então o render gera 7 formatos e o corte é publicado no site.",
    caption:
      "A IA trabalha em escala e as pessoas decidem a qualidade. Nada vai ao ar sem uma aprovação humana, e o render só gasta máquina com o que foi aprovado.",
  },
  decisions: [
    {
      title: "Arco inteiro ou nada",
      body: "Um momento acima do tempo máximo é descartado, nunca encurtado. Aparar gerava cortes sem começo ou sem desfecho. O custo é ter menos cortes por live.",
    },
    {
      title: "A pasta é o estado do job",
      body: "A esteira não tem banco: a pasta onde o arquivo está diz em que fase ele está. Com prazo de dias, isso tirou uma peça inteira de infraestrutura. O custo foi menos visibilidade, compensada depois com um painel.",
    },
    {
      title: "Trocar de provedor de LLM sem parar",
      body: "No agente de WhatsApp da campanha, erro de conta, limite ou timeout abre um disjuntor de 5 minutos e as chamadas vão para o outro provedor (Anthropic ou OpenAI). Recusa do modelo não aciona a troca. O custo é a resposta vir de outro modelo.",
    },
  ],
  highlight: {
    title: "Em escala, ao vivo",
    figure: "12.844",
    figureCaption: "cortes no ar no site da TV Celular, no 1º turno",
    line: "No primeiro dia em escala, a esteira fez 252 publicações.",
    body: "Uma live de 2 horas virava cortes prontos em menos de uma hora. A equipe aprovou entre 86% e 89% dos cortes sugeridos, dependendo da nota dada pelo LLM. O site chegou a 98 mil downloads de cortes prontos para postar.",
  },
  ai: {
    stats: [
      { figure: "~700", caption: "testes pytest que escrevi para o autocut" },
      { figure: "−64%", caption: "de custo por chamada no agente, com cache de prompt" },
    ],
    notes: [
      "ADRs para cada decisão da esteira, um AGENTS.md por módulo e specs com plano antes do código. Todo merge passou por pull request.",
      "O gravador era operado por um agente: eu passava o link da live e ele cuidava da gravação, do monitor e da recuperação de buracos.",
      "O agente de WhatsApp tinha um gate de avaliação contra o endpoint real, que passou em 23 de 23 casos de regra.",
    ],
  },
  next: "O sistema foi arquivado depois da eleição. Numa próxima, eu começaria a captação na nuvem desde o primeiro dia e daria à esteira um banco de estado desde o início, em vez de depender da estrutura de pastas.",
};

export const tvCelular: CaseStudy = {
  slug: "tv-celular",
  copy: { pt, en: pt, es: pt },
};
