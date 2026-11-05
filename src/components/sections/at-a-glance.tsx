import { getTranslations } from "next-intl/server";

const cells = ["focus", "ai", "stack", "languages"] as const;

export async function AtAGlance() {
  const t = await getTranslations("Glance");

  return (
    <section
      aria-label={t("label")}
      className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] border-y border-line"
    >
      {cells.map((cell) => (
        <div
          key={cell}
          className="border-line px-gutter py-7 not-last:border-r max-md:not-last:border-b"
        >
          <p className="font-mono text-eyebrow uppercase tracking-[0.18em] text-mute">
            {t(`${cell}.title`)}
          </p>
          <p className="mt-2.5 text-base leading-normal">
            {t(`${cell}.body`)}
          </p>
        </div>
      ))}
    </section>
  );
}
