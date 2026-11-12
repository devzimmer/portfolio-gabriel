import type { StaticImageData } from "next/image";
import type { Locale } from "next-intl";

export type CaseSlug = "engpocket" | "duzi-crm" | "lumuviz" | "tv-celular";

export type CaseMediaItem = {
  label: string;
  caption: string;
  image?: StaticImageData;
  /** CSS max width in px; phone captures are 2x, so this is half their pixel width. */
  displayWidth?: number;
  /** Spans the full media row (desktop screenshots next to phone captures). */
  wide?: boolean;
};

export type CaseCopy = {
  title: string;
  lede: string;
  card: { summary: string; stack: string; meta: string };
  facts: { label: string; value: string }[];
  /** With `image`, `label` is the alt text; without it, a labelled placeholder is shown. */
  media: CaseMediaItem[];
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
