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

const photoCache = new Map<string, string>();
/** Read a public image (e.g. "/projects/x/x-01-1200.jpg") as a data URI for the card background. */
function photoUri(publicPath: string) {
  let uri = photoCache.get(publicPath);
  if (!uri) {
    const bytes = fs.readFileSync(path.join(process.cwd(), "public", publicPath));
    uri = `data:image/jpeg;base64,${bytes.toString("base64")}`;
    photoCache.set(publicPath, uri);
  }
  return uri;
}

/**
 * Branded social card: ink background, light logo, orange rule, title.
 * Titles are English in every locale: the default OG font has no Bengali glyphs.
 */
export function renderOgImage({
  title,
  kicker,
  photo,
}: {
  title: string;
  kicker?: string;
  /** Public path of a photo (use the 1200 px version) shown behind the text. */
  photo?: string;
}) {
  const size = title.length > 60 ? 54 : title.length > 36 ? 64 : 76;
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#141414",
        color: "#ffffff",
        padding: 64,
        fontFamily: "sans-serif",
      }}
    >
      {photo ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUri(photo)}
            alt=""
            width={1200}
            height={630}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 1200,
              height: 630,
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 1200,
              height: 630,
              display: "flex",
              background:
                "linear-gradient(90deg, rgba(20,20,20,0.92) 0%, rgba(20,20,20,0.6) 55%, rgba(20,20,20,0.15) 100%)",
            }}
          />
        </>
      ) : null}
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
