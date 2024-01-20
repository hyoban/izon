module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json", "./playground/tsconfig.json"],
  },
  root: true,
  ignorePatterns: ["*.js", "*.cjs", "*.mjs", "dist"],
  reportUnusedDisableDirectives: true,
  settings: {
    next: {
      rootDir: "playground",
    },
  },
  rules: {
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

    "no-console": ["warn", { allow: ["warn", "error", "table"] }],
  },
}
