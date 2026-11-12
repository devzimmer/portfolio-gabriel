import type { Locale } from "next-intl";

export type CaseSlug = "engpocket" | "duzi-crm" | "lumuviz" | "tv-celular";

export type CaseCopy = {
  title: string;
  lede: string;
  card: { summary: string; stack: string; meta: string };
  facts: { label: string; value: string }[];
  media: { label: string; caption: string }[];
  problem: { lead: string; body: string };
  built: { kicker?: string; title: string; tag?: string; body: string }[];
  diagram: { ascii: string; label: string; caption: string };
  decisions: { title: string; body: string }[];
  highlight: {
    title: string;
    figure: string;
    figureCaption: string;
    line: string;
    body: string;
  };
  ai: { stats: { figure: string; caption: string }[]; notes: string[] };
  next: string;
};

export type CaseStudy = { slug: CaseSlug; copy: Record<Locale, CaseCopy> };
