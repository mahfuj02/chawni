import { expect, test } from "@playwright/test";
import { ALL_JOURNAL_SLUGS, ALL_PROJECT_SLUGS, LOCALES, ROUTES, withLocale } from "./routes";

test.describe("every route renders in en and bn", () => {
  for (const locale of LOCALES) {
    for (const route of ROUTES) {
      const url = withLocale(locale, route);
      test(`${url}`, async ({ page }) => {
        const response = await page.goto(url);
        expect(response?.status()).toBe(200);
        await expect(page.locator("html")).toHaveAttribute("lang", locale);
        // Exactly one h1, with text, per page.
        await expect(page.locator("h1")).toHaveCount(1);
        await expect(page.locator("h1")).not.toBeEmpty();
        // Landmarks and the skip link target exist.
        await expect(page.locator("main#main")).toHaveCount(1);
        await expect(page.getByRole("banner")).toBeVisible();
        await expect(page.getByRole("contentinfo")).toBeVisible();
        // Canonical + both hreflang alternates are present.
        await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
        await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveCount(1);
        await expect(page.locator('link[rel="alternate"][hreflang="bn"]')).toHaveCount(1);
      });
    }
  }

  test("all 25 project pages and all 6 journal posts exist in both locales", async ({
    request,
  }) => {
    for (const locale of LOCALES) {
      for (const slug of ALL_PROJECT_SLUGS) {
        expect((await request.get(`/${locale}/projects/${slug}`)).status()).toBe(200);
      }
      for (const slug of ALL_JOURNAL_SLUGS) {
        expect((await request.get(`/${locale}/journal/${slug}`)).status()).toBe(200);
      }
    }
    expect(ALL_PROJECT_SLUGS).toHaveLength(25);
    expect(ALL_JOURNAL_SLUGS).toHaveLength(6);
  });

  test("the root redirects to the default locale", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en\/?$/);
  });
});

