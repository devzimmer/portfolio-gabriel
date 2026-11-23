"use client";

import { type ReactNode, useSyncExternalStore } from "react";
import { whatsappHref } from "@/lib/contact";

// Until hydration the link points at the contact section, so it is never a
// dead control. The address itself is drawn by CSS from two attributes
// (see `.email-parts` in globals.css): readable without JavaScript, but with
// no "@" anywhere in the markup for a harvester to match.

const noop = () => () => {};
/** False in the server HTML and during hydration, true once on the client. */
function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}

type EmailLinkProps = { user: string; domain: string; className?: string };

export function EmailLink({ user, domain, className }: EmailLinkProps) {
  const ready = useHydrated();

  return (
    <a href={ready ? `mailto:${user}@${domain}` : "#contact"} className={className}>
      {ready ? (
        `${user}@${domain}`
      ) : (
        <span className="email-parts" data-user={user} data-domain={domain} />
      )}
    </a>
  );
}

type WhatsAppLinkProps = {
  obscured: string;
  message: string;
  className?: string;
  children: ReactNode;
};

export function WhatsAppLink({ obscured, message, className, children }: WhatsAppLinkProps) {
  const href = useHydrated() ? whatsappHref(obscured, message) : null;

  return (
    <a
      href={href ?? "#contact"}
      className={className}
      {...(href ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
