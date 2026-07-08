# Lychee Config Update Checklist

Use this checklist when refreshing this shared config or adopting it in another repository.

## Required For This Package

- [ ] Confirm `lychee.toml` still represents a reusable baseline, not one repository's one-off link exceptions.
- [ ] Keep package metadata pointed at `lychee-config-nick2bad4u`.
- [ ] Keep `package.json#files` publishing `dist` and `lychee.toml`.
- [ ] Keep `src/preset.ts` and `test/preset.test.ts` aligned with the published config filename.
- [ ] Keep `.lychee.report.md` and `.lycheecache` ignored locally.
- [ ] Run `npm run lint:lychee:smoke` when Lychee is installed locally.

## Config Review

- [ ] Avoid hardcoding `github_token`, credentials, cookies, private URLs, or repository-specific auth headers.
- [ ] Keep global concurrency conservative enough for GitHub-heavy CI runs.
- [ ] Keep `cache_exclude_status` excluding rate limits and server errors.
- [ ] Review accepted status codes before adding anything outside normal success ranges and `429`.
- [ ] Review `exclude` entries for broad patterns that could hide real broken links.
- [ ] Review `exclude_path` entries so generated output, dependencies, locks, and binary assets stay out of scans.
- [ ] Add repo-specific `base_url`, `root_dir`, remaps, and one-off excludes in consuming repositories, not this package.

## Required Per Consuming Repository

- [ ] Install this package as a dev dependency.
- [ ] Install the Lychee CLI through the repository's normal toolchain or CI setup.
- [ ] Add a script such as `lychee --config node_modules/lychee-config-nick2bad4u/lychee.toml .`.
- [ ] Add a second `--config lychee.toml` only when the repository needs local overrides.
- [ ] Add `.lychee.report.md` and `.lycheecache` to `.gitignore` unless those artifacts are intentionally published.
- [ ] Set `GITHUB_TOKEN` in CI for GitHub-heavy repositories instead of writing tokens to config files.
- [ ] Run the link check locally and in CI before enabling it as a required gate.

## Shared Config Refresh

- [ ] Publish this package before migrating consumers to a new version.
- [ ] Run `NPM-Convert-SharedPackageConfigMigration.ps1 -Path . -SkipDependencyUpdate` in consuming repositories after the package is published.
- [ ] Run `npm run update-deps` in consuming repositories after confirming the shared package version is available on npm.
- [ ] Check consuming repositories for local `lychee.toml` overrides that now duplicate shared defaults.
- [ ] Re-pin reusable workflow callers after updating `Nick2bad4u/workflow-templates`.

## Package Tooling Review

- [ ] Run `npm run lint:config`.
- [ ] Run `npm run lint:package`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run test`.
- [ ] Run `npm run test:coverage`.
- [ ] Run `npm run package:check`.
- [ ] Run `npm run changelog:preview` before cutting a release.

## Before Release

- [ ] Confirm `private` is `false` in `package.json`.
- [ ] Confirm `publishConfig.provenance` and registry settings are correct.
- [ ] Confirm package exports and declaration files match built output.
- [ ] Confirm `npm pack --dry-run` includes `lychee.toml`.
- [ ] Create the first tag only after `npm run release:verify` passes locally.
