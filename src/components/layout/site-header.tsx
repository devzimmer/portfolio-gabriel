import { getLocale, getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button-link";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { MobileMenu } from "./mobile-menu";

const sectionIds = ["work", "process", "experience", "contact"] as const;

export async function SiteHeader() {
  const [t, locale] = await Promise.all([getTranslations("Nav"), getLocale()]);
  const items = sectionIds.map((id) => ({
    label: t(id),
    href: `/${locale}#${id}`,
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-void/80 backdrop-blur-md">
      <div className="mx-auto flex h-18 w-full max-w-[90rem] items-center justify-between gap-6 px-gutter">
        <Link
          href="/"
          aria-label={`${siteConfig.name}, ${t("home")}`}
          className="flex min-h-11 items-center text-[0.9375rem] font-medium tracking-[0.16em] text-fog"
        >
          GZ
        </Link>

        <nav aria-label={t("label")} className="hidden items-center gap-8 md:flex">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="inline-flex min-h-11 items-center text-eyebrow uppercase text-mute transition-colors hover:text-fog"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ButtonLink
            href={siteConfig.cvPath}
            variant="outline"
            className="hidden min-h-11 text-[0.6875rem] tracking-[0.22em] md:inline-flex"
          >
            {t("cv")}
          </ButtonLink>
          <MobileMenu items={items} siteName={siteConfig.name} />
        </div>
      </div>
    </header>
  );
}
