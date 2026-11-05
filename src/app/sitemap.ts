import type { MetadataRoute } from "next";
import { cases } from "@/content/cases";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";

function entry(path: string, priority: number): MetadataRoute.Sitemap[number][] {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${siteConfig.url}/${locale}${path}`]),
  );

  return routing.locales.map((locale) => ({
    url: `${siteConfig.url}/${locale}${path}`,
    alternates: { languages },
    changeFrequency: "monthly",
    priority: locale === routing.defaultLocale ? priority : priority * 0.8,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...entry("", 1),
    ...cases.flatMap(({ slug }) => entry(`/work/${slug}`, 0.8)),
  ];
}