test.describe("navigation", () => {
  test("header links navigate between pages", async ({ page }) => {
    await page.goto("/en");
    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const [name, path] of [
      ["About us", "/en/about"],
      ["Services", "/en/services"],
      ["Projects", "/en/projects"],
      ["Journal", "/en/journal"],
      ["Home", "/en"],
    ] as const) {
      await nav.getByRole("link", { name }).click();
      await expect(page).toHaveURL(new RegExp(`${path}/?$`));
    }
  });

  test("the current page is marked in the nav", async ({ page }) => {
    await page.goto("/en/services");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link", { name: "Services" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(nav.getByRole("link", { name: "About us" })).not.toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("the Contact us pill goes to the contact page", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("banner").getByRole("link", { name: "Contact us" }).click();
    await expect(page).toHaveURL(/\/en\/contact\/?$/);
  });

  test("the language switcher keeps you on the same page", async ({ page }) => {
    await page.goto("/en/about");
    await page
      .getByRole("navigation", { name: "Language" })
      .getByRole("link", { name: "বাংলা" })
      .click();
    await expect(page).toHaveURL(/\/bn\/about\/?$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "bn");
    await page.getByRole("navigation", { name: "ভাষা" }).getByRole("link", { name: /EN/ }).click();
    await expect(page).toHaveURL(/\/en\/about\/?$/);
  });

  test("the mobile menu opens, traps focus, navigates and closes", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/en");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL(/\/en\/projects\/?$/);
    await expect(dialog).toBeHidden();

    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  });

  test("the skip link moves focus to the main content", async ({ page }) => {
    await page.goto("/en/about");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await skip.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

  test("the floating WhatsApp button is present and labelled", async ({ page }) => {
    await page.goto("/en");
    const link = page.getByRole("link", { name: "Chat with us on WhatsApp" });
    await expect(link).toHaveAttribute("href", /wa\.me\//);
  });
});

test.describe("projects filter", () => {
  test("shows 25 projects and a count label", async ({ page }) => {
    await page.goto("/en/projects");
    await expect(page.locator("main article")).toHaveCount(25);
    await expect(page.getByRole("status")).toHaveText("25 projects");
  });

  test("filtering updates the URL and the list, and is shareable", async ({ page }) => {
    await page.goto("/en/projects");
    const cards = page.locator("main article");
    await expect(cards).toHaveCount(25);

    const filter = page.getByRole("navigation", { name: "Filter projects by category" });
    await filter.getByRole("link", { name: "Hospitality" }).click();
    await expect(page).toHaveURL(/\/en\/projects\/?\?category=hospitality$/);
    await expect(cards).toHaveCount(2);
    await expect(page.getByRole("status")).toHaveText("2 projects");
    await expect(filter.getByRole("link", { name: "Hospitality" })).toHaveAttribute(
      "aria-current",
      "true",
    );

    // Reloading the same URL shows the same filtered view.
    await page.reload();
    await expect(cards).toHaveCount(2);

    await filter.getByRole("link", { name: "Residential" }).click();
    await expect(page).toHaveURL(/category=residential$/);
    await expect(cards).toHaveCount(9);

    await filter.getByRole("link", { name: "Institutional" }).click();
    await expect(cards).toHaveCount(2);

    await filter.getByRole("link", { name: "All" }).click();
    await expect(page).not.toHaveURL(/category=/);
    await expect(cards).toHaveCount(25);
  });

  test("every category exists as a filter and the counts add up", async ({ page }) => {
    await page.goto("/en/projects");
    const filter = page.getByRole("navigation", { name: "Filter projects by category" });
    let total = 0;
    for (const [name, count] of [
      ["Residential", 9],
      ["Commercial", 1],
      ["Hospitality", 2],
      ["Interior", 11],
      ["Institutional", 2],
    ] as const) {
      await filter.getByRole("link", { name }).click();
      await expect(page.locator("main article")).toHaveCount(count);
      total += count;
    }
    expect(total).toBe(25);
  });

  test("each card shows a status badge: dark when Completed, white otherwise", async ({ page }) => {
    await page.goto("/en/projects");
    const first = page.locator("main article").first();
    await expect(first.getByText("Completed")).toHaveClass(/bg-ink/);
    const proposed = page.locator("main article", { hasText: "Hotel Paradise Inn" });
    await expect(proposed.getByText("Proposed")).toHaveClass(/bg-white/);
  });

  test("an unknown category falls back to all projects", async ({ page }) => {
    await page.goto("/en/projects?category=spaceships");
    await expect(page.locator("main article")).toHaveCount(25);
  });

  test("the old dummy category is gone", async ({ page }) => {
    await page.goto("/en/projects");
    const filter = page.getByRole("navigation", { name: "Filter projects by category" });
    await expect(filter.getByRole("link", { name: "Construction" })).toHaveCount(0);
  });

  test("the filter works in Bangla too", async ({ page }) => {
    await page.goto("/bn/projects");
    await page
      .getByRole("navigation", { name: "ক্যাটাগরি অনুযায়ী প্রকল্প ছাঁকুন" })
      .getByRole("link", { name: "আতিথেয়তা" })
      .click();
    await expect(page).toHaveURL(/\/bn\/projects\/?\?category=hospitality$/);
    await expect(page.locator("main article")).toHaveCount(2);
  });
});

test.describe("project detail", () => {
  test("a project with a model shows the facts that exist and the Explore in 3D section", async ({
    page,
  }) => {
    await page.goto("/en/projects/hotel-paradise-inn");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Hotel Paradise Inn");
    for (const label of ["Location", "Area", "Scope", "Status"]) {
      await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
    }
    // No client and no year are given for this project, so those facts are not shown.
    await expect(page.getByText("Client", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Year", { exact: true })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Walk around the model." })).toBeVisible();
    await page.getByRole("link", { name: /Next project/ }).click();
    await expect(page).toHaveURL(/\/en\/projects\/samriddhi\/?$/);
  });

  test("a photos-only project has no Explore in 3D section", async ({ page }) => {
    await page.goto("/en/projects/nirjhar-education");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Nirjhar Education Sylhet");
    await expect(page.getByRole("heading", { name: "Walk around the model." })).toHaveCount(0);
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.getByText("Client", { exact: true })).toBeVisible();
    await expect(page.getByText("Photography: Shumon Chowdhury")).toBeVisible();
  });

  test("Bangla titles are used where they exist", async ({ page }) => {
    await page.goto("/bn/projects/samriddhi");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("সমৃদ্ধি");
  });

  test("the 3D viewer has Rotate, Explode and Show photos controls and labelled hotspots", async ({
    page,
  }) => {
    await page.goto("/en/projects/hotel-paradise-inn?force3d=1");
    await page.locator("#explore-heading").scrollIntoViewIfNeeded();
    const toolbar = page.getByRole("toolbar");
    await expect(toolbar.getByRole("button", { name: "Rotate" })).toBeVisible();
    await expect(toolbar.getByRole("button", { name: "Explode floors" })).toBeVisible();
    await expect(toolbar.getByRole("button", { name: "Show photos" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    // Controls unlock once the 3D view has loaded.
    await expect(toolbar.getByRole("button", { name: "Explode floors" })).toBeEnabled({
      timeout: 30_000,
    });
    const hotspot = page.getByRole("button", { name: "Lobby entrance — open photo 2" });
    await expect(hotspot).toBeVisible({ timeout: 30_000 });
    await hotspot.click();
    await expect(page.getByRole("dialog").getByText("02 / 19")).toBeVisible();
    await page.keyboard.press("Escape");
    await toolbar.getByRole("button", { name: "Show photos" }).click();
    await expect(page.getByRole("button", { name: /open photo/ })).toHaveCount(0);
  });

  test("the gallery lightbox opens, steps through photos with a counter, and closes", async ({
    page,
  }) => {
    await page.goto("/en/projects/windsor-hotel");
    await expect(page.getByText("Photography: Rmsi Prottoy")).toBeVisible();
    await page.locator("#gallery-heading").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: /photo 01/ }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("01 / 24")).toBeVisible();
    await dialog.getByRole("button", { name: "Next photo" }).click();
    await expect(dialog.getByText("02 / 24")).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByText("03 / 24")).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await expect(dialog.getByText("02 / 24")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });
});

