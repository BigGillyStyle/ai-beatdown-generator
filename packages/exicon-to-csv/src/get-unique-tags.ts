import { fetchExiconData } from "./index.js";

export async function getUniqueTags(): Promise<string> {
  const exercises = await fetchExiconData();

  const uniqueTags = new Set<string>();

  for (const exercise of exercises) {
    const tagsValue = exercise.tags;

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
