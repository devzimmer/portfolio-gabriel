"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { GitHubIcon } from "@/components/icons";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Hero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="inicio"
      className="relative isolate overflow-hidden px-6 pb-24 pt-20 sm:pt-28 lg:pb-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.18),transparent_55%)]" />
        <motion.div
          className="absolute -top-32 left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl"
          animate={
            shouldReduceMotion
              ? undefined
              : { x: ["-50%", "-42%", "-50%"], y: [0, 24, 0] }
          }
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 right-0 size-[26rem] rounded-full bg-fuchsia-600/10 blur-3xl"
          animate={
            shouldReduceMotion ? undefined : { x: [0, -32, 0], y: [0, -18, 0] }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(9,9,11,0.4),#09090b)]" />
      </div>

      <motion.div
        variants={container}
        initial={shouldReduceMotion ? false : "hidden"}
        animate="show"
        className="mx-auto flex w-full max-w-4xl flex-col items-center text-center"
      >
        <motion.span
          variants={item}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-violet-400 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-violet-400" />
          </span>
          Portfólio em construção
        </motion.span>

        <motion.h1
          variants={item}
          className="mt-8 text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-zinc-50 sm:text-6xl lg:text-7xl"
        >
          Olá, eu sou{" "}
          <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
            {siteConfig.name}
          </span>
          .
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-zinc-400 sm:text-xl"
        >
          {siteConfig.role} construindo experiências web rápidas, acessíveis e
          bem acabadas. Este é o ponto de partida do meu novo portfólio.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-zinc-50 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-white"
          >
            <GitHubIcon className="size-4" />
            Ver no GitHub
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a
            href="#stack"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:border-white/20 hover:bg-white/10"
          >
            <Sparkles className="size-4 text-violet-300" />
            Explorar a stack
          </a>
        </motion.div>

        <motion.div
          variants={item}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500"
        >
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" />
            {siteConfig.location}
          </span>
          <span className="hidden size-1 rounded-full bg-zinc-700 sm:block" />
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Aberto a novos projetos
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
