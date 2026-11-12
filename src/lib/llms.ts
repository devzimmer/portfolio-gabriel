import { cases } from "@/content/cases";
import { experience } from "@/content/experience";
import { siteConfig } from "@/lib/site";

// Plain-text profile for AI assistants and crawlers (https://llmstxt.org).
// Built from the same content as the site, so it never drifts. Uses the "en"
// copy, which falls back to Portuguese until the translation pass.
export function buildLlmsTxt(): string {
  const url = siteConfig.url;
  const lines: string[] = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.summary}`,
    "",
    `Looking for: ${siteConfig.seeking}`,
    `Contact: ${siteConfig.email} · LinkedIn: ${siteConfig.links.linkedin} · GitHub: ${siteConfig.links.github}`,
    "",
    "## Case studies",
    "",
    ...cases.map((study) => {
      const copy = study.copy.en;
      return `- [${copy.title}](${url}/en/work/${study.slug}): ${copy.card.summary} Stack: ${copy.card.stack}.`;
    }),
    "",
    "## Experience",
    "",
    ...experience.en.flatMap((entry) => [
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
