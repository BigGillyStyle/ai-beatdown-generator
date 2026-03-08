import { json2csv } from "json-2-csv";
import { fetchExiconData } from "./fetch-exicon-data.js";
import type { TagToTypeMapping, TypePriority } from "./types.js";

/**
 * Shared logic to fetch, validate, normalize, and convert exicon data to CSV format.
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
export async function generateExiconCsv(options?: { tagMapping?: TagToTypeMapping; typePriority?: TypePriority }): Promise<string> {
  const normalizedExercises = await fetchExiconData(options);

  // Convert to CSV
  try {
    const csv = await json2csv(normalizedExercises, {
      keys: ["name", "tags", "type", "description"],
    });
    return csv;
  } catch (error) {
    throw new Error("Failed to convert exercises to CSV format", { cause: error });
  }
}
