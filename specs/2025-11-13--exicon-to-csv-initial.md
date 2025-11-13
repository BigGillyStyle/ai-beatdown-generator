# Exicon to CSV Conversion

**Author:** system
**Date:** 2025-11-13

---

## What & Why

**What are we building?**
- A CLI tool that converts F3 Exicon JSON data to a clean CSV format

**Why does it matter?**
- AI models need structured exercise data to generate workouts
- Manual CSV creation is error-prone and inconsistent
- CSV format is easier for training pipelines to consume

---

## How

**Approach:**
1. Read JSON file from `--input` path
2. Validate required fields (name, description, categories)
3. Normalize and clean data (trim whitespace, consistent formatting)
4. Write CSV to `--output` path (or stdout if not specified)

**Key Details:**

**Files affected:**
- `apps/exicon-to-csv/src/` (new directory structure)

**CLI signature:**
```bash
pnpm exicon-to-csv --input ./exicon.json --output ./exicon.csv
```

**Flags:**
- `--input <path>` (required) - Source JSON file
- `--output <path>` (optional) - Destination CSV file, defaults to stdout
- `--columns` (optional) - Show CSV schema and exit

**CSV columns:**
| Column | Type | Example |
|--------|------|---------|
| name | string | "Merkin" |
| aliases | string | "Push-up\|Press-up" (pipe-delimited) |
| description | string | Plain text, HTML stripped |
| categories | string | "upper body,core" (comma-separated) |
| equipment | string | "none" or "dumbbells,mat" |
| intensity | string | "low", "moderate", or "high" |
| fng_friendly | boolean | true/false |

---

## Acceptance Criteria

- [ ] Running `pnpm exicon-to-csv --input valid.json --output out.csv` creates CSV with correct headers
- [ ] Invalid JSON file exits with error code 1 and helpful error message
- [ ] `--columns` flag prints schema table and exits successfully
- [ ] Omitting `--output` writes CSV to stdout
- [ ] CSV output includes header row matching schema above
- [ ] All fields are properly escaped for CSV format

---

## Notes

**Risks:**
- Large files could cause memory issues → Stream JSON parsing if needed
- Different input formats might break → Add validation early

**Open Questions:**
- Should we support multiple input files at once?
- Do we need a "strict mode" for validation?
