import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import astro from "eslint-plugin-astro";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier/flat";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "**/dist/**",
    "**/.astro/**",
    "**/.sanity/**",
    "**/node_modules/**",
  ]),
  js.configs.recommended,
  { files: ["**/*.{ts,tsx}"], extends: [tseslint.configs.recommended] },
  ...astro.configs.recommended,
  {
    files: ["**/*.astro"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  { files: ["**/*.tsx"], extends: [reactHooks.configs.flat.recommended] },
  prettier,
]);
