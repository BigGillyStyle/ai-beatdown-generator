#!/bin/bash
set -e

# Get the file path from hook input
file_path=$(jq -r '.tool_input.file_path' 2>/dev/null)

if [ -z "$file_path" ] || [ "$file_path" = "null" ]; then
  exit 0
fi

# Only process TS/JS files
if [[ ! "$file_path" =~ \.(ts|tsx|js|jsx|mjs)$ ]]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR" || exit 0

# Format the file (matches your Prettier config)
pnpm format -- "$file_path" 2>&1 || true

# Lint and auto-fix (matches your ESLint config)
pnpm lint:fix -- "$file_path" 2>&1 || true

exit 0
