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
src/
  app/
    layout.tsx        # Layout raiz, fontes e metadados
    page.tsx          # Página inicial
    globals.css       # Tailwind + tokens de estilo
  components/
    hero.tsx          # Seção de abertura (Framer Motion)
    site-header.tsx   # Cabeçalho fixo
    site-footer.tsx   # Rodapé
    tech-stack.tsx    # Grade com a stack do projeto
    icons.tsx         # Ícones de marca (GitHub/LinkedIn)
  lib/
    site.ts           # Nome, links e textos do site
wrangler.jsonc        # Configuração do Worker (Cloudflare)
open-next.config.ts   # Configuração do adapter OpenNext
```

Os dados pessoais, links e textos principais ficam centralizados em
`src/lib/site.ts` — atualize ali antes de publicar.

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
