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
    page.getByRole("list").filter({ hasText: "Harness" }).getByRole("listitem"),
  ).toHaveCount(5);
});

test("reduced motion still shows the hands", async ({ browser }) => {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.goto("/pt#process");
  const box = await page.locator("#process canvas").boundingBox();
  expect(box?.height).toBeGreaterThan(100);
  await page.close();
});

test("selected work lists the three cases in order with working links", async ({ page }) => {
  await page.goto("/pt");
  const work = page.locator("#work");
  await expect(work.getByRole("heading", { level: 2 })).toHaveText("01 — Trabalhos selecionados");
  await expect(work.getByRole("heading", { level: 3 })).toHaveText(["EngPocket", "Duzi CRM", "Lumuviz"]);
  const links = work.getByRole("link", { name: /^Ler o case/ });
  await expect(links).toHaveCount(3);
  await expect(links.first()).toHaveAttribute("href", "/pt/work/engpocket");
  await expect(work).toContainText("150 assinaturas vendidas");
});

test("home sections follow the approved order", async ({ page }) => {
  await page.goto("/pt");
  const ids = await page.locator("main > section[id]").evaluateAll((els) => els.map((el) => el.id));
  expect(ids.slice(0, 2)).toEqual(["work", "process"]);
});

test("experience lists every role, newest first, with no placeholder", async ({ page }) => {
  await page.goto("/pt");
  const experience = page.locator("#experience");
  await expect(experience.getByRole("heading", { level: 3 })).toHaveText([
    "Duzi Tecnologia",
    "Aceleraí",
    "Partido Liberal · Eleições 2026",
    "Aurea Tech",
  ]);
  await expect(experience).not.toContainText("[");
  await expect(experience.getByRole("link", { name: "Baixar CV completo (PDF)" })).toHaveAttribute("href", "/cv.pdf");
  await expect(experience.getByRole("link", { name: /Baixar CV completo/ })).toHaveAttribute("target", "_blank");
});

test("contact gives a recruiter a way in, without a phone number", async ({ page }) => {
  await page.goto("/pt");
  const contact = page.locator("#contact");
  await expect(contact.getByRole("link", { name: "dev.gabrielzimmer@gmail.com" })).toHaveAttribute(
    "href",
    "mailto:dev.gabrielzimmer@gmail.com",
  );
  await expect(contact.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/gabrielzimmerdev/",
  );
  await expect(contact.getByRole("link", { name: /GitHub/ })).toHaveAttribute("target", "_blank");
  await expect(contact.getByRole("link", { name: /CV/ })).toHaveAttribute("href", "/cv.pdf");
  await expect(contact.getByRole("link", { name: /CV/ })).toHaveAttribute("target", "_blank");
  await expect(page.locator("body")).not.toContainText(/\+55|telefone/i);
});

test("each case has a visible, distinctly named read button", async ({ page }) => {
  await page.goto("/pt");
  const work = page.locator("#work");
  for (const title of ["EngPocket", "Duzi CRM", "Lumuviz"]) {
    const button = work.getByRole("link", { name: `Ler o case ${title}` });
    await expect(button).toBeVisible();
    const box = await button.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(48);
    await expect(button).toHaveCSS("border-top-style", "solid");
  }
});

for (const locale of ["en", "es"]) {
  test(`no WhatsApp contact on /${locale}`, async ({ page }) => {
    await page.goto(`/${locale}`);
    await expect(page.locator('a[href^="https://wa.me/"]')).toHaveCount(0);
  });
}

test("WhatsApp contact on /pt opens wa.me with a prefilled message", async ({ page }) => {
  const { siteConfig } = await import("../src/lib/site");
  test.skip(!siteConfig.whatsapp.number, "WhatsApp number not configured yet");
  await page.goto("/pt");
  const link = page.locator("#contact").getByRole("link", { name: /Chamar no WhatsApp/ });
  await expect(link).toHaveAttribute("href", /^https:\/\/wa\.me\/\d+\?text=/);
  await expect(link).toHaveAttribute("target", "_blank");
});