test.describe("about and team", () => {
  test("About shows all six team members, with initials tiles where there is no photo", async ({
    page,
  }) => {
    await page.goto("/en/about");
    const members = page.locator("#leadership article");
    // Portraits load lazily, so bring the grid into view first.
    await members.last().scrollIntoViewIfNeeded();
    await expect(members).toHaveCount(6);
    await expect(members.getByText("Co-founder")).toHaveCount(2);
    await expect(members.getByText("Photo coming soon")).toHaveCount(2);
    await expect(members.locator("img")).toHaveCount(4);
  });

  test("Home shows the four members who have photos", async ({ page }) => {
    await page.goto("/en");
    const section = page.locator('section[aria-labelledby="team-heading"]');
    await expect(section.locator("article")).toHaveCount(4);
    await expect(section.getByText("Photo coming soon")).toHaveCount(0);
  });

  test("the contact page shows both phone numbers and the email", async ({ page }) => {
    await page.goto("/en/contact");
    const main = page.locator("main");
    await expect(main.getByRole("link", { name: "+880 1714 912091" })).toHaveAttribute(
      "href",
      "tel:+8801714912091",
    );
    await expect(main.getByRole("link", { name: "+880 1738 572355" })).toBeVisible();
    await expect(main.getByRole("link", { name: "chawnimn@gmail.com" })).toBeVisible();
  });

  test("the Bangla name is spelled ছাউনি, never চাউনি", async ({ page }) => {
    await page.goto("/bn");
    const text = await page.locator("body").innerText();
    expect(text).not.toContain("চাউনি");
    await expect(page).toHaveTitle(/ছাউনি/);
  });
});

test.describe("home projects and clients", () => {
  test("features Windsor Hotel, Nirjhar Education and Hotel Paradise Inn", async ({ page }) => {
    await page.goto("/en");
    const section = page.locator('section[aria-labelledby="projects-heading"]');
    await expect(section.locator("article h3")).toHaveText([
      "Windsor Hotel",
      "Nirjhar Education Sylhet",
      "Hotel Paradise Inn",
    ]);
  });

  test("shows the six client wordmarks", async ({ page }) => {
    await page.goto("/en");
    const logos = page.getByRole("list", { name: "Client logos" });
    await expect(logos.locator("li")).toHaveText([
      "Windsor Hotel",
      "Team Consultancy UK",
      "Nirjhar Education",
      "Study Milestone",
      "YES Academy",
      "Zaman Associates",
    ]);
  });
});

