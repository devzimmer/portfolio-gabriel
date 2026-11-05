type MediaPlaceholderProps = { label: string; caption: string; tall?: boolean };

export function MediaPlaceholder({ label, caption, tall }: MediaPlaceholderProps) {
  return (
    <figure className="flex flex-col gap-3">
      <div
        className={`flex items-center justify-center border border-dashed border-edge bg-well p-6 text-center font-mono text-[0.8125rem] text-mute ${tall ? "h-[35rem]" : "h-[26.25rem]"}`}
      >
        {label}
      </div>
      <figcaption className="font-mono text-eyebrow uppercase tracking-[0.16em] text-mute">
        {caption}
      </figcaption>
    </figure>
  );
}
