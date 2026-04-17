# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PNPM monorepo for generating F3 workout "beatdowns" using AI. F3 is a fitness organization with unique workout formats and terminology.

**Key Concepts:**

- **Beatdown**: F3 term for a workout session with exercises
- **Exicon**: Exercise lexicon/dictionary used in F3 workouts

## Monorepo Layout

- `apps/beatdown-app/` - Primary app: Next.js 16 web application (App Router)
- `packages/exicon-to-csv/` - Utility: converts F3 exicon JSON to CSV
- PNPM workspace with centralized dependency catalog in [pnpm-workspace.yaml](pnpm-workspace.yaml)
  - All dependency versions live in `pnpm-workspace.yaml`. Individual apps/packages must not pin their own versions.

## Common Commands

```bash
# Package management (MUST use PNPM, never npm/yarn)
pnpm install          # Install all workspace dependencies

# Code quality (Lefthook pre-commit hooks run these automatically)
pnpm lint:fix         # Auto-fix linting errors
pnpm format           # Format all files with Prettier
pnpm typecheck        # Run TypeScript type checking

# beatdown-app
pnpm --filter beatdown-app run dev          # Start dev server
pnpm --filter beatdown-app run db:generate  # Generate Drizzle migration files from schema changes
pnpm --filter beatdown-app run db:migrate   # Run pending migrations against DATABASE_URL

# exicon-to-csv utility
pnpm --filter exicon-to-csv run build   # Build package
pnpm --filter exicon-to-csv run fetch   # Fetch exicon data from F3 API
```

## beatdown-app Architecture

**Stack:**

- Next.js 16 (App Router), React 19, TypeScript
- Drizzle ORM + Neon PostgreSQL
- Auth: Better Auth (passwordless magic links)
- AI: Anthropic Claude API (`ANTHROPIC_API_KEY`)
- Email: Resend
- UI: Tailwind CSS v4 + shadcn/ui
- Deployment: Vercel

**Non-obvious gotchas:**

- `src/proxy.ts` is the Next.js middleware (renamed from `middleware.ts` in v16). It exports a `proxy` function, not `middleware`.
- `src/db/index.ts` exposes `getDb()` — lazy-initializes DB connection so `next build` succeeds without `DATABASE_URL` present.
- `src/lib/env.ts` is the single entry point for all env vars. `NEXT_PUBLIC_*` vars must use dot notation (`process.env.NEXT_PUBLIC_FOO`, not bracket notation) for Next.js build-time inlining.
- Path alias: `@/*` maps to `./src/*`

**Route groups:**

- `(admin)/` — admin-only pages: exercises, exicon, routine-templates, users
- `(auth)/` — unauthenticated pages: sign-in, pending
- `(user)/` — authenticated standard-user pages: generate

**User model:**

- Roles: `admin`, `standard_user`
- Approval flow: `pending` → `approved` / `rejected`
- All routes protected by default via proxy.ts matcher; public paths explicitly allowlisted

**IMPORTANT:** Before writing any Next.js code for beatdown-app, read the bundled docs:

@apps/beatdown-app/AGENTS.md

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

**Testing (non-Next.js packages only):**

- Use Node.js test runner (`node --test`)
- Tests must be compiled to `dist/` before running

**Development Environment:**

- All code must be executable on Mac, Linux, and Windows

## Adding Non-Next.js Packages

1. Create directory under `apps/` or `packages/`
2. Add `package.json` with `"type": "module"`, catalog deps, `"main": "dist/index.js"`
3. Add `tsconfig.json` extending `@tsconfig/node24/tsconfig.json` with `outDir: ./dist`, `rootDir: ./src`
4. Place source in `src/`; tests colocated as `*.test.ts`

Note: beatdown-app intentionally does NOT follow this pattern — see [apps/beatdown-app/CLAUDE.md](apps/beatdown-app/CLAUDE.md).

## Code Quality & Pre-commit Hooks

Lefthook runs automatically on commit (in sequence):

1. Lint and fix staged TS/JS files (`pnpm lint:fix`)
2. Format staged files with Prettier (`pnpm format`)
3. Type check entire workspace (`pnpm typecheck`)

**ESLint:** TypeScript recommended, type-aware, explicit return types disabled, unused vars warn (`_` prefix allowed), test files allow `any`.

**Prettier:** 2-space indent, 180-char line width, LF, semicolons, trailing commas, single quotes.

## Feature Planning

Features and bugs tracked in GitHub Issues as epics and stories. Check for a corresponding issue and reference it in commits before implementing substantial changes.

## Development Environment

**Required:**

- Node.js 24.15.0+ (see [.nvmrc](.nvmrc))
- PNPM 10.33.0+ (enforced by `packageManager` field)

Use `nvm use` to activate the correct Node version.
