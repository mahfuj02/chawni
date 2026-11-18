/**
 * Writes tiny base64 blur placeholders for every image in public/projects, public/team and public/hero
 * to src/content/blur.json, keyed by public path ("/projects/<slug>/<file>.jpg").
 *
 * Run with: pnpm content:blur   (needs Node 22.18+ so .ts files run directly)
 */
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const FOLDERS = ["projects", "team", "hero"];

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  );
  return nested.flat();
}

const files = (await Promise.all(FOLDERS.map((f) => walk(path.join(PUBLIC, f)))))
  .flat()
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort();

const blur: Record<string, string> = {};
// Sequential on purpose: keeps memory flat for several hundred large photos.
for (const file of files) {
  const buf = await sharp(file)
    .rotate()
    .resize({ width: 10 })
    .blur(0.6)
    .webp({ quality: 35 })
    .toBuffer();
  const key = "/" + path.relative(PUBLIC, file).split(path.sep).join("/");
  blur[key] = `data:image/webp;base64,${buf.toString("base64")}`;
}

await writeFile(
  path.join(ROOT, "src", "content", "blur.json"),
  JSON.stringify(blur, null, 0) + "\n",
);
console.log(`Wrote ${Object.keys(blur).length} blur placeholders to src/content/blur.json`);
