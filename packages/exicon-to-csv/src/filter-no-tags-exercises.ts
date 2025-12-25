import type { NormalizedExercise, NoTagsExercise } from "./types.js";

/**
 * Filters exercises that have no tags and transforms them to NoTagsExercise format.
 *
 * An exercise is considered to have no tags if its tags field is an empty string.
 * The normalizeTags() utility returns "" for both undefined and empty array cases.
 *
 * Returns exercises sorted alphabetically by name (A-Z).
 *
 * @param exercises - Array of normalized exercises from fetchExiconData()
 * @returns Object containing filtered exercises and total count
 */
export function filterNoTagsExercises(exercises: NormalizedExercise[]): {
  noTagsExercises: NoTagsExercise[];
  totalCount: number;
} {
  const filtered = exercises
    .filter((exercise) => exercise.tags === "")
    .map((exercise) => ({
      name: exercise.name,
      description: exercise.description,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    noTagsExercises: filtered,
    totalCount: exercises.length,
  };
}
