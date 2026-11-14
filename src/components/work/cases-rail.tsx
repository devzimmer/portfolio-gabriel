"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { scrollToY } from "@/components/motion/scroll-to";

// Keep in sync with the `pin` variant in globals.css.
const PIN_QUERY =
  "(min-width: 64rem) and (min-height: 36rem) and (prefers-reduced-motion: no-preference)";
// Sticky header height (h-18): the gallery pins just below it.
const HEADER = 72;

const clamp = (v: number) => Math.min(1, Math.max(0, v));

type CasesRailProps = {
  label: ReactNode;
  titles: string[];
  goToLabel: string;
  children: ReactNode;
};

/**
 * Selected work as a horizontal gallery on large screens: the section pins
 * under the header and vertical scrolling slides the cases sideways. Small
 * screens and reduced motion keep the plain vertical list (CSS `pin` variant).
 */
export function CasesRail({ label, titles, goToLabel, children }: CasesRailProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const goTo = useRef<(index: number, immediate?: boolean) => void>(() => {});

  useEffect(() => {
    const outer = outerRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!outer || !sticky || !track) return;

    const mq = window.matchMedia(PIN_QUERY);
    const items = () => Array.from(track.children) as HTMLElement[];
    let pinned = false;
    let top = 0;
    let dist = 0;
    let frame = 0;
    let current = -1;

    const update = () => {
      frame = 0;
      if (!pinned) return;
      const progress = dist > 0 ? clamp((window.scrollY - top) / dist) : 0;
      const x = -progress * dist;
      track.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
      sticky.style.setProperty("--rail-progress", progress.toFixed(4));

      const center = track.parentElement!.clientWidth / 2;
      let nearest = 0;
      let best = Infinity;
      items().forEach((item, index) => {
        const d = Math.abs(item.offsetLeft + item.offsetWidth / 2 + x - center);
        if (d < best) {
          best = d;
          nearest = index;
        }
      });
      if (nearest !== current) {
        current = nearest;
        items().forEach((item, index) => {
          item.dataset.active = String(index === nearest);
        });
        setActive(nearest);
      }
    };

    const measure = () => {
      pinned = mq.matches;
      outer.style.height = "";
      track.style.transform = "";
      if (!pinned) {
        items().forEach((item) => delete item.dataset.active);
        current = -1;
        return;
      }
      dist = Math.max(0, track.scrollWidth - track.parentElement!.clientWidth);
      outer.style.height = `${sticky.offsetHeight + dist}px`;
      top = outer.getBoundingClientRect().top + window.scrollY - HEADER;
      current = -1;
      update();
    };

    goTo.current = (index, immediate = false) => {
      if (!pinned) return;
      const item = items()[index];
      if (!item) return;
      const viewport = track.parentElement!.clientWidth;
      const k = dist > 0 ? clamp((item.offsetLeft + item.offsetWidth / 2 - viewport / 2) / dist) : 0;
      scrollToY(top + k * dist, { immediate });
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Keyboard: tabbing into an off-screen case scrolls the gallery to it.
    const onFocusIn = (event: FocusEvent) => {
      const item = (event.target as HTMLElement).closest("li");
      const index = item ? items().indexOf(item as HTMLElement) : -1;
      if (index >= 0) goTo.current(index, true);
    };

    // Trackpads: a sideways swipe moves the gallery too.
    const onWheel = (event: WheelEvent) => {
      if (!pinned || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      scrollToY(window.scrollY + event.deltaX, { immediate: true });
    };

    const resize = new ResizeObserver(measure);
    resize.observe(track);
    resize.observe(document.body);
    mq.addEventListener("change", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("focusin", onFocusIn);
    sticky.addEventListener("wheel", onWheel, { passive: false });
    measure();

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      mq.removeEventListener("change", measure);
      window.removeEventListener("scroll", onScroll);
      track.removeEventListener("focusin", onFocusIn);
      sticky.removeEventListener("wheel", onWheel);
      outer.style.height = "";
      track.style.transform = "";
    };
  }, []);

  const total = String(titles.length).padStart(2, "0");

  return (
    <div ref={outerRef}>
      <div
        ref={stickyRef}
        className="pin:sticky pin:top-18 pin:flex pin:h-[calc(100svh-4.5rem)] pin:flex-col pin:pt-8"
      >
        {label}
        <div className="min-h-0 pin:flex-1 pin:overflow-clip">
          <ul ref={trackRef} className="pin:flex pin:h-full pin:will-change-transform">
            {children}
          </ul>
        </div>
        <div className="hidden items-center gap-6 border-t border-line py-5 font-mono text-eyebrow uppercase tracking-[0.18em] text-mute pin:flex">
          <span aria-hidden="true" className="tabular-nums text-fog">
            {String(active + 1).padStart(2, "0")} / {total}
          </span>
          <span aria-hidden="true" className="min-w-0 flex-1 truncate">
            {titles[active]}
          </span>
          <div className="flex gap-2">
            {titles.map((title, index) => (
              <button
                key={title}
                type="button"
                tabIndex={-1}
                aria-label={`${goToLabel} ${title}`}
                data-cursor={title}
                onClick={() => goTo.current(index)}
                className="group flex h-8 w-10 items-center"
              >
                <span
                  className={`h-px w-full transition-colors duration-300 ease-editorial group-hover:bg-fog ${
                    index === active ? "bg-fog" : "bg-edge"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        <div
          aria-hidden="true"
          className="hidden h-px origin-left bg-fog pin:block"
          style={{ transform: "scaleX(var(--rail-progress, 0))" }}
        />
      </div>
    </div>
  );
}
