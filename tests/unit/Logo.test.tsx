import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Logo, logoSrc } from "@/components/ui/Logo";

describe("logoSrc", () => {
  it("picks the dark-on-light artwork for the dark variant", () => {
    expect(logoSrc("dark", false)).toBe("/brand/chawni-logo-dark-on-light.svg");
  });

  it("picks the light-on-dark artwork for the light variant", () => {
    expect(logoSrc("light", false)).toBe("/brand/chawni-logo-light-on-dark.svg");
  });

  it("adds the compact suffix", () => {
    expect(logoSrc("dark", true)).toBe("/brand/chawni-logo-dark-on-light-compact.svg");
    expect(logoSrc("light", true)).toBe("/brand/chawni-logo-light-on-dark-compact.svg");
  });
});

describe("<Logo />", () => {
  const src = () => screen.getByRole("img", { name: "Chawni Architectures" }).getAttribute("src");

  it("defaults to the dark artwork for light backgrounds", () => {
    render(<Logo />);
    expect(src()).toContain("chawni-logo-dark-on-light.svg");
  });

  it("switches to the light artwork with onDark", () => {
    render(<Logo onDark />);
    expect(src()).toContain("chawni-logo-light-on-dark.svg");
  });

  it("switches with an explicit variant, which wins over onDark", () => {
    render(<Logo variant="dark" onDark />);
    expect(src()).toContain("chawni-logo-dark-on-light.svg");
  });

  it("uses the compact artwork when asked", () => {
    render(<Logo compact variant="light" />);
    expect(src()).toContain("chawni-logo-light-on-dark-compact.svg");
  });

  it("keeps the artwork's aspect ratio for the given width", () => {
    render(<Logo width={200} />);
    const img = screen.getByRole("img", { name: "Chawni Architectures" });
    expect(img).toHaveAttribute("width", "200");
    // full lockup is 1070 x 1160
    expect(img).toHaveAttribute("height", String(Math.round((200 * 1160) / 1070)));
  });
});
