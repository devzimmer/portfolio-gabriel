import { duziCrm } from "./duzi-crm";
import { engpocket } from "./engpocket";
import { lumuviz } from "./lumuviz";
import { tvCelular } from "./tv-celular";
import type { CaseSlug, CaseStudy } from "./types";

export type { CaseCopy, CaseSlug, CaseStudy } from "./types";

export const cases: readonly CaseStudy[] = [engpocket, duziCrm, lumuviz, tvCelular];

export function isCaseSlug(value: string): value is CaseSlug {
  return cases.some((study) => study.slug === value);
}

export function getCase(slug: string): CaseStudy | undefined {
  return cases.find((study) => study.slug === slug);
}

export function getCaseNeighbours(slug: CaseSlug): {
  previous?: CaseStudy;
  next?: CaseStudy;
} {
  const index = cases.findIndex((study) => study.slug === slug);
  return { previous: cases[index - 1], next: cases[index + 1] };
}
