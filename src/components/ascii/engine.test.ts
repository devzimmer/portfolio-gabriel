import { COLS, ROWS, createHandsModel, frameGlyphs } from "./engine";
import { HANDS_GRID } from "./hands-grid";

const lit = [...HANDS_GRID].filter((c) => c !== "0").length;
const LEFT = " .:-=+*#%@";
const RIGHT = " .:;/<{}10";

it("decodes the full grid", () => {
  expect(createHandsModel(HANDS_GRID).levels).toHaveLength(COLS * ROWS);
  expect(() => createHandsModel("123")).toThrow();
});

it("finds both fingertips", () => {
  const m = createHandsModel(HANDS_GRID);
  expect(m.tipLeft).toEqual({ x: 73, y: 16 });
  expect(m.tipRight).toEqual({ x: 96, y: 14 });
});

it("draws nothing before the reveal starts", () => {
  expect(frameGlyphs(createHandsModel(HANDS_GRID), 0, { still: false })).toHaveLength(0);
});

it("still frame shows every lit cell with its ramp glyph", () => {
  const m = createHandsModel(HANDS_GRID);
  const glyphs = frameGlyphs(m, 0, { still: true });
  expect(glyphs).toHaveLength(lit);
  for (const g of glyphs) {
    const level = m.levels[g.y * COLS + g.x];
    expect(g.char).toBe((g.x >= COLS / 2 ? RIGHT : LEFT)[level]);
    expect(g.alpha).toBeGreaterThan(0);
    expect(g.alpha).toBeLessThanOrEqual(1);
  }
});

it("sends a spark between the fingertips", () => {
  const m = createHandsModel(HANDS_GRID);
  const spark = frameGlyphs(m, 2550, { still: false }).filter(
    (g) => m.levels[g.y * COLS + g.x] === 0 && "-=>".includes(g.char),
  );
  expect(spark.length).toBeGreaterThan(0);
  for (const g of spark) {
    expect(g.x).toBeGreaterThan(73);
    expect(g.x).toBeLessThan(96);
  }
});

it("is deterministic for a seed", () => {
  const a = frameGlyphs(createHandsModel(HANDS_GRID, 7), 3000, { still: false });
  const b = frameGlyphs(createHandsModel(HANDS_GRID, 7), 3000, { still: false });
  expect(a).toEqual(b);
});
