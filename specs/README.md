# Specification System

We use spec-driven development. Before building anything substantial, write a quick Markdown spec under `specs/` to clarify what you're building and why.

## File Naming

```
specs/YYYY-MM-DD--short-description.md
```

Example: `specs/2025-11-13--exicon-csv-export.md`

The date prefix keeps files in chronological order.

## When to Write a Spec

**Write a spec for:**

- New features or tools
- Changes affecting multiple files
- Database or data structure changes
- New CLI commands or APIs

**Skip specs for:**

- Typo fixes
- README updates
- Dependency version bumps
- Single-line bug fixes

When in doubt, write a short spec. It helps others understand your work later.

## How to Write a Spec

Use the template at `specs/2025-11-13--template.md`. The key sections are:

1. **What & Why** – What you're building and why it matters
2. **How** – Your approach (keep it simple)
3. **Acceptance Criteria** – How you'll know it works
4. **Notes** – Optional: risks, alternatives, open questions

That's it. No need for 20 sections. Keep it brief and clear.

## Working with Copilot

To get Copilot to implement your spec:

1. Write your spec file
2. Tell Copilot: "Implement the spec at `specs/2025-11-13--my-feature.md`"
3. Copilot will build it based on your acceptance criteria

## Example

See `specs/apps/2025-11-13--exicon-to-csv-initial.md` for a working example.

## Tips

- Use bullet points, not paragraphs
- Be specific about file paths, command names, field names
- Write acceptance criteria you can actually test
- Keep old specs around for history
