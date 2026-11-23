// Generates the site's static brand images: favicon/app icons and the
// Open Graph cards shown when a link is shared (LinkedIn, WhatsApp, Slack).
//
//   node scripts/generate-images.mjs
//
// Output is committed: src/app/{favicon.ico,icon.png,apple-icon.png} and
// public/og/*.png. Re-run after changing the copy below or the case list.
// Fonts are fetched once from Google Fonts into node_modules/.cache.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(join(root, "package.json"));
const { ImageResponse } = require("next/og");
const React = require("react");
const sharp = require("sharp");
const h = React.createElement;

const color = { void: "#0a0a0a", fog: "#f2f2f0", mute: "#a0a0a0", dim: "#8c8c8c", line: "#2a2a29" };

// Copy for the share cards. Kept short: these render at thumbnail size.
const home = {
  eyebrow: "Full Stack · Product Engineer",
  name: "Gabriel Zimmer",
  role: "AI-Native Full Stack Developer",
  tagline: "Construo produtos com IA, do banco de dados ao deploy.",
  url: "dev.gabrielzimmer.com.br",
};
const cases = [
  {
    slug: "engpocket",
    title: "EngPocket",
    lede: "Agente de IA no WhatsApp que faz a papelada de obra de engenheiros civis.",
    figure: "150+",
    figureCaption: "assinaturas vendidas",
    stack: "Next.js · Supabase · PostgreSQL · OpenAI · WhatsApp API",
  },
  {
    slug: "duzi-crm",
    title: "Duzi CRM",
    lede: "CRM de WhatsApp multi-tenant, com o isolamento entre empresas provado no banco.",
    figure: "Tech Provider",
    figureCaption: "aprovado pela Meta",
    stack: "React · Supabase · PostgreSQL · Deno · Cloudflare",
  },
  {
    slug: "lumuviz",
    title: "Lumuviz",
    lede: "Modelador 3D com motor de geometria próprio e render com IA para arquitetos.",
    figure: "−58–73%",
    figureCaption: "de custo por render, em benchmark",
    stack: "TypeScript · three.js · Electron · Next.js · OpenAI",
  },
];