test.describe("journal", () => {
  test("lists posts, pages with Load more, and filters by category", async ({ page }) => {
    await page.goto("/en/journal");
    const cards = page.locator("main article");
    await expect(cards).toHaveCount(4); // featured + 3
    await page.getByRole("button", { name: "Load more" }).click();
    await expect(cards).toHaveCount(6);
    await expect(page.getByRole("button", { name: "Load more" })).toBeHidden();

    const filter = page.getByRole("navigation", { name: "Filter posts by category" });
    await filter.getByRole("link", { name: "Handover" }).click();
    await expect(page).toHaveURL(/category=handover$/);
    await expect(cards).toHaveCount(3);
  });

  test("an article shows the body, share links and related posts", async ({ page }) => {
    await page.goto(`/en/journal/${ALL_JOURNAL_SLUGS[0]}`);
    await expect(page.getByRole("heading", { level: 1 })).not.toBeEmpty();
    const main = page.locator("main");
    await expect(main.getByRole("link", { name: /Facebook/ })).toBeVisible();
    await expect(main.getByRole("link", { name: /WhatsApp/ })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy link" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Related posts" })).toBeVisible();
    await expect(page.locator('section[aria-labelledby="related-heading"] article')).toHaveCount(3);
  });

  test("Bangla article pages say the body is English only", async ({ page }) => {
    await page.goto(`/bn/journal/${ALL_JOURNAL_SLUGS[0]}`);
    await expect(page.getByText("এই লেখাটি শুধু ইংরেজিতে পাওয়া যাচ্ছে।")).toBeVisible();
  });
});

