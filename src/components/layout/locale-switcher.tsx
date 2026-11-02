"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeNames: Record<string, string> = {
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
            aria-label={localeNames[item]}
            aria-current={isActive ? "true" : undefined}
            className={
              isActive
                ? "rounded-full px-2.5 py-1 text-xs font-medium tracking-wide text-neutral-100"
                : "rounded-full px-2.5 py-1 text-xs font-medium tracking-wide text-neutral-500 transition-colors hover:text-neutral-300"
            }
          >
            {item.toUpperCase()}
          </Link>
        );
      })}
    </nav>
  );
}
