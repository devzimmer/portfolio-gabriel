import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

// Makes Cloudflare bindings (R2, Images, etc.) available in `next dev`.
import("@opennextjs/cloudflare").then((m) =>
  m.initOpenNextCloudflareForDev(),
);