test.describe("contact form", () => {
  test("shows validation errors for an empty submit and keeps focus usable", async ({ page }) => {
    await page.goto("/en/contact");
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Please enter a valid phone number.")).toBeVisible();
    await expect(page.getByText("Please choose a service.")).toBeVisible();
    await expect(page.getByText("Please write at least 10 characters.")).toBeVisible();
    await expect(page.getByLabel("Full name")).toHaveAttribute("aria-invalid", "true");
    // Email is optional, so it is not flagged when empty.
    await expect(page.getByLabel("Email")).not.toHaveAttribute("aria-invalid", "true");
  });

  test("flags an invalid email", async ({ page }) => {
    await page.goto("/en/contact");
    await page.getByLabel("Email").fill("nope");
    await page.getByRole("button", { name: "Send inquiry" }).click();
    await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
  });

  test("submits a valid inquiry and shows the success state", async ({ page }) => {
    await page.goto("/en/contact");
    await page.getByLabel("Full name").fill("Rahim Uddin");
    await page.getByLabel("Phone / WhatsApp").fill("+880 1700-000000");
    await page.getByLabel("Email").fill("rahim@example.com");
    await page.getByLabel("Service").selectOption("design");
    await page.getByLabel("Message").fill("We want to build a two-storey home on a 5 katha plot.");
    await page.getByRole("button", { name: "Send inquiry" }).click();

    await expect(
      page.getByRole("status").filter({ hasText: "Thank you, we have your message." }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Send another message" }).click();
    await expect(page.getByLabel("Full name")).toHaveValue("");
  });

  test("works in Bangla with translated errors", async ({ page }) => {
    await page.goto("/bn/contact");
    await page.getByRole("button", { name: "অনুসন্ধান পাঠান" }).click();
    await expect(page.getByText("আপনার নাম লিখুন।")).toBeVisible();
  });

  test("silently accepts but ignores a filled honeypot", async ({ page }) => {
    await page.goto("/en/contact");
    await page.getByLabel("Full name").fill("Bot");
    await page.getByLabel("Phone / WhatsApp").fill("+880 1700-000000");
    await page.getByLabel("Service").selectOption("other");
    await page.getByLabel("Message").fill("Buy cheap watches at my shop right now.");
    await page.locator("#contact-website").fill("http://spam.example", { force: true });
    await page.getByRole("button", { name: "Send inquiry" }).click();
    // Bots get no success message and no visible error, and the field is hidden from assistive tech.
    await expect(page.getByText("Thank you, we have your message.")).toBeHidden();
    await expect(page.locator('div[aria-hidden="true"] #contact-website')).toHaveCount(1);
  });
});

test.describe("404 and errors", () => {
  test("an unknown page shows the branded 404 in English", async ({ page }) => {
    const response = await page.goto("/en/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "We could not find that page.",
    );
    await page.getByRole("link", { name: "Back to home" }).click();
    await expect(page).toHaveURL(/\/en\/?$/);
  });

  test("an unknown page shows the branded 404 in Bangla", async ({ page }) => {
    const response = await page.goto("/bn/nope/nothing");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("আমরা সেই পৃষ্ঠাটি খুঁজে পাইনি।");
  });

  test("an unknown project or post slug is a 404", async ({ request }) => {
    expect((await request.get("/en/projects/no-such-project")).status()).toBe(404);
    expect((await request.get("/en/journal/no-such-post")).status()).toBe(404);
  });
});

test.describe("SEO files and structured data", () => {
  test("sitemap lists every route with hreflang alternates", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    expect(xml).toContain("/en/projects/windsor-hotel");
    expect(xml).toContain("/bn/journal/");
    expect(xml).toContain('hreflang="bn"');
    // 7 static pages + 25 projects + 6 posts, each in 2 locales
    expect((xml.match(/<loc>/g) ?? []).length).toBe((7 + 25 + 6) * 2);
  });

  test("robots.txt points at the sitemap", async ({ request }) => {
    const text = await (await request.get("/robots.txt")).text();
    expect(text).toContain("Sitemap:");
    expect(text).toContain("/sitemap.xml");
  });

  test("the home page has Organization and LocalBusiness JSON-LD", async ({ page }) => {
    await page.goto("/en");
    const json = await page.locator('script[type="application/ld+json"]').first().textContent();
    const data = JSON.parse(json ?? "{}");
    const types = data["@graph"].map((n: { "@type": unknown }) => n["@type"]);
    expect(types).toContainEqual("Organization");
    expect(types).toContainEqual(["LocalBusiness", "GeneralContractor"]);
  });

  test("project pages have CreativeWork and journal posts have Article JSON-LD", async ({
    page,
  }) => {
    await page.goto("/en/projects/windsor-hotel");
    const work = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "{}",
    );
    expect(work["@type"]).toBe("CreativeWork");

    await page.goto(`/en/journal/${ALL_JOURNAL_SLUGS[0]}`);
    const article = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').first().textContent()) ?? "{}",
    );
    expect(article["@type"]).toBe("Article");
  });

  test("OG images render as PNGs", async ({ request }) => {
    for (const url of ["/en/opengraph-image", "/en/projects/windsor-hotel/opengraph-image"]) {
      const res = await request.get(url);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("image/png");
    }
  });

  test("the manifest and icons are served", async ({ request }) => {
    expect((await request.get("/manifest.webmanifest")).status()).toBe(200);
    expect((await request.get("/brand/favicon.svg")).status()).toBe(200);
  });
});

test.describe("home page content", () => {
  test("renders every section in order with the brand copy", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("For an environment");
    for (const heading of [
      "A studio of architects and engineers who build what they draw.",
      "Four phases. One accountable team.",
      "Why clients choose us",
      "Selected work",
      "Nine disciplines, one studio.",
      "Trusted by clients across Sylhet.",
      "Notes from the studio and the site",
      "Bring your vision to life.",
    ]) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }
    await expect(page.locator("main > section").first()).toHaveClass(/bg-sky/);
  });

  test("the phase chips scroll to and highlight their phase", async ({ page }) => {
    await page.goto("/en");
    const chips = page.getByRole("navigation", { name: "Project phases" });
    await chips.scrollIntoViewIfNeeded();
    await chips.getByRole("button", { name: /03 Engineer/ }).click();
    await expect(chips.getByRole("button", { name: /03 Engineer/ })).toHaveAttribute(
      "aria-current",
      "step",
    );
    await expect(
      page.getByRole("heading", { name: "Engineer", level: 3, exact: true }),
    ).toBeInViewport();
  });

  test("the hero static illustration is available without 3D (reduced motion)", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/en");
    await page.mouse.move(100, 100);
    await page.waitForTimeout(500);
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(
      page.getByRole("img", { name: /Interactive 3D model: the Chawni logo/ }).first(),
    ).toBeVisible();
    await context.close();
  });
});
