import type { Locale } from "next-intl";
import { isCaseSlug } from "@/content/cases";
import { routing } from "@/i18n/routing";

const casePath = /^\/([^/]+)\/work\/([^/]+)\/?$/;

/**
 * Returns the locale when `pathname` is a case-study URL whose slug does not
 * exist, so the proxy can answer with a real 404 before the streamed shell
 * (Partial Prefetching) commits a 200.
 */
export function unknownCaseLocale(pathname: string): Locale | null {
  const match = casePath.exec(pathname);
  if (!match) return null;
  const [, locale, slug] = match;
  if (!routing.locales.includes(locale as Locale)) return null;
  return isCaseSlug(slug) ? null : (locale as Locale);
}
