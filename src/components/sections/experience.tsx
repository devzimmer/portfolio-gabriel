import { getTranslations } from "next-intl/server";
import { experience } from "@/lib/experience";
import { siteConfig } from "@/lib/site";

export async function Experience() {
  const t = await getTranslations("Experience");

  return (
    <section
      id="experience"
      data-surface="paper"
      aria-labelledby="experience-title"
      className="scroll-mt-24 border-t border-line-ink bg-paper px-gutter py-section text-ink"
    >
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="flex items-baseline justify-between gap-4 border-b border-line-ink pb-5">
          <h2
            id="experience-title"
            className="text-eyebrow uppercase text-ash"
          >
            {t("label")}
          </h2>
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ash">
            {t("meta")}
          </p>
        </div>

        <div className="mt-12 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="text-balance text-title">
              {t.rich("intro", {
                em: (chunks) => (
                  <em className="font-serif font-normal italic">{chunks}</em>
                ),
              })}
            </p>

            <a
              href={`mailto:${siteConfig.email}`}
              className="group mt-8 inline-flex items-center gap-3 text-eyebrow uppercase text-ink"
            >
              {t("cta")}
              <span
                aria-hidden="true"
                className="h-px w-8 bg-ash transition-[width,background-color] duration-300 ease-[var(--ease-editorial)] group-hover:w-12 group-hover:bg-ink"
              />
            </a>
          </div>

          <ol className="lg:col-span-8">
            {experience.map((entry) => (
              <li
                key={entry.slug}
                className="relative border-l border-line-ink pb-10 pl-6 last:pb-0 lg:pl-8"
              >
                <span
                  aria-hidden="true"
                  className="absolute top-[0.55rem] -left-[3.5px] size-1.5 bg-ink"
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ash">
                    {t(`items.${entry.slug}.period`)}
                  </p>

                  {entry.placeholder ? (
                    <span className="border border-line-ink px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-ash">
                      {t("placeholder")}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-3 text-title">
                  {t(`items.${entry.slug}.role`)}
                </h3>
                <p className="mt-1 text-small text-ash">
                  {t(`items.${entry.slug}.company`)} ·{" "}
                  {t(`items.${entry.slug}.location`)}
                </p>
                <p className="mt-4 max-w-[52ch] text-body text-ash">
                  {t(`items.${entry.slug}.description`)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
