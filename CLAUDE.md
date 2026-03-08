# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PNPM monorepo for generating F3 workout "beatdowns" using AI. F3 is a fitness organization with unique workout formats and terminology.

**Key Concepts:**

- **Beatdown**: F3 term for a workout session with exercises
- **Exicon**: Exercise lexicon/dictionary used in F3 workouts

## Common Commands

```bash
# Package management (MUST use PNPM, never npm/yarn)
pnpm install          # Install all workspace dependencies
pnpm build            # Build all apps/packages recursively
pnpm clean            # Clean all dist/ directories
pnpm test             # Run all tests recursively

# Code quality (Lefthook pre-commit hooks run these automatically)
pnpm lint             # Check for linting errors
pnpm lint:fix         # Auto-fix linting errors
pnpm format           # Format all files with Prettier
pnpm format:check     # Check formatting without modifying
pnpm typecheck        # Run TypeScript type checking

# Package-specific commands (run from package directory or use pnpm filter)
pnpm --filter exicon-to-csv run test    # Test specific package
pnpm --filter exicon-to-csv run build   # Build specific package
pnpm --filter exicon-to-csv run fetch   # Fetch exicon data (exicon-to-csv)
pnpm --filter exicon-to-csv run tags    # Get unique tags (exicon-to-csv)
```

## Architecture

**Monorepo Layout:**

- `apps/` - Standalone applications (currently empty)
- `packages/` - Shared libraries
  - `exicon-to-csv` - Convert F3 exicon JSON data to CSV format
- PNPM workspace with centralized dependency catalog in [pnpm-workspace.yaml](pnpm-workspace.yaml)
  - All dependency versions should be referenced in pnpm-workspace.yaml. None of the individual apps/ or packages/ should refer to their own dependency versions.

**Key Design Decisions:**

- All packages use ES modules (`"type": "module"`)
- Node 24 LTS required (`>=24.11.1`)
- TypeScript 5.7.2 via catalog
- Build pattern: `src/` → `dist/` compilation
- Dependencies managed via PNPM catalog for version consistency

## Coding Conventions

**Architectural Principles:**

- Prefer functional code over classes unless stateful behavior needed
- Prefer simple, clear implementations over complex abstractions EVEN IF this results in longer code
- Keep functions small and focused; break complex logic into helper functions

**File Organization Rules:**

- Only one exported function per file
- Exported function must be at the top of the file (before helper functions)
- TypeScript types/interfaces in separate `types.ts` files, not colocated with implementation
- File names should reflect their primary exported function or purpose
- Tests colocated with source files (`*.test.ts`)

**Testing:**

- Use Node.js test runner (`node --test`) - see https://nodejs.org/api/test.html
- Tests must be compiled to `dist/` before running (run from compiled JS, not TS)

**Development Environment**

- All code must be executable on Mac, Linux, and Windows

## Feature Planning

Features and bugs are tracked as epics and stories in GitHub Issues. Before implementing substantial changes, check for a corresponding issue and reference it in commits.

## Adding Apps/Packages

1. Create directory under `apps/` or `packages/`
2. Add `package.json` with:
   - `"type": "module"`
   - Catalog dependencies (e.g., `"typescript": "catalog:"`)
   - `"main": "dist/index.js"` and `"exports": { ".": "./dist/index.js" }`
   - Scripts: `build` (tsc), `clean` (rm -rf dist), `test` (node --test)
3. Add `tsconfig.json` extending `@tsconfig/node24/tsconfig.json`
   - `"outDir": "./dist"` and `"rootDir": "./src"`
4. Place source files in `src/` directory
5. Add recursive script to root package.json if needed

## Code Quality & Pre-commit Hooks

**Lefthook Configuration:**
Pre-commit hooks automatically (in sequence):

1. Lint and fix staged TS/JS files (`pnpm lint:fix`)
2. Format staged files with Prettier (`pnpm format`)
3. Run type checking on entire workspace (`pnpm typecheck`)

Modified files are automatically re-staged after fixes.

**ESLint Configuration ([eslint.config.mjs](eslint.config.mjs)):**

- TypeScript recommended rules with type-aware linting
- Explicit return types disabled (aligns with functional style)
- Unused variables warn (allows `_` prefix for intentionally unused)
- Test files allow `any` type for mocking

**Prettier Configuration ([.prettierrc.json](.prettierrc.json)):**

- 2-space indentation
- 180 character print width
- LF line endings
- Semicolons, trailing commas, single quotes

## Technology Stack

**Core:**

- TypeScript 5.7.2 (workspace-wide via catalog)
- Node 24 LTS with ES modules
- PNPM 10.22+ (enforced via packageManager field)

**Catalog Dependencies:**
Available in [pnpm-workspace.yaml](pnpm-workspace.yaml):

- `typescript`, `@tsconfig/node24`, `@types/node`
- `json-2-csv`, `csv-parse`
- `tsx` (TypeScript execution for scripts)

## Current Packages

**exicon-to-csv:**
Converts F3 exicon JSON data to CSV format. Key exports in [packages/exicon-to-csv/src/index.ts](packages/exicon-to-csv/src/index.ts):

- Functions to fetch exicon data from F3 API
- Convert exicon JSON to CSV string or file
- Extract unique tags from exicon data
- Scripts for fetching data and analyzing tags

## Development Environment

**Required:**

- Node.js 24.14.0+ (see [.nvmrc](.nvmrc))
- PNPM 10.26.0+ (enforced by packageManager field)

**Recommended:**

- Use `nvm use` to switch to correct Node version
- Run `pnpm install` after pulling changes
- Run `pnpm build` before running tests (tests run on compiled output)
