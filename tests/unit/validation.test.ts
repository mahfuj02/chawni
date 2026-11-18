import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/validation";

const valid = {
  name: "Rahim Uddin",
  phone: "+880 1700-000000",
  email: "rahim@example.com",
  service: "design",
  message: "We would like to build a two-storey house on a 5 katha plot.",
  website: "",
};

/** Returns the translation keys of all issues, per field. */
function errorsFor(input: unknown) {
  const result = contactSchema.safeParse(input);
  if (result.success) return {};
  return Object.fromEntries(result.error.issues.map((i) => [String(i.path[0]), i.message]));
}

describe("contactSchema", () => {
  it("accepts a valid inquiry", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("trims whitespace", () => {
    const parsed = contactSchema.parse({ ...valid, name: "  Rahim  " });
    expect(parsed.name).toBe("Rahim");
  });

  it("requires a name", () => {
    expect(errorsFor({ ...valid, name: "   " })).toEqual({ name: "nameRequired" });
  });

  it("limits the name length", () => {
    expect(errorsFor({ ...valid, name: "x".repeat(101) }).name).toBe("nameLong");
  });

  it("validates phone numbers", () => {
    expect(errorsFor({ ...valid, phone: "abc" }).phone).toBe("phoneInvalid");
    expect(errorsFor({ ...valid, phone: "123" }).phone).toBe("phoneInvalid");
    expect(contactSchema.safeParse({ ...valid, phone: "01700-000000" }).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, phone: "(02) 555 0123" }).success).toBe(true);
  });

  it("treats email as optional but validates it when present", () => {
    expect(contactSchema.safeParse({ ...valid, email: "" }).success).toBe(true);
    expect(errorsFor({ ...valid, email: "not-an-email" }).email).toBe("emailInvalid");
  });

  it("only allows known services", () => {
    expect(errorsFor({ ...valid, service: "magic" }).service).toBe("serviceRequired");
    expect(errorsFor({ ...valid, service: undefined }).service).toBe("serviceRequired");
  });

  it("enforces message length bounds", () => {
    expect(errorsFor({ ...valid, message: "short" }).message).toBe("messageShort");
    expect(errorsFor({ ...valid, message: "x".repeat(2001) }).message).toBe("messageLong");
    expect(contactSchema.safeParse({ ...valid, message: "x".repeat(2000) }).success).toBe(true);
  });

  it("rejects a filled honeypot", () => {
    expect(contactSchema.safeParse({ ...valid, website: "http://spam.example" }).success).toBe(
      false,
    );
  });

  it("defaults the honeypot to an empty string when omitted", () => {
    const { website: _omit, ...rest } = valid;
    void _omit;
    expect(contactSchema.parse(rest).website).toBe("");
  });
});
