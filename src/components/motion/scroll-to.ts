import type Lenis from "lenis";

// The live Lenis instance, when smooth scrolling is on. Programmatic scrolls
// must go through it, or Lenis snaps back to its own target on the next frame.
let current: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  current = lenis;
}

export function scrollToY(y: number, { immediate = false } = {}) {
  if (current) {
    current.scrollTo(y, { immediate });
    return;
  }
  window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
}
