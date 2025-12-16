# AI Beatdown Generator - Copilot Instructions

## Project Overview

This is a PNPM monorepo for generating F3 workout "beatdowns" using AI. F3 is a fitness organization that uses unique workout formats and terminology. The project is in early development with infrastructure in place but minimal implementation.

## Architecture & Structure

**Monorepo Layout:**

- `apps/` - Standalone applications (currently empty)
- `packages/` - Shared libraries (currently: `exicon-to-csv` for converting exercise data to CSV)
- Managed via PNPM workspace with centralized dependency catalog in `pnpm-workspace.yaml`

**Key Design Decisions:**

- Each app is independently buildable TypeScript with ES modules (`"type": "module"`)
- Uses Node 24 LTS (`@tsconfig/node24`) with strict version requirements (`>=24.11.1`)
- Outputs to `dist/` directories with `src/` → `dist/` compilation pattern
- Dependencies managed through PNPM catalog for version consistency across workspace

**Coding Conventions:**

- Prefer functional code over classes unless stateful behavior is needed
- Prefer simple, clear implementations over complex abstractions EVEN IF this results in longer code
- Keep functions small and focused; break down complex logic into helper functions
- Only one exported function per file
- Exported function must be at the top of the file (before helper functions)
- TypeScript types and interfaces must be in separate `types.ts` files, not colocated with implementation
- Use descriptive names for functions and variables to enhance readability
- File names should reflect their primary exported function or purpose
- Create tests using Node test runner (https://nodejs.org/api/test.html)

## Development Workflow

**Spec-Driven Development:**

This project uses lightweight specs stored in `specs/` for substantial changes. Before implementing features:

1. Check if a spec exists: `specs/YYYY-MM-DD--description.md`
2. If user mentions "implement the spec" or references a spec file, read it fully
3. Use the spec's "Acceptance Criteria" section as your implementation checklist
4. Follow the "How" section for approach and technical details
5. Small changes (typos, version bumps, single-line fixes) don't need specs

**When implementing from a spec:**

- Read the entire spec file first to understand context
- Prioritize acceptance criteria - those are the testable requirements
- Use specified file paths, CLI signatures, and data structures exactly as documented
- If the spec has open questions or unclear areas, ask before proceeding

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
- Packages export via `exports` field in package.json
- Build outputs are git-ignored (`dist/`, `.tsbuildinfo`)
- Tests use Node.js test runner with recursive pattern

**File Organization:**

- Source code in `src/` subdirectories
- Configuration at package root (package.json, tsconfig.json)
- Tests colocated with source files (\*.test.ts)
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
