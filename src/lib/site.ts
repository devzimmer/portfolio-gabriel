export const siteConfig = {
  name: "Gabriel Zimmer",
  firstName: "Gabriel",
  lastName: "Zimmer",
  role: "AI-Native Full Stack Developer",
  // English on purpose: read by search engines and AI assistants (JSON-LD, /llms.txt).
  summary:
    "AI-native full stack developer and product engineer based in Brazil (UTC−3). Builds and runs production software end to end with AI coding agents: TypeScript, Next.js, React, Node.js, Python, Supabase and PostgreSQL.",
  seeking: "Remote roles as Full Stack Developer, AI Engineer or Product Engineer.",
  knowsAbout: [
    "Full-stack development",
    "AI agents",
    "LLM applications",
    "Retrieval-augmented generation (RAG)",
    "Claude Code",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "FastAPI",
    "PostgreSQL",
    "Supabase",
    "Row-level security",
    "Cloudflare Workers",
    "WhatsApp Business API",
    "Multi-tenant SaaS",
  ],
  // TODO: substituir pelo domínio final assim que estiver configurado na Cloudflare.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfolio-gabriel.devzimmer.workers.dev",
  email: "dev.gabrielzimmer@gmail.com",
  // CV is published together with the site; the file lands in public/ before launch.
  cvPath: "/cv.pdf",
  // WhatsApp is offered to Brazilian recruiters only. Set the number (any
  // format, country code included) to show the button on the pt pages.
  whatsapp: {
    number: "+55 51 99773-0087" as string | null,
    locales: ["pt"] as const,
  },
  countryCode: "BR",
  links: {
    github: "https://github.com/devzimmer",
    linkedin: "https://www.linkedin.com/in/gabrielzimmerdev/",
  },
} as const;
