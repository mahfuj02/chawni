import { z } from "zod";

import { SERVICE_OPTIONS } from "./service-options";

export { SERVICE_OPTIONS, type ServiceOption } from "./service-options";

/** Allows digits, spaces, hyphens, parentheses and a leading +. At least 7 digits. */
const PHONE_RE = /^\+?[\d\s\-()]+$/;

/**
 * Contact form schema shared by the browser (React Hook Form) and the Server Action.
 * Error "messages" are translation keys under `contact.form.errors`, so each locale
 * can show them in its own language.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "nameRequired").max(100, "nameLong"),
  phone: z
    .string()
    .trim()
    .refine((v) => PHONE_RE.test(v) && v.replace(/\D/g, "").length >= 7 && v.length <= 20, {
      message: "phoneInvalid",
    }),
  email: z
    .string()
    .trim()
    .max(200, "emailInvalid")
    .refine((v) => v === "" || z.email().safeParse(v).success, { message: "emailInvalid" }),
  service: z.enum(SERVICE_OPTIONS, { message: "serviceRequired" }),
  message: z.string().trim().min(10, "messageShort").max(2000, "messageLong"),
  /** Honeypot: real people never see or fill this. Bots usually do. */
  website: z.string().max(0).optional().default(""),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactValues = z.output<typeof contactSchema>;

export type ContactResult =
  | { ok: true }
  | {
      ok: false;
      code: "invalid" | "rate_limited" | "failed";
      fieldErrors?: Record<string, string>;
    };
