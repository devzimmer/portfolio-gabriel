import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1920, height: 1080 } });

for (const path of ["/pt", "/pt/work/duzi-crm"]) {
  test(`${path} keeps content within the header's 1440px column`, async ({ page }) => {
    await page.goto(path);
    const header = await page.getByRole("banner").locator("> div").boundingBox();
    const main = await page.locator("main").boundingBox();
    expect(header?.width).toBe(1440);
    expect(main?.width).toBeLessThanOrEqual(1440);
    expect(Math.round(main?.x ?? 0)).toBe(Math.round(header?.x ?? -1));
  });
}
