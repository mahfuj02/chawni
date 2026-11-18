/** Kept in its own tiny file so the contact form can list options without loading zod. */
export const SERVICE_OPTIONS = [
  "plan",
  "design",
  "engineer",
  "build",
  "interior",
  "other",
] as const;
export type ServiceOption = (typeof SERVICE_OPTIONS)[number];
