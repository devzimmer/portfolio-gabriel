import { routing } from "@/i18n/routing";

export const openGraphLocale: Record<
  (typeof routing.locales)[number],
  string
> = {
  en: "en_US",
  pt: "pt_BR",
  es: "es_ES",
};

export function getLanguageAlternates(): Record<string, string> {
  return {
    ...Object.fromEntries(
      routing.locales.map((locale) => [locale, `/${locale}`]),
    ),
    "x-default": `/${routing.defaultLocale}`,
  };
}
