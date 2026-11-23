import type { StaticImageData } from "next/image";
import type { Locale } from "next-intl";

export type CaseSlug = "engpocket" | "duzi-crm" | "lumuviz";

export type CaseMediaItem = {
  /** Alt text for the image, or the description shown in a placeholder tile. */
  label: string;
  caption: string;
  image?: StaticImageData;
  /**
   * Tile width in the case's bento grid (12 columns from tablet up): full = 12,
   * wide = 7, half = 6, narrow = 5. Rows should add up to 12. Default: half.
   */
  span?: "full" | "wide" | "half" | "narrow";
  /** object-position for the cropped preview of a screen capture. Default: left top. */
  focus?: string;
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
