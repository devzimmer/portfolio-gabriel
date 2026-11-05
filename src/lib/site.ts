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
  // CV is published together with the site; the file lands in public/ before launch.
  cvPath: "/cv.pdf",
  // WhatsApp is offered to Brazilian recruiters only. Set the number (any
  // format, country code included) to show the button on the pt pages.
  whatsapp: {
    number: null as string | null,
    locales: ["pt"] as const,
  },
  countryCode: "BR",
  links: {
    github: "https://github.com/devzimmer",
    linkedin: "https://www.linkedin.com/in/gabrielzimmerdev/",
  },
} as const;
