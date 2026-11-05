import en from "../../messages/en.json";
import es from "../../messages/es.json";
import pt from "../../messages/pt.json";

function keys(obj: object, prefix = ""): string[] {
  return Object.entries(obj)
    .flatMap(([k, v]) =>
      v && typeof v === "object" ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
    )
    .sort();
}

it("pt has exactly the en keys", () => expect(keys(pt)).toEqual(keys(en)));
it("es has exactly the en keys", () => expect(keys(es)).toEqual(keys(en)));
