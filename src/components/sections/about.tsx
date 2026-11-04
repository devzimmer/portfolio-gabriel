import { getTranslations } from "next-intl/server";

const focusItems = [
  { key: "architecture", index: "01" },
  { key: "product", index: "02" },
  { key: "infrastructure", index: "03" },
  { key: "ai", index: "04" },
] as const;

export async function About() {
  const t = await getTranslations("About");

  return (
    <section
      id="about"
      data-surface="paper"
      aria-labelledby="about-title"
      className="scroll-mt-24 border-t border-line-ink bg-paper px-gutter py-section text-ink"
    >
      <div className="mx-auto w-full max-w-[90rem]">
        <div className="flex items-baseline justify-between gap-4 border-b border-line-ink pb-5">
          <p className="text-eyebrow uppercase text-ash">{t("label")}</p>
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ash">
            {t("meta")}
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <h2
            id="about-title"
            className="text-balance text-headline lg:col-span-7"
          >
            {t.rich("headline", {
              em: (chunks) => (
                <em className="font-serif font-normal italic">{chunks}</em>
              ),
            })}
          </h2>

          <div className="lg:col-span-5 lg:border-l lg:border-line-ink lg:pl-10 xl:pl-14">
            <p className="text-body-lg text-ink/80">{t("bio.one")}</p>
            <p className="mt-5 text-body text-ash">{t("bio.two")}</p>
          </div>
        </div>

        <ol className="mt-16 grid grid-cols-1 gap-px border border-line-ink bg-line-ink sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {focusItems.map(({ key, index }) => (
            <li
              key={key}
              className="flex flex-col bg-paper px-5 py-6 sm:px-6 sm:py-7"
            >
              <span
                aria-hidden="true"
                className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ash"
              >
                {index}
              </span>
              <h3 className="mt-7 text-title lg:min-h-[2.3em]">
                {t(`focus.${key}.title`)}
              </h3>
              <p className="mt-3 text-small text-ash">
                {t(`focus.${key}.description`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
