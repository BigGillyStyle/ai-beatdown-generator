import { json2csv } from "json-2-csv";
import { fetchExiconData } from "./fetch-exicon-data.js";

/**
 * Shared logic to fetch, validate, normalize, and convert exicon data to CSV format.
 *
 * @returns A CSV string with headers: name, description, tags
 * @throws Error if the API is unreachable or returns invalid data
 * @throws Error if the JSON cannot be parsed
 */
export async function generateExiconCsv(): Promise<string> {
  const normalizedExercises = await fetchExiconData();

  // Convert to CSV
  try {
    const csv = await json2csv(normalizedExercises, {
      keys: ["name", "description", "tags"],
    });
    return csv;
  } catch (error) {
    throw new Error("Failed to convert exercises to CSV format");
  }
}
