import { expect, test } from "@playwright/test";

const MIN = 44;

test("desktop header and footer controls are at least 44px tall", async ({ page }) => {
  await page.goto("/pt");
  const targets = [
    ...(await page.getByRole("navigation", { name: "Principal" }).getByRole("link").all()),
    ...(await page.getByRole("contentinfo").getByRole("link").all()),
  ];
  for (const target of targets) {
    const box = await target.boundingBox();
    expect(box?.height, await target.innerText()).toBeGreaterThanOrEqual(MIN);
  }
});

test("mobile menu button is at least 44px", async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto("/pt");
  const box = await page.getByRole("button", { name: "Abrir menu" }).boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(MIN);
  expect(box?.height).toBeGreaterThanOrEqual(MIN);
  await page.close();
});
