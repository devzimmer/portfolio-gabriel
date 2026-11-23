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

for (const path of ["/pt/work/nope", "/pt/nada-aqui"]) {
  test(`${path} answers 404 with the designed page, not indexed`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Esta página não existe.");
    await expect(page.getByRole("link", { name: "Voltar ao início" })).toHaveAttribute("href", "/pt");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });
}

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
