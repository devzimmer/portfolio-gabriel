"use client";

import Lenis from "lenis";
import { useEffect } from "react";

// Sticky header height (h-18): anchor targets land just below it.
const HEADER_OFFSET = -72;

/**
 * Subtle inertial scrolling. A lerp of 0.14 adds a short glide without
 * feeling laggy; people who prefer reduced motion keep native scrolling.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.14,
      autoRaf: true,
      anchors: { offset: HEADER_OFFSET },
      allowNestedScroll: true,
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
