"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { company } from "@/content";
import { createRateLimiter } from "@/lib/rate-limit";
import { contactSchema, type ContactInput, type ContactResult } from "@/lib/validation";

// 5 inquiries per 10 minutes per IP (in memory, see lib/rate-limit.ts).
const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function submitInquiry(input: ContactInput): Promise<ContactResult> {
  // 1. Validate on the server too: the browser check is a convenience, not a guarantee.
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    // A filled honeypot fails `website: max(0)`. Pretend success so bots learn nothing.
    if (fieldErrors.website) return { ok: true };
    return { ok: false, code: "invalid", fieldErrors };
  }

  // 2. Rate limit by IP.
  if (!limiter.check(await clientIp())) return { ok: false, code: "rate_limited" };

  const { name, phone, email, service, message } = parsed.data;
  const subject = `New inquiry from ${name} (${service})`;
  const text = [
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email || "-"}`,
    `Service: ${service}`,
    "",
    message,
  ].join("\n");

  // 3. Send via Resend, or log when no key is configured (development / dry run).
  const apiKey = process.env.RESEND_API_KEY;
  const dryRun = process.env.CONTACT_DRY_RUN === "1" || process.env.NODE_ENV !== "production";

  if (!apiKey) {
    if (dryRun) {
      console.info(
        `[contact] RESEND_API_KEY not set, logging inquiry instead:\n${subject}\n${text}`,
      );
      return { ok: true };
    }
    console.error("[contact] RESEND_API_KEY is missing in production; inquiry was not delivered.");
    return { ok: false, code: "failed" };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Chawni Website <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL ?? company.email,
      replyTo: email || undefined,
      subject,
      text,
    });
    if (error) {
      console.error("[contact] Resend error:", error.message);
      return { ok: false, code: "failed" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[contact] send failed:", err);
    return { ok: false, code: "failed" };
  }
}
