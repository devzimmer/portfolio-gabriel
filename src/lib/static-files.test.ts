import { existsSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { isStaticFile } from "./static-files";

const root = process.cwd();

function publicFiles(): string[] {
  const dir = join(root, "public");
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name !== "_headers")
    .map((entry) => "/" + relative(dir, join(entry.parentPath, entry.name)).split(sep).join("/"));
}

it("lets every file in public/ through", () => {
  const files = publicFiles();
  expect(files.length).toBeGreaterThan(0);
  for (const file of files) expect(isStaticFile(file), file).toBe(true);
});

it("lets the metadata routes in src/app through", () => {
  const routes: Record<string, string> = {
    "/favicon.ico": "favicon.ico",
    "/icon.png": "icon.png",
    "/apple-icon.png": "apple-icon.png",
    "/robots.txt": "robots.ts",
    "/sitemap.xml": "sitemap.ts",
    "/llms.txt": "llms.txt",
  };
  for (const [path, source] of Object.entries(routes)) {
    expect(existsSync(join(root, "src/app", source)), source).toBe(true);
    expect(isStaticFile(path), path).toBe(true);
  }
});

it("sends unknown file URLs through locale routing", () => {
  for (const path of ["/x.php", "/.env", "/wp-login.php", "/manifest.webmanifest", "/pt/work/x.png", "/og"]) {
    expect(isStaticFile(path), path).toBe(false);
  }
});
