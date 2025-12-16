import type { NormalizedExercise } from "./types.js";
import { normalizeString, normalizeTags } from "./utils.js";
import { loadMappingConfig } from "./load-mapping-config.js";
import { determineExerciseType } from "./determine-exercise-type.js";

/**
 * Fetches the latest F3 Exicon data from the API and returns normalized exercise data.
 *
 * This function provides direct access to the normalized exercise data without CSV conversion,
 * useful for consumers who want to process the data programmatically.
 *
 * The function will:
 * 1. Load tag-to-type mapping configuration
 * 2. Fetch exercise data from https://codex.f3nation.com/api/exicon
 * 3. Validate the JSON structure (array of objects with name/description/tags)
 * 4. Normalize and clean the data (trim whitespace, replace newlines, convert tags to string)
 * 5. Determine exercise type based on tags and mapping
 *
 * @returns An array of normalized exercises with name, description, tags, and type
 * @throws Error if the API is unreachable or returns invalid data
 * @throws Error if the JSON cannot be parsed
 * @throws Error if mapping configuration cannot be loaded
 * @throws Error if an exercise has tags but none match the mapping
 */
export async function fetchExiconData(): Promise<NormalizedExercise[]> {
  // Load mapping configuration first
  const { tagMapping, typePriority } = await loadMappingConfig();
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
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
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
  } catch (_error) {
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
      throw new Error(`Invalid exercise at index ${i}: missing or invalid 'name' field`);
    }

    if (typeof exercise.description !== "string") {
      throw new Error(`Invalid exercise at index ${i}: missing or invalid 'description' field`);
    }

    // Determine type BEFORE normalizing tags (need raw array)
    const type = determineExerciseType(exercise.tags, tagMapping, typePriority);

    // Normalize the data
    const normalizedExercise: NormalizedExercise = {
      name: normalizeString(exercise.name),
      description: normalizeString(exercise.description),
      tags: normalizeTags(exercise.tags),
      type: type,
    };

    normalizedExercises.push(normalizedExercise);
  }

  return normalizedExercises;
}
