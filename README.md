# ai-beatdown-generator

PNPM workspace for AI beatdown generation tools.

## Requirements

- Node.js 24 (LTS)
- PNPM 10.22 or later

## Setup

```bash
# Install PNPM if you haven't already
https://pnpm.io/installation

# Install dependencies
pnpm install
```

## Workspace Structure

- `apps/` - Applications
  - `exicon-to-csv` - Convert exicon data to CSV format
- `packages/` - Shared packages

## Spec-Driven Development

Substantial changes are proposed and reviewed via Markdown specs stored under `specs/`.

Spec naming convention:

```
specs/<area>/YYYY-MM-DD--kebab-case-slug.md
```

See `specs/README.md` for guidelines, required sections, status lifecycle, and authoring workflow.

For small trivial changes (typos, minor version bumps) a spec is not required.

## Development

```bash
# Build all packages and apps
pnpm build

# Clean build artifacts
pnpm clean
```
