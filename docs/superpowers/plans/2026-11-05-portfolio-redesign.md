# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the home page and add three case-study pages so the site matches the approved "A — Editorial" design, including the animated ASCII hands.

**Architecture:** Next.js 16 App Router under `src/app/[locale]`, server components with next-intl for short UI strings, typed TypeScript content modules (`src/content/*`) for long-form case and experience copy keyed by locale, and one client component that draws the ASCII hands on a `<canvas>` from a pure, unit-tested engine. Case pages are statically generated at `/[locale]/work/[slug]`.

**Tech Stack:** Next.js 16.4.5 (cacheComponents, proxy.ts), React 19.3, next-intl 4, Tailwind CSS 4 (`@theme` tokens), Vitest + React Testing Library (unit), Playwright (end-to-end smoke).

**Spec:** `docs/superpowers/specs/2026-11-05-portfolio-redesign-design.md` (copy deck, visual system, ASCII behaviour, content rules). Visual references: `docs/design/canvas/Case-*.dc.html` (case pages, structure and English copy) and `docs/design/ascii-hands-reference.js` (approved animation). Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` (AGENTS.md).

## Global Constraints

- Work on branch `feat/redesign`; never commit to `main` directly.
- Every claim on the site obeys the spec's "Content rules" section; when in doubt, leave it out.
- Colours, type and spacing come from the spec's "Visual system"; express them as Tailwind `@theme` tokens in `src/app/globals.css`, never as ad-hoc hex values in components.
- English copy is final for this round; `pt` and `es` reuse the English copy (content modules) or English strings (messages) until a translation task. Message files must keep identical key sets.
- No new runtime dependencies. Dev dependencies allowed: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `@testing-library/jest-dom`, `vite-tsconfig-paths`, `@playwright/test`.
- `dynamicParams` is not available with `cacheComponents`; unknown case slugs must call `notFound()`.
- Async Server Components are covered by Playwright, not Vitest (Next.js Vitest guide).
- Accessibility: one `h1` per page, sections labelled by their heading, touch targets ≥ 44px, decorative canvas `aria-hidden`, ASCII diagrams `<pre role="img" aria-label>`.
- The CV link renders only when `siteConfig.cvPath` is a non-empty string (currently `null`).
- `npm run check`, `npm test` and `npm run build` pass at the end of every task.

## Review Focus

1. Unknown case slug (`/en/work/nope`) → 404 page, not a 500 or an empty page.
2. Switching locale on a case page (`/en/work/duzi-crm` → PT) stays on the same case at `/pt/work/duzi-crm`.
3. Header nav clicked from a case page lands on the matching home section (`/en#process`).
4. `prefers-reduced-motion: reduce` → the hands render once, fully revealed, and no animation loop runs.
5. 375px-wide viewport → no horizontal page scroll; ASCII diagrams scroll inside their own box.

---

### Task 1: Test harness and CI

**Files:**
- Create: `vitest.config.mts`, `vitest.setup.ts`, `playwright.config.ts`, `src/i18n/messages.test.ts`, `e2e/smoke.spec.ts`
- Modify: `package.json` (scripts, devDependencies), `.github/workflows/ci.yml`, `.gitignore`

**Interfaces:**
- Produces: `npm test` (Vitest, run once), `npm run test:e2e` (Playwright). Unit tests live next to code as `*.test.ts(x)`; e2e specs in `e2e/`.

- [ ] **Step 1: Create the branch and install dev dependencies**

Run: `git switch -c feat/redesign` then `npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom vite-tsconfig-paths @playwright/test` then `npx playwright install chromium`.

- [ ] **Step 2: Configure Vitest and Playwright**

`vitest.config.mts` per the Next.js guide (`tsconfigPaths()`, `react()`, `environment: "jsdom"`, `setupFiles: ["./vitest.setup.ts"]`, `include: ["src/**/*.test.{ts,tsx}"]`). `vitest.setup.ts` imports `@testing-library/jest-dom/vitest`. `playwright.config.ts`: `testDir: "e2e"`, project `chromium`, `baseURL: "http://localhost:3100"`, `webServer.command` = `npm run start -- -p 3100` when `process.env.CI` else `npm run dev -- -p 3100`, `reuseExistingServer: !process.env.CI`. Scripts: `"test": "vitest run"`, `"test:e2e": "playwright test"`. Add `test-results/`, `playwright-report/` to `.gitignore`.

