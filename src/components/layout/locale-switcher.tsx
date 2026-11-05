"use client";

import { type Locale, useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeNames: Record<Locale, string> = {
  en: "English",
  pt: "Português",
  es: "Español",
};

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t("label")} className="flex items-center gap-1">
      {routing.locales.map((item) => {
        const isActive = item === locale;

        return (
          <Link
            key={item}
            href={pathname}
            locale={item}
            hrefLang={item}
            aria-label={`${item.toUpperCase()} — ${localeNames[item]}`}
            aria-current={isActive ? "true" : undefined}
            className={
              isActive
                ? "inline-flex min-h-11 min-w-11 items-center justify-center text-eyebrow uppercase text-fog underline underline-offset-4"
                : "inline-flex min-h-11 min-w-11 items-center justify-center text-eyebrow uppercase text-mute transition-colors hover:text-fog"
            }
          >
            {item.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
