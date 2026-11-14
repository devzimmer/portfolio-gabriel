"use client";

import { useEffect, useRef, useState } from "react";

const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
// Sits below-right of the pointer so the system arrow stays visible.
const OFFSET = 18;

/**
 * A small label that follows the mouse over elements marked `data-cursor`
 * (e.g. "Ver case →" over a case card). The system cursor is never hidden.
 * Mouse only: touch and reduced-motion users never see it. Decorative, so it
 * is hidden from assistive tech; the real link text carries the meaning.
 */
export function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);
  // The text outlives `visible` so it doesn't vanish mid fade-out.
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const el = ref.current;
    if (!el) return;

    let x = -1;
    let y = -1;
    let frame = 0;
    const inspect = (target: Element | null) => {
      const text = target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
      if (text) setLabel(text);
      setVisible(Boolean(text));
    };
    const onMove = (event: PointerEvent) => {
      if (!mq.matches || event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      el.style.transform = `translate3d(${x + OFFSET}px, ${y + OFFSET}px, 0)`;
      inspect(event.target as Element | null);
    };
    // Scrolling moves content under a still pointer (the gallery slides
    // sideways), so re-check what is under it once per frame.
    const onScroll = () => {
      if (x < 0 || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        inspect(document.elementFromPoint(x, y));
      });
    };
    const hide = () => {
      x = -1;
      setVisible(false);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", hide);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-cursor-label
      className="pointer-events-none fixed top-0 left-0 z-50 will-change-transform"
    >
      <div
        className={`flex size-24 items-center justify-center rounded-full bg-fog px-3 text-center font-mono text-[0.6875rem] leading-tight font-medium uppercase tracking-[0.14em] text-void transition-[opacity,scale] duration-300 ease-editorial ${
          visible ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        {label}
      </div>
    </div>
  );
}
