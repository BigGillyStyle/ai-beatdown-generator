# Add CSV "Type" Column

**Author:** Andy Pickler
**Date:** 2025-12-16

---

## What & Why

**What are we building?**

- The @packages/exicon-to-csv package reads the F3 exicon data and creates a CSV file out of it. However, there is an additional column ("type") that needs to be added to the CSV file to make it more useful. This "type" column will come from a new, static mapping file in this repo as part of this change

**Why does it matter?**

- The CSV data is passed to an AI tool to generate a beatdown, and the source data is not sufficiently structured to allow for quality parsing and output by the AI tool
- This change will be beneficial to the users of the AI beatdown generator app that will eventually be in this repo

---

## How

**Approach:**

- Create a new feature branch for this work
- During creation of the CSV, each line should be read and have its tags parsed to understand what to add to the "type" column
- Create mapping file(s) in JSON format within the exicon-to-csv package:
  - Tag-to-Type mapping file: maps individual tags to their corresponding types
  - Type priority file (unless this can be included in the mapping file): defines priority order when multiple types match
  - Initially create the structure of these files. The user will need to fill in the data
- Add the "type" to the output CSV file
- Create an "output" directory at the repo root for generated CSV files (auto-create if missing, add to .gitignore)

**Key Details:**

- Primary file paths affected: @packages/exicon-to-csv/src/generate-exicon-csv.ts
- CLI commands: `pnpm --filter exicon-to-csv run fetch`
- Mapping files (JSON format, in exicon-to-csv package, structure to be provided by user with recommendations by Claude Code)
- The CSV file should by default be output to a top-level "output/" directory in this repo (add to .gitignore so CSV files are not committed)
- The CSV file column order should be changed to "name", "tags", "type", and "description" (in that order)
- Tag matching should be case-insensitive
- Original exicon data structure: JSON array where each exercise has a `tags` array of objects with `id` and `name` properties

**Tag-to-Type Mapping Rules:**

- Multiple tags can map to the same type
- Each exercise can have ONLY ONE type value (key requirement)
- If an exercise has multiple tags that map to different types, use the type with the highest priority
- If an exercise has no tags, the "type" column should be empty
- If an exercise has tags but none match the mapping file, exit with an explanatory error message

**Recommended JSON Structure:**

Tag-to-Type Mapping (`tag-to-type-mapping.json`):

```json
{
  "legs": "lower-body",
  "core": "core",
  "arms": "upper-body",
  "cardio": "cardio"
}
```

Type Priority (`type-priority.json`):

```json
{
  "priorities": ["cardio", "upper-body", "lower-body", "core"]
}
```

Higher priority types appear first in the array. When an exercise has multiple matching types, select the one that appears earliest in this list.

---

## Acceptance Criteria

How we know it's done:

- [ ] When `pnpm --filter exicon-to-csv run fetch` is run, a new CSV file is created and all rows have a value for the "type" column
