# Portfólio — Gabriel Dutra Zimmer

Site portfólio pessoal construído com Next.js, TypeScript, Tailwind CSS,
Framer Motion e Lucide, com deploy em Cloudflare Workers.

## Stack

| Camada        | Tecnologia                                                       |
| ------------- | ---------------------------------------------------------------- |
| Linguagem     | [TypeScript](https://www.typescriptlang.org/)                    |
| Framework     | [Next.js 16](https://nextjs.org/) (App Router)                   |
| CSS           | [Tailwind CSS 4](https://tailwindcss.com/)                       |
| Animações     | Canvas próprio (mãos em ASCII) e [Framer Motion](https://motion.dev/) no menu mobile |
| Testes        | [Vitest](https://vitest.dev/) e [Playwright](https://playwright.dev/) |
| Ícones        | [Lucide](https://lucide.dev/)                                    |
| i18n          | [next-intl](https://next-intl.dev/)                              |
| Deploy        | [Cloudflare Workers](https://developers.cloudflare.com/workers/) |
| CDN / DNS     | [Cloudflare](https://www.cloudflare.com/)                        |

O adapter usado para rodar Next.js na Cloudflare é o
[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare).

## Requisitos

- Node.js 22+ (versão fixada em `.nvmrc`)
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
| `npm run typecheck` | Gera os tipos de rota e roda o TypeScript             |
| `npm run check`    | Lint + typecheck                                       |
| `npm test`         | Testes unitários (Vitest)                              |
| `npm run test:e2e` | Testes end-to-end (Playwright)                         |
| `npm run preview`  | Build do OpenNext + preview local no runtime do Worker |
| `npm run deploy`   | Build do OpenNext + deploy na Cloudflare               |
| `npm run upload`   | Build do OpenNext + upload de uma nova versão           |
| `npm run cf-typegen` | Gera os tipos dos bindings da Cloudflare             |

## Estrutura

```text
messages/{en,pt,es}.json  # Textos curtos de UI (hoje todos em português; tradução pendente)
src/
  app/
    [locale]/
      layout.tsx              # Layout por idioma, metadados, hreflang e JSON-LD
      page.tsx                # Home: hero, em resumo, trabalhos, processo, experiência, contato
      work/[slug]/page.tsx    # Página de case (gerada estaticamente por slug)
    sitemap.ts                # Home e cases em todos os idiomas
  components/
    ascii/                    # Mãos em ASCII: engine pura + componente <canvas>
    case/                     # Blocos das páginas de case
    layout/                   # Header, footer, menu mobile, seletor de idioma
    sections/                 # Seções da home
    ui/                       # SectionLabel e ButtonLink
  content/
    cases/                    # Conteúdo tipado de cada case (pt; en/es reaproveitam)
    experience.ts             # Trajetória profissional
  lib/
    case-routes.ts            # Detecta slugs de case inexistentes (usado no proxy)
    site.ts                   # Dados do site, links e caminho do CV
  proxy.ts                    # Idioma (next-intl) e 404 de cases inexistentes
docs/
  design/                     # Referências do canvas aprovado
  superpowers/                # Spec e plano do redesign
e2e/                          # Testes end-to-end (Playwright)
```

## Design

O design aprovado ("A — Editorial") está descrito em
`docs/superpowers/specs/2026-11-05-portfolio-redesign-design.md`, com as
referências visuais em `docs/design/`.

- **Cores:** fundo `void` (#0A0A0A), texto `fog` (#F2F2F0), secundário `mute`
  (#A0A0A0) e `dim` (#8C8C8C); superfície clara `paper` com texto `ink` e `ash`.
- **Tipografia:** Geist, Geist Mono e Instrument Serif itálico.
- **Mãos em ASCII:** a seção Processo abre com duas mãos desenhadas em
  caracteres (a humana em densidade, a da máquina em símbolos de código), que se
  revelam ao entrar na tela e trocam uma faísca `-=>`. Respeita
  `prefers-reduced-motion` com um quadro estático.
- **Conteúdo:** as regras do que pode ou não ser dito sobre cada projeto estão
  na spec e são conferidas por testes em `src/content/cases/cases.test.ts`.

## Pendências antes de publicar

- Arte das mãos: a grade atual vem de uma imagem de referência e é
  placeholder; substituir por fonte própria (afresco de domínio público ou foto).
- Tradução de `en` e `es` (hoje reaproveitam o texto em português).
- Experiência anterior a 2026 (linha placeholder) e CV em `public/cv.pdf`.
- Screenshots dos projetos no lugar dos placeholders das páginas de case.
- Imagem Open Graph, favicon e Content Security Policy.

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
- Headers de segurança (HSTS, nosniff, frame, referrer, permissions) ficam em
  `next.config.ts`. A CSP será definida antes do lançamento.
- O CI (`.github/workflows/ci.yml`) roda lint, typecheck, testes unitários, build, testes e2e e audit em cada
  push e pull request.
- `npm run preview` valida o build completo no runtime da Cloudflare antes do
  deploy.
- O Proxy do Next.js 16 roda no runtime Node.js. O OpenNext o suporta em modo
  experimental; a negociação de idioma foi validada com `npm run preview` no
  runtime real do Worker.
