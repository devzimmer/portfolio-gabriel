import type { Metadata } from "next";
import Link from "next/link";
import { NotFoundView } from "@/components/not-found/not-found-view";
import { fontVariables } from "@/lib/fonts";
import { siteConfig } from "@/lib/site";
import messages from "../../messages/pt.json";
import "./globals.css";

// Any URL that matches no route. Renders outside the [locale] layout, so it
// brings its own document, fonts and a minimal header and footer.
export const metadata: Metadata = {
  title: `${messages.NotFound.metaTitle} — ${siteConfig.name}`,
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="pt" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <header className="border-b border-line">
          <div className="mx-auto flex h-18 w-full max-w-[90rem] items-center px-gutter">
            <Link
              href="/pt"
              aria-label={`${siteConfig.name}, ${messages.Nav.home}`}
              className="flex min-h-11 items-center text-[0.9375rem] font-medium tracking-[0.16em] text-fog"
            >
              GZ
            </Link>
          </div>
        </header>
        <NotFoundView copy={messages.NotFound} />
        <footer className="border-t border-line px-gutter">
          <p className="mx-auto w-full max-w-[90rem] py-7 font-mono text-eyebrow uppercase tracking-[0.18em] text-mute">
            {messages.Footer.rights}
          </p>
        </footer>
      </body>
    </html>
  );
}
