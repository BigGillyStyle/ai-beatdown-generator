import { generateExiconCsv } from "./generate-exicon-csv.js";
import type { TagToTypeMapping, TypePriority } from "./types.js";

/**
 * Fetches the latest F3 Exicon data from the API and converts it to CSV format.
 *
 * The function will:
 * 1. Load tag-to-type mapping configuration (cached after first load)
 * 2. Fetch exercise data from https://codex.f3nation.com/api/exicon
 * 3. Validate the JSON structure (array of objects with name/description/tags)
 * 4. Normalize and clean the data (trim whitespace, replace newlines)
 * 5. Determine exercise type based on tags and mapping
 * 6. Convert to CSV format with columns: name, tags, type, description
 *
 * @param options - Optional configuration object
 * @param options.tagMapping - Optional tag-to-type mapping (for testing or custom configs)
 * @param options.typePriority - Optional type priority (for testing or custom configs)
 * @returns A CSV string with headers: name, tags, type, description
 * @throws Error if the API is unreachable or returns invalid data
 * @throws Error if the JSON cannot be parsed
 * @throws Error if mapping configuration cannot be loaded
 * @throws Error if an exercise has tags but none match the mapping
 */
export async function exiconToCsvString(options?: { tagMapping?: TagToTypeMapping; typePriority?: TypePriority }): Promise<string> {
  return generateExiconCsv(options);
}
