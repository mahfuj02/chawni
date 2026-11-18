import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Chawni Architectures",
    short_name: "Chawni",
    description:
      "Architecture, engineering, interior and construction. For an environment to live.",
    start_url: "/en",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#AECBE8",
    icons: [
      { src: "/brand/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/brand/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
