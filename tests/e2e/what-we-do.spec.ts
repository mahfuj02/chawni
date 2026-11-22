import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const chips = (page: Page) => page.getByRole("navigation", { name: "Project phases" });
const stage = (page: Page) => page.getByTestId("wwd-stage");

async function openDesktop(page: Page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/en");
  await page.locator("#what-heading").scrollIntoViewIfNeeded();
}

const CAPTIONS = [
  "Plan · Elevation drawing",
  "Design · Massing model",
  "Engineer · Structural frame",
  "Build · Hotel Paradise Inn",
];

test.describe("what we do: four-stage sequence", () => {
  test("scrolling to each phase changes the visible image and the caption", async ({ page }) => {
    await openDesktop(page);
    for (let i = 0; i < 4; i++) {
      await page
        .locator(`ol > li[data-phase="${i}"]`)
        .evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
      await expect(stage(page)).toHaveAttribute("data-active", String(i));
      await expect(page.getByTestId("wwd-caption")).toHaveText(CAPTIONS[i]);
      const layer = stage(page).locator(`[data-testid="wwd-layer"][data-phase="${i}"]`);
      await expect(layer).toHaveCSS("opacity", "1");
      if (i < 3) {
        const above = stage(page).locator(`[data-testid="wwd-layer"][data-phase="${i + 1}"]`);
        await expect(above).toHaveCSS("opacity", "0");
      }
    }
    await expect(page.getByTestId("wwd-badge")).toHaveText("Visualised · Hotel Paradise Inn");
  });

  test("badge only shows on 04 Build", async ({ page }) => {
    await openDesktop(page);
    await expect(page.getByTestId("wwd-badge")).toHaveCount(0);
    await chips(page)
      .getByRole("button", { name: /04\s*Build/ })
      .click();
    await expect(page.getByTestId("wwd-badge")).toBeVisible();
  });

  test("clicking '03 Engineer' shows engineer.jpg and its caption", async ({ page }) => {
    await openDesktop(page);
    const chip = chips(page).getByRole("button", { name: /03\s*Engineer/ });
    await chip.click();
    await expect(chip).toHaveAttribute("aria-current", "step");
    await expect(stage(page)).toHaveAttribute("data-active", "2");
    await expect(page.getByTestId("wwd-caption")).toHaveText("Engineer · Structural frame");
    await expect(page.getByTestId("wwd-caption")).toHaveAttribute(
      "href",
      /\/projects\/hotel-paradise-inn$/,
    );
    const src = await stage(page).locator('[data-phase="2"] img').getAttribute("src");
    expect(decodeURIComponent(src ?? "")).toContain("engineer.jpg");
    // The scroll observer must not fight the click.
    await page.waitForTimeout(1500);
    await expect(stage(page)).toHaveAttribute("data-active", "2");
  });

  test("arrow keys move focus between chips", async ({ page }) => {
    await openDesktop(page);
    const first = chips(page).getByRole("button", { name: /01\s*Plan/ });
    await first.focus();
    await page.keyboard.press("ArrowRight");
    await expect(chips(page).getByRole("button", { name: /02\s*Design/ })).toBeFocused();
  });

  test("only one caption element exists in the frame", async ({ page }) => {
    await openDesktop(page);
    await expect(stage(page).getByTestId("wwd-caption")).toHaveCount(1);
    await chips(page)
      .getByRole("button", { name: /02\s*Design/ })
      .click();
    await expect(stage(page).getByTestId("wwd-caption")).toHaveCount(1);
    await expect(stage(page).getByTestId("wwd-caption")).toHaveText("Design · Massing model");
  });

  test("the frame is sticky on desktop", async ({ page }) => {
    await openDesktop(page);
    await expect(stage(page).locator("xpath=..")).toHaveCSS("position", "sticky");
  });

  test("axe passes on the section", async ({ page }) => {
    await openDesktop(page);
    await page.waitForTimeout(800);
    const results = await new AxeBuilder({ page })
      .include("section[aria-labelledby='what-heading']")
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test("screenshot at 1440×900", async ({ page }) => {
    await openDesktop(page);
    await chips(page)
      .getByRole("button", { name: /02\s*Design/ })
      .click();
    await expect(stage(page)).toHaveAttribute("data-active", "1");
    await page.waitForTimeout(1500);
    await page.screenshot({ path: "test-results/what-we-do-1440x900.png" });
  });

  test("phones: no pinned frame; every phase shows its own image under its text", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en");
    const items = page.locator("#what-heading").locator("xpath=ancestor::section//ol/li");
    await expect(items).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      const img = items.nth(i).locator("[data-static-frame] img");
      await expect(img).toHaveCount(1);
      const src = decodeURIComponent((await img.getAttribute("src")) ?? "");
      expect(src + (await img.getAttribute("srcset"))).toContain("-800.jpg");
    }
    await expect(page.getByTestId("wwd-stage")).toHaveCount(0);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await items.first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: "test-results/what-we-do-390x844.png" });
  });

  test("reduced motion: images inline under each phase, nothing sticky", async ({ browser }) => {
    const context = await browser.newContext({
      reducedMotion: "reduce",
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    await page.goto("/en");
    const items = page.locator("#what-heading").locator("xpath=ancestor::section//ol/li");
    await expect(items).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      await expect(items.nth(i).locator("[data-static-frame]")).toHaveCount(1);
    }
    await expect(page.getByTestId("wwd-stage")).toHaveCount(0);
    await context.close();
  });
});

