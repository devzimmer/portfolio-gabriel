import { cases } from "@/content/cases";
import { experience } from "@/content/experience";
import { siteConfig } from "@/lib/site";

// Plain-text profile for AI assistants and crawlers (https://llmstxt.org).
// Built from the same content as the site, so it never drifts. The site is in
// Portuguese for now; the summary above it is in English for global search.
export function buildLlmsTxt(): string {
  const url = siteConfig.url;
  const lines: string[] = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.summary}`,
    "",
    `Looking for: ${siteConfig.seeking}`,
    `Contact: ${siteConfig.email.replace("@", " at ")} · LinkedIn: ${siteConfig.links.linkedin} · GitHub: ${siteConfig.links.github}`,
    `CV (PDF): ${url}${siteConfig.cvEnglish} · Portuguese: ${url}${siteConfig.cv.pt}`,
    "",
    "## Case studies",
    "",
    ...cases.map((study) => {
      const copy = study.copy.pt;
      return `- [${copy.title}](${url}/pt/work/${study.slug}): ${copy.card.summary} Stack: ${copy.card.stack}.`;
    }),
    "",
    "## Experience",
    "",
    ...experience.pt.flatMap((entry) => [
      `### ${entry.org} · ${entry.role} (${entry.period})`,
      "",
      entry.engagement ? `${entry.summary} (${entry.engagement}.)` : entry.summary,
      "",
      ...entry.highlights.map((item) => `- ${item.name}: ${item.text}`),
      `- Stack: ${entry.stack.join(", ")}`,
      "",
    ]),
    "## Skills",
    "",
    siteConfig.knowsAbout.join(", "),
    "",
  ];
  return lines.join("\n");
}
