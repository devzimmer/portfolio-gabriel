export type ExperienceEntry = {
  slug: string;
  placeholder?: boolean;
};

// Placeholder slots: replace with real roles before launch.
export const experience: ExperienceEntry[] = [
  { slug: "one", placeholder: true },
  { slug: "two", placeholder: true },
  { slug: "three", placeholder: true },
];
