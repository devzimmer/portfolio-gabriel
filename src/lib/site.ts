export const siteConfig = {
  name: "Gabriel Dutra Zimmer",
  shortName: "Gabriel Zimmer",
  role: "Desenvolvedor de Software",
  description:
    "Portfólio de Gabriel Dutra Zimmer: projetos, experiência e experimentos com desenvolvimento web.",
  // TODO: atualize com o domínio final configurado na Cloudflare.
  url: "https://gabrieldutrazimmer.dev",
  location: "Brasil",
  copyrightYear: 2026,
  links: {
    github: "https://github.com/devzimmer",
    // Preencha quando estiver pronto — o link só aparece se estiver definido.
    linkedin: "",
    email: "",
  },
} as const;

export const navigation = [
  { label: "Início", href: "#inicio" },
  { label: "Stack", href: "#stack" },
] as const;
