import sitemap from "./sitemap";

it("lists the home and every case page", () => {
  const urls = sitemap().map((entry) => new URL(entry.url).pathname);
  expect(urls).toEqual(["/pt", "/pt/work/engpocket", "/pt/work/duzi-crm", "/pt/work/lumuviz"]);
});
