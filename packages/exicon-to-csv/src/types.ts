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
 * Configuration for tag-to-type mapping
 */
export interface TagToTypeMapping {
  [tagName: string]: string;
}

/**
 * Configuration for type priority
 */
export interface TypePriority {
  priorities: string[];
}
