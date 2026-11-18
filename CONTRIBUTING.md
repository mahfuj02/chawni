# Contributing

## Branching

`main` only receives `--no-ff` merges of finished phases. Work on `feat/<name>`, `fix/<name>`,
`docs/<name>`, `test/<name>` or `chore/<name>`, branched from an up-to-date `main`.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/), enforced by commitlint + Husky:
`feat | fix | chore | docs | style | refactor | test | perf | ci`. Scope optional, e.g.
`feat(home): add who-we-are section`. One concern per commit; no "wip" or "update".
Merge commits must also be conventional, e.g. `feat: merge feat/home-page`.

## Pull request checklist

- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` pass
- [ ] `pnpm test:e2e` passes for changed routes
- [ ] Works in `en` and `bn`, 360px to 1920px
- [ ] Accessible: keyboard, focus states, alt text, contrast, reduced motion
- [ ] No secrets; new env vars documented in `.env.example`
- [ ] New dummy content lives in `src/content/` and is marked `// DUMMY DATA`
- [ ] `docs/DECISIONS.md` updated if a choice was made
