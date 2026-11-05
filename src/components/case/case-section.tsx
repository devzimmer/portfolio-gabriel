import type { ReactNode } from "react";

type CaseSectionProps = {
  number: number;
  title: string;
  id: string;
  children: ReactNode;
};

/** Two-column section: numbered mono label on the left, content on the right. */
export function CaseSection({ number, title, id, children }: CaseSectionProps) {
  return (
    <section aria-labelledby={id} className="flex flex-wrap gap-12 px-gutter pt-28">
      <h2
        id={id}
        className="flex-[1_1_15rem] font-mono text-eyebrow uppercase text-mute"
      >
        {String(number).padStart(2, "0")} — {title}
      </h2>
      <div className="min-w-0 flex-[999_1_35rem]">{children}</div>
    </section>
  );
}
