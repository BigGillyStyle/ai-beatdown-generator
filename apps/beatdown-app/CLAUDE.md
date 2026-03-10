@AGENTS.md

## tsconfig.json Exception

This app does NOT extend `@tsconfig/node24/tsconfig.json` and does NOT use `outDir: ./dist`.

Next.js has incompatible requirements:

- `noEmit: true` is required (Next.js manages compilation — `outDir` is contradictory)
- Compiles to `.next/`, never `dist/`
- Requires `moduleResolution: bundler` and the `next` TypeScript plugin

The root CLAUDE.md guideline (extend node24, outDir/rootDir) applies to non-Next.js packages only.
