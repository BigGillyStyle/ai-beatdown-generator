import assert from "node:assert";
import { describe, it, mock } from "node:test";
import { getUniqueTags } from "./get-unique-tags.js";

describe("getUniqueTags", () => {
  it("should return unique tags in alphabetical order", async () => {
    const mockData = [
      {
        name: "Burpee",
        description: "A full body exercise",
        tags: [
          { id: "1", name: "cardio" },
          { id: "2", name: "full-body" },
        ],
      },
      {
        name: "Merkin",
        description: "A push-up",
        tags: [{ id: "3", name: "upper-body" }],
      },
      {
        name: "Squat",
        description: "Lower body exercise",
        tags: [
          { id: "4", name: "legs" },
          { id: "1", name: "cardio" }, // Duplicate tag
        ],
      },
    ];

    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData,
    })) as any;

    const result = await getUniqueTags();

    // Should return alphabetically sorted, comma-delimited string
    assert.strictEqual(result, "cardio, full-body, legs, upper-body");
  });

  it("should handle exercises with no tags", async () => {
    const mockData = [
      {
        name: "Burpee",
        description: "A full body exercise",
        tags: [{ id: "1", name: "cardio" }],
      },
      {
        name: "Merkin",
        description: "A push-up",
        tags: [],
      },
      {
        name: "Squat",
        description: "Lower body exercise",
        // No tags field at all
      },
    ];

    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData,
    })) as any;

    const result = await getUniqueTags();

    // Should only return the one valid tag
    assert.strictEqual(result, "cardio");
  });

  it("should return empty string when no exercises have tags", async () => {
    const mockData = [
      {
        name: "Exercise1",
        description: "Description",
        tags: [],
      },
      {
        name: "Exercise2",
        description: "Description",
      },
    ];

    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData,
    })) as any;

    const result = await getUniqueTags();

    assert.strictEqual(result, "");
  });

  it("should deduplicate tags across multiple exercises", async () => {
    const mockData = [
      {
        name: "Exercise1",
        description: "Description",
        tags: [
          { id: "1", name: "cardio" },
          { id: "2", name: "strength" },
        ],
      },
      {
        name: "Exercise2",
        description: "Description",
        tags: [
          { id: "1", name: "cardio" }, // Duplicate
          { id: "3", name: "flexibility" },
        ],
      },
      {
        name: "Exercise3",
        description: "Description",
        tags: [
          { id: "2", name: "strength" }, // Duplicate
          { id: "1", name: "cardio" }, // Duplicate
        ],
      },
    ];

    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData,
    })) as any;

    const result = await getUniqueTags();

    // Should have exactly 3 unique tags, alphabetically sorted
    assert.strictEqual(result, "cardio, flexibility, strength");
  });

  it("should handle tags with whitespace correctly", async () => {
    const mockData = [
      {
        name: "Exercise",
        description: "Description",
        tags: [
          { id: "1", name: "  cardio  " },
          { id: "2", name: "strength" },
        ],
      },
    ];

    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData,
    })) as any;

    const result = await getUniqueTags();

    // Tags should be trimmed (exiconToCsvString normalizes them)
    assert.strictEqual(result, "cardio, strength");
  });

  it("should preserve tag order as alphabetical", async () => {
    const mockData = [
      {
        name: "Exercise",
        description: "Description",
        tags: [
          { id: "1", name: "zumba" },
          { id: "2", name: "aerobics" },
          { id: "3", name: "mobility" },
          { id: "4", name: "balance" },
        ],
      },
    ];

    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData,
    })) as any;

    const result = await getUniqueTags();

    // Should be sorted alphabetically, not in order of appearance
    assert.strictEqual(result, "aerobics, balance, mobility, zumba");
  });

  it("should handle single exercise with single tag", async () => {
    const mockData = [
      {
        name: "Exercise",
        description: "Description",
        tags: [{ id: "1", name: "cardio" }],
      },
    ];

    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData,
    })) as any;

    const result = await getUniqueTags();

    assert.strictEqual(result, "cardio");
  });

  it("should throw error when API is unreachable", async () => {
    global.fetch = mock.fn(async () => {
      throw new Error("Network error");
    }) as any;

    await assert.rejects(async () => await getUniqueTags(), {
      message: /Failed to fetch exicon data/,
    });
  });

  it("should throw error when API request times out", async () => {
    global.fetch = mock.fn(async () => {
      const error = new Error("The operation was aborted");
      error.name = "AbortError";
      throw error;
    }) as any;

    await assert.rejects(async () => await getUniqueTags(), {
      message: /API request timed out after 10000ms/,
    });
  });
});
