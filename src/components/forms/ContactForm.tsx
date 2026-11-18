"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui";
import { submitInquiry } from "@/app/[locale]/contact/actions";
import {
  SERVICE_OPTIONS,
  contactSchema,
  type ContactInput,
  type ContactValues,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

type Status = "idle" | "success" | "error" | "rate_limited";

const fieldBase =
  "min-h-12 w-full rounded-card border-2 bg-white px-4 py-3 text-ink placeholder:text-muted/70 focus-visible:border-ink";

interface FieldProps {
  name: string;
  label: string;
  requiredText?: string;
  error?: string;
  help?: string;
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => React.ReactNode;
}

/** Label + control + help/error wiring. Module-level on purpose: a component defined inside render would remount (and lose focus) on every keystroke. */
function Field({ name, label, requiredText, error, help, children }: FieldProps) {
  const id = `contact-${name}`;
  const describedBy = [error ? `${id}-error` : null, help ? `${id}-help` : null]
    .filter(Boolean)
    .join(" ");
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-medium">
        {label}
        {requiredText && (
          <>
            <span className="ms-1 text-orange-text" aria-hidden="true">
              *
            </span>
            <span className="sr-only"> ({requiredText})</span>
          </>
        )}
      </label>
      {children({ id, describedBy: describedBy || undefined, invalid: Boolean(error) })}
      {help && (
        <p id={`${id}-help`} className="text-small text-muted">
          {help}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-small font-medium text-[#b42318]">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<Status>("idle");

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput, unknown, ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", phone: "", email: "", service: undefined, message: "", website: "" },
  });

  async function onSubmit(values: ContactValues) {
    setStatus("idle");
    try {
      const result = await submitInquiry(values);
      if (result.ok) {
        setStatus("success");
        reset();
        return;
      }
      if (result.code === "rate_limited") return setStatus("rate_limited");
      if (result.code === "invalid" && result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          setError(field as keyof ContactInput, { message });
        }
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-4 rounded-card bg-mist p-8 md:p-10"
      >
        <CheckCircle2 aria-hidden="true" className="size-12 text-orange-text" strokeWidth={1.5} />
        <h3 className="text-h3">{t("successTitle")}</h3>
        <p className="text-muted">{t("successText")}</p>
        <Button variant="outline" onClick={() => setStatus("idle")}>
          {t("sendAnother")}
        </Button>
      </div>
    );
  }

  const err = (name: keyof ContactInput) => {
    const m = errors[name]?.message;
    return m ? t(`errors.${m}` as never) : undefined;
  };

  const border = (invalid: boolean) => (invalid ? "border-[#b42318]" : "border-line");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <h2 className="text-h3">{t("title")}</h2>

      {(status === "error" || status === "rate_limited") && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-card border-2 border-[#b42318] bg-[#fef3f2] p-4 text-[#7a271a]"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-semibold">
              {status === "rate_limited" ? t("tooMany") : t("errorTitle")}
            </p>
            {status === "error" && <p>{t("errorText")}</p>}
          </div>
        </div>
      )}

      {Object.keys(errors).length > 0 && status === "idle" && (
        <p role="alert" className="text-small font-medium text-[#b42318]">
          {t("fixErrors")}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Field name="name" label={t("name")} requiredText={t("required")} error={err("name")}>
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              type="text"
              autoComplete="name"
              aria-invalid={invalid}
              aria-describedby={describedBy}
              className={cn(fieldBase, border(invalid))}
              {...register("name")}
            />
          )}
        </Field>
        <Field name="phone" label={t("phone")} requiredText={t("required")} error={err("phone")}>
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              aria-invalid={invalid}
              aria-describedby={describedBy}
              className={cn(fieldBase, border(invalid))}
              {...register("phone")}
            />
          )}
        </Field>
        <Field name="email" label={t("email")} error={err("email")}>
          {({ id, describedBy, invalid }) => (
            <input
              id={id}
              type="email"
              autoComplete="email"
              aria-invalid={invalid}
              aria-describedby={describedBy}
              className={cn(fieldBase, border(invalid))}
              {...register("email")}
            />
          )}
        </Field>
        <Field
          name="service"
          label={t("service")}
          requiredText={t("required")}
          error={err("service")}
        >
          {({ id, describedBy, invalid }) => (
            <select
              id={id}
              aria-invalid={invalid}
              aria-describedby={describedBy}
              className={cn(fieldBase, border(invalid))}
              defaultValue=""
              {...register("service")}
            >
              <option value="" disabled>
                {t("servicePlaceholder")}
              </option>
              {SERVICE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {t(`services.${s}`)}
                </option>
              ))}
            </select>
          )}
        </Field>
      </div>

      <Field
        name="message"
        label={t("message")}
        requiredText={t("required")}
        error={err("message")}
        help={t("messageHelp")}
      >
        {({ id, describedBy, invalid }) => (
          <textarea
            id={id}
            rows={6}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={cn(fieldBase, border(invalid), "resize-y")}
            {...register("message")}
          />
        )}
      </Field>

      {/* Honeypot: off-screen and hidden from assistive tech. Humans never fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">{t("honeypot")}</label>
        <input
          id="contact-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div>
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? t("sending") : t("send")}
        </Button>
      </div>
    </form>
  );
}
