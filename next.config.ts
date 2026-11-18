import withBundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./src/i18n/request.ts",
  experimental: {
    // Compile ICU messages at build time so the ~100 KB runtime message formatter is not shipped.
    messages: { path: "./messages", format: "json", locales: "infer", precompile: true },
  },
});
const analyze = withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

const nextConfig: NextConfig = {
  // WebP only: AVIF encoding of hundreds of large photos makes the first (uncached) request of each
  // image slow. WebP is nearly as small and far faster to produce.
  images: { formats: ["image/webp"] },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default analyze(withNextIntl(nextConfig));