- [ ] **Step 3: Write the message-parity test**

```ts
// src/i18n/messages.test.ts
import en from "../../messages/en.json";
import pt from "../../messages/pt.json";
import es from "../../messages/es.json";

function keys(obj: object, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  ).sort();
}

it("pt has exactly the en keys", () => expect(keys(pt)).toEqual(keys(en)));
it("es has exactly the en keys", () => expect(keys(es)).toEqual(keys(en)));
```

- [ ] **Step 4: Write the first e2e smoke test**

```ts
// e2e/smoke.spec.ts
import { expect, test } from "@playwright/test";

test("root redirects to a locale and renders one h1", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(en|pt|es)$/);
  await expect(page.locator("h1")).toHaveCount(1);
});
```

- [ ] **Step 5: Run both suites**

Run: `npm test` → PASS (2 tests). Run: `npm run test:e2e` → PASS (1 test).

- [ ] **Step 6: Wire CI**

In `.github/workflows/ci.yml`, after `npm run typecheck` add `npm test`; after `npm run build` add `npx playwright install --with-deps chromium` and `npm run test:e2e` (CI env is set by Actions, so Playwright uses `next start`).

- [ ] **Step 7: Commit**

`git add -A && git commit -m "test: add Vitest and Playwright harness"`

---

### Task 2: Design tokens and UI primitives

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/components/ui/section-label.tsx`, `src/components/ui/button-link.tsx`, `src/components/ui/ui.test.tsx`

**Interfaces:**
- Produces tokens (Tailwind utilities follow from names): `--color-void: #0a0a0a` (page ground), `--color-fog: #f2f2f0` (primary text; replaces the old `#f5f5f5`), `--color-mute: #a0a0a0`, `--color-dim: #8c8c8c`, `--color-ink: #171717`, `--color-ash: #5f5f5f`, `--color-paper: #f2f2f0`, `--color-line: rgb(242 242 240 / 0.12)`, `--color-edge: rgb(242 242 240 / 0.3)`, `--color-line-ink: rgb(23 23 23 / 0.14)`, `--spacing-gutter: clamp(1.25rem, 4vw, 3.5rem)`, `--spacing-section: 7rem`; body background becomes `--color-void`.
- Produces `SectionLabel({ index, label, meta, id? }: { index: string; label: string; meta?: string; id?: string })` — renders the hairline row `"{index} — {label}"` (as `<h2 id={id}>` when `id` is given, else `<span>`) and the mono `meta`.
- Produces `ButtonLink({ href, variant, children, external? }: { href: string; variant: "solid" | "outline"; children: ReactNode; external?: boolean })` — anchor, min-height 48px, uppercase 12px tracking 0.2em; `solid` = fog background with void text, `outline` = `--color-edge` border; `external` adds `target="_blank" rel="noopener noreferrer"`.

- [ ] **Step 1: Write the failing tests**

```tsx
// src/components/ui/ui.test.tsx
import { render, screen } from "@testing-library/react";
import { ButtonLink } from "./button-link";
import { SectionLabel } from "./section-label";

it("SectionLabel renders an h2 with the joined label when id is given", () => {
  render(<SectionLabel index="01" label="Selected work" meta="3 case studies" id="work-title" />);
  expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("01 — Selected work");
  expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute("id", "work-title");
  expect(screen.getByText("3 case studies")).toBeInTheDocument();
});

it("SectionLabel renders no heading without id", () => {
  render(<SectionLabel index="02" label="Process" />);
  expect(screen.queryByRole("heading")).toBeNull();
});

it("ButtonLink external opens safely in a new tab", () => {
  render(<ButtonLink href="https://github.com/devzimmer" variant="outline" external>GitHub</ButtonLink>);
  const link = screen.getByRole("link", { name: "GitHub" });
  expect(link).toHaveAttribute("target", "_blank");
  expect(link).toHaveAttribute("rel", "noopener noreferrer");
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run src/components/ui` → FAIL (modules not found).

- [ ] **Step 3: Update tokens in `globals.css` and implement both components**

Keep the existing type scale, focus, selection and reduced-motion rules; change colours and spacing to the values above. Replace `ease-[var(--ease-editorial)]` usages with the `ease-editorial` utility while touching files.

- [ ] **Step 4: Run tests and checks**

Run: `npm test && npm run check` → PASS.

- [ ] **Step 5: Commit**

