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
}
