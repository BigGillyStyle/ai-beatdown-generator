import assert from "node:assert";
import { describe, it, mock } from "node:test";
import { exiconToCsvString, fetchExiconData } from "./index.js";
import { loadTestMappingConfig } from "./load-test-mapping-config.js";

// Load test mapping config once at module level
// This is used to inject configs into functions during tests
const testConfig = await loadTestMappingConfig();

describe("exiconToCsvString", () => {
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

    const result = await exiconToCsvString(testConfig);

    // Verify CSV headers (new order: name, tags, type, description)
    assert.ok(result.includes("name,tags,type,description"));

    // Verify data rows (new order includes type column)
    // Format: Burpee,"cardio, full-body",cardio,A full body exercise
    assert.ok(result.includes('Burpee,"cardio, full-body",cardio'));
    assert.ok(result.includes("Merkin,upper-body,upper-body,A push-up"));
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

    const result = await exiconToCsvString(testConfig);

    // Both should have empty tags and type columns (new order: name, tags, type, description)
    assert.ok(result.includes("Burpee,,,A full body exercise"));
    assert.ok(result.includes("Merkin,,,A push-up"));
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

    const result = await exiconToCsvString(testConfig);

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

    const result = await exiconToCsvString(testConfig);

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

    const result = await exiconToCsvString(testConfig);

    // Should only include valid tag names
    assert.ok(result.includes("cardio, strength"));
    assert.ok(!result.includes(",,"));
  });

  it("should throw error when API is unreachable", async () => {
    global.fetch = mock.fn(async () => {
      throw new Error("Network error");
    }) as any;

    await assert.rejects(async () => await exiconToCsvString(testConfig), {
      message: /Failed to fetch exicon data/,
    });
  });

  it("should throw error when API request times out", async () => {
    global.fetch = mock.fn(async () => {
      const error = new Error("The operation was aborted");
      error.name = "AbortError";
      throw error;
    }) as any;

    await assert.rejects(async () => await exiconToCsvString(testConfig), {
      message: /API request timed out after 10000ms/,
    });
  });

  it("should throw error when API returns non-OK status", async () => {
    global.fetch = mock.fn(async () => ({
      ok: false,
      status: 404,
      statusText: "Not Found",
    })) as any;

    await assert.rejects(async () => await exiconToCsvString(testConfig), {
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

    await assert.rejects(async () => await exiconToCsvString(testConfig), {
      message: /Failed to parse JSON response from API/,
    });
  });

  it("should throw error when data is not an array", async () => {
    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => ({ exercises: [] }), // Object instead of array
    })) as any;

    await assert.rejects(async () => await exiconToCsvString(testConfig), {
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

    await assert.rejects(async () => await exiconToCsvString(testConfig), {
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

    await assert.rejects(async () => await exiconToCsvString(testConfig), {
      message: /Invalid exercise at index 0: missing or invalid 'description' field/,
    });
  });

  it("should throw error when exercise is not an object", async () => {
    const mockData = ["not an object"];

    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData,
    })) as any;

    await assert.rejects(async () => await exiconToCsvString(testConfig), {
      message: /Invalid exercise at index 0: expected an object/,
    });
  });
});

describe("fetchExiconData", () => {
  it("should return normalized exercise data as array", async () => {
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

    const result = await fetchExiconData(testConfig);

    // Verify array structure
    assert.strictEqual(Array.isArray(result), true);
    assert.strictEqual(result.length, 2);

    // Verify first exercise
    assert.strictEqual(result[0].name, "Burpee");
    assert.strictEqual(result[0].description, "A full body exercise");
    assert.strictEqual(result[0].tags, "cardio, full-body");

    // Verify second exercise
    assert.strictEqual(result[1].name, "Merkin");
    assert.strictEqual(result[1].description, "A push-up");
    assert.strictEqual(result[1].tags, "upper-body");
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

    const result = await fetchExiconData(testConfig);

    // Both should have empty tags
    assert.strictEqual(result[0].tags, "");
    assert.strictEqual(result[1].tags, "");
  });

  it("should normalize whitespace and replace newlines", async () => {
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

    const result = await fetchExiconData(testConfig);

    assert.strictEqual(result[0].name, "Burpee");
    assert.strictEqual(result[0].description, "A full body exercise with multiple lines");
    assert.strictEqual(result[0].tags, "cardio");
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

    const result = await fetchExiconData(testConfig);

    assert.strictEqual(result[0].tags, "cardio, strength");
  });

  it("should throw error when API is unreachable", async () => {
    global.fetch = mock.fn(async () => {
      throw new Error("Network error");
    }) as any;

    await assert.rejects(async () => await fetchExiconData(testConfig), {
      message: /Failed to fetch exicon data/,
    });
  });

  it("should throw error when data is not an array", async () => {
    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => ({ exercises: [] }),
    })) as any;

    await assert.rejects(async () => await fetchExiconData(testConfig), {
      message: /Invalid exicon data: expected an array of exercises/,
    });
  });

  it("should throw error when exercise is missing required fields", async () => {
    const mockData = [
      {
        description: "Missing name field",
      },
    ];

    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData,
    })) as any;

    await assert.rejects(async () => await fetchExiconData(testConfig), {
      message: /Invalid exercise at index 0: missing or invalid 'name' field/,
    });
  });
});

