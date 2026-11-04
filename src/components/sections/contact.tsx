import { ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/site";

const links = [
  {
    key: "linkedin",
    label: "LinkedIn",
    href: siteConfig.links.linkedin,
  },
  {
    key: "github",
    label: "GitHub",
    href: siteConfig.links.github,
  },
] as const;

export async function Contact() {
  const t = await getTranslations("Contact");

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-24 border-t border-line bg-ink px-gutter py-section text-fog"
    >
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
          <h2 id="contact-title" className="text-eyebrow uppercase text-mute">
            {t("label")}
          </h2>
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-mute">
            {t("meta")}
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <p className="text-balance text-headline lg:col-span-7">
            {t.rich("headline", {
              em: (chunks) => (
                <em className="font-serif font-normal italic">{chunks}</em>
              ),
            })}
          </p>

          <div className="lg:col-span-5 lg:border-l lg:border-line lg:pl-10 xl:pl-14">
            <p className="text-body-lg text-fog/80">{t("description")}</p>

            <p className="mt-6 flex items-center gap-2.5 text-small text-fog">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-paper"
              />
              {t("availability")}
            </p>
            <p className="mt-2 text-eyebrow uppercase text-mute">
              {t("location")}
            </p>
          </div>
        </div>

        <a
          href={`mailto:${siteConfig.email}`}
          className="group mt-16 flex items-center justify-between gap-4 border-y border-line py-8 lg:mt-24 lg:py-10"
        >
          <span className="text-email break-words text-fog transition-colors duration-300 group-hover:text-paper">
            {siteConfig.email}
          </span>
          <ArrowUpRight
            aria-hidden="true"
            strokeWidth={1.5}
            className="hidden size-6 shrink-0 text-mute transition-[color,transform] duration-300 ease-[var(--ease-editorial)] group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-fog sm:block"
          />
        </a>

        <ul className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          {links.map((link) => (
            <li key={link.key}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-eyebrow uppercase text-fog transition-colors hover:text-paper"
              >
                {link.label}
                <ArrowUpRight
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-3.5 text-mute transition-[color,transform] duration-300 ease-[var(--ease-editorial)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fog"
                />
                <span className="sr-only">({t("newTab")})</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
