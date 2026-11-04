export const siteConfig = {
  name: "Gabriel Zimmer",
  firstName: "Gabriel",
  lastName: "Zimmer",
  role: "AI-Native Full Stack Developer",
  // TODO: substituir pelo domínio final assim que estiver configurado na Cloudflare.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfolio-gabriel.devzimmer.workers.dev",
  email: "dev.gabrielzimmer@gmail.com",
  countryCode: "BR",
  links: {
    github: "https://github.com/devzimmer",
    linkedin: "https://www.linkedin.com/in/gabrielzimmerdev/",
  },
} as const;