describe("exiconToCsvFile", () => {
  it("should write CSV to file with default filename in current directory", async () => {
    const mockData = [
      {
        name: "Burpee",
        description: "A full body exercise",
        tags: [{ id: "1", name: "cardio" }],
      },
    ];

    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData,
    })) as any;

    const { exiconToCsvFile } = await import("./index.js");
    const { readFile, unlink } = await import("node:fs/promises");
    const { basename } = await import("node:path");

    const filePath = await exiconToCsvFile();

    // Verify the returned path is absolute
    assert.ok(filePath.startsWith("/"));

    // Verify filename matches pattern: exicon_YYYY-MM-DD.csv
    const filename = basename(filePath);
    assert.match(filename, /^exicon_\d{4}-\d{2}-\d{2}\.csv$/);

    // Verify file was created and contains correct content (new order: name, tags, type, description)
    const content = await readFile(filePath, "utf-8");
    assert.ok(content.includes("name,tags,type,description"));
    // Uses production config: cardio -> format
    assert.ok(content.includes("Burpee,cardio,format,A full body exercise"));

    // Cleanup
    await unlink(filePath);
  });

  it("should write CSV to file with custom filename (basename only)", async () => {
    const mockData = [
      {
        name: "Merkin",
        description: "A push-up",
        tags: [],
      },
    ];

    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData,
    })) as any;

    const { exiconToCsvFile } = await import("./index.js");
    const { readFile, unlink } = await import("node:fs/promises");
    const { basename } = await import("node:path");

    const customFilename = "my-exicon.csv";
    const filePath = await exiconToCsvFile(customFilename);

    // Verify the returned path is absolute
    assert.ok(filePath.startsWith("/"));

    // Verify filename matches custom name
    const filename = basename(filePath);
    assert.strictEqual(filename, customFilename);

    // Verify file was created and contains correct content (new order: name, tags, type, description)
    const content = await readFile(filePath, "utf-8");
    assert.ok(content.includes("name,tags,type,description"));
    assert.ok(content.includes("Merkin,,,A push-up"));

    // Cleanup
    await unlink(filePath);
  });

  it("should write CSV to file with custom path", async () => {
    const mockData = [
      {
        name: "Squat",
        description: "Lower body exercise",
        tags: [{ id: "1", name: "legs" }],
      },
    ];

    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData,
    })) as any;

    const { exiconToCsvFile } = await import("./index.js");
    const { readFile, unlink, mkdir, rmdir } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const { tmpdir } = await import("node:os");

    // Create a temporary directory
    const tempDir = join(tmpdir(), "exicon-test-" + Date.now());
    await mkdir(tempDir, { recursive: true });

    const customPath = join(tempDir, "exercises.csv");
    const filePath = await exiconToCsvFile(customPath);

    // Verify the returned path is absolute
    assert.ok(filePath.startsWith("/"));

    // Verify the returned path matches our custom path (resolved)
    assert.strictEqual(filePath, customPath);

    // Verify file was created and contains correct content (new order: name, tags, type, description)
    const content = await readFile(filePath, "utf-8");
    assert.ok(content.includes("name,tags,type,description"));
    // Uses production config: legs -> exercise
    assert.ok(content.includes("Squat,legs,exercise,Lower body exercise"));

    // Cleanup
    await unlink(filePath);
    await rmdir(tempDir);
  });

  it("should silently overwrite existing file", async () => {
    const mockData1 = [
      {
        name: "Exercise1",
        description: "First exercise",
        tags: [],
      },
    ];

    const mockData2 = [
      {
        name: "Exercise2",
        description: "Second exercise",
        tags: [],
      },
    ];

    const { exiconToCsvFile } = await import("./index.js");
    const { readFile, unlink } = await import("node:fs/promises");

    const customFilename = "overwrite-test.csv";

    // Write first file
    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData1,
    })) as any;

    const filePath1 = await exiconToCsvFile(customFilename);
    const content1 = await readFile(filePath1, "utf-8");
    assert.ok(content1.includes("Exercise1"));

    // Overwrite with second file
    global.fetch = mock.fn(async () => ({
      ok: true,
      json: async () => mockData2,
    })) as any;

    const filePath2 = await exiconToCsvFile(customFilename);
    const content2 = await readFile(filePath2, "utf-8");

    // Verify same path returned
    assert.strictEqual(filePath1, filePath2);

    // Verify content was overwritten
    assert.ok(content2.includes("Exercise2"));
    assert.ok(!content2.includes("Exercise1"));

    // Cleanup
    await unlink(filePath2);
  });

  it("should throw error when API is unreachable", async () => {
    global.fetch = mock.fn(async () => {
      throw new Error("Network error");
    }) as any;

    const { exiconToCsvFile } = await import("./index.js");

    await assert.rejects(async () => await exiconToCsvFile(), {
      message: /Failed to fetch exicon data/,
    });
  });
});

