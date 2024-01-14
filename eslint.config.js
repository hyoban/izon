import process from "node:process"
import ts from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import eslintConfigPrettier from "eslint-config-prettier"
import eslintPluginUnicorn from "eslint-plugin-unicorn"

export default [
  // don't lint js files
  {
    ignores: ["**/*.js", "**/*.cjs", "**/*.mjs"],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      "@typescript-eslint": ts,
    },
    rules: {
      ...ts.configs["eslint-recommended"].overrides[0].rules,
      ...ts.configs["strict-type-checked"].rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-non-null-assertion": "off",

      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",

      "no-console": ["warn", { allow: ["warn", "error"] }],

      "no-restricted-syntax": [
        "error",
        {
          selector: "TSEnumDeclaration",
          message: "We should not use Enum",
        },
      ],
    },
  },
  {
    ...eslintPluginUnicorn.configs["flat/recommended"],
    rules: {
      ...eslintPluginUnicorn.configs["flat/recommended"].rules,
      "unicorn/prevent-abbreviations": "off",
      // https://github.com/sindresorhus/meta/discussions/7
      "unicorn/no-null": "off",
      // https://github.com/orgs/web-infra-dev/discussions/10
      "unicorn/prefer-top-level-await": "off",
      "unicorn/catch-error-name": "off",
    },
  },
  // disable formatting rules, make sure to put this last
  eslintConfigPrettier,
]
