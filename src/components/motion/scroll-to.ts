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

/** Freezes page scrolling (smooth or native) while an overlay is open. */
export function pauseScroll(): () => void {
  const root = document.documentElement;
  const previous = root.style.overflow;
  root.style.overflow = "hidden";
  current?.stop();
  return () => {
    root.style.overflow = previous;
    current?.start();
  };
}
