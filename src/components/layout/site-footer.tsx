import { ArrowUp } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function SiteFooter() {
  const t = await getTranslations("Footer");

  return (
    <footer className="mt-auto border-t border-line bg-ink px-gutter">
      <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-3 py-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-eyebrow uppercase text-mute">{t("rights")}</p>

        <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-mute">
          {t("location")}
        </p>

        <a
          href="#top"
          className="group inline-flex items-center gap-2 text-eyebrow uppercase text-mute transition-colors hover:text-fog"
        >
          {t("backToTop")}
          <ArrowUp
            aria-hidden="true"
            strokeWidth={1.5}
            className="size-3.5 transition-transform duration-300 ease-[var(--ease-editorial)] group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </footer>
  );
}
