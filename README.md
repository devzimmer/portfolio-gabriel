# Portfólio — Gabriel Dutra Zimmer

Site portfólio pessoal construído com Next.js, TypeScript, Tailwind CSS,
Framer Motion e Lucide, com deploy em Cloudflare Workers.

## Stack

| Camada        | Tecnologia                                                       |
| ------------- | ---------------------------------------------------------------- |
| Linguagem     | [TypeScript](https://www.typescriptlang.org/)                    |
| Framework     | [Next.js 16](https://nextjs.org/) (App Router)                   |
| CSS           | [Tailwind CSS 4](https://tailwindcss.com/)                       |
| Animações     | [Framer Motion](https://motion.dev/)                             |
| Ícones        | [Lucide](https://lucide.dev/)                                    |
| i18n          | [next-intl](https://next-intl.dev/)                              |
| Deploy        | [Cloudflare Workers](https://developers.cloudflare.com/workers/) |
| CDN / DNS     | [Cloudflare](https://www.cloudflare.com/)                        |

O adapter usado para rodar Next.js na Cloudflare é o
[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare).

## Requisitos

- Node.js 20+ (recomendado 22+)
- npm
- Conta na Cloudflare (para deploy)

## Desenvolvimento

```bash
npm install
npm run dev
```

O site fica disponível em <http://localhost:3000>.

### Scripts

| Script             | Descrição                                              |
| ------------------ | ------------------------------------------------------ |
| `npm run dev`      | Servidor de desenvolvimento do Next.js                 |
| `npm run build`    | Build de produção do Next.js                           |
| `npm run start`    | Sobe o build do Next.js localmente                     |
| `npm run lint`     | Roda o ESLint                                          |
| `npm run preview`  | Build do OpenNext + preview local no runtime do Worker |
| `npm run deploy`   | Build do OpenNext + deploy na Cloudflare               |
| `npm run upload`   | Build do OpenNext + upload de uma nova versão           |
| `npm run cf-typegen` | Gera os tipos dos bindings da Cloudflare             |

## Estrutura

```text
messages/
  en.json             # Traduções em inglês (padrão)
  pt.json             # Traduções em português
  es.json             # Traduções em espanhol
src/
  app/
    [locale]/
      layout.tsx      # Layout raiz por idioma, metadados e hreflang
      page.tsx        # Página inicial
    globals.css       # Tailwind
    robots.ts         # robots.txt
    sitemap.ts        # sitemap com alternates por idioma
  components/
    layout/
      site-header.tsx     # Header fixo, monograma e navegação
      mobile-menu.tsx     # Overlay mobile com focus trap
      locale-switcher.tsx # Seletor EN / PT / ES
    sections/
      hero.tsx            # Hero editorial com retrato
      about.tsx           # Seção Sobre com posicionamento e foco
  i18n/
    routing.ts        # Locales, prefixo e cookie
    request.ts        # Mensagens e timezone por requisição
    navigation.ts     # Link/redirect com locale
  lib/
    motion.ts         # Tokens de easing e duração
    portrait.ts       # Retrato otimizado e blur placeholder
    seo.ts            # Helpers de metadata e hreflang
    site.ts           # Dados do site e links
  assets/
    portrait-gabriel-zimmer.webp # Retrato otimizado (170 KB)
  proxy.ts            # Negociação de idioma (Next 16 Proxy)
wrangler.jsonc        # Configuração do Worker (Cloudflare)
open-next.config.ts   # Configuração do adapter OpenNext
```

O front-end será construído incrementalmente a partir desta base.

## Internacionalização

- Idiomas: `en` (padrão), `pt` e `es`, sempre com prefixo (`/en`, `/pt`, `/es`).
- A raiz `/` negocia o idioma por `Accept-Language` e cookie, com fallback para inglês.
- A preferência fica no cookie `NEXT_LOCALE` por um ano.
- O seletor preserva o pathname atual ao trocar de idioma.
- Metadados, canonical, `hreflang`, `sitemap.xml` e `robots.txt` são localizados.
- Nenhuma geolocalização por IP é utilizada.

## Design System

- **Cores:** `ink` (#171717), `graphite` (#242424), `paper` (#F2F2F0), `fog`
  (#F5F5F5), `mute` (#A0A0A0), `ash` (#5F5F5F) para texto secundário sobre
  superfícies claras, `line` (branco a 12%) e `line-ink` (tinta a 14%).
- **Tipografia:** Geist para display/UI, Geist Mono para detalhes técnicos e
  Instrument Serif para o acento editorial em itálico.
- **Escala fluida:** tokens `display`, `headline`, `title`, `body-lg`, `body`,
  `small`, `serif` e `eyebrow`, com `clamp()`.
- **Ritmo:** `gutter` e `section` como tokens de espaçamento responsivo.
- **Movimento:** easing `cubic-bezier(0.22, 1, 0.36, 1)` e durações em
  `src/lib/motion.ts`, com respeito a `prefers-reduced-motion`.

## Header e navegação

- Header fixo (`sticky`) com monograma, navegação e seletor de idioma.
- No mobile, a navegação abre em um overlay em tela cheia, renderizado via
  portal no `<body>` para não ser limitado pelo `backdrop-filter` do header.
- O overlay bloqueia o scroll da página, prende o foco, fecha com `Esc` e
  devolve o foco ao botão que o abriu.
- Os links de navegação apontam para `#about`, `#projects`, `#experience` e
  `#contact`; About já existe, as demais seções vêm nas próximas etapas.

## Hero

- Composição editorial em duas colunas: painel escuro com nome, tagline e
  disponibilidade à esquerda; retrato em preto e branco à direita.
- Nome em caixa alta em duas linhas, com o token fluido `text-hero`
  (`clamp(3.5rem, 9.2vw, 11rem)`).
- Abaixo de `lg` o hero empilha o texto e a imagem, mantendo o retrato em
  proporção vertical.
- A foto original (2,2 MB) foi convertida para WebP de 170 KB em
  `src/assets/portrait-gabriel-zimmer.webp`; o `next/image` gera as variantes
  responsivas pelo binding `IMAGES` da Cloudflare, com `priority`, `sizes` e
  blur placeholder.
- A fonte tem 1021 px de largura; a imagem nunca é ampliada acima disso.

## About

- Seção clara (`paper`) logo após o hero escuro, criando o contraste editorial
  entre as duas primeiras dobras.
- Cabeçalho com numeração (`01 — About`) e metadado à direita, separados por
  um hairline.
- Grid de 12 colunas: headline em `text-headline` ocupando 7 colunas, com
  acento em Instrument Serif itálico via `t.rich`; bio em duas colunas de texto
  com divisor vertical em `lg`.
- Quatro frentes de atuação (`Architecture`, `Product`, `Infrastructure`,
  `AI in the process`) em uma grade de hairlines, numeradas de `01` a `04`.
- O texto é posicionamento profissional, sem empresas, datas ou resultados
  inventados; deve ser substituído pela bio real quando ela for fornecida.
- Superfícies claras usam `data-surface="paper"` para inverter as cores de
  foco e seleção, mantendo o contraste e a acessibilidade.
- `scroll-mt-24` garante que o link `#about` não fique escondido sob o header
  fixo.

## Deploy na Cloudflare

1. Autentique o Wrangler:

   ```bash
   npx wrangler login
   ```

2. Crie o bucket R2 usado como cache incremental (uma única vez):

   ```bash
   npx wrangler r2 bucket create portfolio-gabriel-opennext-cache
   ```

3. Faça o deploy:

   ```bash
   npm run deploy
   ```

O Worker será publicado em `https://portfolio-gabriel.<seu-subdominio>.workers.dev`.

### Domínio próprio (CDN + DNS)

1. Adicione o domínio na Cloudflare e aponte os nameservers no registrador.
2. No dashboard, acesse **Workers & Pages → portfolio-gabriel → Settings →
   Domains & Routes** e adicione o domínio (ex.: `gabrieldutrazimmer.dev`).
3. A Cloudflare cria o registro DNS e emite o certificado automaticamente.
4. Atualize `siteConfig.url` em `src/lib/site.ts` com o domínio final e faça um
   novo deploy.

### Variáveis de ambiente

Para desenvolvimento local, copie `.dev.vars.example` para `.dev.vars`.
Em produção, configure as variáveis em **Workers & Pages → Settings →
Variables and Secrets** (ou via `wrangler secret put`).

## Notas

- `wrangler.jsonc` já configura os bindings de assets, cache R2 e otimização de
  imagens (`IMAGES`).
- O cache de assets estáticos é definido em `public/_headers`.
- `npm run preview` valida o build completo no runtime da Cloudflare antes do
  deploy.
- O Proxy do Next.js 16 roda no runtime Node.js. O OpenNext o suporta em modo
  experimental; a negociação de idioma foi validada com `npm run preview` no
  runtime real do Worker.
