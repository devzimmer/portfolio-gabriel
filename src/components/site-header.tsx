import Link from "next/link";
import { navigation, siteConfig } from "@/lib/site";
import { GitHubIcon } from "@/components/icons";

const initials = siteConfig.shortName
  .split(" ")
  .map((part) => part[0])
  .join("")
  .toUpperCase();

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-zinc-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-full"
          aria-label={`${siteConfig.name} — início`}
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition group-hover:shadow-violet-500/40">
            {initials}
          </span>
          <span className="hidden text-sm font-medium tracking-tight text-zinc-200 sm:block">
            {siteConfig.shortName}
          </span>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-1 sm:flex"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-zinc-100"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
        >
          <GitHubIcon className="size-4" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </header>
  );
}