describe("determineExerciseType", async () => {
  const { determineExerciseType } = await import("./index.js");

  const mockMapping: { [tagName: string]: string } = {
    legs: "lower-body",
    core: "core",
    arms: "upper-body",
    cardio: "cardio",
    "full-body": "full-body",
  };

  const mockPriority: { priorities: string[] } = {
    priorities: ["cardio", "upper-body", "lower-body", "core", "full-body"],
  };

  it("should return empty string when no tags", () => {
    const result = determineExerciseType(undefined, mockMapping, mockPriority);
    assert.strictEqual(result, "");
  });

  it("should return empty string when tags array is empty", () => {
    const result = determineExerciseType([], mockMapping, mockPriority);
    assert.strictEqual(result, "");
  });

  it("should return type for single matching tag", () => {
    const tags = [{ id: "t1", name: "legs" }];
    const result = determineExerciseType(tags, mockMapping, mockPriority);
    assert.strictEqual(result, "lower-body");
  });

  it("should be case-insensitive when matching tags", () => {
    const tags = [{ id: "t1", name: "LEGS" }];
    const result = determineExerciseType(tags, mockMapping, mockPriority);
    assert.strictEqual(result, "lower-body");
  });

  it("should return same type when multiple tags map to same type", () => {
    const mapping: { [tagName: string]: string } = {
      legs: "lower-body",
      squats: "lower-body",
    };
    const tags = [
      { id: "t1", name: "legs" },
      { id: "t2", name: "squats" },
    ];
    const result = determineExerciseType(tags, mapping, mockPriority);
    assert.strictEqual(result, "lower-body");
  });

  it("should use priority when multiple tags map to different types", () => {
    const tags = [
      { id: "t1", name: "legs" },
      { id: "t2", name: "cardio" },
    ];
    const result = determineExerciseType(tags, mockMapping, mockPriority);
    // cardio has higher priority than lower-body
    assert.strictEqual(result, "cardio");
  });

  it("should throw error when tags exist but none match mapping", () => {
    const tags = [{ id: "t1", name: "unknown-tag" }];
    assert.throws(() => determineExerciseType(tags, mockMapping, mockPriority), /Exercise has tags \[unknown-tag\] but none match the tag-to-type mapping/);
  });

  it("should skip invalid tags and only process valid ones", () => {
    const tags = [
      { id: "t1", name: "" }, // invalid - empty name
      { id: "t2", name: "   " }, // invalid - whitespace only
      { id: "t3", name: "legs" }, // valid
    ];
    const result = determineExerciseType(tags, mockMapping, mockPriority);
    assert.strictEqual(result, "lower-body");
  });

  it("should handle tags with whitespace around names", () => {
    const tags = [{ id: "t1", name: "  legs  " }];
    const result = determineExerciseType(tags, mockMapping, mockPriority);
    assert.strictEqual(result, "lower-body");
  });

  it("should skip comment key in mapping", () => {
    const mappingWithComment: { [tagName: string]: string } = {
      comment: "This is a comment",
      legs: "lower-body",
    };
    const tags = [{ id: "t1", name: "comment" }];
    assert.throws(() => determineExerciseType(tags, mappingWithComment, mockPriority), /Exercise has tags \[comment\] but none match the tag-to-type mapping/);
  });

  it("should return first priority match when three types match", () => {
    const mapping: { [tagName: string]: string } = {
      tag1: "cardio",
      tag2: "upper-body",
      tag3: "lower-body",
    };
    const tags = [
      { id: "t1", name: "tag3" }, // lower-body
      { id: "t2", name: "tag1" }, // cardio (highest priority)
      { id: "t3", name: "tag2" }, // upper-body
    ];
    const result = determineExerciseType(tags, mapping, mockPriority);
    assert.strictEqual(result, "cardio");
  });
});
