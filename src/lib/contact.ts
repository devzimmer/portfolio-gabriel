/**
 * Contact details travel to the browser in a shape that email and phone
 * harvesters do not match (no "@", digits reversed). The client component
 * puts them back together after hydration, so people still see and click
 * them, but the static HTML and RSC payload never contain them verbatim.
 */
export function splitEmail(email: string): { user: string; domain: string } {
  const at = email.indexOf("@");
  return { user: email.slice(0, at), domain: email.slice(at + 1) };
}

export function obscureDigits(phone: string): string {
  return phone.replace(/\D/g, "").split("").reverse().join("");
}

export function whatsappHref(obscured: string, message: string): string {
  const digits = obscured.split("").reverse().join("");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
