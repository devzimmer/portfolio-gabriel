"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

type NavItem = {
  label: string;
  href: string;
};

type MobileMenuProps = {
  items: NavItem[];
  siteName: string;
};

type State = "closed" | "open" | "closing";

const iconProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  "aria-hidden": true,
} as const;

/**
 * Full-screen menu for small screens. Animations are plain CSS (`.menu-*` in
 * globals.css), so reduced motion is handled by the global rule there.
 */
export function MobileMenu({ items, siteName }: MobileMenuProps) {
  const t = useTranslations("MobileMenu");
  const navT = useTranslations("Nav");

  const [state, setState] = useState<State>("closed");
  const open = state !== "closed";
  // The overlay is portaled to <body> so the header's backdrop-filter does not
  // become the containing block of this fixed-position element.
  const portalRoot = useSyncExternalStore(
    () => () => {},
    () => document.body,
    () => null,
  );
  const wasOpen = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Unmount once the 200 ms fade-out has played. A timer rather than
  // animationend, which never fires in a background tab.
  useEffect(() => {
    if (state !== "closing") return;
    const id = window.setTimeout(() => setState("closed"), 200);
    return () => window.clearTimeout(id);
  }, [state]);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) {
        wasOpen.current = false;
        triggerRef.current?.focus();
      }
      return;
    }

    wasOpen.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setState("closing");
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const media = window.matchMedia("(min-width: 768px)");
    const onMediaChange = () => {
      if (media.matches) setState("closed");
    };

    document.addEventListener("keydown", onKeyDown);
    media.addEventListener("change", onMediaChange);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      media.removeEventListener("change", onMediaChange);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setState("open")}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={t("open")}
        className="inline-flex size-11 items-center justify-center border border-line text-fog transition-colors hover:bg-well md:hidden"
      >
        <svg {...iconProps}>
          <path d="M2 4.5h12M2 8h12M2 11.5h12" />
        </svg>
      </button>

      {portalRoot && open
        ? createPortal(
            <div
              ref={panelRef}
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label={t("label")}
              data-state={state}
              className="menu-panel fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-void px-gutter py-5 md:hidden"
            >
              <div className="flex items-center justify-between">
                <p className="text-eyebrow uppercase text-mute">{siteName}</p>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => setState("closing")}
                  aria-label={t("close")}
                  className="inline-flex size-11 items-center justify-center border border-line text-fog transition-colors hover:bg-well"
                >
                  <svg {...iconProps}>
                    <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
                  </svg>
                </button>
              </div>

              <nav aria-label={navT("label")} className="mt-14 flex flex-col">
                {items.map((item, index) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setState("closed")}
                    style={{ animationDelay: `${50 + index * 60}ms` }}
                    className="menu-item border-b border-line py-4 text-headline text-fog transition-colors hover:text-mute"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>,
            portalRoot,
          )
        : null}
    </>
  );
}