const PAIRS = [
  { chip: /01\s*Plan/, file: "plan.jpg", caption: "Plan · Elevation drawing" },
  { chip: /02\s*Design/, file: "design.jpg", caption: "Design · Massing model" },
  { chip: /03\s*Engineer/, file: "engineer.jpg", caption: "Engineer · Structural frame" },
  { chip: /04\s*Build/, file: "build.jpg", caption: "Build · Hotel Paradise Inn" },
];

test.describe("what we do: image/caption pairs", () => {
  test("every chip shows its own image and caption", async ({ page }) => {
    await openDesktop(page);
    // Visit out of order so both the forward wipe and the backward fade are exercised.
    for (const i of [0, 1, 2, 3, 1, 3, 0]) {
      const { chip, file, caption } = PAIRS[i];
      await chips(page).getByRole("button", { name: chip }).click();
      await expect(stage(page)).toHaveAttribute("data-active", String(i));
      await expect(page.getByTestId("wwd-caption")).toHaveText(caption);
      const layer = stage(page).locator(`[data-testid="wwd-layer"][data-phase="${i}"]`);
      await expect(layer).toHaveCSS("opacity", "1");
      const src = await layer.locator("img").getAttribute("src");
      expect(decodeURIComponent(src ?? "")).toContain(file);
    }
  });

  test("every scroll position shows its own image and caption", async ({ page }) => {
    await openDesktop(page);
    for (const i of [0, 1, 2, 3]) {
      const { file, caption } = PAIRS[i];
      await page
        .locator(`ol > li[data-phase="${i}"]`)
        .evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
      await expect(stage(page)).toHaveAttribute("data-active", String(i));
      await expect(page.getByTestId("wwd-caption")).toHaveText(caption);
      const src = await stage(page)
        .locator(`[data-testid="wwd-layer"][data-phase="${i}"] img`)
        .getAttribute("src");
      expect(decodeURIComponent(src ?? "")).toContain(file);
    }
  });

  test("no leftover old frames", async ({ page }) => {
    await openDesktop(page);
    const html = await page.locator("section[aria-labelledby='what-heading']").innerHTML();
    for (const old of ["plan.svg", "samriddhi-01", "dr-arafat-palace-01", "windsor-hotel-01"]) {
      expect(html).not.toContain(old);
    }
    await expect(page.getByText("Concept floor plan")).toHaveCount(0);
  });
});
