import { access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Module-level cache for repo root (lazy-loaded on first call)
let cachedRepoRoot: string | null = null;

/**
 * Finds the repository root by traversing up from the current file location.
 * Looks for pnpm-workspace.yaml as the indicator of the repo root.
 * Results are cached after the first call for performance.
 *
 * @returns The absolute path to the repository root
 * @throws Error if repository root cannot be found
 */
export async function getRepoRoot(): Promise<string> {
  // Return cached value if available
  if (cachedRepoRoot !== null) {
    return cachedRepoRoot;
  }

  const __filename = fileURLToPath(import.meta.url);
  let currentDir = dirname(__filename);

  // Traverse up until we find the repo root (indicated by pnpm-workspace.yaml)
  // Maximum 10 levels to prevent infinite loop
  for (let i = 0; i < 10; i++) {
    try {
      // Check if pnpm-workspace.yaml exists in current directory
      await access(join(currentDir, "pnpm-workspace.yaml"));
      cachedRepoRoot = currentDir;
      return currentDir;
    } catch {
      // Not found, go up one level
      const parentDir = dirname(currentDir);
      if (parentDir === currentDir) {
        // Reached filesystem root without finding repo root
        throw new Error("Could not find repository root (pnpm-workspace.yaml not found)");
      }
      currentDir = parentDir;
    }
  }

  throw new Error("Could not find repository root after checking 10 levels");
}
