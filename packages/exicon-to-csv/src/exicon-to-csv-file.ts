import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { generateExiconCsv } from "./generate-exicon-csv.js";

/**
 * Fetches the latest F3 Exicon data from the API and writes it to a CSV file.
 *
 * The function will:
 * 1. Fetch exercise data from https://codex.f3nation.com/api/exicon
 * 2. Validate the JSON structure (array of objects with name/description/tags)
 * 3. Normalize and clean the data (trim whitespace, replace newlines)
 * 4. Convert to CSV with columns: name, description, tags
 * 5. Write the CSV data to a file
 *
 * @param filename - Optional filename or path for the CSV file. If not provided, defaults to "exicon_YYYY-MM-DD.csv" in the current working directory
 * @returns The absolute path to the written CSV file
 * @throws Error if the API is unreachable or returns invalid data
 * @throws Error if the JSON cannot be parsed
 * @throws Error if the file cannot be written
 */
export async function exiconToCsvFile(filename?: string): Promise<string> {
  const csv = await generateExiconCsv();

  // Generate default filename if not provided
  const finalFilename = filename ?? `exicon_${new Date().toISOString().substring(0, 10)}.csv`;

  // Resolve to absolute path
  const absolutePath = resolve(finalFilename);

  // Write the file with improved error handling
  try {
    await writeFile(absolutePath, csv, "utf-8");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to write CSV file to ${absolutePath}: ${error.message}`);
    }
    throw new Error(`Failed to write CSV file to ${absolutePath}: Unknown error`);
  }

  return absolutePath;
}
