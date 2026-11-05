import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { portraitBlurDataURL, portraitImage } from "@/lib/portrait";
import { siteConfig } from "@/lib/site";

export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section
      aria-labelledby="hero-title"
      className="grid min-h-[calc(100dvh-4rem)] grid-cols-1 bg-ink md:min-h-[calc(100dvh-4.5rem)] lg:grid-cols-[1.08fr_0.92fr]"
    >
      <div className="flex flex-col justify-between px-gutter pt-10 pb-8 md:pt-14 md:pb-12">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-eyebrow uppercase text-mute">{t("role")}</p>
          <p className="hidden font-mono text-[0.625rem] uppercase tracking-[0.18em] text-mute sm:block">
            {t("meta")}
          </p>
        </div>

        <div className="py-14 md:py-16">
          <h1 id="hero-title" className="text-hero uppercase text-fog">
            <span className="block">{siteConfig.firstName}</span>
            <span className="block">{siteConfig.lastName}</span>
          </h1>

          <p className="mt-6 font-serif text-serif italic text-paper">
            {t("tagline")}
          </p>

          <p className="mt-7 max-w-[34ch] text-body text-mute">
            {t("description")}
          </p>

          <a
            href="#projects"
            className="group mt-9 inline-flex items-center gap-3 text-eyebrow uppercase text-fog"
          >
            {t("cta")}
            <span
              aria-hidden="true"
              className="h-px w-8 bg-mute transition-[width,background-color] duration-300 ease-editorial group-hover:w-12 group-hover:bg-fog"
            />
          </a>
        </div>

        <div className="flex items-end justify-between gap-6 border-t border-line pt-5">
          <p className="flex items-center gap-2.5 text-small text-fog">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-paper" />
            {t("availability")}
          </p>
          <p className="text-eyebrow uppercase text-mute">{t("location")}</p>
        </div>
      </div>

      <div className="relative h-[62dvh] min-h-[20rem] border-t border-line sm:h-[68dvh] lg:h-auto lg:min-h-0 lg:border-t-0 lg:border-l">
        <Image
          src={portraitImage}
          alt={t("portraitAlt")}
          fill
          priority
          quality={85}
          placeholder="blur"
          blurDataURL={portraitBlurDataURL}
          sizes="(min-width: 1024px) 46vw, 100vw"
          className="object-cover object-[50%_25%]"
        />
      </div>
    </section>
  );
}
