import type { TagToTypeMapping, TypePriority } from "./types.js";

/**
 * Determines the exercise type based on its tags using the provided mapping and priority.
 *
 * Rules:
 * - If exercise has no tags, returns empty string
 * - If exercise has tags but none match the mapping, throws error
 * - If multiple tags map to the same type, returns that type
 * - If multiple tags map to different types, returns the highest priority type
 * - Tag matching is case-insensitive
 *
 * @param tags - Array of tag objects with id and name properties
 * @param tagMapping - Map of tag names (lowercase) to type names
 * @param typePriority - Priority configuration with ordered types array
 * @returns The determined exercise type (or empty string if no tags)
 * @throws Error if tags exist but none match the mapping
 */
export function determineExerciseType(tags: Array<{ id: string; name: string }> | undefined, tagMapping: TagToTypeMapping, typePriority: TypePriority): string {
  // No tags = empty type
  if (!tags || tags.length === 0) {
    return "";
  }

  // Filter valid tags and extract names
  const validTagNames = tags.filter((tag) => typeof tag.name === "string" && tag.name.trim().length > 0).map((tag) => tag.name.trim());

  if (validTagNames.length === 0) {
    return "";
  }

  // Normalize tag mapping keys to lowercase for case-insensitive matching
  const normalizedMapping: { [key: string]: string } = {};
  for (const [tagName, type] of Object.entries(tagMapping)) {
    // Skip the "comment" key used for documentation
    if (tagName === "comment") continue;
    normalizedMapping[tagName.toLowerCase()] = type;
  }

  // Find all matching types for this exercise's tags
  const matchedTypes = new Set<string>();

  for (const tagName of validTagNames) {
    const normalizedTagName = tagName.toLowerCase();
    const type = normalizedMapping[normalizedTagName];

    if (type) {
      matchedTypes.add(type);
    }
  }

  // Error if tags exist but none match
  if (matchedTypes.size === 0) {
    const tagList = validTagNames.join(", ");
    throw new Error(`Exercise has tags [${tagList}] but none match the tag-to-type mapping. ` + `Please add mappings for these tags or remove them from the exercise.`);
  }

  // If only one type matched, return it
  if (matchedTypes.size === 1) {
    return Array.from(matchedTypes)[0];
  }

  // Multiple types matched - use priority to resolve
  // Find the first type in the priority list that exists in matchedTypes
  for (const priorityType of typePriority.priorities) {
    if (matchedTypes.has(priorityType)) {
      return priorityType;
    }
  }

  // Fallback: if no priority match found, return the first matched type
  // This handles the case where a type is in the mapping but not in the priority list
  return Array.from(matchedTypes)[0];
}
