import "server-only";
import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

let logoDataUri: string | undefined;
function logo() {
  if (!logoDataUri) {
    const svg = fs.readFileSync(
      path.join(process.cwd(), "public", "brand", "chawni-logo-light-on-dark-compact.svg"),
    );
    logoDataUri = `data:image/svg+xml;base64,${svg.toString("base64")}`;
  }
  return logoDataUri;
}

/**
 * Branded social card: ink background, light logo, orange rule, title.
 * Titles are English in every locale: the default OG font has no Bengali glyphs.
 */
export function renderOgImage({ title, kicker }: { title: string; kicker?: string }) {
  const size = title.length > 60 ? 54 : title.length > 36 ? 64 : 76;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#141414",
        color: "#ffffff",
        padding: 64,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {kicker ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 28,
                textTransform: "lowercase",
                color: "#ffffff",
              }}
            >
              <div style={{ width: 16, height: 16, background: "#F47C24", display: "flex" }} />
              {kicker}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              fontSize: size,
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: 760,
            }}
          >
            {title}
          </div>
        </div>
        <div style={{ display: "flex", width: 160, height: 8, background: "#F47C24" }} />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo()} width={300} height={Math.round((300 * 1090) / 1070)} alt="" />
    </div>,
    OG_SIZE,
  );
}
