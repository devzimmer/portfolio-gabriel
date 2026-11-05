# Portfolio redesign — design spec

Approved by Gabriel on 2026-11-04/05 in the design canvas (https://claude.ai/artifact/1LT46iB5kbRbrLhyw2yC8D, direction "A — Editorial"). This document is the source of truth for implementation; the canvas is the visual reference.

## Intent

A public portfolio that gets Gabriel Zimmer hired as an **AI-native full stack / product engineer**. It must please visually (signature: drawings and motion made of symbols) and answer a recruiter's questions fast: who he is, what he shipped, how he works with AI, how to reach him.

Recruiter takeaway, in one line: *"He builds software end to end, with quality, using AI."*

## Goals

- Home page with, in order: header, hero, "At a glance" strip, 01 Selected work, 02 Process (opened by animated ASCII hands), 03 Experience, 04 Contact, footer.
- One case-study page per project at `/{locale}/work/{slug}`, slugs `engpocket`, `duzi-crm`, `lumuviz`, in that order.
- Three locales (en, pt, es) with `localePrefix: "always"`, as today.

## Non-goals (this round)

- Translating copy into pt/es (English placeholder copy in pt/es until copy is final).
- The CV PDF itself, OG image, favicon, CSP — tracked separately.
- About section (removed: hero + At a glance replace it).
- Blog, CMS, contact form.

## Anti-goals

- Any claim that breaks the content rules below.
- Motion that blocks reading or ignores `prefers-reduced-motion`.
- A broken link shown to a recruiter (e.g. a CV button pointing at a missing file).

## Content rules (non-negotiable)

- All four source repos are private: never link code or quote source.
- EngPocket: the only traction number is "150+ subscriptions sold" (since Jan 2026). Never name the co-founder. No admin screens. The multi-agent office and budgeting module are "in development".
- Duzi CRM: no usage numbers. The Meta Tech Provider approval may be cited.
- Lumuviz: numbers are benchmarks, never "customers" or "users"; status is pre-launch. Never mention reverse engineering of SketchUp. Do not cite a test count until Gabriel confirms the suite passes.
- Review is done by AI reviewers and security subagents; Gabriel owns architecture and go/no-go. Never imply line-by-line human review.
- The hands artwork used in the prototype is derived from a reference image Gabriel does not own: it is a placeholder and must be replaced by an owned source (public-domain Michelangelo fresco or a photo of Gabriel's hands) before launch.

## Visual system

- Ground `#0a0a0a`; text `#f2f2f0`; secondary text `#a0a0a0`; hero secondary line `#8c8c8c`; hairlines `rgba(242,242,240,0.12)`; outline buttons `rgba(242,242,240,0.3)`.
- Paper surface (process steps, case highlight block): background `#f2f2f0`, text `#171717`, secondary `#5f5f5f`, hairlines `rgba(23,23,23,0.14)`.
- Type: Geist (sans, 400/500), Geist Mono (labels, metadata), Instrument Serif italic (accents). Eyebrows 11px, uppercase, letter-spacing 0.22em (mono metadata 0.16–0.18em).
- Gutter `clamp(20px, 4vw, 56px)`; sections separated by 112px; max content width 1440px.
- Touch targets ≥ 44px; text contrast ≥ 4.5:1.

## ASCII hands (Process section)

Port of `docs/design/ascii-hands-reference.js` (approved behaviour, hover removed):

- Grid 180 × 34 cells; each cell a brightness level 0–9 (`GRID` string). Left half (x < 90) is the human hand, ramp `" .:-=+*#%@"`; right half is the machine hand, ramp `" .:;/<{}10"`. Scramble pool `"!<>-_/\\[]{}=+*^?#01"`.
- Reveal when ≥ 20% visible: each lit cell waits `(1 − |x − 90| / 90) × 1300 + rand × 500` ms, scrambles for 380 ms with alpha ramping in, then settles.
- Idle: alpha × (0.85 + 0.15 · sin(x·0.09 − t·0.0016 + y·0.05)); flicker probability 0.006 on the right (glyph becomes `0`/`1`) and 0.002 on the left (random scramble glyph).
- Spark: after 2000 ms, every 3600 ms a `-=>` trail travels in 1100 ms from the left fingertip (rightmost lit cell with level > 2 in the left half) to the right fingertip (leftmost such cell in the right half).
- 24 fps cap (≥ 41 ms between frames); paused while off-screen; cell width = width / 180, font size = cell width / 0.6, row height = font size; device pixel ratio capped at 2; seeded PRNG (mulberry32, seed 7).
- `prefers-reduced-motion: reduce`: draw one static, fully revealed frame; no loop.
- No pointer interaction (rejected by Gabriel).
- Decorative: `aria-hidden`.

## Copy deck — home (English, final for this round)

Header nav: Work · Process · Experience · Contact; button "Download CV (PDF)" (shown only when a CV file is configured).

Hero: eyebrow "Product Engineer · Full Stack" / "Brazil · Remote"; H1 "Gabriel Zimmer"; secondary "AI-Native Developer"; serif "Software, engineered end to end."; buttons "View case studies" (→ #work), "Get in touch" (→ #contact); portrait (existing `src/assets/portrait-gabriel-zimmer.webp`, alt "Black and white portrait of Gabriel Zimmer").

At a glance: Focus — "Product thinking, architecture, security"; AI workflow — "Claude Code, specs & ADRs, agent harness, evals"; Stack — "TypeScript · Next.js · React · Supabase · Postgres · Deno"; Languages — "Portuguese (native) · English [B2] · Spanish [B1]" (levels are placeholders until Gabriel confirms).

01 — Selected work, meta "3 case studies". Rows (title / summary / stack / meta / "Read case study →"):

- EngPocket — "An AI agent on the official WhatsApp API that handles site paperwork for civil engineers: daily logs by voice, expenses by photo. In production since January 2026, with 150+ subscriptions sold." — "Next.js · Supabase · OpenAI · WhatsApp API" — "2026 · Co-founder, sole engineer · Live".
- Duzi CRM — "A multi-tenant WhatsApp CRM on Meta’s official Cloud API, approved as a Meta Tech Provider. Tenant isolation is enforced in Postgres and checked by ~2,300 pgTAP assertions; its read-only AI assistant scored 30/30 on its eval." — "Supabase · Postgres RLS · Deno · React" — "2026 · Solo · Live".
- Lumuviz — "A product line for architects: a 3D modeler with its own geometry engine that opens .skp files without SketchUp, and an AI render service that turns a model view into a photoreal image." — "TypeScript · three.js · Electron · OpenAI" — "2026 · Solo · Pre-launch".

02 — Process, meta "How I work with AI". Headline "Human intent, machine execution — *and judgement at every step.*" Lede "AI writes the code and reviews it. I decide what gets built, how it is shaped and what is allowed to ship." Steps on paper:

1. Spec — "Plans and decision records are written and approved before any code."
2. Harness — "AGENTS.md, skills, MCP and a curated runbook give agents context, rules and tools."
3. Build — "Small, reviewable changes against the spec, with tests alongside."
4. Review — "AI reviewers and security subagents check every change. I own the architecture calls and the go/no-go."
5. Ship — "CI, deploy and observability — software that holds up in production."

03 — Experience, meta "Trajectory". Headline "Roles, scope and what each one *changed.*" Entries (period / title / description / location):

- "2026 — Now" / "Founder & engineer · Duzi Tecnologia" / "Product, architecture, security and operations for the company’s software. Shipped Duzi CRM to production as an approved Meta Tech Provider, and built the Lumuviz line for architects ahead of its 2026 launch." / "Brazil · Remote".
- "Jan 2026 — Now" / "Co-founder & sole engineer · EngPocket" / "Built and run the whole platform: a WhatsApp AI agent, a Next.js app and a serverless backend. 150+ subscriptions sold; moved every automation off a self-hosted server into versioned code." / "Brazil · Remote".
- Earlier roles: pending (Gabriel's LinkedIn). Do not render placeholder rows.

Button "Download full CV (PDF)" (only when a CV is configured).

04 — Contact, status "Open to remote roles". Headline "Hiring an engineer who ships *end to end?*" Email `dev.gabrielzimmer@gmail.com` (mailto), "Email is the fastest way to reach me." Links: LinkedIn ↗, GitHub ↗, CV (PDF) ↓ (only when configured). No phone number on the site.

Footer: "© 2026 Gabriel Zimmer" · "Brazil · Remote" · locale switcher EN/PT/ES.

## Case-study pages

Structure and English copy: `docs/design/canvas/Case-EngPocket.dc.html`, `Case-DuziCRM.dc.html`, `Case-Lumuviz.dc.html`. Each page has: back link "← All work" and "Case study NN / 03"; H1; serif lede; facts list (Role, Timeline, Status/Traction, Stack); media placeholder(s) with caption; numbered sections 01 Problem, 02 What I built (3 cards), 03 Architecture (ASCII diagram as `<pre role="img">` with an `aria-label` and a caption), 04 Key decisions (A–C), 05 highlight block on paper (big figure + serif line + paragraph), 06 How AI built it (stats + statements), 07 Next; footer nav to previous/next case.

Media placeholders stay as labelled dashed boxes until Gabriel supplies screenshots.

## Decided by Claude (Gabriel may override)

- Case content lives in typed data (`src/content/cases/*`) plus translatable strings in `messages/*.json`; ASCII diagrams are not translated, their `aria-label`s are.
- Unit tests with Vitest; end-to-end smoke tests with Playwright (async Server Components cannot be unit-tested, per the Next.js Vitest guide).
- The CV button is hidden until `siteConfig.cvPath` is set.
- framer-motion stays only where it is today (mobile menu).
