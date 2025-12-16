import { parse } from "csv-parse/sync";
import { exiconToCsvString } from "./index.js";

export async function getUniqueTags(): Promise<string> {
  const csvString = await exiconToCsvString();

  const records = parse(csvString, {
    columns: true,
    skip_empty_lines: true,
  }) as Array<{ name: string; description: string; tags: string }>;

  const uniqueTags = new Set<string>();

  for (const record of records) {
    const tagsValue = record.tags;

    if (!tagsValue || tagsValue.trim() === "") {
      continue;
    }

    const tags = tagsValue.split(",").map((tag) => tag.trim());

    for (const tag of tags) {
      if (tag !== "") {
        uniqueTags.add(tag);
      }
    }
  }

  const sortedTags = Array.from(uniqueTags).sort();

  return sortedTags.join(", ");
}

const tags = await getUniqueTags();
console.log(tags);