`git commit -am "feat(ui): editorial tokens, SectionLabel and ButtonLink"` (add new files first).

---

### Task 3: Content model (cases, experience, site config)

**Files:**
- Create: `src/content/cases/types.ts`, `src/content/cases/engpocket.ts`, `src/content/cases/duzi-crm.ts`, `src/content/cases/lumuviz.ts`, `src/content/cases/index.ts`, `src/content/cases/cases.test.ts`, `src/content/experience.ts`, `src/content/experience.test.ts`
- Modify: `src/lib/site.ts` (add `cvPath: null as string | null`)
- Delete: `src/lib/projects.ts`, `src/lib/experience.ts` (and their imports once Tasks 6 and 8 replace the sections; delete in Task 10 if still referenced)

**Interfaces:**
- Produces (`types.ts`):

```ts
import type { Locale } from "next-intl";
export type CaseSlug = "engpocket" | "duzi-crm" | "lumuviz";
export type CaseCopy = {
  title: string;
  lede: string;
  card: { summary: string; stack: string; meta: string };
  facts: { label: string; value: string }[];
  media: { label: string; caption: string }[];
  problem: { lead: string; body: string };
  built: { kicker?: string; title: string; tag?: string; body: string }[];
  diagram: { ascii: string; label: string; caption: string };
  decisions: { title: string; body: string }[];
  highlight: { title: string; figure: string; figureCaption: string; line: string; body: string };
  ai: { stats: { figure: string; caption: string }[]; notes: string[] };
  next: string;
};
export type CaseStudy = { slug: CaseSlug; copy: Record<Locale, CaseCopy> };
```

- Produces (`index.ts`): `cases: readonly CaseStudy[]` in order engpocket, duzi-crm, lumuviz; `isCaseSlug(value: string): value is CaseSlug`; `getCase(slug: string): CaseStudy | undefined`; `getCaseNeighbours(slug: CaseSlug): { previous?: CaseStudy; next?: CaseStudy }`.
- Produces (`experience.ts`): `type ExperienceEntry = { period: string; title: string; description: string; location: string }`; `experience: Record<Locale, ExperienceEntry[]>`.
- Copy: each case file defines `const en: CaseCopy` transcribed verbatim from `docs/design/canvas/Case-<Name>.dc.html` (card text from the spec's Selected work rows) and exports `{ slug, copy: { en, pt: en, es: en } }`. Highlight titles: "The incident", "Proof, not promises", "Measured, not guessed". EngPocket's "In development" goes in `built[2].tag`; Lumuviz's product names go in `built[n].kicker`. Experience entries are the two in the spec, in that order.

- [ ] **Step 1: Write the failing tests**

```ts
// src/content/cases/cases.test.ts
import { routing } from "@/i18n/routing";
import { cases, getCase, getCaseNeighbours, isCaseSlug } from ".";

it("lists the three cases in the approved order", () => {
  expect(cases.map((c) => c.slug)).toEqual(["engpocket", "duzi-crm", "lumuviz"]);
});
it("rejects unknown slugs", () => {
  expect(isCaseSlug("nope")).toBe(false);
  expect(getCase("nope")).toBeUndefined();
});
it("links neighbours without wrapping", () => {
  expect(getCaseNeighbours("engpocket")).toEqual({ previous: undefined, next: cases[1] });
  expect(getCaseNeighbours("lumuviz")).toEqual({ previous: cases[1], next: undefined });
});
it.each(cases)("$slug has complete copy in every locale", (study) => {
  for (const locale of routing.locales) {
    const copy = study.copy[locale];
    expect(copy.facts).toHaveLength(4);
    expect(copy.built).toHaveLength(3);
    expect(copy.decisions).toHaveLength(3);
    expect(copy.diagram.label.length).toBeGreaterThan(40);
  }
});
it("respects the content rules", () => {
  const text = JSON.stringify(cases).toLowerCase();
  for (const banned of ["reverse engineer", "line by line", "customers", "users"]) {
    expect(text).not.toContain(banned);
  }
});
```

```ts
// src/content/experience.test.ts
import { experience } from "./experience";
it("has the two confirmed roles first, newest first", () => {
  expect(experience.en.map((e) => e.title)).toEqual([
    "Founder & engineer · Duzi Tecnologia",
    "Co-founder & sole engineer · EngPocket",
  ]);
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run src/content` → FAIL (modules not found).

- [ ] **Step 3: Implement types, the three case modules, the index and experience; add `cvPath` to `siteConfig`**

If the banned-word test trips on legitimate copy (e.g. "users" inside "users mark points"), rephrase the copy, not the test — the spec forbids "users" for Lumuviz.

- [ ] **Step 4: Run tests and checks**

Run: `npm test && npm run check` → PASS.

- [ ] **Step 5: Commit**

`git add src/content src/lib/site.ts && git commit -m "feat(content): typed case studies and experience"`

---

### Task 4: Header, footer and navigation

**Files:**
- Modify: `src/components/layout/site-header.tsx`, `src/components/layout/site-footer.tsx`, `src/components/layout/mobile-menu.tsx` (labels only), `messages/{en,pt,es}.json`
- Create: `e2e/navigation.spec.ts`

**Interfaces:**
- Consumes: `ButtonLink` (Task 2), `siteConfig.cvPath` (Task 3).
- Nav items are `work | process | experience | contact`, each `href` = `` `/${locale}#${id}` `` (locale from `getLocale()`), so they work from case pages. Messages `Nav`: `label, home, work, process, experience, contact, cv` (`cv` = "Download CV (PDF)"); remove `about`, `projects`. `Footer`: `rights` = "© 2026 Gabriel Zimmer", `location` = "Brazil · Remote"; remove `backToTop`. Footer renders rights, location and `<LocaleSwitcher />`.

- [ ] **Step 1: Write the failing e2e tests**

```ts
// e2e/navigation.spec.ts
import { expect, test } from "@playwright/test";

test("header links point at home sections and no CV link shows while cvPath is null", async ({ page }) => {
  await page.goto("/en");
  const nav = page.getByRole("navigation", { name: "Main" });
  for (const [name, id] of [["Work", "work"], ["Process", "process"], ["Experience", "experience"], ["Contact", "contact"]]) {
    await expect(nav.getByRole("link", { name })).toHaveAttribute("href", `/en#${id}`);
  }
  await expect(page.getByRole("link", { name: /CV/ })).toHaveCount(0);
});

