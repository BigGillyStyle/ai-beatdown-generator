import { writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import { generateNoTagsCsv } from "./generate-no-tags-csv.js";
import { getRepoRoot } from "./get-repo-root.js";

/**
 * Fetches exicon data and writes exercises without tags to a CSV file.
 *
 * The function will:
 * 1. Fetch and normalize all exercises
 * 2. Filter to only exercises with no tags
 * 3. Sort alphabetically by name
 * 4. Convert to CSV with columns: name, description
 * 5. Write to output/exicon-no-tags_YYYY-MM-DD.csv at repo root
 * 6. Print summary to console showing count of no-tags exercises vs total
 *
 * @param filename - Optional filename or path for the CSV file. If not provided, defaults to "output/exicon-no-tags_YYYY-MM-DD.csv" at the repo root
 * @returns The absolute path to the written CSV file
 * @throws Error if the API is unreachable or returns invalid data
 * @throws Error if the JSON cannot be parsed
 * @throws Error if mapping configuration cannot be loaded
 * @throws Error if the file cannot be written
 */
export async function noTagsToCsvFile(filename?: string): Promise<string> {
  const { csv, noTagsCount, totalCount } = await generateNoTagsCsv();

  // Generate default filename with output/ directory at repo root if not provided
  let finalFilename: string;
  if (filename) {
    finalFilename = filename;
  } else {
    const repoRoot = await getRepoRoot();
    finalFilename = join(repoRoot, "output", `exicon-no-tags_${new Date().toISOString().substring(0, 10)}.csv`);
  }

  // Resolve to absolute path
  const absolutePath = resolve(finalFilename);

  // Ensure the directory exists
  const directory = dirname(absolutePath);
  try {
    await mkdir(directory, { recursive: true });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create directory ${directory}: ${error.message}`, { cause: error });
    }
    throw new Error(`Failed to create directory ${directory}: Unknown error`, { cause: error });
  }

  // Write the file with improved error handling
  try {
    await writeFile(absolutePath, csv, "utf-8");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to write CSV file to ${absolutePath}: ${error.message}`, { cause: error });
    }
    throw new Error(`Failed to write CSV file to ${absolutePath}: Unknown error`, { cause: error });
  }

  // Print summary to console
  console.log(`Found ${noTagsCount} exercises without tags out of ${totalCount} total exercises. Wrote to ${absolutePath}`);

  return absolutePath;
}
