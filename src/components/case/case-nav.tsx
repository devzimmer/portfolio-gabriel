import type { CaseStudy } from "@/content/cases";
import { Link } from "@/i18n/navigation";
import type { Locale } from "next-intl";

type CaseNavProps = {
  locale: Locale;
  previous?: CaseStudy;
  next?: CaseStudy;
  labels: { nav: string; previous: string; next: string; backTo: string; allWork: string };
};

const kicker = "font-mono text-eyebrow uppercase tracking-[0.18em] text-mute";
const title = "text-[1.5rem] font-medium tracking-[-0.015em]";

export function CaseNav({ locale, previous, next, labels }: CaseNavProps) {
  return (
    <nav
      aria-label={labels.nav}
      className="mt-28 flex flex-wrap justify-between gap-6 border-t border-line px-gutter py-10"
    >
      {previous ? (
        <Link href={`/work/${previous.slug}`} className="flex min-h-12 flex-col gap-1.5">
          <span className={kicker}>{labels.previous}</span>
          <span className={title}>← {previous.copy[locale].title}</span>
        </Link>
      ) : (
        <Link href={{ pathname: "/", hash: "work" }} className="flex min-h-12 flex-col gap-1.5">
          <span className={kicker}>{labels.backTo}</span>
          <span className={title}>← {labels.allWork}</span>
        </Link>
      )}
      {next ? (
        <Link href={`/work/${next.slug}`} className="flex min-h-12 flex-col items-end gap-1.5">
          <span className={kicker}>{labels.next}</span>
          <span className={title}>{next.copy[locale].title} →</span>
        </Link>
      ) : (
        <Link href={{ pathname: "/", hash: "work" }} className="flex min-h-12 flex-col items-end gap-1.5">
          <span className={kicker}>{labels.backTo}</span>
          <span className={title}>{labels.allWork} →</span>
        </Link>
      )}
    </nav>
  );
}
