import { getTranslations } from "next-intl/server";

const items = ["subscriptions", "meta", "products", "clips"] as const;

// The four results a recruiter should see before scrolling.
export async function ProofStrip() {
  const t = await getTranslations("Proof");

  return (
    <section aria-label={t("label")} className="border-t border-line">
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]">
        {items.map((item) => (
          <li
            key={item}
            className="border-line px-gutter py-7 not-last:border-r max-md:not-last:border-b"
          >
            <p className="text-[clamp(1.5rem,2.4vw,2.125rem)] leading-none font-medium tracking-[-0.03em]">
              {t(`items.${item}.figure`)}
            </p>
            <p className="mt-3 max-w-[30ch] text-sm leading-snug text-mute">
              {t(`items.${item}.caption`)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
