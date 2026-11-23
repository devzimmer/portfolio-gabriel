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
    page.getByRole("banner").getByRole("link", { name: "Currículo (PDF)" }),
  ).toHaveAttribute("href", "/cv-gabriel-zimmer-pt.pdf");
});

test("footer shows rights and local time, with no language switch", async ({ page }) => {
  await page.goto("/pt");
  const footer = page.getByRole("contentinfo");
  await expect(footer).toContainText("© 2026 Gabriel Zimmer");
  await expect(footer).toContainText("UTC−3");
  await expect(footer.getByRole("link")).toHaveCount(0);
});

test("home and case pages share their own preview image", async ({ page, request }) => {
  for (const [path, image] of [
    ["/pt", "/og/home.png"],
    ["/pt/work/engpocket", "/og/engpocket.png"],
  ]) {
    await page.goto(path);
    const og = await page.locator('meta[property="og:image"]').first().getAttribute("content");
    expect(og).toMatch(new RegExp(`${image.replace(".", "\.")}$`));
    expect((await request.get(image)).status()).toBe(200);
  }
  const icons = await page.locator('link[rel="icon"], link[rel="apple-touch-icon"]').count();
  expect(icons).toBeGreaterThanOrEqual(2);
});
