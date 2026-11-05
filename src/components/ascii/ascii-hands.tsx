"use client";

import { useEffect, useRef } from "react";
import {
  COLS,
  FRAME_INTERVAL_MS,
  ROWS,
  createHandsModel,
  frameGlyphs,
} from "./engine";
import { HANDS_GRID } from "./hands-grid";

const GLYPH_WIDTH_EM = 0.6;
const MAX_DPR = 2;

type AsciiHandsProps = { className?: string };

export function AsciiHands({ className }: AsciiHandsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const model = createHandsModel(HANDS_GRID);
    const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let ctx: CanvasRenderingContext2D | null = null;
    let cellW = 0;
    let cellH = 0;
    let raf = 0;
    let start: number | null = null;
    let visible = true;
    let last = 0;
    let alive = true;

    const draw = (t: number) => {
      if (!ctx) return;
      ctx.clearRect(0, 0, cellW * COLS, cellH * ROWS);
      for (const glyph of frameGlyphs(model, t, { still })) {
        ctx.fillStyle = `rgba(242,242,240,${glyph.alpha.toFixed(3)})`;
        ctx.fillText(glyph.char, glyph.x * cellW, glyph.y * cellH);
      }
    };

    const resize = () => {
      if (!alive) return;
      const width = canvas.clientWidth || canvas.parentElement?.clientWidth || 0;
      if (!width) return;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      cellW = width / COLS;
      cellH = cellW / GLYPH_WIDTH_EM;
      const height = Math.round(cellH * ROWS);
      canvas.style.height = `${height}px`;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const family = getComputedStyle(canvas).fontFamily || "monospace";
      ctx.font = `${cellH.toFixed(2)}px ${family}`;
      ctx.textBaseline = "top";
      if (still) draw(0);
    };

    resize();
    document.fonts?.ready.then(resize);
    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    resizeObserver?.observe(canvas.parentElement ?? canvas);

    let intersectionObserver: IntersectionObserver | null = null;
    if (!still) {
      if (typeof IntersectionObserver === "undefined") {
        start = performance.now();
      } else {
        intersectionObserver = new IntersectionObserver(
          (entries) => {
            const entry = entries[entries.length - 1];
            visible = entry.isIntersecting;
            if (visible && start === null) start = performance.now();
          },
          { threshold: 0.2 },
        );
        intersectionObserver.observe(canvas);
      }

      const loop = (now: number) => {
        if (!alive) return;
        raf = requestAnimationFrame(loop);
        if (!visible || start === null || now - last < FRAME_INTERVAL_MS) return;
        last = now;
        draw(now - start);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block aspect-[108/34] w-full font-mono${className ? ` ${className}` : ""}`}
    />
  );
}
