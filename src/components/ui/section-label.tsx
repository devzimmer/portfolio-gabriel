type SectionLabelProps = {
  index: string;
  label: string;
  meta?: string;
  id?: string;
};

export function SectionLabel({ index, label, meta, id }: SectionLabelProps) {
  const text = `${index} — ${label}`;

  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5 text-eyebrow uppercase text-mute">
      {id ? (
        <h2 id={id} className="text-eyebrow">
          {text}
        </h2>
      ) : (
        <span>{text}</span>
      )}
      {meta ? (
        <span className="font-mono tracking-[0.18em]">{meta}</span>
      ) : null}
    </div>
  );
}
