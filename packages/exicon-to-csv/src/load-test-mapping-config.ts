import { loadMappingConfigFromFiles } from "./load-mapping-config-internal.js";
import type { TagToTypeMapping, TypePriority } from "./types.js";

/**
 * Loads and validates the TEST tag-to-type mapping and type priority configuration files.
 * This is used only for testing and loads test-specific mapping files.
 *
 * @returns Object containing tagMapping and typePriority
 * @throws Error if files cannot be read or parsed
 * @throws Error if JSON structure is invalid
 */
export async function loadTestMappingConfig(): Promise<{
  tagMapping: TagToTypeMapping;
  typePriority: TypePriority;
}> {
  return loadMappingConfigFromFiles("test-tag-to-type-mapping.json", "test-type-priority.json");
}
