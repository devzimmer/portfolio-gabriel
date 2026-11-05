import { render } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import { AsciiHands } from "./ascii-hands";

const ctx = {
  setTransform: vi.fn(),
  clearRect: vi.fn(),
  fillText: vi.fn(),
  font: "",
  fillStyle: "",
  textBaseline: "",
};

function mockMotion(reduce: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduce && query.includes("reduce"),
    addEventListener() {},
    removeEventListener() {},
  }));
}

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx as never);
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(1440);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  ctx.fillText.mockClear();
});

it("reduced motion draws one full frame and starts no loop", () => {
  mockMotion(true);
  const raf = vi.spyOn(window, "requestAnimationFrame");
  render(<AsciiHands />);
  expect(ctx.fillText).toHaveBeenCalled();
  expect(raf).not.toHaveBeenCalled();
});

it("is hidden from assistive tech", () => {
  mockMotion(true);
  const { container } = render(<AsciiHands />);
  expect(container.querySelector("canvas")).toHaveAttribute("aria-hidden", "true");
});

it("cancels its loop on unmount", () => {
  mockMotion(false);
  const cancel = vi.spyOn(window, "cancelAnimationFrame");
  const { unmount } = render(<AsciiHands />);
  unmount();
  expect(cancel).toHaveBeenCalled();
});

it("reserves its final aspect ratio before JavaScript sizes it", () => {
  mockMotion(true);
  const { container } = render(<AsciiHands />);
  const canvas = container.querySelector("canvas");
  expect(canvas?.className).toContain("aspect-[108/34]");
  expect(canvas?.className).not.toMatch(/\bh-\[/);
});
