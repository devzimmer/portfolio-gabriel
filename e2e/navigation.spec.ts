import { expect, test } from "@playwright/test";

const sections = [
  ["Trabalhos", "work"],
  ["Processo", "process"],
  ["Experiência", "experience"],
  ["Contato", "contact"],
] as const;

test("header links point at home sections from any page", async ({ page }) => {
  await page.goto("/pt");
  const nav = page.getByRole("navigation", { name: "Principal" });
  for (const [name, id] of sections) {
    await expect(nav.getByRole("link", { name })).toHaveAttribute("href", `/pt#${id}`);
  }
});

test("header offers the CV download", async ({ page }) => {
  await page.goto("/pt");
  await expect(
    page.getByRole("banner").getByRole("link", { name: "Baixar CV (PDF)" }),
  ).toHaveAttribute("href", "/cv-gabriel-zimmer-pt.pdf");
});

test("English pages offer the English CV", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("banner").getByRole("link", { name: /CV/ })).toHaveAttribute(
    "href",
    "/cv-gabriel-zimmer-en.pdf",
  );
  const res = await page.request.get("/cv-gabriel-zimmer-en.pdf");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("application/pdf");
});

test("footer shows rights and a locale switcher", async ({ page }) => {
  await page.goto("/pt");
  const footer = page.getByRole("contentinfo");
  await expect(footer).toContainText("© 2026 Gabriel Zimmer");
  await expect(footer.getByRole("link", { name: /^EN/ })).toHaveAttribute("href", "/en");
});
