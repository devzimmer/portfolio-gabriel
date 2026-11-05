// Pure model of the ASCII hands animation: no DOM, deterministic per seed.
// Behaviour approved in the design canvas (docs/design/ascii-hands-reference.js).

export const COLS = 180;
export const ROWS = 34;
export const FRAME_INTERVAL_MS = 41;

const HALF = COLS / 2;
const LEFT_RAMP = " .:-=+*#%@";
const RIGHT_RAMP = " .:;/<{}10";
const NOISE = "!<>-_/\[]{}=+*^?#01";
const SCRAMBLE_MS = 380;
const SPARK_START_MS = 2000;
const SPARK_PERIOD_MS = 3600;
const SPARK_TRAVEL_MS = 1100;

export type Point = { x: number; y: number };
export type Glyph = { x: number; y: number; char: string; alpha: number };
export type HandsModel = {
  levels: Uint8Array;
  delays: Float32Array;
  tipLeft: Point | null;
  tipRight: Point | null;
  rnd: () => number;
};

/** mulberry32 */
export function createRng(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createHandsModel(grid: string, seed = 7): HandsModel {
  if (grid.length !== COLS * ROWS) {
    throw new Error(`Hands grid must have ${COLS * ROWS} cells, got ${grid.length}`);
  }
  const rnd = createRng(seed);
  const levels = new Uint8Array(grid.length);
  const delays = new Float32Array(grid.length);
  let tipLeft: Point | null = null;
  let tipRight: Point | null = null;

  for (let i = 0; i < grid.length; i++) {
    const x = i % COLS;
    const y = (i / COLS) | 0;
    levels[i] = grid.charCodeAt(i) - 48;
    delays[i] = (1 - Math.abs(x - HALF) / HALF) * 1300 + rnd() * 500;
    if (levels[i] > 2) {
      if (x < HALF && (!tipLeft || x > tipLeft.x)) tipLeft = { x, y };
      if (x >= HALF && (!tipRight || x < tipRight.x)) tipRight = { x, y };
    }
  }

  return { levels, delays, tipLeft, tipRight, rnd };
}

function noise(rnd: () => number): string {
  return NOISE[(rnd() * NOISE.length) | 0];
}

export function frameGlyphs(
  model: HandsModel,
  t: number,
  { still }: { still: boolean },
): Glyph[] {
  const { levels, delays, rnd } = model;
  const glyphs: Glyph[] = [];

  for (let i = 0; i < levels.length; i++) {
    const level = levels[i];
    if (!level) continue;
    const x = i % COLS;
    const y = (i / COLS) | 0;
    const right = x >= HALF;
    let char = (right ? RIGHT_RAMP : LEFT_RAMP)[level];
    let alpha = 0.3 + (level / 9) * 0.7;

    if (!still) {
      const elapsed = t - delays[i];
      if (elapsed < 0) continue;
      if (elapsed < SCRAMBLE_MS) {
        char = noise(rnd);
        alpha *= elapsed / SCRAMBLE_MS;
      } else {
        alpha *= 0.85 + 0.15 * Math.sin(x * 0.09 - t * 0.0016 + y * 0.05);
        if (rnd() < (right ? 0.006 : 0.002)) {
          char = right ? (rnd() < 0.5 ? "0" : "1") : noise(rnd);
        }
      }
    }

    if (alpha > 0) glyphs.push({ x, y, char, alpha });
  }

  const { tipLeft: a, tipRight: b } = model;
  if (!still && a && b && t > SPARK_START_MS) {
    const progress = ((t - SPARK_START_MS) % SPARK_PERIOD_MS) / SPARK_TRAVEL_MS;
    if (progress <= 1.25) {
      const steps = Math.max(1, b.x - a.x - 2);
      for (let s = 1; s <= steps; s++) {
        const f = s / (steps + 1);
        const k = progress - f;
        if (k < 0 || k > 0.25) continue;
        glyphs.push({
          x: a.x + 1 + s,
          y: Math.round(a.y + (b.y - a.y) * f),
          char: k < 0.04 ? ">" : k < 0.12 ? "=" : "-",
          alpha: 1 - k / 0.25,
        });
      }
    }
  }

  return glyphs;
}
