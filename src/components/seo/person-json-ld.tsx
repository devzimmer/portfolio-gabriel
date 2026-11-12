import type { Locale } from "next-intl";
import { portraitImage } from "@/lib/portrait";
import { siteConfig } from "@/lib/site";

type PersonJsonLdProps = {
  locale: Locale;
};

// schema.org Person data so search engines can associate the site with the
// person's name, role and public profiles.
export function PersonJsonLd({ locale }: PersonJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    description: siteConfig.summary,
    knowsAbout: siteConfig.knowsAbout,
    knowsLanguage: ["pt-BR", "en", "es"],
    worksFor: {
      "@type": "Organization",
      name: "Duzi Tecnologia",
    },
    seeks: {
      "@type": "Demand",
      description: siteConfig.seeking,
    },
    url: `${siteConfig.url}/${locale}`,
    image: `${siteConfig.url}${portraitImage.src}`,
    email: `mailto:${siteConfig.email}`,
    address: {
      "@type": "PostalAddress",
      addressCountry: siteConfig.countryCode,
    },
    sameAs: Object.values(siteConfig.links),
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so a value can never close the script tag (XSS guard).
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