test("footer shows rights and a locale switcher", async ({ page }) => {
  await page.goto("/en");
  const footer = page.getByRole("contentinfo");
  await expect(footer).toContainText("© 2026 Gabriel Zimmer");
  await expect(footer.getByRole("link", { name: /^PT/ })).toHaveAttribute("href", "/pt");
});
```

(`Nav.label` must be "Main" in en.)

- [ ] **Step 2: Run to verify they fail**

Run: `npx playwright test e2e/navigation.spec.ts` → FAIL.

- [ ] **Step 3: Implement header, footer and message changes in all three locales**

- [ ] **Step 4: Run all checks**

Run: `npm test && npm run check && npx playwright test e2e/navigation.spec.ts` → PASS.

- [ ] **Step 5: Commit**

`git commit -am "feat(layout): editorial header, footer and section navigation"`

---

### Task 5: Hero and "At a glance"

**Files:**
- Modify: `src/components/sections/hero.tsx`, `src/app/[locale]/page.tsx`, `messages/{en,pt,es}.json`
- Create: `src/components/sections/at-a-glance.tsx`, `e2e/home.spec.ts`
- Delete: `src/components/sections/about.tsx`, `About` messages

**Interfaces:**
- Consumes: `ButtonLink` (Task 2).
- Messages `Hero`: `eyebrow, location, secondary, tagline, ctaWork, ctaContact, portraitAlt` (values from the spec copy deck). Messages `Glance`: `label` ("At a glance"), `focus.{title,body}`, `ai.{title,body}`, `stack.{title,body}`, `languages.{title,body}`.
- Page order after this task: `Hero`, `AtAGlance`, then existing sections until replaced.

- [ ] **Step 1: Write the failing e2e test**

```ts
// e2e/home.spec.ts
import { expect, test } from "@playwright/test";

