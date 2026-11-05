import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/ui/button-link";
import { portraitBlurDataURL, portraitImage } from "@/lib/portrait";
import { siteConfig } from "@/lib/site";

export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section
      aria-labelledby="hero-title"
      className="grid min-h-[47.5rem] grid-cols-1 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]"
    >
      <div className="flex flex-col justify-between gap-12 px-gutter pt-14 pb-10">
        <div className="flex items-baseline justify-between gap-4 text-eyebrow uppercase text-mute">
          <p>{t("eyebrow")}</p>
          <p className="font-mono tracking-[0.18em]">{t("location")}</p>
        </div>

        <div>
          <h1
            id="hero-title"
            className="text-[clamp(3.5rem,8.4vw,8.5rem)] leading-[0.88] font-medium tracking-[-0.045em] uppercase"
          >
            <span className="block">{siteConfig.firstName}</span>
            <span className="block">{siteConfig.lastName}</span>
          </h1>
          <p className="mt-[1.125rem] text-[clamp(2.5rem,5.6vw,5.5rem)] leading-[0.92] tracking-[-0.04em] text-dim uppercase">
            {t("secondary")}
          </p>
          <p className="mt-7 font-serif text-[clamp(1.5rem,2.4vw,2.125rem)] italic">
            {t("tagline")}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#work" variant="solid">
            {t("ctaWork")}
          </ButtonLink>
          <ButtonLink href="#contact" variant="outline">
            {t("ctaContact")}
          </ButtonLink>
        </div>
      </div>

      <div className="relative min-h-[40rem] border-t border-line lg:border-t-0 lg:border-l">
        <Image
          src={portraitImage}
          alt={t("portraitAlt")}
          fill
          priority
          quality={85}
          placeholder="blur"
          blurDataURL={portraitBlurDataURL}
          sizes="(min-width: 1024px) 46vw, 100vw"
          className="object-cover object-[50%_20%]"
        />
      </div>
    </section>
  );
}
