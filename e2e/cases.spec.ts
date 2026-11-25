import { expect, test } from "@playwright/test";

const cases = [
  ["engpocket", "EngPocket"],
  ["duzi-crm", "Duzi CRM"],
  ["lumuviz", "Lumuviz"],
] as const;

for (const [slug, title] of cases) {
  test(`${slug} renders its case study`, async ({ page }) => {
    const res = await page.goto(`/pt/work/${slug}`);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.locator("pre[role='img']")).toHaveCount(1);
    await expect(page).toHaveTitle(new RegExp(title));
  });
}

// An unknown case is rewritten by the proxy to the not-found page. A rewrite's
// status is not reliable across runtimes (OpenNext on Workers keeps 200), so
// that path is held to "designed page, never indexed"; other unknown URLs
// must answer a real 404.
for (const [path, status] of [
  ["/pt/work/nope", null],
  ["/pt/nada-aqui", 404],
] as const) {
  test(`${path} shows the designed 404 page, not indexed`, async ({ page }) => {
    const res = await page.goto(path);
    if (status) expect(res?.status()).toBe(status);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Esta página não existe.");
    await expect(page.getByRole("link", { name: "Voltar ao início" })).toHaveAttribute("href", "/pt");
    const robots = await page.locator('meta[name="robots"]').evaluateAll((tags) =>
      tags.map((tag) => tag.getAttribute("content")),
    );
    expect(robots.length).toBeGreaterThan(0);
    for (const content of robots) expect(content).toMatch(/noindex/);
  });
}

// Bots probe paths like these. They must get locale routing like any other
// URL instead of reaching the [locale] route with the file name as a locale.
for (const [path, landing] of [
  ["/x.php", "/pt/x.php"],
  ["/.env", "/pt/.env"],
] as const) {
  test(`${path} lands on the designed 404 at ${landing}`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(404);
    expect(new URL(page.url()).pathname).toBe(landing);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Esta página não existe.");
  });
}

test("a case URL with a file extension shows the designed 404", async ({ page }) => {
  await page.goto("/pt/work/x.png");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Esta página não existe.");
});

test("an English case URL lands on the Portuguese case", async ({ page }) => {
  await page.goto("/en/work/duzi-crm");
  await expect(page).toHaveURL(/\/pt\/work\/duzi-crm$/);
});

test("case nav chains the cases", async ({ page }) => {
  await page.goto("/pt/work/engpocket");
  await page.getByRole("link", { name: /Próximo case/ }).click();
  await expect(page).toHaveURL(/\/pt\/work\/duzi-crm$/);
});

test("header nav from a case page reaches the home section", async ({ page }) => {
  await page.goto("/pt/work/lumuviz");
  await page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Processo" }).click();
  await expect(page).toHaveURL(/\/pt#process$/);
});

test("case images open in a lightbox that steps with the arrows and closes with Escape", async ({
  page,
}) => {
  await page.goto("/pt/work/engpocket");
  const tile = page.getByRole("button", { name: /^Ampliar: .*relatório diário/ });
  await tile.click();

  const dialog = page.getByRole("dialog", { name: "Imagem ampliada" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("01 / 03")).toBeVisible();
  await expect(page.locator("html")).toHaveCSS("overflow", "hidden");

  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByText("02 / 03")).toBeVisible();
  await dialog.getByRole("button", { name: "Imagem anterior" }).click();
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByText("03 / 03")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(tile).toBeFocused();
  await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
});

test("no horizontal overflow on a phone", async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  for (const path of ["/pt", "/pt/work/engpocket", "/pt/work/duzi-crm", "/pt/work/lumuviz"]) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
  await page.close();
});
