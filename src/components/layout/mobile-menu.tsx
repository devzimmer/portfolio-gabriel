"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { easeEditorial } from "@/lib/motion";
import { LocaleSwitcher } from "./locale-switcher";

type NavItem = {
  label: string;
  href: string;
};

type MobileMenuProps = {
  items: NavItem[];
  siteName: string;
};

export function MobileMenu({ items, siteName }: MobileMenuProps) {
  const t = useTranslations("MobileMenu");
  const navT = useTranslations("Nav");
  const shouldReduceMotion = useReducedMotion();

  const [open, setOpen] = useState(false);
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
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
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
      if (media.matches) setOpen(false);
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
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={t("open")}
        className="inline-flex size-9 items-center justify-center border border-line text-fog transition-colors hover:bg-graphite md:hidden"
      >
        <Menu className="size-4" aria-hidden="true" />
      </button>

      {portalRoot
        ? createPortal(
            <AnimatePresence>
              {open && (
                <motion.div
                  ref={panelRef}
                  id="mobile-menu"
                  role="dialog"
                  aria-modal="true"
                  aria-label={t("label")}
                  className="fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-ink px-gutter py-5 md:hidden"
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.25, ease: easeEditorial }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-eyebrow uppercase text-mute">{siteName}</p>
                    <button
                      ref={closeButtonRef}
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label={t("close")}
                      className="inline-flex size-9 items-center justify-center border border-line text-fog transition-colors hover:bg-graphite"
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  </div>

                  <motion.nav
                    aria-label={navT("label")}
                    className="mt-14 flex flex-col"
                    initial={shouldReduceMotion ? false : "hidden"}
                    animate="show"
                    variants={{
                      hidden: {},
                      show: {
                        transition: {
                          staggerChildren: shouldReduceMotion ? 0 : 0.06,
                          delayChildren: shouldReduceMotion ? 0 : 0.05,
                        },
                      },
                    }}
                  >
                    {items.map((item) => (
                      <motion.a
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        variants={{
                          hidden: {
                            opacity: 0,
                            y: shouldReduceMotion ? 0 : 14,
                          },
                          show: {
                            opacity: 1,
                            y: 0,
                            transition: {
                              duration: shouldReduceMotion ? 0 : 0.35,
                              ease: easeEditorial,
                            },
                          },
                        }}
                        className="border-b border-line py-4 text-headline text-fog transition-colors hover:text-mute"
                      >
                        {item.label}
                      </motion.a>
                    ))}
                  </motion.nav>

                  <div className="mt-auto border-t border-line pt-5">
                    <LocaleSwitcher />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>,
            portalRoot,
          )
        : null}
    </>
  );
}
