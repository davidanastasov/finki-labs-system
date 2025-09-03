//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";

export default [
  ...tanstackConfig,
  {
    name: "tanstack/package-json",
    files: ["package.json", "**/package.json"],
    rules: {
      "pnpm/json-enforce-catalog": "off",
      "pnpm/json-valid-catalog": "off",
      "pnpm/json-prefer-workspace-settings": "off",
    },
  },
  {
    name: "custom/our-overrides",
    rules: {
      "@typescript-eslint/array-type": "off",
    },
  },
  {
    ignores: [
      "eslint.config.js",
      "prettier.config.js",
      "src/routeTree.gen.ts",
      "src/components/ui/**",
    ],
  },
];
