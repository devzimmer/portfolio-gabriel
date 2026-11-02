import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { siteConfig } from "@/lib/site";

// Página temporária da etapa 03 (Design System).
// Será substituída pelo hero na etapa 05.

const palette = [
  {
    name: "Ink",
    token: "--color-ink",
    value: "#171717",
    swatch: "bg-ink text-fog",
  },
  {
    name: "Graphite",
    token: "--color-graphite",
    value: "#242424",
    swatch: "bg-graphite text-fog",
  },
  {
    name: "Paper",
    token: "--color-paper",
    value: "#F2F2F0",
    swatch: "bg-paper text-ink",
  },
  {
    name: "Fog",
    token: "--color-fog",
    value: "#F5F5F5",
    swatch: "bg-fog text-ink",
  },
  {
    name: "Mute",
    token: "--color-mute",
    value: "#A0A0A0",
    swatch: "bg-mute text-ink",
  },
  {
    name: "Line",
    token: "--color-line",
    value: "12% opacity",
    swatch: "border border-line bg-ink text-fog",
  },
] as const;

const typeScale = [
  { label: "display", className: "text-display text-fog", sample: "Gabriel Zimmer" },
  { label: "headline", className: "text-headline text-fog", sample: "Precision in every layer." },
  { label: "title", className: "text-title text-fog", sample: "Selected work" },
  {
    label: "body-lg",
    className: "max-w-xl text-body-lg text-mute",
    sample:
      "Architecture, product and infrastructure — one continuous engineering practice.",
  },
  {
    label: "body",
    className: "max-w-xl text-body text-mute",
    sample:
      "The base reading size for longer paragraphs, descriptions and supporting copy.",
  },
  {
    label: "small",
    className: "text-small text-mute",
    sample: "Available for remote opportunities",
  },
  {
    label: "eyebrow",
    className: "text-eyebrow uppercase text-mute",
    sample: "AI-Native Full Stack Developer",
  },
  {
    label: "serif",
    className: "font-serif text-serif italic text-mute",
    sample: "Software, engineered end to end.",
  },
] as const;

export default async function HomePage() {
  const t = await getTranslations("Hero");

  return (
    <main className="px-gutter py-10 sm:py-14">
      <header className="flex items-center justify-between border-b border-line pb-6">
        <p className="text-eyebrow uppercase text-mute">Design System — 03</p>
        <LocaleSwitcher />
      </header>

      <section className="grid gap-10 py-section lg:grid-cols-[1fr_1.6fr] lg:items-end">
        <div>
          <p className="text-eyebrow uppercase text-mute">Identity</p>
          <h1 className="mt-4 text-headline text-fog">Design system</h1>
          <p className="mt-4 max-w-sm text-body text-mute">
            Monochrome editorial foundation: type, color and rhythm before any
            layout decisions.
          </p>
        </div>

        <div className="border border-line bg-graphite p-6 sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <p className="text-eyebrow uppercase text-mute">Display specimen</p>
            <p className="font-mono text-[0.625rem] text-mute">
              Geist / Instrument Serif
            </p>
          </div>
          <p className="mt-10 text-display text-fog">{siteConfig.name}</p>
          <p className="mt-8 font-serif text-serif italic text-mute">
            {t("tagline")}
          </p>
        </div>
      </section>

      <section className="border-t border-line pt-10">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-eyebrow uppercase text-mute">Typography</p>
          <p className="font-mono text-[0.625rem] text-mute">
            fluid scale · clamp()
          </p>
        </div>

        <div className="mt-8 divide-y divide-line border-y border-line">
          {typeScale.map((row) => (
            <div
              key={row.label}
              className="grid gap-3 py-6 sm:grid-cols-[7rem_1fr] sm:gap-8"
            >
              <span className="font-mono text-xs text-mute">{row.label}</span>
              <p className={row.className}>{row.sample}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-line pt-10">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-eyebrow uppercase text-mute">Color</p>
          <p className="font-mono text-[0.625rem] text-mute">
            monochrome · low contrast
          </p>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {palette.map((color) => (
            <li key={color.token} className="border border-line">
              <div className={`flex h-24 items-end p-3 ${color.swatch}`}>
                <span className="font-mono text-[0.625rem]">{color.value}</span>
              </div>
              <div className="border-t border-line px-3 py-2.5">
                <p className="text-small text-fog">{color.name}</p>
                <p className="mt-0.5 font-mono text-[0.625rem] text-mute">
                  {color.token}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16 border-t border-line pt-10">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-eyebrow uppercase text-mute">Rhythm</p>
          <p className="font-mono text-[0.625rem] text-mute">
            spacing · easing
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="border border-line p-6">
            <p className="text-eyebrow uppercase text-mute">Gutter</p>
            <p className="mt-3 font-mono text-small text-fog">
              clamp(1.25rem, 4vw, 4rem)
            </p>
            <div
              className="mt-6 h-1.5 bg-paper"
              style={{ width: "min(100%, var(--spacing-gutter))" }}
            />
          </div>
          <div className="border border-line p-6">
            <p className="text-eyebrow uppercase text-mute">Section</p>
            <p className="mt-3 font-mono text-small text-fog">
              clamp(5rem, 12vw, 10rem)
            </p>
            <div
              className="mt-6 h-1.5 bg-paper"
              style={{ width: "min(100%, var(--spacing-section))" }}
            />
          </div>
          <div className="border border-line p-6 sm:col-span-2">
            <p className="text-eyebrow uppercase text-mute">Easing</p>
            <p className="mt-3 font-mono text-small text-fog">
              cubic-bezier(0.22, 1, 0.36, 1)
            </p>
          </div>
        </div>
      </section>

      <footer className="mt-16 border-t border-line pt-6">
        <p className="text-eyebrow uppercase text-mute">
          Etapa 03 — página temporária de revisão
        </p>
      </footer>
    </main>
  );
}
