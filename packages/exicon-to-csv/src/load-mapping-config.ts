import { loadMappingConfigFromFiles } from "./load-mapping-config-internal.js";
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
  return loadMappingConfigFromFiles("tag-to-type-mapping.json", "type-priority.json");
}
