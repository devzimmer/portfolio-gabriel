import { buildLlmsTxt } from "./llms";

it("starts with the name and summary, then lists every case and role", () => {
  const text = buildLlmsTxt();
  expect(text.startsWith("# Gabriel Zimmer\n\n> AI-native full stack developer")).toBe(true);
  for (const slug of ["engpocket", "duzi-crm", "lumuviz"]) {
    expect(text).toContain(`/en/work/${slug})`);
  }
  for (const org of ["Duzi Tecnologia", "Aceleraí", "Aurea Tech"]) {
    expect(text).toContain(`### ${org}`);
  }
  expect(text).toContain("dev.gabrielzimmer@gmail.com");
});
