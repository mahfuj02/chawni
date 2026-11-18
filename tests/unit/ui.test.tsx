import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button, buttonStyles } from "@/components/ui/Button";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { SectionLabel } from "@/components/ui/SectionLabel";

describe("Button", () => {
  it("renders a real <button type=button> that handles clicks", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Send</Button>);
    const button = screen.getByRole("button", { name: "Send" });
    expect(button).toHaveAttribute("type", "button");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("can render a link with button styles via asChild", () => {
    render(
      <Button asChild>
        <a href="https://example.com/contact">Contact</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Contact" });
    expect(link).toHaveAttribute("href", "https://example.com/contact");
    expect(link.className).toContain("rounded-full");
  });

  it("uses ink text on the orange primary button, never white", () => {
    const styles = buttonStyles("primary");
    expect(styles).toContain("bg-orange");
    expect(styles).toContain("text-ink");
    expect(styles).not.toContain("text-white");
  });

  it("keeps a 44px+ touch target", () => {
    expect(buttonStyles("dark")).toContain("min-h-12");
  });

  it("does not fire when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Nope
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe("PlaceholderImage", () => {
  it("shows the caption and an accessible name without a real image", () => {
    render(<PlaceholderImage caption="HOUSE EXTERIOR" alt="Front of the house" />);
    expect(screen.getByRole("img", { name: "Front of the house" })).toBeInTheDocument();
    expect(screen.getByText(/HOUSE EXTERIOR/)).toBeInTheDocument();
  });

  it("keeps the requested aspect ratio", () => {
    const { container } = render(<PlaceholderImage caption="X" aspect="4/5" alt="x" />);
    expect((container.firstChild as HTMLElement).style.aspectRatio).toBe("4 / 5");
  });

  it("renders the real image, with the same wrapper, once src is set", () => {
    const { container } = render(
      <PlaceholderImage caption="X" aspect="4/5" src="/images/a.jpg" alt="Real photo" />,
    );
    expect(screen.getByRole("img", { name: "Real photo" })).toBeInTheDocument();
    expect(screen.queryByText(/Photo ·/)).not.toBeInTheDocument();
    expect((container.firstChild as HTMLElement).style.aspectRatio).toBe("4 / 5");
  });
});

describe("SectionLabel", () => {
  it("renders lowercase text with a decorative orange square", () => {
    const { container } = render(<SectionLabel>who we are</SectionLabel>);
    expect(screen.getByText("who we are")).toBeInTheDocument();
    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass("bg-orange");
  });
});
