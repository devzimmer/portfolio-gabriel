import { experience } from "./experience";

it("lists the confirmed roles newest first, then the placeholder row", () => {
  expect(experience.pt.map((e) => e.title)).toEqual([
    "Fundador e engenheiro · Duzi Tecnologia",
    "Cofundador e único engenheiro · EngPocket",
    "[Cargo anterior] · [Empresa]",
  ]);
  expect(experience.pt.map((e) => Boolean(e.placeholder))).toEqual([false, false, true]);
});

it("reuses the Portuguese entries for every locale until translation", () => {
  expect(experience.en).toEqual(experience.pt);
  expect(experience.es).toEqual(experience.pt);
});
