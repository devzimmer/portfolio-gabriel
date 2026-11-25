import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { unknownCaseLocale } from "@/lib/case-routes";
import { isStaticFile } from "@/lib/static-files";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isStaticFile(pathname)) return NextResponse.next();

  const locale = unknownCaseLocale(pathname);
  if (locale) {
    // No route matches the rewritten path, so Next renders its not-found page
    // (noindex) without ever running the case page for an unknown slug. The
    // status of a rewrite is not guaranteed (OpenNext on Workers keeps 200),
    // but the page always carries noindex, so it never gets indexed.
    return NextResponse.rewrite(new URL(`/${locale}/work`, request.url));
  }
  return intlMiddleware(request);
}

export const config = {
  // Everything but Next.js internals, including paths with a file extension:
  // left out, /x.php would reach [locale] with "x.php" as the locale, which
  // hangs the Worker on Cloudflare. Real files are let through above.
  matcher: "/((?!_next/).*)",
};
