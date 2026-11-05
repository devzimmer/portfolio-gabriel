import type { CaseCopy } from "@/content/cases";

type CaseHighlightProps = { number: number; highlight: CaseCopy["highlight"] };

export function CaseHighlight({ number, highlight }: CaseHighlightProps) {
  return (
    <section
      aria-labelledby="highlight-title"
      data-surface="paper"
      className="mx-gutter mt-28 flex flex-wrap gap-12 bg-paper px-[clamp(1.5rem,4vw,3.5rem)] py-14 text-ink"
    >
      <div className="flex flex-[1_1_15rem] flex-col gap-3">
        <h2
          id="highlight-title"
          className="font-mono text-eyebrow uppercase text-ash"
        >
          {String(number).padStart(2, "0")} — {highlight.title}
        </h2>
        <p className="text-[clamp(3.5rem,6vw,5.5rem)] leading-none font-medium tracking-[-0.04em]">
          {highlight.figure}
        </p>
        <p className="text-[0.9375rem] text-ash">{highlight.figureCaption}</p>
      </div>
      <div className="min-w-0 max-w-[68ch] flex-[999_1_35rem]">
        <p className="font-serif text-[clamp(1.5rem,2.4vw,2rem)] leading-tight italic">
          {highlight.line}
        </p>
        <p className="mt-5 text-[1.0625rem] leading-relaxed text-ash">{highlight.body}</p>
      </div>
    </section>
  );
}