test("hero states who and what, with both calls to action", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Gabriel\s*Zimmer/);
  await expect(page.getByText("AI-Native Developer")).toBeVisible();
  await expect(page.getByRole("link", { name: "View case studies" })).toHaveAttribute("href", "#work");
  await expect(page.getByRole("link", { name: "Get in touch" })).toHaveAttribute("href", "#contact");
  await expect(page.getByRole("region", { name: "At a glance" })).toContainText("Claude Code");
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npx playwright test e2e/home.spec.ts` → FAIL.

- [ ] **Step 3: Implement**

Hero layout per spec (split; left column eyebrow row / name + secondary + serif / buttons; right column portrait with `object-[50%_20%]`, hairline left border). "AI-Native Developer" renders in `text-dim`. At a glance is a `<section aria-label>` with four cells in an auto-fit grid (min 240px).

- [ ] **Step 4: Run all checks**

Run: `npm test && npm run check && npx playwright test e2e/home.spec.ts` → PASS.

- [ ] **Step 5: Commit**

`git add -A && git commit -m "feat(home): editorial hero and at-a-glance strip"`

---

### Task 6: ASCII hands engine

**Files:**
- Create: `src/components/ascii/hands-grid.ts`, `src/components/ascii/engine.ts`, `src/components/ascii/engine.test.ts`

**Interfaces:**
- Produces (`hands-grid.ts`): `export const HANDS_GRID: string` — the `GRID` string from `docs/design/ascii-hands-reference.js`, verbatim (6,120 characters). Add a comment: placeholder art, replace before launch (spec, Content rules).
- Produces (`engine.ts`):

```ts
export const COLS = 180;
export const ROWS = 34;
export const FRAME_INTERVAL_MS = 41;
export type Point = { x: number; y: number };
export type Glyph = { x: number; y: number; char: string; alpha: number };
export type HandsModel = {
  levels: Uint8Array;
  delays: Float32Array;
  tipLeft: Point | null;
  tipRight: Point | null;
  rnd: () => number;
};
export function createRng(seed: number): () => number; // mulberry32
export function createHandsModel(grid: string, seed?: number): HandsModel; // seed defaults to 7; throws if grid.length !== COLS * ROWS
export function frameGlyphs(model: HandsModel, t: number, opts: { still: boolean }): Glyph[];
```

`frameGlyphs` is `_draw` from the reference without the canvas: same ramps, delays, scramble window, idle wave, flicker and spark, returning glyphs instead of drawing. With `still: true` every lit cell is fully revealed with its ramp glyph, idle wave, flicker and spark off.

- [ ] **Step 1: Write the failing tests**

```ts
// src/components/ascii/engine.test.ts
import { HANDS_GRID } from "./hands-grid";
import { COLS, ROWS, createHandsModel, frameGlyphs } from "./engine";

const lit = [...HANDS_GRID].filter((c) => c !== "0").length;
const LEFT = " .:-=+*#%@";
const RIGHT = " .:;/<{}10";

