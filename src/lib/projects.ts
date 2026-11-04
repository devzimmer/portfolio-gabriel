import type messages from "../../messages/en.json";

export type ProjectSlug = keyof (typeof messages)["Projects"]["items"];

export type Project = {
  slug: ProjectSlug;
  stack?: string[];
  year?: string;
  href?: string;
  placeholder?: boolean;
};

// Placeholder slots: replace with real projects before launch.
// Each `slug` must exist under `Projects.items` in messages/*.json.
// `stack`, `year` and `href` are optional and only render when present.
export const projects: Project[] = [
  { slug: "one", placeholder: true },
  { slug: "two", placeholder: true },
  { slug: "three", placeholder: true },
];
