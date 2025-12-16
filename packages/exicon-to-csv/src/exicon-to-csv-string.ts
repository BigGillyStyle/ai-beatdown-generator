import { generateExiconCsv } from "./generate-exicon-csv.js";

/**
 * Fetches the latest F3 Exicon data from the API and converts it to CSV format.
 *
 * The function will:
 * 1. Fetch exercise data from https://codex.f3nation.com/api/exicon
 * 2. Validate the JSON structure (array of objects with name/description/tags)
 * 3. Normalize and clean the data (trim whitespace, replace newlines)
 * 4. Convert to CSV with columns: name, description, tags
 *
 * @returns A CSV string with headers: name, description, tags
 * @throws Error if the API is unreachable or returns invalid data
 * @throws Error if the JSON cannot be parsed
 */
export async function exiconToCsvString(): Promise<string> {
  return generateExiconCsv();
}
