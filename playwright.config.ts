import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "on-first-retry" },
  projects: [
    { name: "chromium", testIgnore: /intro.spec/, use: { ...devices["Desktop Chrome"] } },
    // The intro is a 2.8 s WebGL animation: run it on its own, after the rest, so CPU contention from
    // parallel software-GL workers cannot make the timing-based assertions flaky.
    {
      name: "intro",
      testMatch: /intro.spec/,
      dependencies: ["chromium"],
      fullyParallel: false,
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `pnpm start -p ${PORT}`,
    url: `http://localhost:${PORT}/en`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // Contact submissions are logged instead of emailed during tests.
    env: { CONTACT_DRY_RUN: "1" },
  },
});
