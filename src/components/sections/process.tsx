import { getTranslations } from "next-intl/server";
import { AsciiHands } from "@/components/ascii/ascii-hands";

const steps = ["spec", "harness", "build", "review", "ship"] as const;

export async function Process() {
  const t = await getTranslations("Process");

  return (
    <>
      <section
        id="process"
        aria-labelledby="process-title"
        className="scroll-mt-18 border-t border-line"
      >
        <div className="flex justify-between gap-4 px-gutter py-5 text-eyebrow uppercase text-mute">
          <span>{t("label")}</span>
          <span className="font-mono">{t("meta")}</span>
        </div>
        <AsciiHands className="mt-6" />
        <div className="flex flex-wrap items-end justify-between gap-8 px-gutter pt-2 pb-24">
          <h2
            id="process-title"
            className="min-w-0 flex-[999_1_35rem] text-[clamp(2.25rem,4.5vw,4rem)] leading-[1.02] font-medium tracking-[-0.03em]"
          >
            {t("title")}{" "}
            <em className="font-serif font-normal">{t("titleEmphasis")}</em>
          </h2>
          <p className="flex-[1_1_20rem] text-[1.0625rem] leading-relaxed text-mute">
            {t("lede")}
          </p>
        </div>
      </section>

      <section
        aria-label={t("stepsLabel")}
        data-surface="paper"
        className="bg-paper px-gutter pb-28 text-ink"
      >
        <ol className="relative -top-px grid grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))] gap-px border border-line-ink bg-line-ink">
          {steps.map((step, index) => (
            <li key={step} className="bg-paper px-6 py-8">
              <span className="font-mono text-eyebrow tracking-[0.18em] text-ash">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-7 text-2xl font-medium">{t(`steps.${step}.title`)}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-[1.55] text-ash">
                {t(`steps.${step}.body`)}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
