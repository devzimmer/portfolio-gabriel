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
