import { getLocale, getTranslations } from "next-intl/server";
import { SectionLabel } from "@/components/ui/section-label";
import { CasesRail } from "@/components/work/cases-rail";
import { cases } from "@/content/cases";
import { Link } from "@/i18n/navigation";

export async function SelectedWork() {
  const [t, locale] = await Promise.all([getTranslations("Work"), getLocale()]);

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="scroll-mt-18 px-gutter pt-28 pb-24 pin:pt-20"
    >
      <CasesRail
        label={
          <SectionLabel
            id="work-title"
            index={t("index")}
            label={t("label")}
            meta={t("meta", { count: cases.length })}
          />
        }
        titles={cases.map((study) => study.copy[locale].title)}
        goToLabel={t("goTo")}
      >
        {cases.map((study, index) => {
          const copy = study.copy[locale];
          return (
            <li
              key={study.slug}
              data-cursor={t("cursor")}
              className="relative pin:w-[min(46rem,68vw)] pin:shrink-0 pin:px-12 pin:first:pl-0 pin:border-r pin:border-line pin:transition-opacity pin:duration-500 pin:ease-editorial pin:data-[active=false]:opacity-35"
            >
              <article className="flex flex-wrap gap-8 border-b border-line py-10 pin:h-full pin:flex-col pin:flex-nowrap pin:justify-between pin:gap-10 pin:border-b-0 pin:py-12">
                <span className="flex-[0_0_3.5rem] font-mono text-eyebrow tracking-[0.18em] text-mute pin:flex-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-[999_1_26rem] pin:flex-none">
                  <h3 className="text-[1.75rem] font-medium tracking-[-0.015em] pin:text-[clamp(2.5rem,4.6vw,4.5rem)] pin:leading-[0.95] pin:tracking-[-0.035em]">
                    {copy.title}
                  </h3>
                  <p className="mt-3 max-w-[56ch] text-base leading-relaxed text-mute pin:mt-6 pin:text-[1.0625rem]">
                    {copy.card.summary}
                  </p>
                </div>
                <div className="flex flex-[1_1_16rem] flex-col gap-2 font-mono text-eyebrow uppercase tracking-[0.16em] text-mute pin:flex-none">
                  <span>{copy.card.stack}</span>
                  <span>{copy.card.meta}</span>
                  <Link
                    href={`/work/${study.slug}`}
                    className="group mt-4 inline-flex after:absolute after:inset-0 after:content-[''] min-h-12 items-center justify-between gap-6 self-start border border-edge px-5 text-xs font-medium tracking-[0.2em] text-fog transition-colors duration-300 ease-editorial hover:border-fog hover:bg-fog hover:text-void"
                  >
                    <span>
                      {t("read")}
                      <span className="sr-only"> {copy.title}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 ease-editorial group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </article>
            </li>
          );
        })}
      </CasesRail>
    </section>
  );
}
