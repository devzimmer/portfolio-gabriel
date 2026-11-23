import { getTranslations } from "next-intl/server";

// First focusable element on every page: hidden until a keyboard user tabs
// onto it, then jumps past the header to the main content.
export async function SkipLink() {
  const t = await getTranslations("Nav");
  return (
    <a
      href="#conteudo"
      className="fixed top-3 left-3 z-50 -translate-y-20 bg-fog px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-void transition-transform duration-200 focus:translate-y-0"
    >
      {t("skip")}
    </a>
  );
}
