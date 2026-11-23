import { obscureDigits, splitEmail, whatsappHref } from "./contact";

it("splits an email so the address never appears whole", () => {
  expect(splitEmail("dev.gabrielzimmer@gmail.com")).toEqual({ user: "dev.gabrielzimmer", domain: "gmail.com" });
});

it("round-trips a phone number into a wa.me link with a prefilled message", () => {
  const obscured = obscureDigits("+55 (11) 98765-4321");
  expect(obscured).not.toContain("5511987654321");
  expect(whatsappHref(obscured, "Olá, Gabriel!")).toBe("https://wa.me/5511987654321?text=Ol%C3%A1%2C%20Gabriel!");
});
