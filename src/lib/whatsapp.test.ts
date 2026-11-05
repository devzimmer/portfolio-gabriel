import { whatsappHref } from "./whatsapp";

const config = { number: "+55 (11) 98765-4321", locales: ["pt"] as const };

it("builds a wa.me link with digits only and a prefilled message", () => {
  expect(whatsappHref("pt", config, "Olá, Gabriel!")).toBe(
    "https://wa.me/5511987654321?text=Ol%C3%A1%2C%20Gabriel!",
  );
});

it("is only offered on the configured locales", () => {
  expect(whatsappHref("en", config, "Hi")).toBeNull();
  expect(whatsappHref("es", config, "Hola")).toBeNull();
});

it("is hidden until a number is configured", () => {
  expect(whatsappHref("pt", { number: null, locales: ["pt"] }, "Olá")).toBeNull();
});
