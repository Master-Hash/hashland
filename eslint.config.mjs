import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import storybook from "eslint-plugin-storybook";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import("@typescript-eslint/utils").TSESLint.FlatConfig.ConfigFile} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
      // parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...storybook.configs["flat/recommended"],
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  {
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: reactHooks.configs.recommended.rules,
  },
  // reactHooks.configs["recommended-latest"],
  reactCompiler.configs.recommended,
  // ...fixupConfigRules(
  //   compat.extends(
  //     "plugin:react/recommended",
  //     "plugin:react/jsx-runtime",
  //     // "plugin:react-hooks/recommended",
  //     "plugin:jsx-a11y/recommended",
  //   ),
  // ).map((config) => ({
  //   ...config,
  //   files: ["**/*.{js,jsx,ts,tsx}"],
  // })),
  // {
  //   files: ["**/*.{js,jsx,ts,tsx}"],

  //   plugins: {
  //     react: fixupPluginRules(react),
  //     "jsx-a11y": fixupPluginRules(jsxA11Y),
  //   },

  //   settings: {
  //     react: {
  //       version: "detect",
  //     },

  //     formComponents: ["Form"],

  //     linkComponents: [
  //       {
  //         name: "Link",
  //         linkAttribute: "to",
  //       },
  //       {
  //         name: "NavLink",
  //         linkAttribute: "to",
  //       },
  //     ],

  //     "import/resolver": {
  //       typescript: {},
  //     },
  //   },

  //   rules: {
  //     "@typescript-eslint/consistent-type-imports": "error",
  //   },
  // },
  // ...fixupConfigRules(
  //   compat.extends(
  //     "plugin:@typescript-eslint/recommended",
  //     "plugin:import/recommended",
  //     "plugin:import/typescript",
  //   ),
  // ).map((config) => ({
  //   ...config,
  //   files: ["**/*.{ts,tsx}"],
  // })),
  // {
  //   files: ["**/*.{ts,tsx}"],

  //   plugins: {
  //     "@typescript-eslint": fixupPluginRules(typescriptEslint),
  //     import: fixupPluginRules(_import),
  //   },

  //   languageOptions: {
  //     parser: tsParser,
  //   },

  //   settings: {
  //     "import/internal-regex": "^~/",

  //     "import/resolver": {
  //       node: {
  //         extensions: [".ts", ".tsx"],
  //       },

  //       typescript: {
  //         alwaysTryTypes: true,
  //       },
  //     },
  //   },

  //   rules: {
  //     "@typescript-eslint/consistent-type-imports": "error",
  //   },
  // },
];