async function loadFonts() {
  const cache = join(root, "node_modules/.cache/brand-fonts");
  await mkdir(cache, { recursive: true });
  const families = [
    ["Geist", "Geist:wght@500", 500, "normal"],
    ["GeistSemi", "Geist:wght@600", 600, "normal"],
    ["GeistMono", "Geist+Mono:wght@400", 400, "normal"],
    ["Serif", "Instrument+Serif:ital@1", 400, "italic"],
  ];
  return Promise.all(
    families.map(async ([name, query, weight, style]) => {
      const file = join(cache, `${name}.ttf`);
      if (!existsSync(file)) {
        // Without a browser user agent Google Fonts serves TTF, which satori reads.
        const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${query}`)).text();
        const url = css.match(/src: url\((.+?\.ttf)\)/)?.[1];
        if (!url) throw new Error(`No TTF for ${query}`);
        await writeFile(file, Buffer.from(await (await fetch(url)).arrayBuffer()));
      }
      return { name, data: await readFile(file), weight, style };
    }),
  );
}

async function png(element, width, height, fonts) {
  const res = new ImageResponse(element, { width, height, fonts });
  return Buffer.from(await res.arrayBuffer());
}

const mono = (text, extra = {}) =>
  h("div", { style: { fontFamily: "GeistMono", fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: color.mute, ...extra } }, text);

function homeCard(portrait) {
  return h(
    "div",
    { style: { display: "flex", width: "100%", height: "100%", background: color.void, color: color.fog } },
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, padding: "56px 56px 52px" } },
      mono(home.eyebrow),
      h(
        "div",
        { style: { display: "flex", flexDirection: "column" } },
        h("div", { style: { fontFamily: "Geist", fontSize: 104, lineHeight: 0.9, letterSpacing: -4.5, textTransform: "uppercase" } }, home.name),
        h("div", { style: { fontFamily: "Geist", fontSize: 46, lineHeight: 1, letterSpacing: -1.5, textTransform: "uppercase", color: color.dim, marginTop: 22 } }, home.role),
        h("div", { style: { fontFamily: "Serif", fontStyle: "italic", fontSize: 34, marginTop: 30 } }, home.tagline),
      ),
      mono(home.url, { color: color.fog }),
    ),
    h("img", { src: portrait, width: 380, height: 630, style: { objectFit: "cover", borderLeft: `1px solid ${color.line}` } }),
  );
}

function caseCard(study, index) {
  return h(
    "div",
    { style: { display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", padding: "56px 64px 52px", background: color.void, color: color.fog } },
    h(
      "div",
      { style: { display: "flex", justifyContent: "space-between" } },
      mono(`Case ${String(index + 1).padStart(2, "0")} / ${String(cases.length).padStart(2, "0")}`),
      mono("Gabriel Zimmer", { color: color.fog }),
    ),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column" } },
      h("div", { style: { fontFamily: "Geist", fontSize: 132, lineHeight: 0.9, letterSpacing: -6 } }, study.title),
      h("div", { style: { fontFamily: "Serif", fontStyle: "italic", fontSize: 40, lineHeight: 1.15, marginTop: 28, maxWidth: 900 } }, study.lede),
    ),
    h(
      "div",
      { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: `1px solid ${color.line}`, paddingTop: 26 } },
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: 8 } },
        h("div", { style: { fontFamily: "Geist", fontSize: 44, lineHeight: 1, letterSpacing: -1.5 } }, study.figure),
        h("div", { style: { fontFamily: "GeistMono", fontSize: 20, color: color.mute } }, study.figureCaption),
      ),
      mono(study.stack, { fontSize: 18, letterSpacing: 2, maxWidth: 520, textAlign: "right", lineHeight: 1.5 }),
    ),
  );
}

// Lowercase "gz" in white on black. Rendered large and scaled down, which
// keeps the letterforms clean at 16 px. The favicon gets rounded corners;
// the Apple touch icon stays square because iOS applies its own mask.
function icon({ rounded }) {
  return h(
    "div",
    {
      style: {
        display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%",
        background: color.void, borderRadius: rounded ? 112 : 0,
        color: color.fog, fontFamily: "GeistSemi", fontSize: 300, letterSpacing: -18, paddingBottom: 40,
      },
    },
    "gz",
  );
}

// A .ico is a small directory of PNG images.
function ico(images) {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const entry = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, entry);
    header.writeUInt8(size >= 256 ? 0 : size, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((image) => image.data)]);
}

const fonts = await loadFonts();
const out = (path) => join(root, path);
await mkdir(out("public/og"), { recursive: true });

const rounded = await png(icon({ rounded: true }), 512, 512, fonts);
const square = await png(icon({ rounded: false }), 512, 512, fonts);
const resize = (size, master = rounded) =>
  sharp(master).resize(size, size, { kernel: "lanczos3" }).png({ compressionLevel: 9 }).toBuffer();
await writeFile(out("src/app/icon.png"), await resize(192));
await writeFile(out("src/app/apple-icon.png"), await resize(180, square));
await writeFile(
  out("src/app/favicon.ico"),
  ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await resize(size) })))),
);

const portraitPng = await sharp(out("src/assets/portrait-gabriel-zimmer.webp"))
  .resize(760, 1260, { fit: "cover", position: "top" })
  .grayscale()
  .png()
  .toBuffer();
const portrait = `data:image/png;base64,${portraitPng.toString("base64")}`;

const write = async (name, element) => {
  const raw = await png(element, 1200, 630, fonts);
  await writeFile(out(`public/og/${name}.png`), await sharp(raw).png({ compressionLevel: 9, palette: false }).toBuffer());
};
await write("home", homeCard(portrait));
for (const [index, study] of cases.entries()) await write(study.slug, caseCard(study, index));

console.log("Images written: favicon.ico, icon.png, apple-icon.png, og/home.png and one og/<slug>.png per case.");
