/**
 * ExiconExercise represents a single exercise from the F3 Exicon API
 */
export interface ExiconExercise {
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
export interface NormalizedExercise {
  name: string;
  description: string;
  tags: string;
  type: string;
}

/**
 * Exercise with no tags, containing only name and description for CSV export
 */
export interface NoTagsExercise {
  name: string;
  description: string;
}

/**
 * Configuration for tag-to-type mapping.
 * Maps tag names to exercise types with case-insensitive matching.
 *
 * Keys: Tag names (can be any case, normalized to lowercase during matching)
 * Values: Exercise type names
 * Special key "comment": Optional documentation field, ignored during mapping
 */
export interface TagToTypeMapping {
  [tagName: string]: string;
}

/**
 * Configuration for type priority used in conflict resolution.
 * When an exercise has multiple tags that map to different types,
 * the type appearing first in the priorities array is selected.
 *
 * Earlier entries = higher priority
 */
export interface TypePriority {
  priorities: string[];
}
