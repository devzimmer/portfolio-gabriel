import type { CSSProperties, ReactNode } from "react";

type InkPart = { text: string; wrap?: (words: ReactNode) => ReactNode };

/**
 * Splits a statement into words that "gain ink" one after another as it
 * scrolls through the viewport (see `.ink` in globals.css). Pure CSS: without
 * scroll-driven animations, or with reduced motion, the text is simply shown.
 */
export function InkText({ parts }: { parts: InkPart[] }) {
  const total = parts.reduce((n, part) => n + part.text.split(/\s+/).filter(Boolean).length, 0);
  let index = 0;

  return parts.map((part, partIndex) => {
    const words = part.text
      .split(/\s+/)
      .filter(Boolean)
      .map((word, wordIndex, all) => {
        const start = total > 1 ? index / (total - 1) : 0;
        index += 1;
        return (
          <span key={wordIndex}>
            <span className="ink-word" style={{ "--ink-start": start.toFixed(3) } as CSSProperties}>
              {word}
            </span>
            {wordIndex < all.length - 1 ? " " : null}
          </span>
        );
      });
    return (
      <span key={partIndex}>
        {partIndex > 0 ? " " : null}
        {part.wrap ? part.wrap(words) : words}
      </span>
    );
  });
}
