"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import {
  Cloud,
  FileCode2,
  Layers3,
  Shapes,
  Sparkles,
  Wind,
  type LucideIcon,
} from "lucide-react";

type StackItem = {
  name: string;
  description: string;
  icon: LucideIcon;
  accent: string;
};

const stack: StackItem[] = [
  {
    name: "TypeScript",
    description: "Tipagem estática de ponta a ponta.",
    icon: FileCode2,
    accent: "from-sky-400/20 to-blue-500/5 text-sky-300",
  },
  {
    name: "Next.js",
    description: "App Router, React Server Components e rotas otimizadas.",
    icon: Layers3,
    accent: "from-zinc-300/20 to-zinc-500/5 text-zinc-200",
  },
  {
    name: "Tailwind CSS",
    description: "Estilização utilitária com design tokens consistentes.",
    icon: Wind,
    accent: "from-cyan-400/20 to-teal-500/5 text-cyan-300",
  },
  {
    name: "Framer Motion",
    description: "Animações fluidas que respeitam preferências de movimento.",
    icon: Sparkles,
    accent: "from-fuchsia-400/20 to-purple-500/5 text-fuchsia-300",
  },
  {
    name: "Lucide",
    description: "Ícones leves, consistentes e fáceis de compor.",
    icon: Shapes,
    accent: "from-amber-400/20 to-orange-500/5 text-amber-300",
  },
  {
    name: "Cloudflare Workers",
    description: "Deploy global na borda, com CDN e DNS na Cloudflare.",
    icon: Cloud,
    accent: "from-orange-400/20 to-amber-500/5 text-orange-300",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export function TechStack() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="stack"
      className="relative border-t border-white/5 px-6 py-24 sm:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-300">
            Stack
          </p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            As ferramentas por trás deste portfólio.
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-zinc-400">
            Uma base moderna, tipada e rápida — escolhida para manter o site
            simples de evoluir e barato de operar.
          </p>
        </div>

        <motion.ul
          variants={container}
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {stack.map(({ name, description, icon: Icon, accent }) => (
            <motion.li key={name} variants={item}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20 hover:bg-white/[0.05]">
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
                <div className="relative">
                  <span
                    className={`inline-flex size-11 items-center justify-center rounded-xl border border-white/10 bg-zinc-900/80 ${accent}`}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-base font-semibold text-zinc-100">
                    {name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {description}
                  </p>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
