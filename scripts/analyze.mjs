import { spawnSync } from "node:child_process";

const result = spawnSync("pnpm", ["exec", "next", "build", "--webpack"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, ANALYZE: "true" },
});
process.exit(result.status ?? 1);
