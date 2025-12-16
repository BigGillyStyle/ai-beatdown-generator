# Extract Unique Tags from F3 Exicon JSON Data

**Author:** Andy Pickler
**Date:** 2025-11-23

---

## What & Why

**What are we building?**
- A function that pulls the unique list of tags in the F3 Exicon JSON data

**Why does it matter?**
- An LLM could benefit from knowing the unique list of tags (including the definition of each, which is a separate effort)

---

## How

**Approach:**
- Call the `exiconToCsvString` function in the @packages/exicon-to-csv/src/index.ts file
- Iterate through the values in the "tags" column, where each "tags" value is itself a comma-separated list of "tags"
- Determine the unique set of tags
- Return the tags as a comma-delimited string

**Key Details:**
- New file and function should be in @packages/exicon-to-csv/src folder

---

## Acceptance Criteria

How we know it's done:

- [ ] Executing function finds the complete, unique set of tags in the F3 Exicon JSON data
