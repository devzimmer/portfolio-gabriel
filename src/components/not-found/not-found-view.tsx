import { ButtonLink } from "@/components/ui/button-link";
import type messages from "../../../messages/pt.json";

type NotFoundCopy = (typeof messages)["NotFound"];

/** The 404 body, shared by the in-layout and the global not-found pages. */
export function NotFoundView({ copy }: { copy: NotFoundCopy }) {
  return (
    <main
      id="conteudo"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-[90rem] flex-1 flex-col px-gutter pt-14 pb-24 focus:outline-none"
    >
      <p className="border-b border-line pb-5 font-mono text-eyebrow uppercase tracking-[0.18em] text-mute">
        {copy.eyebrow}
      </p>
      <div className="flex flex-1 flex-col justify-center gap-8 py-20">
        <p
          aria-hidden="true"
          className="font-mono text-[clamp(6rem,22vw,17rem)] leading-[0.8] tracking-[-0.08em] text-edge select-none"
        >
          404
        </p>
        <div className="max-w-[40rem]">
          <h1 className="text-[clamp(2.25rem,4.4vw,4.25rem)] leading-[0.98] font-medium tracking-[-0.04em]">
            {copy.title}
          </h1>
          <p className="mt-5 font-serif text-[clamp(1.25rem,1.8vw,1.625rem)] italic text-mute">{copy.lede}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/pt" variant="solid">
            {copy.home}
          </ButtonLink>
          <ButtonLink href="/pt#work" variant="outline">
            {copy.work}
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
