import { experience } from "./experience";

it("lists the roles newest first, with no placeholder text", () => {
  expect(experience.pt.map((e) => e.org)).toEqual([
    "Duzi Tecnologia",
    "Aceleraí",
    "Partido Liberal · Eleições 2026",
    "Aurea Tech",
  ]);
  const strings = experience.pt.flatMap((e) => [
    e.period, e.role, e.org, e.location, e.summary,
    ...e.highlights.flatMap((h) => [h.name, h.text]),
  ]);
  expect(strings.filter((s) => /\[.*\]/.test(s))).toEqual([]);
});

it("marks outsourced work and gives every role highlights and a stack", () => {
  const outsourced = experience.pt.filter((e) => e.engagement).map((e) => e.org);
  expect(outsourced).toEqual(["Aceleraí", "Partido Liberal · Eleições 2026"]);
  for (const entry of experience.pt) {
    expect(entry.highlights.length).toBeGreaterThan(0);
    expect(entry.stack.length).toBeGreaterThan(0);
  }
});

it("reuses the Portuguese entries for every locale until translation", () => {
  expect(experience.en).toEqual(experience.pt);
  expect(experience.es).toEqual(experience.pt);
});
