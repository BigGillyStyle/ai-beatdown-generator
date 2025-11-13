import assert from "node:assert";
import { describe, it, mock } from "node:test";
import { exiconToCsv } from "./index.js";

describe("exiconToCsv", () => {
  it("should successfully convert valid exicon data to CSV with correct headers", async () => {
    // Mock fetch to return valid exicon data
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
    ];

    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData,
    })) as any;

    const result = await exiconToCsv();

    // Verify CSV headers
    assert.ok(result.includes("name,description,tags"));

    // Verify data rows
    assert.ok(
      result.includes('Burpee,A full body exercise,"cardio, full-body"')
    );
    assert.ok(result.includes("Merkin,A push-up,upper-body"));
  });

  it("should handle exercises with no tags", async () => {
    const mockData = [
      {
        name: "Burpee",
        description: "A full body exercise",
        tags: [],
      },
      {
        name: "Merkin",
        description: "A push-up",
        // No tags field at all
      },
    ];

    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData,
    })) as any;

    const result = await exiconToCsv();

    // Both should have empty tags column
    assert.ok(result.includes("Burpee,A full body exercise,"));
    assert.ok(result.includes("Merkin,A push-up,"));
  });

  it("should normalize whitespace and replace newlines with spaces", async () => {
    const mockData = [
      {
        name: "  Burpee  ",
        description: "A full body\nexercise with\nmultiple lines",
        tags: [{ id: "1", name: "  cardio  " }],
      },
    ];

    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData,
    })) as any;

    const result = await exiconToCsv();

    // Verify trimming and newline replacement
    assert.ok(result.includes("Burpee"));
    assert.ok(result.includes("A full body exercise with multiple lines"));
    assert.ok(result.includes("cardio"));
    assert.ok(!result.includes("\n\n")); // No double newlines in data
  });

  it("should properly escape CSV fields with commas and quotes", async () => {
    const mockData = [
      {
        name: "Exercise, with comma",
        description: 'Description with "quotes"',
        tags: [
          { id: "1", name: "tag1" },
          { id: "2", name: "tag2" },
        ],
      },
    ];

    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData,
    })) as any;

    const result = await exiconToCsv();

    // The json-2-csv library should handle escaping
    assert.ok(result.includes("Exercise, with comma"));
    assert.ok(result.includes('"quotes"'));
  });

  it("should skip tags with missing or empty names", async () => {
    const mockData = [
      {
        name: "Burpee",
        description: "A full body exercise",
        tags: [
          { id: "1", name: "cardio" },
          { id: "2" }, // Missing name
          { id: "3", name: "" }, // Empty name
          { id: "4", name: "   " }, // Whitespace only
          { id: "5", name: "strength" },
        ],
      },
    ];

    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData,
    })) as any;

    const result = await exiconToCsv();

    // Should only include valid tag names
    assert.ok(result.includes("cardio, strength"));
    assert.ok(!result.includes(",,"));
  });

  it("should throw error when API is unreachable", async () => {
    global.fetch = mock.fn(async () => {
      throw new Error("Network error");
    }) as any;

    await assert.rejects(async () => await exiconToCsv(), {
      message: /Failed to fetch exicon data/,
    });
  });

  it("should throw error when API request times out", async () => {
    global.fetch = mock.fn(async () => {
      const error = new Error("The operation was aborted");
      error.name = "AbortError";
      throw error;
    }) as any;

    await assert.rejects(async () => await exiconToCsv(), {
      message: /API request timed out after 10000ms/,
    });
  });

  it("should throw error when API returns non-OK status", async () => {
    global.fetch = mock.fn(async () => ({
      ok: false,
      status: 404,
      statusText: "Not Found",
    })) as any;

    await assert.rejects(async () => await exiconToCsv(), {
      message: /API request failed with status 404/,
    });
  });

  it("should throw error when JSON cannot be parsed", async () => {
    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    })) as any;

    await assert.rejects(async () => await exiconToCsv(), {
      message: /Failed to parse JSON response from API/,
    });
  });

  it("should throw error when data is not an array", async () => {
    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => ({ exercises: [] }), // Object instead of array
    })) as any;

    await assert.rejects(async () => await exiconToCsv(), {
      message: /Invalid exicon data: expected an array of exercises/,
    });
  });

  it("should throw error when exercise is missing required name field", async () => {
    const mockData = [
      {
        description: "A full body exercise",
      },
    ];

    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData,
    })) as any;

    await assert.rejects(async () => await exiconToCsv(), {
      message: /Invalid exercise at index 0: missing or invalid 'name' field/,
    });
  });

  it("should throw error when exercise is missing required description field", async () => {
    const mockData = [
      {
        name: "Burpee",
      },
    ];

    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData,
    })) as any;

    await assert.rejects(async () => await exiconToCsv(), {
      message:
        /Invalid exercise at index 0: missing or invalid 'description' field/,
    });
  });

  it("should throw error when exercise is not an object", async () => {
    const mockData = ["not an object"];

    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData,
    })) as any;

    await assert.rejects(async () => await exiconToCsv(), {
      message: /Invalid exercise at index 0: expected an object/,
    });
  });
});
