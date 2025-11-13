import { json2csv } from "json-2-csv";

/**
 * ExiconExercise represents a single exercise from the F3 Exicon API
 */
interface ExiconExercise {
  name: string;
  description: string;
  tags?: Array<{
    id: string;
    name: string;
  }>;
}

/**
 * Normalized exercise with cleaned data ready for CSV conversion
 */
interface NormalizedExercise {
  name: string;
  description: string;
  tags: string;
}

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
export async function exiconToCsv(): Promise<string> {
  const API_URL = "https://codex.f3nation.com/api/exicon";
  const TIMEOUT_MS = 10000;

  let response: Response;

  try {
    // Fetch with timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    response = await fetch(API_URL, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `API request failed with status ${response.status}: ${response.statusText}`
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error(`API request timed out after ${TIMEOUT_MS}ms`);
      }
      throw new Error(`Failed to fetch exicon data: ${error.message}`);
    }
    throw new Error("Failed to fetch exicon data: Unknown error");
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Failed to parse JSON response from API");
  }

  // Validate that data is an array
  if (!Array.isArray(data)) {
    throw new Error("Invalid exicon data: expected an array of exercises");
  }

  // Validate and normalize each exercise
  const normalizedExercises: NormalizedExercise[] = [];

  for (let i = 0; i < data.length; i++) {
    const exercise = data[i];

    // Validate required fields
    if (typeof exercise !== "object" || exercise === null) {
      throw new Error(`Invalid exercise at index ${i}: expected an object`);
    }

    if (typeof exercise.name !== "string") {
      throw new Error(
        `Invalid exercise at index ${i}: missing or invalid 'name' field`
      );
    }

    if (typeof exercise.description !== "string") {
      throw new Error(
        `Invalid exercise at index ${i}: missing or invalid 'description' field`
      );
    }

    // Normalize the data
    const normalizedExercise: NormalizedExercise = {
      name: normalizeString(exercise.name),
      description: normalizeString(exercise.description),
      tags: normalizeTags(exercise.tags),
    };

    normalizedExercises.push(normalizedExercise);
  }

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

/**
 * Normalizes a string by trimming whitespace and replacing newlines with spaces
 */
function normalizeString(value: string): string {
  return value.trim().replace(/\n/g, " ").replace(/\s+/g, " "); // Collapse multiple spaces into one
}

/**
 * Normalizes tags array into a comma-separated string of tag names
 * Returns empty string if no tags or if tags is not an array
 * Skips tags that don't have a valid name field
 */
function normalizeTags(tags: unknown): string {
  if (!Array.isArray(tags) || tags.length === 0) {
    return "";
  }

  const tagNames = tags
    .filter((tag): tag is { name: string } => {
      return (
        typeof tag === "object" &&
        tag !== null &&
        typeof tag.name === "string" &&
        tag.name.trim().length > 0
      );
    })
    .map((tag) => normalizeString(tag.name));

  return tagNames.join(", ");
}
