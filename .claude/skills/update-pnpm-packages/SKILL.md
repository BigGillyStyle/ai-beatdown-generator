---
name: update-pnpm-packages
description: >
  Use when the user wants to update PNPM packages, check for outdated dependencies,
  bump package versions, or keep dependencies up to date in this PNPM workspace.
  Trigger when the user says things like "update packages", "update npm packages",
  "bump dependencies", "check for outdated packages", "upgrade packages", "dependency
  updates", or anything suggesting they want to refresh third-party library versions.
  Always invoke this skill before manually editing pnpm-workspace.yaml to bump versions.
---

# Update PNPM Packages

This workflow keeps dependencies current with safe, incremental updates. It targets only minor and patch releases — changes small enough that they're unlikely to require code modifications — and skips major version bumps, which carry breaking-change risk and warrant deliberate, manual review.

## Step 1 — Verify branch and working tree

Run these two commands before doing anything else:

```bash
git branch --show-current
git status --short
```

- If the current branch is not `main`, stop immediately. Tell the user: "This workflow must run on `main`. Please switch branches and try again."
- If the working tree is dirty (any output from `git status --short`), stop. Tell the user to commit or stash their changes first.

Then pull the latest:

```bash
git pull --ff-only origin main
```

If the pull fails (non-fast-forward), stop and tell the user to sync `main` manually before proceeding.

## Step 2 — Discover outdated packages

```bash
pnpm outdated -r
```

Classify each outdated package by which semver segment changes between the installed version and the latest available:

| Type        | Example                | Action  |
| ----------- | ---------------------- | ------- |
| Patch       | `4.2.1` → `4.2.3`      | Include |
| Minor       | `4.2.1` → `4.5.0`      | Include |
| Major       | `4.x.x` → `5.x.x`      | Skip    |
| Pre-release | `4.2.1` → `4.3.0-rc.1` | Skip    |

Pre-release versions (any version containing `-alpha`, `-beta`, `-rc`, or similar suffixes) are treated as major bumps regardless of their base version number and should always be skipped.

Collect the full list of packages with minor or patch updates.

## Step 3 — Exit early if nothing to do

If no minor or patch updates are found, report:

> All packages are up to date (no minor/patch updates found).

Then stop — no branch, no edits, no PR.

## Step 4 — Enter Plan Mode with the update plan

If there are minor or patch updates, enter Plan Mode and present the plan below. Use today's actual date (ISO format: `YYYY-MM-DD`) wherever the placeholder appears.

Include a table at the top of the plan listing every package being updated:

| Package | Current | Latest | Type | File to edit |
| ------- | ------- | ------ | ---- | ------------ |

Then lay out these steps:

---

### 1. Create feature branch

```bash
git checkout -b task/update-pnpm-packages-YYYY-MM-DD
```

### 2. Bump versions in the correct files

This workspace uses a PNPM catalog — most dependency versions are centralized in `pnpm-workspace.yaml` under the `catalog:` key. However, some packages (typically root-level devDependencies) are pinned directly in `package.json` files with a semver specifier instead of `"catalog:"`.

For each package with a minor or patch update, check where its version is actually declared:

- Entry reads `"catalog:"` in a `package.json` → the version lives in `pnpm-workspace.yaml`. **Edit `pnpm-workspace.yaml`**, not the `package.json`.
- Entry has a semver specifier (e.g. `"^10.0.1"`) in a `package.json` → **this is policy drift**. Do not edit the `package.json` directly. Surface this to the user: _"Package X in `path/to/package.json` has a hardcoded version instead of `"catalog:"`. Per repo policy, all versions must live in `pnpm-workspace.yaml`. Should I migrate it to the catalog before bumping, or skip this package?"_ Wait for a decision before continuing.

Apply this check across all `package.json` files in the workspace (root and workspace packages). Never convert a `"catalog:"` reference to a hardcoded version.

### 3. Reinstall and reconcile

```bash
pnpm install
pnpm update -r
```

`pnpm install` resolves the new version constraints and updates the lockfile. `pnpm update -r` reconciles transitive/indirect packages within their declared semver ranges across all workspace packages — the lockfile diff may include packages beyond those listed in the plan table above. This is expected and intentional.

### 4. Type-check

```bash
pnpm typecheck
```

Package updates can introduce type incompatibilities. If typecheck fails, revert the version bump for the offending package in `pnpm-workspace.yaml`, then re-run typecheck before continuing. If the failing package is hardcoded in a `package.json`, route through the policy-drift decision from Step 2 (migrate to catalog or skip) instead of editing that `package.json` directly. Do not commit broken types.

### 5. Commit, push, and open a PR

Use the `commit-commands:commit-push-pr` skill.

If the `commit-commands` plugin is unavailable, run these steps manually (substitute `YYYY-MM-DD` with today's date):

```bash
git add pnpm-workspace.yaml pnpm-lock.yaml
git commit -m "chore: update pnpm packages (minor/patch) YYYY-MM-DD"
git push -u origin HEAD
gh pr create --title "chore: update pnpm packages (minor/patch) YYYY-MM-DD" --body "Routine minor/patch dependency updates (minor and patch only — no major bumps)."
```

Suggested commit message: `chore: update pnpm packages (minor/patch) YYYY-MM-DD`

Note: The Lefthook pre-commit hook runs `pnpm lint:fix` and `pnpm format` automatically on commit — no need to run them manually.
