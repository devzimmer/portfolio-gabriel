import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Every page is prerendered and nothing revalidates, so the build's cache is
// served read-only from Workers static assets: no R2 bucket to provision.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
