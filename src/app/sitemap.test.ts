import sitemap from "./sitemap";

it("lists every locale home and every case page", () => {
  const urls = sitemap().map((entry) => new URL(entry.url).pathname);
  for (const locale of ["en", "pt", "es"]) {
    expect(urls).toContain(`/${locale}`);
    for (const slug of ["engpocket", "duzi-crm", "lumuviz"]) {
      expect(urls).toContain(`/${locale}/work/${slug}`);
    }
  }
  expect(urls).toHaveLength(12);
});
