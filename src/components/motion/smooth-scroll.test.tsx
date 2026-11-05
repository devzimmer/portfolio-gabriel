import { render } from "@testing-library/react";
import { afterEach, vi } from "vitest";

const destroy = vi.fn();
const LenisMock = vi.fn(function (this: { destroy: () => void }, options: unknown) {
  void options;
  this.destroy = destroy;
});
vi.mock("lenis", () => ({ default: LenisMock }));

const { SmoothScroll } = await import("./smooth-scroll");

function mockMotion(reduce: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: reduce && query.includes("reduce"),
    addEventListener() {},
    removeEventListener() {},
  }));
}

afterEach(() => {
  vi.unstubAllGlobals();
  LenisMock.mockClear();
  destroy.mockClear();
});

it("starts a subtle smooth scroll that also handles anchor links", () => {
  mockMotion(false);
  render(<SmoothScroll />);
  expect(LenisMock).toHaveBeenCalledTimes(1);
  const options = LenisMock.mock.calls[0][0] as {
    lerp: number;
    autoRaf: boolean;
    anchors: { offset: number };
  };
  expect(options.lerp).toBeGreaterThanOrEqual(0.12);
  expect(options.autoRaf).toBe(true);
  expect(options.anchors.offset).toBe(-72);
});

it("does nothing for people who prefer reduced motion", () => {
  mockMotion(true);
  render(<SmoothScroll />);
  expect(LenisMock).not.toHaveBeenCalled();
});

it("tears down on unmount", () => {
  mockMotion(false);
  const { unmount } = render(<SmoothScroll />);
  unmount();
  expect(destroy).toHaveBeenCalled();
});
