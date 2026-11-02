export const siteConfig = {
  name: "Gabriel Zimmer",
  role: "AI-Native Full Stack Developer",
  // TODO: substituir pelo domínio final assim que estiver configurado na Cloudflare.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfolio-gabriel.devzimmer.workers.dev",
  email: "dev.gabrielzimmer@gmail.com",
  location: "Brazil",
  links: {
    github: "https://github.com/devzimmer",
    linkedin: "https://www.linkedin.com/in/gabrielzimmerdev/",
  },
} as const;
