import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu } from "./mobile-menu";

const navItems = [
  { key: "about", href: "#about" },
  { key: "projects", href: "#projects" },
  { key: "experience", href: "#experience" },
  { key: "contact", href: "#contact" },
] as const;

export async function SiteHeader() {
  const t = await getTranslations("Nav");
  const items = navItems.map(({ key, href }) => ({
    label: t(key),
    href,
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center justify-between gap-6 px-gutter md:h-18">
        <Link
          href="/"
          aria-label={`${siteConfig.name} — ${t("home")}`}
          className="group flex items-center gap-2.5"
        >
          <span className="text-[0.9375rem] font-medium tracking-[0.16em] text-fog">
            GZ
          </span>
          <span
            aria-hidden="true"
            className="size-1.5 bg-paper transition-transform duration-300 ease-[var(--ease-editorial)] group-hover:rotate-45"
          />
        </Link>

        <nav
          aria-label={t("label")}
          className="hidden items-center gap-8 md:flex"
        >
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative py-2 text-eyebrow uppercase text-mute transition-colors hover:text-fog"
            >
              {item.label}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-fog transition-transform duration-300 ease-[var(--ease-editorial)] group-hover:scale-x-100"
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <div className="hidden md:block">
            <LocaleSwitcher />
          </div>
          <MobileMenu items={items} siteName={siteConfig.name} />
        </div>
      </div>
    </header>
  );
}
