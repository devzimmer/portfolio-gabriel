type CaseDiagramProps = { ascii: string; label: string; caption: string };

export function CaseDiagram({ ascii, label, caption }: CaseDiagramProps) {
  return (
    <figure className="flex flex-col gap-4">
      <div className="overflow-x-auto border border-line bg-panel p-8">
        <pre
          role="img"
          aria-label={label}
          className="m-0 w-max font-mono text-sm leading-[1.6] text-fog"
        >
          {ascii}
        </pre>
      </div>
      <figcaption className="max-w-[68ch] leading-relaxed text-mute">{caption}</figcaption>
    </figure>
  );
}
