import { getLocale, getTranslations } from "next-intl/server";
import { SectionLabel } from "@/components/ui/section-label";
import { cases } from "@/content/cases";
import { Link } from "@/i18n/navigation";

export async function SelectedWork() {
  const [t, locale] = await Promise.all([getTranslations("Work"), getLocale()]);

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="mx-auto w-full max-w-[90rem] scroll-mt-18 px-gutter pt-28 pb-24"
    >
      <SectionLabel
        id="work-title"
        index={t("index")}
        label={t("label")}
        meta={t("meta", { count: cases.length })}
      />
      <ul>
        {cases.map((study, index) => {
          const copy = study.copy[locale];
          return (
            <li key={study.slug}>
              <article className="flex flex-wrap gap-8 border-b border-line py-10">
                <span className="flex-[0_0_3.5rem] font-mono text-eyebrow tracking-[0.18em] text-mute">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-[999_1_26rem]">
                  <h3 className="text-[2rem] font-medium tracking-[-0.015em]">
                    {copy.title}
                  </h3>
                  <p className="mt-3 max-w-[56ch] text-[1.0625rem] leading-relaxed text-mute">
                    {copy.card.summary}
                  </p>
                </div>
                <div className="flex flex-[1_1_16rem] flex-col gap-2 font-mono text-eyebrow uppercase tracking-[0.16em] text-mute">
                  <span>{copy.card.stack}</span>
                  <span>{copy.card.meta}</span>
                  <Link
                    href={`/work/${study.slug}`}
                    className="mt-2 inline-flex min-h-11 items-center text-fog hover:text-white"
                  >
                    {t("read")}
                  </Link>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
