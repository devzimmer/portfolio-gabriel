import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { unknownCaseLocale } from "@/lib/case-routes";

const intlMiddleware = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const locale = unknownCaseLocale(request.nextUrl.pathname);
  if (locale) {
    // No route matches the rewritten path, so Next renders its not-found page
    // (noindex) without ever running the case page for an unknown slug.
    return NextResponse.rewrite(new URL(`/${locale}/work`, request.url));
  }
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except API routes, Next.js internals and files with an extension.
  matcher: "/((?!api|trpc|_next|_vercel|.*\..*).*)",
};
