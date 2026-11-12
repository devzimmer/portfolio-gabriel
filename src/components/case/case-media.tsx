import Image from "next/image";
import type { CaseMediaItem } from "@/content/cases/types";
import { MediaPlaceholder } from "./media-placeholder";

type CaseMediaProps = CaseMediaItem & { tall?: boolean };

// A real screenshot when one exists, otherwise the labelled placeholder.
export function CaseMedia({ label, caption, image, displayWidth, wide, tall }: CaseMediaProps) {
  const span = wide ? "md:col-span-2" : "";
  if (!image) {
    return (
      <div className={span}>
        <MediaPlaceholder label={label} caption={caption} tall={tall} />
      </div>
    );
  }

  // Never upscale: narrow captures keep their natural (or declared) width.
  const maxWidth = displayWidth ?? image.width;
  return (
    <figure className={`mx-auto flex w-full flex-col gap-3 ${span}`} style={{ maxWidth }}>
      <Image
        src={image}
        alt={label}
        placeholder="blur"
        sizes={wide ? "(min-width: 90rem) 84rem, 100vw" : `(min-width: 48rem) min(${maxWidth}px, 46vw), 100vw`}
        className="h-auto w-full border border-edge"
      />
      <figcaption className="font-mono text-eyebrow uppercase tracking-[0.16em] text-mute">
        {caption}
      </figcaption>
    </figure>
  );
}
