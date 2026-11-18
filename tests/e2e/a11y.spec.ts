import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { LOCALES, ROUTES, withLocale } from "./routes";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

for (const locale of LOCALES) {
  for (const route of ROUTES) {
    const url = withLocale(locale, route);

    test(`a11y: ${url} has no serious or critical violations`, async ({ page }) => {
      await page.goto(url, { waitUntil: "networkidle" });
      // Let entrance animations and counters settle before measuring contrast.
      await page.waitForTimeout(800);

      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      const blocking = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );

      expect(
        blocking.map((v) => ({
          rule: v.id,
          impact: v.impact,
          nodes: v.nodes.slice(0, 3).map((n) => n.html.slice(0, 140)),
        })),
      ).toEqual([]);
    });
  }
}

// Phone width: the mobile menu, stacked layouts and 44px targets matter here.
test.describe("a11y at 360px", () => {
  test.use({ viewport: { width: 360, height: 740 } });

  for (const route of ["/", "/projects", "/contact"]) {
    test(`a11y mobile: /en${route === "/" ? "" : route}`, async ({ page }) => {
      await page.goto(withLocale("en", route), { waitUntil: "networkidle" });
      await page.waitForTimeout(800);
      const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      const blocking = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(blocking.map((v) => v.id)).toEqual([]);
    });
  }
});
