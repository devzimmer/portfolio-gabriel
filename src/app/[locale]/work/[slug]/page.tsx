import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { CaseDiagram } from "@/components/case/case-diagram";
import { CaseHighlight } from "@/components/case/case-highlight";
import { CaseNav } from "@/components/case/case-nav";
import { CaseSection } from "@/components/case/case-section";
import { CaseMedia } from "@/components/case/case-media";
import { cases, getCase, getCaseNeighbours, isCaseSlug } from "@/content/cases";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type CasePageProps = PageProps<"/[locale]/work/[slug]">;

// Every valid slug is prerendered by generateStaticParams, and the proxy answers
// unknown slugs with a 404 before this page runs, so the generic [slug] shell is
// never served. Opt it out of instant-navigation validation instead of wrapping
// the whole page in <Suspense>.
export const instant = false;

export function generateStaticParams() {
  return cases.map(({ slug }) => ({ slug }));
}

async function resolve(params: CasePageProps["params"]) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale) || !isCaseSlug(slug)) notFound();
  const study = getCase(slug);
  if (!study) notFound();
  return { locale, slug, study };
}

export async function generateMetadata({ params }: CasePageProps): Promise<Metadata> {
  const { locale, slug, study } = await resolve(params);
  const copy = study.copy[locale];
  const path = `/work/${slug}`;

  return {
    title: copy.title,
    description: copy.card.summary,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}${path}`])),
        "x-default": `/${routing.defaultLocale}${path}`,
      },
    },
    openGraph: { title: copy.title, description: copy.card.summary, url: `/${locale}${path}` },
  };
}

const lead = "text-[clamp(1.25rem,1.6vw,1.5rem)] leading-[1.4]";
const body = "text-base leading-relaxed text-mute";

export default async function CasePage({ params }: CasePageProps) {
  const { locale, slug, study } = await resolve(params);
  const t = await getTranslations({ locale, namespace: "Case" });
  const copy = study.copy[locale];
  const { previous, next } = getCaseNeighbours(slug);
  const position = cases.findIndex((c) => c.slug === slug) + 1;

  return (
    <main className="mx-auto w-full max-w-[90rem]">
      <section className="flex flex-col gap-10 px-gutter pt-14 pb-16">
        <div className="flex flex-wrap justify-between gap-4 font-mono text-eyebrow uppercase tracking-[0.18em] text-mute">
          <Link href={{ pathname: "/", hash: "work" }} className="inline-flex min-h-11 items-center hover:text-fog">
            {t("allWork")}
          </Link>
          <span className="inline-flex min-h-11 items-center">
            {t("counter", { n: String(position).padStart(2, "0"), total: String(cases.length).padStart(2, "0") })}
          </span>
        </div>
        <div>
          <h1 className="text-[clamp(3rem,6.4vw,6rem)] leading-[0.88] font-medium tracking-[-0.045em] uppercase">
            {copy.title}
          </h1>
          <p className="mt-6 max-w-[32ch] font-serif text-[clamp(1.375rem,2.2vw,2rem)] leading-[1.15] italic">
            {copy.lede}
          </p>
        </div>
        <dl
          aria-label={t("factsLabel")}
          className="grid grid-cols-[repeat(auto-fit,minmax(12.5rem,1fr))] border-y border-line"
        >
          {copy.facts.map((fact) => (
            <div key={fact.label} className="py-6 pr-6">
              <dt className="font-mono text-eyebrow uppercase tracking-[0.18em] text-mute">{fact.label}</dt>
              <dd className="mt-2.5 text-base leading-normal">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(20rem,100%),1fr))] gap-6 px-gutter">
        {copy.media.map((media) => (
          <CaseMedia key={media.label} {...media} tall={copy.media.length === 1} />
        ))}
      </div>

      <CaseSection number={1} id="problem" title={t("sections.problem")}>
        <div className="max-w-[68ch]">
          <p className={lead}>{copy.problem.lead}</p>
          <p className={`mt-5 ${body}`}>{copy.problem.body}</p>
        </div>
      </CaseSection>

      <section aria-labelledby="built" className="px-gutter pt-28">
        <h2 id="built" className="border-b border-line pb-5 font-mono text-eyebrow uppercase text-mute">
          02 — {t("sections.built")}
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(17.5rem,100%),1fr))] gap-px border-b border-line bg-line">
          {copy.built.map((item) => (
            <div key={item.title} className="bg-void py-8 pr-8 [&+&]:pl-8">
              {item.kicker ? (
                <p className="mb-3.5 font-mono text-eyebrow uppercase tracking-[0.18em] text-mute">{item.kicker}</p>
              ) : null}
              <h3 className="text-[1.25rem] font-medium">
                {item.title}
                {item.tag ? (
                  <span className="ml-2 font-mono text-eyebrow uppercase tracking-[0.16em] text-mute">{item.tag}</span>
                ) : null}
              </h3>
              <p className={`mt-3 text-base ${body}`}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <CaseSection number={3} id="architecture" title={t("sections.architecture")}>
        <CaseDiagram {...copy.diagram} />
      </CaseSection>

      <CaseSection number={4} id="decisions" title={t("sections.decisions")}>
        <ol className="border-t border-line">
          {copy.decisions.map((decision, index) => (
            <li key={decision.title} className="flex gap-6 border-b border-line py-7">
              <span className="flex-[0_0_2.5rem] font-mono text-eyebrow tracking-[0.18em] text-mute">
                {String.fromCharCode(65 + index)}
              </span>
              <div>
                <h3 className="text-lg font-medium">{decision.title}</h3>
                <p className={`mt-2.5 text-base ${body}`}>{decision.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </CaseSection>

      <CaseHighlight number={5} highlight={copy.highlight} />

      <CaseSection number={6} id="ai" title={t("sections.ai")}>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(13.75rem,100%),1fr))] gap-8">
          {copy.ai.stats.map((stat) => (
            <div key={stat.figure}>
              <p className="text-4xl font-medium tracking-[-0.03em]">{stat.figure}</p>
              <p className={`mt-2 text-base ${body}`}>{stat.caption}</p>
            </div>
          ))}
          {copy.ai.notes.map((note) => (
            <p key={note} className="text-base leading-relaxed">
              {note}
            </p>
          ))}
        </div>
      </CaseSection>

      <CaseSection number={7} id="next" title={t("sections.next")}>
        <p className={`max-w-[68ch] ${body}`}>{copy.next}</p>
      </CaseSection>

      <CaseNav
        locale={locale}
        previous={previous}
        next={next}
        labels={{
          nav: t("navLabel"),
          previous: t("previous"),
          next: t("nextCase"),
          backTo: t("backTo"),
          allWork: t("allWorkShort"),
        }}
      />
    </main>
  );
}
