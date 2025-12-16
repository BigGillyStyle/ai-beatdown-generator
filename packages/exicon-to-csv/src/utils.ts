/**
 * Normalizes a string by trimming whitespace and replacing newlines with spaces
 */
export function normalizeString(value: string): string {
  return value.trim().replace(/\n/g, " ").replace(/\s+/g, " "); // Collapse multiple spaces into one
}

/**
 * Normalizes tags array into a comma-separated string of tag names
 * Returns empty string if no tags or if tags is not an array
 * Skips tags that don't have a valid name field
 */
export function normalizeTags(tags: unknown): string {
  if (!Array.isArray(tags) || tags.length === 0) {
    return "";
  }

  const tagNames = tags
    .filter((tag): tag is { name: string } => {
      return typeof tag === "object" && tag !== null && typeof tag.name === "string" && tag.name.trim().length > 0;
    })
    .map((tag) => normalizeString(tag.name));

  return tagNames.join(", ");
}
