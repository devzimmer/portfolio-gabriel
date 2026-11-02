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
      locale-switcher.tsx
  i18n/
    routing.ts        # Locales, prefixo e cookie
    request.ts        # Mensagens e timezone por requisição
    navigation.ts     # Link/redirect com locale
  lib/
    seo.ts            # Helpers de metadata e hreflang
    site.ts           # Dados do site e links
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
