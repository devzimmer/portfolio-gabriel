import { createRequire } from "node:module";
import { resolve } from "node:path";

// OpenNext's request converters do `import cookieParser from "cookie"` and call
// cookieParser.parse(). In the Workers bundle, esbuild hands that default
// import the whole module only when the package is not flagged __esModule.
// cookie@1 is flagged, so the import was undefined and every request carrying
// a cookie crashed the Worker (Cloudflare error 1101). package.json overrides
// OpenNext's cookie with 0.7, which is plain CommonJS.
test("the cookie parser OpenNext bundles survives a default import", () => {
  const openNextRequire = createRequire(
    resolve(process.cwd(), "node_modules/@opennextjs/aws/package.json"),
  );
  const cookie = openNextRequire("cookie");

  expect(cookie.__esModule).toBeFalsy();
  expect(cookie.parse("NEXT_LOCALE=en; _ga=GA1.1.123")).toMatchObject({
    NEXT_LOCALE: "en",
    _ga: "GA1.1.123",
  });
});
