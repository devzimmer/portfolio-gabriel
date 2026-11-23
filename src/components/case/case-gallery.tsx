"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { pauseScroll } from "@/components/motion/scroll-to";
import type { CaseMediaItem } from "@/content/cases/types";

const spans = {
  full: "md:col-span-12",
  wide: "md:col-span-7",
  half: "md:col-span-6",
  narrow: "md:col-span-5",
} as const;

const iconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  "aria-hidden": true,
} as const;

const isPhone = (item: CaseMediaItem) => !!item.image && item.image.height > item.image.width;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The case's screenshots as a bento grid. Each tile shows a framed crop with
 * its caption; clicking opens the full image in a lightbox (native <dialog>:
 * focus stays inside, Esc closes) with arrow-key navigation.
 */
export function CaseGallery({ items }: { items: CaseMediaItem[] }) {
  const t = useTranslations("Case.gallery");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const images = items.filter((item) => item.image);
  const current = index === null ? null : images[index];

  const open = (item: CaseMediaItem) => {
    setIndex(images.indexOf(item));
    dialogRef.current?.showModal();
  };
  const close = () => dialogRef.current?.close();
  const count = images.length;
  const step = (delta: number) => setIndex((i) => (i === null ? i : (i + delta + count) % count));

  const isOpen = index !== null;
  useEffect(() => {
    if (!isOpen) return;
    const resume = pauseScroll();
    const onKey = (event: KeyboardEvent) => {
      const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
      if (delta) setIndex((i) => (i === null ? i : (i + delta + count) % count));
    };
    document.addEventListener("keydown", onKey);
    return () => {
      resume();
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, count]);

  return (
    <>
      <ul aria-label={t("label")} className="grid grid-cols-1 gap-3 px-gutter md:grid-cols-12">
        {items.map((item, i) => {
          const phone = isPhone(item);
          const height = item.span === "full" ? "md:h-[36rem] lg:h-[42rem]" : "md:h-[34rem]";
          const tile = `${spans[item.span ?? "half"]} ${phone ? "h-[32rem]" : "h-[24rem]"} ${height}`;
          const head = (
            <div className="flex items-start justify-between gap-6 p-6 md:p-8">
              <p className="max-w-[34ch] text-[1.0625rem] leading-snug text-fog">{item.caption}</p>
              <span className="font-mono text-eyebrow tracking-[0.18em] text-mute">{pad(i + 1)}</span>
            </div>
          );

          if (!item.image) {
            return (
              <li key={item.label} className={`flex flex-col border border-dashed border-edge bg-well ${tile}`}>
                {head}
                <p className="m-6 mt-0 flex flex-1 items-center justify-center border border-dashed border-line p-6 text-center font-mono text-[0.8125rem] text-mute md:m-8 md:mt-0">
                  {item.label}
                </p>
              </li>
            );
          }

          return (
            <li key={item.label} className={tile}>
              <button
                type="button"
                onClick={() => open(item)}
                data-cursor={t("expand")}
                aria-label={`${t("expand")}: ${item.label}`}
                className="group flex h-full w-full flex-col overflow-hidden border border-line bg-well text-left transition-colors duration-500 ease-editorial hover:border-edge"
              >
                {head}
                {phone ? (
                  <div className="relative mx-auto min-h-0 w-[min(17rem,64%)] flex-1 overflow-hidden rounded-t-[1.75rem] border-x border-t border-edge transition-transform duration-700 ease-editorial group-hover:-translate-y-1.5">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      placeholder="blur"
                      sizes="17rem"
                      className="object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="relative ml-6 min-h-0 flex-1 overflow-hidden border-t border-l border-edge transition-transform duration-700 ease-editorial group-hover:-translate-y-1.5 md:ml-8">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      placeholder="blur"
                      sizes={item.span === "full" ? "(min-width: 90rem) 84rem, 100vw" : "(min-width: 48rem) 60vw, 100vw"}
                      className="object-cover"
                      style={{ objectPosition: item.focus ?? "left top" }}
                    />
                  </div>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setIndex(null)}
        aria-label={t("dialog")}
        data-lenis-prevent
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-void/95 p-0 text-fog backdrop:bg-void/70 open:flex"
      >
        {current?.image ? (
          <div className="flex h-full w-full flex-col">
            <div className="flex items-center justify-between gap-4 px-gutter py-4">
              <span className="font-mono text-eyebrow tracking-[0.18em] text-mute" aria-live="polite">
                {pad((index ?? 0) + 1)} / {pad(images.length)}
              </span>
              <button
                type="button"
                onClick={close}
                aria-label={t("close")}
                className="inline-flex size-11 items-center justify-center border border-line transition-colors hover:border-edge hover:bg-well"
              >
                <svg {...iconProps}>
                  <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
                </svg>
              </button>
            </div>
            <div className="relative min-h-0 flex-1 px-gutter">
              <div className="relative h-full w-full">
                <Image
                  key={current.image.src}
                  src={current.image}
                  alt={current.label}
                  fill
                  quality={85}
                  placeholder="blur"
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 px-gutter py-5">
              <p className="max-w-[60ch] text-base leading-relaxed text-mute">{current.caption}</p>
              {images.length > 1 ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label={t("previous")}
                    className="inline-flex size-11 items-center justify-center border border-line transition-colors hover:border-edge hover:bg-well"
                  >
                    <svg {...iconProps}>
                      <path d="M10 3.5L5.5 8l4.5 4.5" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label={t("next")}
                    className="inline-flex size-11 items-center justify-center border border-line transition-colors hover:border-edge hover:bg-well"
                  >
                    <svg {...iconProps}>
                      <path d="M6 3.5L10.5 8 6 12.5" />
                    </svg>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
