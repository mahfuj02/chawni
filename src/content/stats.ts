// Stats are derived from the real data, so they can never drift from what the site shows.
import { projects } from "./projects";
import { team } from "./team";
import { PROJECT_CATEGORIES, type StatItem } from "./types";

export const stats: StatItem[] = [
  {
    key: "projects",
    value: projects.length,
    label: { en: "Projects in our portfolio", bn: "পোর্টফোলিওতে প্রকল্প" },
  },
  {
    key: "sectors",
    value: PROJECT_CATEGORIES.length,
    label: { en: "Sectors we work in", bn: "যে খাতগুলোতে কাজ করি" },
  },
  {
    key: "models",
    value: projects.filter((p) => p.modelUrl).length,
    label: { en: "Projects you can explore in 3D", bn: "থ্রিডিতে দেখার মতো প্রকল্প" },
  },
  {
    key: "team",
    value: team.length,
    label: { en: "People on the team", bn: "জন দলের সদস্য" },
  },
];
