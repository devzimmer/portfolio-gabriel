import { expect, test } from "@playwright/test";

test("root redirects to a locale and renders one h1", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(en|pt|es)$/);
  await expect(page.locator("h1")).toHaveCount(1);
});
