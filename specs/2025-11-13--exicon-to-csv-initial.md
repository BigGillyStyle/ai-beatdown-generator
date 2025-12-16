# Exicon to CSV Conversion

**Author:** Andy Pickler
**Date:** 2025-11-13

---

## What & Why

**What are we building?**

- A function that converts F3 Exicon JSON data to a clean CSV format

**Why does it matter?**

- AI models need structured exercise data to generate workouts
- Manual CSV creation is error-prone and inconsistent
- CSV format is easier for training pipelines to consume

---

## How

**Approach:**

1. ✅ Move `apps/exicon-to-csv` to `packages/exicon-to-csv`
   1. ✅ Updated all other references in this repo to this new location and reflect the fact that this will now be a _package_ and not a standalone app
1. Create a single exported function
1. Create the following functionality:
   1. Pull latest exicon JSON data from https://codex.f3nation.com/api/exicon
   1. Validate required fields
      1. Top-level array of objects
      1. Individual objects containing at least "name" and "description" with optional "tags" field consisting of an array of objects with "id" and "name"
   1. Normalize and clean data
      1. Trim whitespace
      1. Make formatting consistent
      1. Replace newline characters `/n` with space character " "
      1. Perform any other data cleansing that would make it more easily parseable by LLMs
   1. Return CSV data
   1. Throw an error for common reasons
      1. API endpoint is unreachable
      1. JSON data cannot be parsed
1. Create unit tests for key functionality

## Acceptance Criteria

- [x] Executing exported function creates CSV with correct headers
- [x] Invalid JSON file throws an error with a helpful error message
- [x] All fields are properly escaped for CSV format

---

## Notes

**Risks:**

- Large files could cause memory issues → Stream JSON parsing if needed
- Different input formats might break → Add validation early
