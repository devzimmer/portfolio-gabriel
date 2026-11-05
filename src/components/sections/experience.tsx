import { getLocale, getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button-link";
import { experience } from "@/content/experience";
import { siteConfig } from "@/lib/site";

export async function Experience() {
  const [t, locale] = await Promise.all([
    getTranslations("Experience"),
    getLocale(),
  ]);

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="scroll-mt-18 px-gutter pt-28 pb-24"
    >
      <div className="flex justify-between gap-4 border-b border-line pb-5 text-eyebrow uppercase text-mute">
        <span>{t("label")}</span>
        <span className="font-mono">{t("meta")}</span>
      </div>
      <h2
        id="experience-title"
        className="mt-14 max-w-[20ch] text-[clamp(1.875rem,3.4vw,3rem)] leading-[1.02] font-medium tracking-[-0.03em]"
      >
        {t("title")} <em className="font-serif font-normal">{t("titleEmphasis")}</em>
      </h2>
      <ol className="mt-14 border-t border-line">
        {experience[locale].map((entry) => (
          <li
            key={entry.title}
            className="flex flex-wrap gap-8 border-b border-line py-10"
          >
            <span className="flex-[0_0_12.5rem] font-mono text-xs uppercase tracking-[0.16em] text-mute">
              {entry.period}
            </span>
            <div className="min-w-0 flex-[999_1_26rem]">
              <h3 className="text-[1.375rem] font-medium tracking-[-0.015em]">
                {entry.title}
              </h3>
              <p className="mt-3 max-w-[64ch] text-base leading-relaxed text-mute">
                {entry.description}
              </p>
            </div>
            <span className="flex-[1_1_10rem] font-mono text-eyebrow uppercase tracking-[0.16em] text-mute">
              {entry.location}
            </span>
          </li>
        ))}
      </ol>
      <ButtonLink href={siteConfig.cvPath} variant="outline" className="mt-10">
        {t("cv")}
      </ButtonLink>
    </section>
  );
}
