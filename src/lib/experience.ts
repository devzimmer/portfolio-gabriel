import type messages from "../../messages/en.json";

export type ExperienceSlug = keyof (typeof messages)["Experience"]["items"];

export type ExperienceEntry = {
  slug: ExperienceSlug;
  placeholder?: boolean;
};

// Placeholder slots: replace with real roles before launch.
// Each `slug` must exist under `Experience.items` in messages/*.json.
export const experience: ExperienceEntry[] = [
  { slug: "one", placeholder: true },
  { slug: "two", placeholder: true },
  { slug: "three", placeholder: true },
];
