import { routing } from "@/i18n/routing";
import { cases, getCase, getCaseNeighbours, isCaseSlug } from ".";

it("lists the cases in the approved order", () => {
  expect(cases.map((c) => c.slug)).toEqual(["engpocket", "duzi-crm", "lumuviz", "tv-celular"]);
});

it("rejects unknown slugs", () => {
  expect(isCaseSlug("nope")).toBe(false);
  expect(isCaseSlug("engpocket")).toBe(true);
  expect(getCase("nope")).toBeUndefined();
  expect(getCase("lumuviz")?.slug).toBe("lumuviz");
});

it("links neighbours without wrapping", () => {
  expect(getCaseNeighbours("engpocket")).toEqual({ previous: undefined, next: cases[1] });
  expect(getCaseNeighbours("duzi-crm")).toEqual({ previous: cases[0], next: cases[2] });
  expect(getCaseNeighbours("lumuviz")).toEqual({ previous: cases[1], next: cases[3] });
  expect(getCaseNeighbours("tv-celular")).toEqual({ previous: cases[2], next: undefined });
});

it.each(cases)("$slug has complete copy in every locale", (study) => {
  for (const locale of routing.locales) {
    const copy = study.copy[locale];
    expect(copy.facts).toHaveLength(4);
    expect(copy.built).toHaveLength(3);
    expect(copy.decisions).toHaveLength(3);
    // TV Celular intentionally has no images (campaign material stays private).
    if (study.slug !== "tv-celular") expect(copy.media.length).toBeGreaterThan(0);
    else expect(copy.media).toHaveLength(0);
    expect(copy.ai.stats.length).toBeGreaterThan(0);
    expect(copy.diagram.label.length).toBeGreaterThan(40);
  }
});

it("never claims manual line-by-line review or reverse engineering", () => {
  const text = JSON.stringify(cases).toLowerCase();
  for (const banned of ["linha a linha", "engenharia reversa", "line by line", "reverse engineer"]) {
    expect(text).not.toContain(banned);
  }
});

it("names no people in the campaign case and frames site totals as the platform's", () => {
  const text = JSON.stringify(getCase("tv-celular"));
  for (const banned of ["Duda", "Bolsonaro", "Rodrigo"]) {
    expect(text).not.toContain(banned);
  }
  expect(text).toContain("no site da TV Celular");
});

it("never talks about Lumuviz customers or users", () => {
  const text = JSON.stringify(getCase("lumuviz")).toLowerCase();
  for (const banned of ["clientes", "usuários", "customers", "users"]) {
    expect(text).not.toContain(banned);
  }
});

it("only cites the allowed EngPocket traction number", () => {
  const text = JSON.stringify(getCase("engpocket"));
  expect(text).toContain("150");
  expect(text).not.toMatch(/\bR\$/);
});

it("diagrams use only glyphs that monospace system fonts align", () => {
  for (const study of cases) {
    expect(study.copy.pt.diagram.ascii).not.toMatch(/[✓≤▶◀▼]/);
  }
});
