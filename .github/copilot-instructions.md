# AI Beatdown Generator - Copilot Instructions

## Project Overview

This is a PNPM monorepo for generating F3 workout "beatdowns" using AI. F3 is a fitness organization that uses unique workout formats and terminology. The project is in early development with infrastructure in place but minimal implementation.

## Architecture & Structure

**Monorepo Layout:**

- `apps/` - Standalone applications (currently: `exicon-to-csv` for converting exercise data)
- `packages/` - Shared libraries (empty, ready for common code)
- Managed via PNPM workspace with centralized dependency catalog in `pnpm-workspace.yaml`

**Key Design Decisions:**

- Each app is independently buildable TypeScript with ES modules (`"type": "module"`)
- Uses Node 24 LTS (`@tsconfig/node24`) with strict version requirements (`>=24.11.1`)
- Outputs to `dist/` directories with `src/` → `dist/` compilation pattern
- Dependencies managed through PNPM catalog for version consistency across workspace

## Development Workflow

**Package Manager:**

- **MUST use PNPM** (v10.22+), never npm or yarn
- `packageManager` field enforces pnpm@10.22.0 with specific hash

**Common Commands:**

```bash
pnpm install          # Install all workspace dependencies
pnpm build            # Build all apps/packages recursively (-r flag)
pnpm clean            # Clean all dist/ directories
```

**Adding Apps/Packages:**

1. Create directory under `apps/` or `packages/`
2. Include `package.json` with `"type": "module"` and catalog dependencies
3. Add TypeScript config extending `@tsconfig/node24/tsconfig.json`
4. Use `"outDir": "./dist"` and `"rootDir": "./src"` in tsconfig
5. Implement `build` (tsc) and `clean` (rm -rf dist) scripts

## Technology Stack

**Core:**

- TypeScript 5.7.2 (workspace-wide via catalog)
- Node 24 LTS with ES modules

**TypeScript Configuration:**

- Extends `@tsconfig/node24` base config
- Strict compilation with Node 24 features
- Source in `src/`, output in `dist/`
- Excludes `node_modules` and `dist` from compilation

## Domain Context: F3 & Beatdowns

This project generates workout plans for F3 (Fitness, Fellowship, Faith). Key concepts:

- **Beatdown**: F3 term for a workout session with exercises
- **Exicon**: Exercise lexicon/dictionary used in F3 workouts
- Initial focus: Converting exicon JSON data to CSV format for AI processing

## Patterns & Conventions

**Project-Specific:**

- All packages use catalog versions (e.g., `"typescript": "catalog:"`)
- Apps are standalone executables with entry at `dist/index.js`
- Build outputs are git-ignored (`dist/`, `.tsbuildinfo`)
- No test infrastructure yet (tests should follow workspace recursive pattern when added)

**File Organization:**

- Source code in `src/` subdirectories (not yet implemented in exicon-to-csv)
- Configuration at package root (package.json, tsconfig.json)
- No linting/formatting setup yet (consider when adding)

## Integration Points

**Future Considerations:**

- Shared packages for common F3/beatdown logic should go in `packages/`
- AI integration points not yet defined (likely future apps in `apps/`)

## Quick Start for New Features

1. Determine if feature is an app (standalone) or package (shared library)
2. For new apps: scaffold under `apps/` with full package.json + tsconfig
3. For new packages: same process but in `packages/`, exports via main/exports
4. Always use catalog dependencies for consistency
5. Add recursive script to root package.json if needed (e.g., test, lint)
6. Source files must be in `src/` directory for compilation to work

## Current State

**Implemented:**

- Monorepo structure with PNPM workspace
- exicon-to-csv app scaffolded (package.json, tsconfig only - no source code yet)
- Build/clean infrastructure at root level

**Not Yet Implemented:**

- No source code in any apps/packages
- No testing framework
- No linting/formatting (ESLint, Prettier)
- No CI/CD configuration
- No environment variable handling patterns
