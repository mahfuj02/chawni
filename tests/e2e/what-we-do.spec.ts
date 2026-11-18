import { expect, test } from "@playwright/test";

const chips = (page: import("@playwright/test").Page) =>
  page.getByRole("navigation", { name: "Project phases" });

test.describe("what we do: real-image sequence", () => {
  test("clicking '03 Engineer' activates phase 3 and shows its frame", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en");
    const chip = chips(page).getByRole("button", { name: /03\s*Engineer/ });
    await chip.scrollIntoViewIfNeeded();
    await chip.click();
    await expect(chip).toHaveAttribute("aria-current", "step");
    const frame = page.getByRole("link", { name: "Dr Arafat Palace · Structural concept" });
    await expect(frame).toBeVisible();
    await expect(frame).toHaveAttribute("href", /\/projects\/dr-arafat-palace$/);
  });

  test("phase 4 shows the completed photo with its badge, linked to Windsor Hotel", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en");
    const chip = chips(page).getByRole("button", { name: /04\s*Build/ });
    await chip.scrollIntoViewIfNeeded();
    await chip.click();
    await expect(page.getByText("Completed · Windsor Hotel").first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Windsor Hotel · Completed" })).toBeVisible();
  });

  test("the plan frame is drawn in, group by group, when phase 1 is active", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/en");
    await chips(page).scrollIntoViewIfNeeded();
    await chips(page)
      .getByRole("button", { name: /01\s*Plan/ })
      .click();
    const walls = page.locator("svg.wwd-plan #walls path").first();
    await expect(walls).toHaveCSS("stroke-dashoffset", "0px", { timeout: 4_000 });
    await expect(page.locator("svg.wwd-plan #dims")).toHaveCSS("opacity", "1", { timeout: 4_000 });
  });

  test("phones: no pinned frame; every phase shows its own frame under its text", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en");
    const items = page.locator("#what-heading").locator("xpath=ancestor::section//ol/li");
    await expect(items).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(items.nth(i).locator("[data-static-frame]")).toHaveCount(1);
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("reduced motion: all four frames stacked, one under each phase, nothing pinned", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    await page.goto("/en");
    const items = page.locator("#what-heading").locator("xpath=ancestor::section//ol/li");
    await expect(items).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(items.nth(i).locator("[data-static-frame]")).toBeVisible();
    }
    await expect(chips(page).locator("xpath=..")).toHaveCSS("position", "static");
    await context.close();
  });
});