it("decodes the full grid", () => {
  expect(createHandsModel(HANDS_GRID).levels).toHaveLength(COLS * ROWS);
  expect(() => createHandsModel("123")).toThrow();
});
it("finds both fingertips", () => {
  const m = createHandsModel(HANDS_GRID);
  expect(m.tipLeft).toEqual({ x: 73, y: 16 });
  expect(m.tipRight).toEqual({ x: 96, y: 14 });
});
it("draws nothing before the reveal starts", () => {
  expect(frameGlyphs(createHandsModel(HANDS_GRID), 0, { still: false })).toHaveLength(0);
});
it("still frame shows every lit cell with its ramp glyph", () => {
  const m = createHandsModel(HANDS_GRID);
  const glyphs = frameGlyphs(m, 0, { still: true });
  expect(glyphs).toHaveLength(lit);
  for (const g of glyphs) {
    const level = m.levels[g.y * COLS + g.x];
    expect(g.char).toBe((g.x >= COLS / 2 ? RIGHT : LEFT)[level]);
    expect(g.alpha).toBeGreaterThan(0);
    expect(g.alpha).toBeLessThanOrEqual(1);
  }
});
it("sends a spark between the fingertips", () => {
  const m = createHandsModel(HANDS_GRID);
  const spark = frameGlyphs(m, 2550, { still: false }).filter(
    (g) => m.levels[g.y * COLS + g.x] === 0 && "-=>".includes(g.char),
  );
  expect(spark.length).toBeGreaterThan(0);
  for (const g of spark) {
    expect(g.x).toBeGreaterThan(73);
    expect(g.x).toBeLessThan(96);
  }
});
it("is deterministic for a seed", () => {
  const a = frameGlyphs(createHandsModel(HANDS_GRID, 7), 3000, { still: false });
  const b = frameGlyphs(createHandsModel(HANDS_GRID, 7), 3000, { still: false });
  expect(a).toEqual(b);
});
```

- [ ] **Step 2: Run to verify they fail**

Run: `npx vitest run src/components/ascii` → FAIL.

- [ ] **Step 3: Implement `hands-grid.ts` and `engine.ts`**

- [ ] **Step 4: Run tests and checks**

Run: `npm test && npm run check` → PASS.

- [ ] **Step 5: Commit**

`git add src/components/ascii && git commit -m "feat(ascii): deterministic hands engine"`

---

### Task 7: ASCII hands component and Process section

**Files:**
- Create: `src/components/ascii/ascii-hands.tsx`, `src/components/ascii/ascii-hands.test.tsx`, `src/components/sections/process.tsx`
- Modify: `src/app/[locale]/page.tsx`, `messages/{en,pt,es}.json`, `e2e/home.spec.ts`

**Interfaces:**
- Consumes: `createHandsModel`, `frameGlyphs`, `COLS`, `ROWS`, `FRAME_INTERVAL_MS`, `HANDS_GRID` (Task 6); `SectionLabel` (Task 2).
- Produces: `"use client"` `AsciiHands({ className }: { className?: string })` — `<canvas aria-hidden="true" className="block w-full font-mono ...">`; font family read from `getComputedStyle(canvas).fontFamily` (fallback `monospace`); guards missing `ResizeObserver`, `IntersectionObserver` and `document.fonts` (jsdom has none); sizing, dpr cap, IntersectionObserver (threshold 0.2) start/pause, ResizeObserver redraw, `document.fonts.ready` redraw, 24 fps cap and reduced-motion still frame exactly as the spec; cleans up observers and `cancelAnimationFrame` on unmount. Without IntersectionObserver it starts immediately.
- Messages `Process`: `label` ("Process"), `meta`, `title`, `titleEmphasis`, `lede`, `steps.{spec,harness,build,review,ship}.{title,body}` — values from the copy deck. Section `id="process"`, `aria-labelledby` on the headline; steps on `data-surface="paper"`.

- [ ] **Step 1: Write the failing unit tests**

```tsx
// src/components/ascii/ascii-hands.test.tsx
import { render } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { AsciiHands } from "./ascii-hands";

const ctx = { setTransform: vi.fn(), clearRect: vi.fn(), fillText: vi.fn(), font: "", fillStyle: "", textBaseline: "" };

function mockMotion(reduce: boolean) {
  vi.stubGlobal("matchMedia", (q: string) => ({ matches: reduce && q.includes("reduce"), addEventListener() {}, removeEventListener() {} }));
}

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx as never);
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(1440);
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); ctx.fillText.mockClear(); });

it("reduced motion draws one full frame and starts no loop", () => {
  mockMotion(true);
  const raf = vi.spyOn(window, "requestAnimationFrame");
  render(<AsciiHands />);
  expect(ctx.fillText).toHaveBeenCalled();
  expect(raf).not.toHaveBeenCalled();
});

it("is hidden from assistive tech", () => {
  mockMotion(true);
  const { container } = render(<AsciiHands />);
  expect(container.querySelector("canvas")).toHaveAttribute("aria-hidden", "true");
});

it("cancels its loop on unmount", () => {
  mockMotion(false);
  const cancel = vi.spyOn(window, "cancelAnimationFrame");
  const { unmount } = render(<AsciiHands />);
  unmount();
  expect(cancel).toHaveBeenCalled();
});
```

- [ ] **Step 2: Add the e2e check to `e2e/home.spec.ts`**

```ts
test("process section opens with the hands canvas and lists five steps", async ({ page }) => {
  await page.goto("/en");
  const process = page.locator("#process");
  await expect(process.locator("canvas[aria-hidden='true']")).toHaveCount(1);
  await expect(page.getByRole("list").filter({ hasText: "Spec" }).getByRole("listitem")).toHaveCount(5);
});

