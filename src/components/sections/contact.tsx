import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/lib/site";

export async function Contact() {
  const t = await getTranslations("Contact");
  const links = [
    { label: t("linkedin"), href: siteConfig.links.linkedin, mark: "↗", external: true },
    { label: t("github"), href: siteConfig.links.github, mark: "↗", external: true },
    { label: t("cv"), href: siteConfig.cvPath, mark: "↓", external: false },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="scroll-mt-18 border-t border-line px-gutter pt-28"
    >
      <div className="flex justify-between gap-4 border-b border-line pb-5 text-eyebrow uppercase text-mute">
        <span>{t("label")}</span>
        <span className="flex items-center gap-2.5 font-mono">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-fog" />
          {t("status")}
        </span>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-12 pt-14 pb-24">
        <div className="min-w-0 flex-[999_1_40rem]">
          <h2
            id="contact-title"
            className="max-w-[18ch] text-[clamp(2.25rem,4.4vw,4.25rem)] leading-[0.98] font-medium tracking-[-0.04em]"
          >
            {t("title")} <em className="font-serif font-normal">{t("titleEmphasis")}</em>
          </h2>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-10 inline-flex min-h-12 items-center border-b border-fog/40 text-[clamp(1.25rem,2vw,1.75rem)] tracking-[-0.01em] transition-colors hover:border-fog"
          >
            {siteConfig.email}
          </a>
          <p className="mt-5 text-base leading-relaxed text-mute">{t("lede")}</p>
        </div>
        <ul className="flex-[1_1_17.5rem] border-t border-line">
          {links.map((link) => (
            <li key={link.href} className="border-b border-line">
              <a
                href={link.href}
                className="flex min-h-14 items-center justify-between text-[0.8125rem] uppercase tracking-[0.2em] hover:text-white"
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                <span>
                  {link.label}
                  {link.external ? <span className="sr-only"> ({t("newTab")})</span> : null}
                </span>
                <span aria-hidden="true">{link.mark}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
