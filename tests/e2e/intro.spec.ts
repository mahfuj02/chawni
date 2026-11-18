import { expect, test, type Page } from "@playwright/test";

/** Make the browser look like a real visitor (Playwright sets navigator.webdriver = true). */
async function asRealVisitor(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    // Parallel workers can be slow to fetch the intro chunk; give it longer than the production 1.2 s.
    (window as unknown as Record<string, number>).__CHAWNI_INTRO_TIMEOUT_MS = 15_000;
  });
}

test.describe("logo intro", () => {
  test("is skipped under webdriver: no overlay, hero headline visible at once", async ({
    page,
  }) => {
    await page.goto("/en");
    await expect(page.locator("html")).not.toHaveAttribute("data-intro", /.+/);
    await expect(page.locator("[data-intro-layer]")).toBeHidden();
    await expect(page.locator("[data-hero] h1")).toBeVisible();
  });

  test("plays on the first visit, and 'Skip intro' removes it and hands off to the hero", async ({
    page,
  }) => {
    await asRealVisitor(page);
    await page.goto("/en");
    const layer = page.locator("[data-intro-layer]");
    await expect(layer).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-intro", "playing");
    const skip = page.getByRole("button", { name: "Skip intro" });
    await expect(skip).toBeVisible({ timeout: 10_000 });
    await skip.click();
    await expect(layer).toHaveCount(0, { timeout: 5_000 });
    await expect(page.locator("html")).not.toHaveAttribute("data-intro", /.+/);
    await expect(page.locator("[data-hero] h1")).toBeVisible();
    // Played once this session.
    expect(await page.evaluate(() => sessionStorage.getItem("chawni-intro"))).toBe("1");
    await page.reload();
    await expect(page.locator("[data-intro-layer]")).toBeHidden();
  });

  test("Escape skips it too, and the hero's copy animation waits while it plays", async ({
    page,
  }) => {
    await asRealVisitor(page);
    await page.goto("/en");
    await expect(page.getByRole("button", { name: "Skip intro" })).toBeVisible({ timeout: 10_000 });
    const state = await page
      .locator("[data-hero] h1 span")
      .first()
      .evaluate((el) => getComputedStyle(el).animationPlayState);
    expect(state).toBe("paused");
    await page.keyboard.press("Escape");
    await expect(page.locator("[data-intro-layer]")).toHaveCount(0, { timeout: 5_000 });
  });

  test("it finishes by itself within a few seconds", async ({ page }) => {
    await asRealVisitor(page);
    await page.goto("/en");
    await expect(page.locator("[data-intro-layer]")).toHaveCount(0, { timeout: 12_000 });
  });

  test("with reduced motion it never shows", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await asRealVisitor(page);
    await page.goto("/en");
    await expect(page.locator("[data-intro-layer]")).toBeHidden();
    await expect(page.locator("html")).not.toHaveAttribute("data-intro", /.+/);
    await context.close();
  });

  test("only the Home page has an intro", async ({ page }) => {
    await asRealVisitor(page);
    await page.goto("/en/projects");
    await expect(page.locator("[data-intro-layer]")).toHaveCount(0);
  });
});
