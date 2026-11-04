export type Project = {
  slug: string;
  stack?: string[];
  year?: string;
  href?: string;
  placeholder?: boolean;
};

// Placeholder slots: replace with real projects before launch.
// `stack`, `year` and `href` are optional and only render when present.
export const projects: Project[] = [
  { slug: "one", placeholder: true },
  { slug: "two", placeholder: true },
  { slug: "three", placeholder: true },
];
