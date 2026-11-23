import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const isDev = process.env.NODE_ENV === "development";

// Content-Security-Policy: the site loads nothing from other origins, so every
// fetch directive is 'self'. Scripts and styles keep 'unsafe-inline' because
// the pages are prerendered (PPR): nonces would force per-request rendering,
// and the hydration payload Next.js inlines cannot be hashed ahead of time.
// The site takes no user input, which is what an injected inline script would
// need. Dev adds 'unsafe-eval' and websockets for Fast Refresh.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "media-src 'self'",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

// Security headers applied to every response served by the Worker.
const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  cacheComponents: true,
  // The root layout lives under [locale], so URLs that match no route use
  // app/global-not-found.tsx for a 404 in the site's own design.
  experimental: {
    globalNotFound: true,
  },
  partialPrefetching: true,
  images: {
    qualities: [75, 85],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Portuguese only for now: English and Spanish URLs land on the same page in
  // Portuguese. Temporary (307) so the paths can come back with a translation.
  async redirects() {
    return [
      { source: "/:lang(en|es)", destination: "/pt", permanent: false },
      { source: "/:lang(en|es)/:path*", destination: "/pt/:path*", permanent: false },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);

// Makes Cloudflare bindings (R2, Images, etc.) available in `next dev`.
import("@opennextjs/cloudflare").then((m) =>
  m.initOpenNextCloudflareForDev(),
);
