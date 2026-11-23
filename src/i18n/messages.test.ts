import pt from "../../messages/pt.json";

function values(obj: object): string[] {
  return Object.values(obj).flatMap((v) => (v && typeof v === "object" ? values(v) : [String(v)]));
}

it("has no empty strings or leftover placeholders", () => {
  for (const value of values(pt)) {
    expect(value.trim()).not.toBe("");
    expect(value).not.toMatch(/\[[^\]]*\]|TODO/);
  }
});
