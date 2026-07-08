# Repository Instructions

This repository publishes the shared `lychee.toml` baseline for Nick2bad4u repositories.
Treat the raw TOML file and the tiny TypeScript resolver as the public package surface.

## Priorities

- Keep `lychee.toml` reusable across repositories; put one-off link exceptions in consuming repos.
- Do not hardcode tokens, cookies, private URLs, or repository-specific auth headers in the shared config.
- Keep Lychee concurrency conservative enough for GitHub-heavy CI runs.
- Keep generated output, dependency folders, build artifacts, caches, and local reports out of commits.
- Do not weaken security scanners or release gates to make CI pass.
- Keep workflow permissions least-privilege and keep third-party actions pinned by SHA where already pinned.

## Common Commands

```bash
npm ci
npm run build
npm run lint:lychee:smoke
npm run lint:all
npm run typecheck
npm run test
npm run package:check
npm run release:verify
```

## Package Surface

- `lychee.toml` is the shared Lychee config consumed by other repositories.
- `src/preset.ts` exports `configFileName`, `packageName`, `resolveConfigPath`, and `configPath`.
- `package.json#files` must publish `dist` and `lychee.toml`.
- Consumers should run Lychee directly with `--config node_modules/lychee-config-nick2bad4u/lychee.toml`.
- Repository-local overrides should be passed as later `--config` arguments.

## Tooling Baseline

- Node is controlled by `.node-version`, `.nvmrc`, and `package.json#engines`.
- npm is controlled by `packageManager`.
- ESLint extends `eslint-config-nick2bad4u`.
- Prettier extends `prettier-config-nick2bad4u`.
- Package JSON, Secretlint, Remark, Yamllint, TSDoc, Gitleaks, TypeScript, Vitest, and TypeDoc configs are included.
- GitHub Actions use local scripts for validation and caller workflows for shared security/dependency automation.
