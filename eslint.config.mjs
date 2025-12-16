import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  // Ignore patterns
  {
    ignores: ["**/dist/", "**/node_modules/", "**/.pnpm-store/", "**/*.tsbuildinfo"],
  },

  // Base recommended configs
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // TypeScript-specific configuration
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Disable explicit return types (aligns with functional coding style)
      "@typescript-eslint/explicit-function-return-type": "off",
      // Warn for unused variables, but allow args starting with _
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },

  // JavaScript/config files - disable type-aware linting
  {
    files: ["**/*.js", "**/*.mjs"],
    ...tseslint.configs.disableTypeChecked,
  },

  // Test files - allow 'any' type for mocking
  {
    files: ["**/*.test.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Disable Prettier-conflicting rules (must be last)
  eslintConfigPrettier
);
