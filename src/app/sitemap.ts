import type { MetadataRoute } from "next";
import { cases } from "@/content/cases";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `${siteConfig.url}/${routing.defaultLocale}`;
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...cases.map(({ slug }) => ({
      url: `${base}/work/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
