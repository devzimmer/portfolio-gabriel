import { defineRouting } from "next-intl/routing";

// Portuguese only for now. /en and /es redirect to /pt (next.config.ts) until
// the English version is written; adding a locale back is a one-line change
// here plus its messages file.
export const routing = defineRouting({
  locales: ["pt"],
  defaultLocale: "pt",
  localePrefix: "always",
  localeCookie: false,
  localeDetection: false,
});
