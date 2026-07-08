# lychee-config-nick2bad4u

[![npm license.](https://flat.badgen.net/npm/license/lychee-config-nick2bad4u?color=purple)](https://github.com/Nick2bad4u/lychee-config-nick2bad4u/blob/main/LICENSE)
[![npm total downloads.](https://flat.badgen.net/npm/dt/lychee-config-nick2bad4u?color=pink)](https://www.npmjs.com/package/lychee-config-nick2bad4u)
[![latest GitHub release.](https://flat.badgen.net/github/release/Nick2bad4u/lychee-config-nick2bad4u?color=cyan)](https://github.com/Nick2bad4u/lychee-config-nick2bad4u/releases)
[![GitHub stars.](https://flat.badgen.net/github/stars/Nick2bad4u/lychee-config-nick2bad4u?color=yellow)](https://github.com/Nick2bad4u/lychee-config-nick2bad4u/stargazers)
[![GitHub open issues.](https://flat.badgen.net/github/open-issues/Nick2bad4u/lychee-config-nick2bad4u?color=red)](https://github.com/Nick2bad4u/lychee-config-nick2bad4u/issues)
[![codecov.](https://flat.badgen.net/codecov/github/Nick2bad4u/lychee-config-nick2bad4u?color=blue)](https://codecov.io/gh/Nick2bad4u/lychee-config-nick2bad4u)

Shared [Lychee](https://lychee.cli.rs/) link checker configuration for Nick2bad4u repositories.

## What It Does

This package publishes a raw `lychee.toml` file plus a typed Node helper for tooling that needs to resolve that file. The config:

- keeps CI output deterministic with detailed, non-interactive reports;
- enables a short-lived successful-request cache while refusing to cache rate-limit and server-error responses;
- uses modest global and per-host concurrency for GitHub-heavy repositories;
- checks HTTP, HTTPS, local file, and mailto links while leaving mail checks disabled by default;
- excludes local/private addresses, generated outputs, dependency folders, lock files, binary assets, badges, and bot-hostile social sites.

It does not wrap Lychee in a custom CLI. Consumers should keep using Lychee's native `--config` option so repository-local overrides stay obvious.

## Install

```sh
npm install --save-dev lychee-config-nick2bad4u
```

Install Lychee separately through Chocolatey, Homebrew, Docker, GitHub Actions, or the official release binaries.

## Usage

Run Lychee directly against the packaged config:

```sh
lychee --config node_modules/lychee-config-nick2bad4u/lychee.toml .
```

For an npm script:

```json
{
 "scripts": {
  "lint:links": "lychee --config node_modules/lychee-config-nick2bad4u/lychee.toml ."
 }
}
```

Lychee accepts more than one `--config` file. Later config files take precedence, so add a repository-local override after the shared config when a repo needs `base_url`, `root_dir`, extra excludes, or different status handling:

```json
{
 "scripts": {
  "lint:links": "lychee --config node_modules/lychee-config-nick2bad4u/lychee.toml --config lychee.toml ."
 }
}
```

For list-valued settings such as `exclude`, `exclude_path`, and `extensions`, treat the local override as a full replacement unless you have verified Lychee's merge behavior for the specific option.

## Node Helper

The package exports `configPath` for scripts that need the absolute path to the packaged TOML file:

```ts
import { configPath } from "lychee-config-nick2bad4u";

console.log(configPath);
```

## Generated Files

The shared config writes Markdown output to `.lychee.report.md` and uses Lychee's `.lycheecache` cache. Add both to consuming repositories' `.gitignore` files unless you intentionally publish those artifacts.

## Verification

This repository uses strict package, lint, type, test, coverage, and publishability checks:

```sh
npm run release:verify
```

To verify the TOML parses with the installed Lychee binary without performing network checks:

```sh
npm run lint:lychee:smoke
```