test("reduced motion still shows the hands", async ({ browser }) => {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.goto("/en#process");
  const box = await page.locator("#process canvas").boundingBox();
  expect(box?.height).toBeGreaterThan(100);
});
```

- [ ] **Step 3: Run to verify they fail**

Run: `npx vitest run src/components/ascii && npx playwright test e2e/home.spec.ts` → FAIL.

- [ ] **Step 4: Implement `AsciiHands`, `Process`, messages, and add `<Process />` after `<Projects />` in `page.tsx`**

- [ ] **Step 5: Run all checks**

Run: `npm test && npm run check && npm run test:e2e` → PASS.

- [ ] **Step 6: Commit**

`git add -A && git commit -m "feat(process): ASCII hands and process steps"`

---

### Task 8: Selected work section

**Files:**
- Create: `src/components/sections/selected-work.tsx`
- Modify: `src/app/[locale]/page.tsx`, `messages/{en,pt,es}.json`, `e2e/home.spec.ts`
- Delete: `src/components/sections/projects.tsx`, `src/lib/projects.ts`, `Projects` messages

**Interfaces:**
- Consumes: `cases` (Task 3), `SectionLabel` (Task 2), next-intl `Link` from `@/i18n/navigation`.
- Messages `Work`: `label` ("Selected work"), `meta` ("{count} case studies"), `read` ("Read case study →"). Each row: index `01–03`, `copy[locale].title`, `card.summary`, `card.stack`, `card.meta`, link to `/work/{slug}` (locale-prefixed by `Link`). Section `id="work"`.

- [ ] **Step 1: Write the failing e2e test**

```ts
test("selected work lists the three cases in order with working links", async ({ page }) => {
  await page.goto("/en");
  const work = page.locator("#work");
  await expect(work.getByRole("heading", { level: 3 })).toHaveText(["EngPocket", "Duzi CRM", "Lumuviz"]);
  await expect(work.getByRole("link", { name: /Read case study/ }).first()).toHaveAttribute("href", "/en/work/engpocket");
  await expect(work).toContainText("150+ subscriptions sold");
});
```

- [ ] **Step 2: Run to verify it fails** — `npx playwright test e2e/home.spec.ts` → FAIL.
- [ ] **Step 3: Implement; page order becomes Hero, AtAGlance, SelectedWork, Process, Experience, Contact.**
- [ ] **Step 4: Run all checks** — `npm test && npm run check && npm run test:e2e` → PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(home): selected work from case registry"`

---

### Task 9: Experience and Contact

**Files:**
- Modify: `src/components/sections/experience.tsx`, `src/components/sections/contact.tsx`, `messages/{en,pt,es}.json`, `e2e/home.spec.ts`
- Delete: `src/lib/experience.ts`, old `Experience.items` / `Contact` placeholder messages

**Interfaces:**
- Consumes: `experience` (Task 3), `siteConfig` (`email`, `links`, `cvPath`), `SectionLabel`, `ButtonLink`.
- Messages `Experience`: `label`, `meta`, `title`, `titleEmphasis`, `cv` ("Download full CV (PDF)"). Messages `Contact`: `label`, `status`, `title`, `titleEmphasis`, `lede`, `linkedin`, `github`, `cv`. Sections `id="experience"` and `id="contact"`. Experience renders an `<ol>` from `experience[locale]`; CV buttons only when `cvPath` is set. No phone number.

- [ ] **Step 1: Write the failing e2e test**

```ts
test("experience and contact give a recruiter a way in", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("#experience li")).toHaveCount(2);
  const contact = page.locator("#contact");
  await expect(contact.getByRole("link", { name: "dev.gabrielzimmer@gmail.com" })).toHaveAttribute("href", "mailto:dev.gabrielzimmer@gmail.com");
  await expect(contact.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute("href", "https://www.linkedin.com/in/gabrielzimmerdev/");
  await expect(contact.getByRole("link", { name: /GitHub/ })).toHaveAttribute("target", "_blank");
  await expect(page.locator("body")).not.toContainText(/\+55|phone/i);
});
```

- [ ] **Step 2: Run to verify it fails** — FAIL.
- [ ] **Step 3: Implement both sections and messages.**
- [ ] **Step 4: Run all checks** — `npm test && npm run check && npm run test:e2e` → PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(home): experience and contact sections"`

---

### Task 10: Case-study pages

**Files:**
- Create: `src/app/[locale]/work/[slug]/page.tsx`, `src/components/case/case-hero.tsx`, `src/components/case/case-section.tsx`, `src/components/case/case-diagram.tsx`, `src/components/case/case-highlight.tsx`, `src/components/case/case-nav.tsx`, `src/components/case/media-placeholder.tsx`, `e2e/cases.spec.ts`
- Modify: `src/app/sitemap.ts`, `messages/{en,pt,es}.json`

