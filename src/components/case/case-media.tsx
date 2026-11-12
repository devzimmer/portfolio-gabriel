import Image, { type StaticImageData } from "next/image";
import { MediaPlaceholder } from "./media-placeholder";

type CaseMediaProps = {
  label: string;
  caption: string;
  image?: StaticImageData;
  tall?: boolean;
};

// A real screenshot when one exists, otherwise the labelled placeholder.
export function CaseMedia({ label, caption, image, tall }: CaseMediaProps) {
  if (!image) return <MediaPlaceholder label={label} caption={caption} tall={tall} />;

  return (
    <figure className="flex flex-col gap-3">
      <Image
        src={image}
        alt={label}
        placeholder="blur"
        sizes="(min-width: 90rem) 42rem, (min-width: 48rem) 46vw, 100vw"
        // Never upscale: narrow phone-sized captures keep their natural width.
        style={{ maxWidth: image.width }}
        className="h-auto w-full border border-edge"
      />
      <figcaption className="font-mono text-eyebrow uppercase tracking-[0.16em] text-mute">
        {caption}
      </figcaption>
    </figure>
  );
}
