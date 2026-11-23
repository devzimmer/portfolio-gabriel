import { unknownCaseLocale } from "./case-routes";

it("flags case paths whose slug does not exist", () => {
  expect(unknownCaseLocale("/pt/work/nope")).toBe("pt");
  expect(unknownCaseLocale("/pt/work/nope/")).toBe("pt");
});

it("lets real cases and other paths through", () => {
  expect(unknownCaseLocale("/pt/work/engpocket")).toBeNull();
  expect(unknownCaseLocale("/pt")).toBeNull();
  expect(unknownCaseLocale("/xx/work/nope")).toBeNull();
});
