import { getTranslations } from "next-intl/server";
import { LocalClock } from "./local-clock";
import { LocaleSwitcher } from "./locale-switcher";

export async function SiteFooter() {
  const t = await getTranslations("Footer");

  return (
    <footer className="mt-auto border-t border-line bg-void px-gutter">
      <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-4 py-7 font-mono text-eyebrow uppercase tracking-[0.18em] text-mute sm:flex-row sm:items-center sm:justify-between">
        <p>{t("rights")}</p>
        <p>
          {t("location")} · <LocalClock label={t("localTime")} />
        </p>
        <LocaleSwitcher />
      </div>
    </footer>
  );
}
