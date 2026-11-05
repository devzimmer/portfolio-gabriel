import type { Locale } from "next-intl";

export type WhatsAppConfig = {
  number: string | null;
  locales: readonly Locale[];
};

/** wa.me link for the locale, or null when WhatsApp is not offered there. */
export function whatsappHref(
  locale: Locale,
  config: WhatsAppConfig,
  message: string,
): string | null {
  if (!config.number || !config.locales.includes(locale)) return null;
  const digits = config.number.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
