import type { CaseCopy, CaseStudy } from "./types";

// Copy is authored in Portuguese; en/es reuse it until the translation pass.
// Content rules: pre-launch; numbers are benchmarks only; no test count until
// the suite is confirmed green; never mention how the .skp format was studied.
const pt: CaseCopy = {
  title: "Lumuviz",
  lede: "Modelar, renderizar, apresentar: ferramentas para arquitetos que ficaram de fora das grandes suítes.",
  card: {
    summary:
      "Uma linha de produtos para arquitetos: um modelador 3D com motor de geometria próprio que abre arquivos .skp sem o SketchUp, e um serviço de render com IA que transforma uma vista do modelo em imagem fotorrealista.",
    stack: "TypeScript · three.js · Electron · OpenAI",
    meta: "2026 · Solo · Pré-lançamento",
  },
  facts: [
    { label: "Papel", value: "Solo, produto e engenharia" },
    { label: "Período", value: "Mai — Nov 2026" },
    { label: "Status", value: "Pré-lançamento · 2026" },
    {
      label: "Stack",
      value: "TypeScript · three.js · Electron · Next.js · Supabase · OpenAI · Stripe",
    },
  ],
  media: [
    {
      label: "[GIF: empurrar/puxar com inferências no Lumuviz 3D]",
      caption: "Lumuviz 3D · o modelador",
    },
    {
      label: "[Antes / depois: vista do modelo → render com IA]",
      caption: "Lumuviz · o render com IA",
    },
  ],
  problem: {
    lead: "No Brasil, uma assinatura do SketchUp Pro custa cerca de R$ 2.400 por ano, e um render fotorrealista exige software caro e horas configurando luz e material. Estudantes e escritórios pequenos ficam de fora.",
    body: "Lumuviz é uma linha de produtos para eles: um modelador 3D vendido uma única vez, no fluxo que eles já conhecem, e um serviço de IA que transforma uma vista do modelo em render, controlado com o vocabulário do arquiteto.",
  },
  built: [
    {
      kicker: "Lumuviz 3D",
      title: "Um motor de geometria do zero",
      body: "Um modelo de fronteira com faces que se fundem sozinhas, empurrar/puxar, inferências e booleanas de sólidos, em TypeScript puro e sem dependências. Cerca de 40 ferramentas, incluindo paredes, vãos e escadas.",
    },
    {
      kicker: "Lumuviz 3D",
      title: ".skp de ida e volta, sem SketchUp",
      body: "Abre e salva arquivos do SketchUp preservando as coordenadas de textura. Sai como app de navegador e app Windows, com licença offline e atualizações por comprador.",
    },
    {
      kicker: "Lumuviz",
      title: "Render e edição por marcação",
      body: "Um print vira render fotorrealista em 40 a 85 segundos. Quem edita marca pontos e descreve a mudança; as edições se encadeiam numa árvore de versões. Os créditos rodam no Stripe e num ledger no Postgres.",
    },
  ],
  diagram: {
    ascii: `  [ chave de licença ] ──▶ dígitos ✓ ──▶ POST /v1/activate ──▶ proxy Cloudflare
                                                                       │
                                                                Edge Function
                                                                máquinas ≤ 2 ?
                                                                       │
  license.json ◀──────────── assinatura Ed25519 ◀───────────────────────┘
       │
       └──▶ toda abertura: verificada offline ✓      com internet: renova em silêncio`,
    label:
      "Ativação offline-first: os dígitos de conferência da chave são verificados, e o app faz um POST para o endpoint de ativação atrás de um proxy Cloudflare. Uma Edge Function confere se há no máximo duas máquinas ativas e devolve uma licença assinada com Ed25519. Toda abertura verifica essa assinatura offline; com internet, ela renova em silêncio.",
    caption:
      "O modelador precisa abrir sem internet. A ativação vincula a chave a uma máquina e é assinada no servidor; o app guarda só a chave pública, então um servidor falso ou um arquivo editado não passam na checagem. O proxy mantém um endereço fixo em cada cópia vendida, para o backend poder mudar sem atualizar o app.",
  },
  decisions: [
    {
      title: "Trocar o SDK proprietário por uma biblioteca aberta",
      body: "Os termos do SDK oficial impedem a revenda. Reconstruí a ponte de arquivos sobre a OpenSKP (MIT), com a mesma interface, e validei num modelo real: 1.029 grupos e 12.267 faces, contagens idênticas às do SDK.",
    },
    {
      title: "Escolher o modelo de imagem por A/B medido",
      body: "Mesmo print, mesmo prompt e mesmo tamanho entre os candidatos, comparando tokens, custo e tempo. Escolhi a variante que melhor preservava materiais e cores da entrada, não a mais barata.",
    },
    {
      title: "Encadear edições em vez de remendar pixels",
      body: "A recomposição por pixels mantinha exatas as áreas não tocadas, mas deixava fantasmas e costuras. Encadear cada edição na resposta anterior do modelo reduziu a deriva em três edições de 25% para 10% dos pixels longe das marcas. O custo: a preservação deixa de ser exata.",
    },
  ],
  highlight: {
    title: "Medido, não chutado",
    figure: "−58–73%",
    figureCaption: "de custo por render, em benchmark",
    line: "Toda mudança no render vem com os próprios números.",
    body: "A troca de modelo também cortou o tempo de render em 21–55%. Quando as edições voltaram borradas, medi a nitidez, passei o downscale para dentro com Lanczos e ajustei uma máscara de nitidez, recuperando cerca de 98% do original. Dois bugs só apareceram olhando a imagem, não a métrica.",
  },
  ai: {
    stats: [
      {
        figure: "159 / 175",
        caption: "commits em coautoria com o Claude Code, somando os dois produtos",
      },
    ],
    notes: [
      "Spec, plano e execução por subagentes. A spec marca cada decisão como minha ou do agente, e cada plano lista os casos-limite que o revisor precisa conferir.",
      "Sessões paralelas em worktrees separados, e uma execução autônoma durante a madrugada que relatou o que ficou pronto, o que foi testado, o que não foi e o que dependia de decisão minha.",
      "Um advisor de segurança do banco achou uma função que deixava qualquer um gerar créditos sem login. Ela foi fechada numa migration antes do lançamento.",
    ],
  },
  next: "Lançar os dois produtos em 2026 e depois levar o render para dentro do modelador: mandar uma cena salva direto para o render com IA, sem sair do app.",
};

export const lumuviz: CaseStudy = {
  slug: "lumuviz",
  copy: { pt, en: pt, es: pt },
};
