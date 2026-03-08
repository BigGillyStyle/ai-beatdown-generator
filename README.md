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

- `apps/` - Standalone applications
- `packages/` - Shared libraries
  - `exicon-to-csv` - Convert F3 exicon data to CSV format

## Development

```bash
# Build all packages and apps
pnpm build

# Clean build artifacts
pnpm clean
```
