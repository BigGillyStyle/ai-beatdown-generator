import { writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import { generateExiconCsv } from "./generate-exicon-csv.js";
import { getRepoRoot } from "./get-repo-root.js";

/**
 * Fetches the latest F3 Exicon data from the API and writes it to a CSV file.
 *
 * The function will:
 * 1. Load tag-to-type mapping configuration
 * 2. Fetch exercise data from https://codex.f3nation.com/api/exicon
 * 3. Validate the JSON structure (array of objects with name/description/tags)
 * 4. Normalize and clean the data (trim whitespace, replace newlines)
 * 5. Determine exercise type based on tags and mapping
 * 6. Convert to CSV with columns: name, tags, type, description
 * 7. Write the CSV data to a file in the output/ directory
 *
 * @param filename - Optional filename or path for the CSV file. If not provided, defaults to "output/exicon_YYYY-MM-DD.csv" at the repo root
 * @returns The absolute path to the written CSV file
 * @throws Error if the API is unreachable or returns invalid data
 * @throws Error if the JSON cannot be parsed
 * @throws Error if mapping configuration cannot be loaded
 * @throws Error if an exercise has tags but none match the mapping
 * @throws Error if the file cannot be written
 */
export async function exiconToCsvFile(filename?: string): Promise<string> {
  const csv = await generateExiconCsv();

  // Generate default filename with output/ directory at repo root if not provided
  let finalFilename: string;
  if (filename) {
    finalFilename = filename;
  } else {
    const repoRoot = await getRepoRoot();
    finalFilename = join(repoRoot, "output", `exicon_${new Date().toISOString().substring(0, 10)}.csv`);
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

  return absolutePath;
}
