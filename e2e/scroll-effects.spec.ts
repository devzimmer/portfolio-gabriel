import { expect, test } from "@playwright/test";

const translateX = (transform: string) => {
  const match = transform.match(/translate3d\((-?[\d.]+)px/);
  return match ? Number(match[1]) : 0;
};

test.describe("desktop", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("selected work pins and slides sideways as you scroll", async ({ page }) => {
    await page.goto("/pt");
    const outer = page.locator("#work > div");
    const track = page.locator("#work ul");
    await expect(outer).toHaveAttribute("style", /height: \d+px/);

    const top = await outer.evaluate((el) => el.getBoundingClientRect().top + window.scrollY - 72);
    await page.evaluate((y) => window.scrollTo({ top: y + 900, behavior: "instant" }), top);
    await expect.poll(async () => translateX(await track.evaluate((el) => el.style.transform))).toBeLessThan(-400);
    await expect(page.locator("#work li").first()).toHaveAttribute("data-active", "false");
  });

  test("tabbing into an off-screen case brings it into view", async ({ page }) => {
    await page.goto("/pt");
    // Wait for hydration: the gallery sets its scroll height once measured.
    await expect(page.locator("#work > div")).toHaveAttribute("style", /height: \d+px/);
    const links = page.locator("#work").getByRole("link", { name: /^Ler o case/ });
    await links.nth(1).focus();
    await page.keyboard.press("Tab");
    await expect(links.nth(2)).toBeFocused();
    await expect
      .poll(async () => {
        const box = await links.nth(2).boundingBox();
        return box ? box.x + box.width <= 1440 && box.x >= 0 : false;
      })
      .toBe(true);
  });

  test("hovering a case shows the cursor label and the whole card links to it", async ({ page }) => {
    await page.goto("/pt");
    await expect(page.locator("#work > div")).toHaveAttribute("style", /height: \d+px/);
    const label = page.locator("[data-cursor-label] > div");
    await expect(label).toHaveCSS("opacity", "0");
    const card = page.locator("#work li").first();
    await card.hover({ position: { x: 200, y: 200 } });
    await expect(label).toHaveText("Ver case →");
    await expect(label).toHaveCSS("opacity", "1");
    await card.click({ position: { x: 200, y: 200 } });
    await expect(page).toHaveURL(/\/pt\/work\/engpocket$/);
  });

  test("footer shows the local time in UTC−3", async ({ page }) => {
    await page.goto("/pt");
    await expect(page.locator("footer time")).toHaveText(/^\d{2}:\d{2}$/);
    await expect(page.locator("footer")).toContainText("UTC−3");
  });
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("selected work stays a plain vertical list", async ({ page }) => {
    await page.goto("/pt");
    await expect(page.locator("#work > div")).not.toHaveAttribute("style", /height/);
    await expect(page.locator("#work ul")).not.toHaveAttribute("style", /translate/);
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width).toBe(390);
  });
});

test.describe("reduced motion", () => {
  test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });

  test("keeps the vertical list and full-contrast text", async ({ page }) => {
    await page.goto("/pt");
    await expect(page.locator("#work > div")).not.toHaveAttribute("style", /height/);
    const opacity = await page
      .locator("#process-title .ink-word")
      .first()
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe("1");
  });
});
