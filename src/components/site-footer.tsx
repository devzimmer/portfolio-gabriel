import { siteConfig } from "@/lib/site";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="text-sm font-medium text-zinc-300">
            {siteConfig.name}
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            © {siteConfig.copyrightYear} — construído com Next.js, Tailwind CSS
            e Framer Motion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
          >
            <GitHubIcon className="size-4" />
          </a>
          {siteConfig.links.linkedin ? (
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <LinkedInIcon className="size-4" />
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
