import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { siteConfig } from "@/lib/site";

export default async function HomePage() {
  const t = await getTranslations("Hero");

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <LocaleSwitcher />

      <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
        {t("role")}
      </p>

      <h1 className="text-4xl font-semibold tracking-tight text-neutral-100 sm:text-5xl">
        {siteConfig.name}
      </h1>

      <p className="max-w-md text-pretty text-base leading-relaxed text-neutral-400">
        {t("description")}
      </p>

      <p className="text-sm text-neutral-500">
        {t("availability")} · {t("location")}
      </p>
    </main>
  );
}
