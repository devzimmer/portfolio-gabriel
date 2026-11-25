// Files served as they are: everything in public/ and the metadata routes in
// src/app. The proxy lets these through and sends every other path, file
// extension or not, through locale routing, so a probe like /x.php can never
// reach the [locale] route with "x.php" as its locale. Tests keep this list in
// sync with public/ and src/app.
const files = new Set([
  "/favicon.ico",
  "/icon.png",
  "/apple-icon.png",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/cv-gabriel-zimmer-pt.pdf",
  "/cv-gabriel-zimmer-en.pdf",
]);

const folders = ["/og/"];

export function isStaticFile(pathname: string): boolean {
  return files.has(pathname) || folders.some((folder) => pathname.startsWith(folder));
}
