# Contributing

## Setup

```bash
npm ci
npm run build
```

Install the Lychee CLI separately if you want to run the TOML smoke check or full repository link check locally.

## Before Opening A Pull Request

```bash
npm run lint:lychee:smoke
npm run lint:all
npm run typecheck
npm run test
npm run package:check
```

Use the commit style documented in `.github/agent-commit-message-instructions.md`.
