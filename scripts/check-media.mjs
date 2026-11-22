/**
 * Media check: fails when an image or model the site uses is missing, git-ignored, untracked, a Git LFS
 * pointer, or not a valid file of the type its extension claims.
 *
 * Run with: pnpm check:media   (CI and the pre-push hook run it)
 *
 * What it checks
 *  1. Every "/path/to/file.ext" string literal in src/, content/ and messages/ that points at media must
 *     exist under public/ (paths built with ${...} are skipped; public/ is validated as a whole below).
 *  2. Every file under public/ and content/ is read: Git LFS pointers, wrong formats (a PNG named .jpg),
 *     CMYK JPEGs, unreadable images and bad .glb headers are reported.
 *  3. With git available: every file under public/ and content/ must be tracked and not ignored, and
 *     .gitattributes must not send media through LFS (the LFS objects were never on the server).
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const rel = (p) => path.relative(ROOT, p).split(path.sep).join("/");

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
const MEDIA_EXT = [...IMAGE_EXT, ".svg", ".glb", ".ico"];
const FORMAT_FOR_EXT = {
  ".jpg": "jpeg",
  ".jpeg": "jpeg",
  ".png": "png",
  ".webp": "webp",
  ".avif": "heif",
  ".gif": "gif",
};

let progressive = 0;
const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  });
}

function git(args) {
  try {
    return execFileSync("git", args, {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return null;
  }
}

// ---- 1. Referenced media exists ------------------------------------------------------------
const SCAN_DIRS = ["src", "content", "messages"].map((d) => path.join(ROOT, d));
const SCAN_EXT = new Set([".ts", ".tsx", ".mdx", ".md", ".json", ".css"]);
const refRe = new RegExp(
  `["'\`(](/[^"'\`\\s)$*{}]+(?:${MEDIA_EXT.join("|").replaceAll(".", "\\.")}))["'\`)?#]`,
  "gi",
);

const referenced = new Map(); // public path -> first file that uses it
for (const file of SCAN_DIRS.flatMap(walk)) {
  if (!SCAN_EXT.has(path.extname(file))) continue;
  if (file.endsWith("blur.json")) continue; // generated from public/, checked by the next step
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(refRe)) {
    if (!referenced.has(m[1])) referenced.set(m[1], rel(file));
  }
}
for (const [ref, usedIn] of referenced) {
  if (!existsSync(path.join(ROOT, "public", ref)))
    fail(`public${ref}`, `referenced in ${usedIn} but missing`);
}

// ---- 2. Every media file is real and valid -------------------------------------------------
const mediaFiles = [path.join(ROOT, "public"), path.join(ROOT, "content")]
  .flatMap(walk)
  .filter((f) => MEDIA_EXT.includes(path.extname(f).toLowerCase()));

for (const file of mediaFiles) {
  const name = rel(file);
  const ext = path.extname(file).toLowerCase();
  const size = statSync(file).size;
  if (size === 0) {
    fail(name, "is empty (0 bytes)");
    continue;
  }
  const head = readFileSync(file).subarray(0, 120).toString("latin1");
  if (head.startsWith("version https://git-lfs")) {
    fail(name, "is a Git LFS pointer, not the real file");
    continue;
  }
  if (ext === ".svg" || ext === ".ico") continue;
  if (ext === ".glb") {
    if (!head.startsWith("glTF")) fail(name, "is not a binary glTF (missing 'glTF' header)");
    continue;
  }
  try {
    const meta = await sharp(file).metadata();
    const want = FORMAT_FOR_EXT[ext];
    if (meta.format !== want) {
      fail(name, `has extension ${ext} but is really ${meta.format}`);
    } else if (meta.format === "jpeg" && meta.space === "cmyk") {
      fail(name, "is a CMYK JPEG (convert to sRGB)");
    } else if (meta.format === "jpeg" && meta.isProgressive) {
      progressive += 1;
    }
  } catch (e) {
    fail(name, `cannot be decoded: ${e.message}`);
  }
}

// ---- 3. Git tracking -----------------------------------------------------------------------
const tracked = git(["ls-files", "-z", "--", "public", "content"]);
if (tracked === null) {
  console.log("note: git not available here, skipping the tracked/ignored checks");
} else {
  const trackedSet = new Set(tracked.split("\0").filter(Boolean));
  for (const file of mediaFiles) {
    const name = rel(file);
    if (trackedSet.has(name)) continue;
    const ignored = git(["check-ignore", "-v", "--", name]);
    fail(
      name,
      ignored ? `is git-ignored (${ignored.trim().split("\t")[0]})` : "is not tracked by git",
    );
  }
  const attrs = path.join(ROOT, ".gitattributes");
  if (existsSync(attrs) && /filter=lfs/.test(readFileSync(attrs, "utf8"))) {
    fail(".gitattributes", "sends files through Git LFS; media must be stored in git directly");
  }
}

// ---- Report --------------------------------------------------------------------------------
if (progressive > 0)
  console.log(`note: ${progressive} progressive JPEGs (fine: the OG card re-encodes them)`);
if (errors.length > 0) {
  for (const e of errors) console.error(`FAIL  ${e}`);
  console.error(
    `\ncheck:media failed: ${errors.length} problem(s) in ${mediaFiles.length} media files.`,
  );
  process.exit(1);
}
console.log(
  `check:media ok: ${mediaFiles.length} media files valid, ${referenced.size} referenced paths found.`,
);