**Interfaces:**
- Consumes: `cases`, `getCase`, `isCaseSlug`, `getCaseNeighbours`, `CaseCopy` (Task 3); `SectionLabel` (Task 2).
- Page: `generateStaticParams()` returns `cases.map(({ slug }) => ({ slug }))` (locale comes from the parent layout); the page awaits `params`, calls `notFound()` when `!isCaseSlug(slug)`, and reads UI strings with `getTranslations({ locale, namespace: "Case" })`. `generateMetadata` returns `title = copy.title`, `description = copy.card.summary`, `alternates.canonical = /{locale}/work/{slug}`, `alternates.languages` for all locales plus `x-default`.
- Messages `Case`: `allWork` ("← All work"), `counter` ("Case study {n} / {total}"), `sections.{problem,built,architecture,decisions,ai,next}` ("Problem", "What I built", "Architecture", "Key decisions", "How AI built it", "Next"), `previous` ("Previous case"), `nextCase` ("Next case"), `backTo` ("Back to"), `allWorkShort` ("All work").
- Section numbering: 01 Problem … 05 `highlight.title` … 07 Next, as in the reference artboards. `CaseDiagram` renders `<pre role="img" aria-label={label}>` inside an `overflow-x-auto` box plus the caption.
- Sitemap: add one entry per locale × case at `/{locale}/work/{slug}` with language alternates.

- [ ] **Step 1: Write the failing e2e tests**

```ts
// e2e/cases.spec.ts
import { expect, test } from "@playwright/test";

for (const [slug, title] of [["engpocket", "EngPocket"], ["duzi-crm", "Duzi CRM"], ["lumuviz", "Lumuviz"]]) {
  test(`${slug} renders its case study`, async ({ page }) => {
    const res = await page.goto(`/en/work/${slug}`);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.locator("pre[role='img']")).toHaveCount(1);
  });
}

test("unknown slug is a 404", async ({ page }) => {
  const res = await page.goto("/en/work/nope");
  expect(res?.status()).toBe(404);
});

test("locale switch keeps the case", async ({ page }) => {
  await page.goto("/en/work/duzi-crm");
  await page.getByRole("contentinfo").getByRole("link", { name: /^PT/ }).click();
  await expect(page).toHaveURL(/\/pt\/work\/duzi-crm$/);
});

test("case nav chains the three cases", async ({ page }) => {
  await page.goto("/en/work/engpocket");
  await page.getByRole("link", { name: /Next case/ }).click();
  await expect(page).toHaveURL(/\/en\/work\/duzi-crm$/);
});

test("header nav from a case page reaches the home section", async ({ page }) => {
  await page.goto("/en/work/lumuviz");
  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Process" }).click();
  await expect(page).toHaveURL(/\/en#process$/);
});

test("no horizontal overflow on a phone", async ({ browser }) => {
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  for (const path of ["/en", "/en/work/engpocket", "/en/work/duzi-crm", "/en/work/lumuviz"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});
```

- [ ] **Step 2: Run to verify they fail** — `npx playwright test e2e/cases.spec.ts` → FAIL.
- [ ] **Step 3: Implement the route, components, messages and sitemap entries.**
- [ ] **Step 4: Run all checks** — `npm test && npm run check && npm run build && npm run test:e2e` → PASS.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat(work): case-study pages"`

---

### Task 11: Cleanup and documentation

**Files:**
- Modify: `README.md`, `messages/{en,pt,es}.json`, `src/app/[locale]/layout.tsx` (Metadata description if it still mentions removed sections)
- Delete: any file or message key no longer referenced (`About`, `Projects`, `Footer.backToTop`, `Nav.about`, `Nav.projects`, `src/lib/projects.ts`, `src/lib/experience.ts` if not already gone)

**Interfaces:** none new.

- [ ] **Step 1: Find dead code** — grep each deleted symbol (`rg "lib/projects|lib/experience|sections/about|Projects\\.|About\\." src`) → no matches expected.
- [ ] **Step 2: Update README** — scripts table gains `test` and `test:e2e`; describe `src/content/` (case and experience copy) and `docs/design/`; note the hands art placeholder and pending pt/es translation.
- [ ] **Step 3: Run everything** — `npm run check && npm test && npm run build && npm run test:e2e` → PASS.
- [ ] **Step 4: Commit** — `git add -A && git commit -m "chore: remove legacy sections and document the redesign"`

---

## After this plan (not in scope)

Translate pt/es copy; earlier experience from LinkedIn; screenshots replacing media placeholders; CV PDF and `cvPath`; owned hands artwork; OG image and favicon; CSP; deploy.
