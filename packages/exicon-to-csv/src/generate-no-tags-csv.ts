import { json2csv } from "json-2-csv";
import { fetchExiconData } from "./fetch-exicon-data.js";
import { filterNoTagsExercises } from "./filter-no-tags-exercises.js";

/**
 * Fetches exicon data and generates a CSV containing only exercises without tags.
 *
 * The function will:
 * 1. Fetch and normalize all exercises using fetchExiconData()
 * 2. Filter to only exercises with no tags (tags === "")
 * 3. Sort alphabetically by name
 * 4. Convert to CSV with columns: name, description
 *
 * @returns Object containing CSV string, count of no-tags exercises, and total count
 * @throws Error if the API is unreachable or returns invalid data
 * @throws Error if the JSON cannot be parsed
 * @throws Error if mapping configuration cannot be loaded
 * @throws Error if CSV conversion fails
 */
export async function generateNoTagsCsv(): Promise<{
  csv: string;
  noTagsCount: number;
  totalCount: number;
}> {
  const normalizedExercises = await fetchExiconData();
  const { noTagsExercises, totalCount } = filterNoTagsExercises(normalizedExercises);

  // Convert to CSV with only name and description columns
  try {
    const csv = await json2csv(noTagsExercises, {
      keys: ["name", "description"],
    });

    return {
      csv,
      noTagsCount: noTagsExercises.length,
      totalCount,
    };
  } catch (_error) {
    throw new Error("Failed to convert exercises to CSV format");
  }
}
