import { expect, test } from "@playwright/test";

test("hero states who and what, with both calls to action", async ({ page }) => {
  await page.goto("/pt");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Gabriel\s*Zimmer/);
  await expect(page.getByText("AI-Native Developer")).toBeVisible();
  await expect(page.getByRole("link", { name: "Ver cases" })).toHaveAttribute("href", "#work");
  await expect(page.getByRole("link", { name: "Fale comigo" })).toHaveAttribute("href", "#contact");
  await expect(page.getByRole("img", { name: /Retrato em preto e branco/ })).toBeVisible();
  await expect(page.getByRole("region", { name: "Em resumo" })).toContainText("Claude Code");
});

test("process section opens with the hands canvas and lists five steps", async ({ page }) => {
  await page.goto("/pt");
  const process = page.locator("#process");
  await expect(process.locator("canvas[aria-hidden='true']")).toHaveCount(1);
  await expect(
    page.getByRole("list").filter({ hasText: "Spec" }).getByRole("listitem"),
  ).toHaveCount(5);
});

test("reduced motion still shows the hands", async ({ browser }) => {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.goto("/pt#process");
  const box = await page.locator("#process canvas").boundingBox();
  expect(box?.height).toBeGreaterThan(100);
  await page.close();
});
