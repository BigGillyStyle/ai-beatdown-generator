import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { TagToTypeMapping, TypePriority } from "./types.js";

/**
 * Internal function to load mapping configuration from specified file paths.
 * Used by both production and test configuration loaders.
 *
 * @param tagMappingFilename - Name of the tag-to-type mapping JSON file
 * @param typePriorityFilename - Name of the type priority JSON file
 * @returns Object containing tagMapping and typePriority
 * @throws Error if files cannot be read or parsed
 * @throws Error if JSON structure is invalid
 */
export async function loadMappingConfigFromFiles(
  tagMappingFilename: string,
  typePriorityFilename: string
): Promise<{
  tagMapping: TagToTypeMapping;
  typePriority: TypePriority;
}> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const tagMappingPath = join(__dirname, tagMappingFilename);
  const typePriorityPath = join(__dirname, typePriorityFilename);

  let tagMapping: TagToTypeMapping;
  let typePriority: TypePriority;

  // Load tag-to-type mapping
  try {
    const tagMappingContent = await readFile(tagMappingPath, "utf-8");
    tagMapping = JSON.parse(tagMappingContent);

    // Validate structure (should be object with string values)
    if (typeof tagMapping !== "object" || tagMapping === null) {
      throw new Error(`${tagMappingFilename} must be a JSON object`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load ${tagMappingFilename}: ${error.message}`);
    }
    throw new Error(`Failed to load ${tagMappingFilename}: Unknown error`);
  }

  // Load type priority
  try {
    const typePriorityContent = await readFile(typePriorityPath, "utf-8");
    typePriority = JSON.parse(typePriorityContent);

    // Validate structure (should have priorities array)
    if (!Array.isArray(typePriority.priorities)) {
      throw new Error(`${typePriorityFilename} must contain a 'priorities' array`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load ${typePriorityFilename}: ${error.message}`);
    }
    throw new Error(`Failed to load ${typePriorityFilename}: Unknown error`);
  }

  return { tagMapping, typePriority };
}
