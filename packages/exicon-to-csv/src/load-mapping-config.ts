import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { TagToTypeMapping, TypePriority } from "./types.js";

/**
 * Loads and validates the tag-to-type mapping and type priority configuration files.
 *
 * @returns Object containing tagMapping and typePriority
 * @throws Error if files cannot be read or parsed
 * @throws Error if JSON structure is invalid
 */
export async function loadMappingConfig(): Promise<{
  tagMapping: TagToTypeMapping;
  typePriority: TypePriority;
}> {
  // Get the directory of this file to resolve relative paths
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const tagMappingPath = join(__dirname, "tag-to-type-mapping.json");
  const typePriorityPath = join(__dirname, "type-priority.json");

  let tagMapping: TagToTypeMapping;
  let typePriority: TypePriority;

  // Load tag-to-type mapping
  try {
    const tagMappingContent = await readFile(tagMappingPath, "utf-8");
    tagMapping = JSON.parse(tagMappingContent);

    // Validate structure (should be object with string values)
    if (typeof tagMapping !== "object" || tagMapping === null) {
      throw new Error("tag-to-type-mapping.json must be a JSON object");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load tag-to-type mapping: ${error.message}`);
    }
    throw new Error("Failed to load tag-to-type mapping: Unknown error");
  }

  // Load type priority
  try {
    const typePriorityContent = await readFile(typePriorityPath, "utf-8");
    typePriority = JSON.parse(typePriorityContent);

    // Validate structure (should have priorities array)
    if (!Array.isArray(typePriority.priorities)) {
      throw new Error("type-priority.json must contain a 'priorities' array");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load type priority config: ${error.message}`);
    }
    throw new Error("Failed to load type priority config: Unknown error");
  }

  return { tagMapping, typePriority };
}
