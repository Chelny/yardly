// import stylistic from "@stylistic/eslint-plugin";
// import pluginLingui from "eslint-plugin-lingui";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import pluginReact from "eslint-plugin-react";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: [
      ".expo/**",
      "dist/**",
      "node_modules/**",
      // "prisma/**",
      // "src/generated/**",
      // "src/locales/**",
    ],
  },
  tseslint.configs.recommended,
  // pluginLingui.configs["flat/recommended"],
  eslintPluginPrettierRecommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { globals: globals.node },
    plugins: {
      react: pluginReact,
      // "@stylistic": stylistic,
      perfectionist: perfectionist,
      "unused-imports": unusedImports,
    },
    rules: {
      // "@stylistic/object-curly-spacing": [
      //   "error",
      //   "always",
      //   {
      //     arraysInObjects: true,
      //     objectsInObjects: true,
      //   },
      // ],
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
      "no-unused-vars": "off",
      "no-warning-comments": [
        "warn",
        {
          terms: ["todo", "fixme"],
          location: "anywhere",
        },
      ],
      "perfectionist/sort-imports": [
        "warn",
        {
          type: "alphabetical",
          groups: [
            "builtin",
            "framework",
            "external",
            "internal",
            "parent",
            "sibling",
            "side-effect",
            "style",
            "unknown",
          ],
          customGroups: [
            { groupName: "framework", elementNamePattern: ["^react", "^expo"] },
            { groupName: "internal", elementNamePattern: ["^@\/"] },
          ],
          newlinesBetween: 0,
        },
      ],
      "perfectionist/sort-jsx-props": [
        "warn",
        {
          type: "unsorted",
          groups: [
            "key-ref",
            "identification",
            "content",
            "accessibility",
            "form",
            "styling",
            "callbacks",
            "unknown",
          ],
          customGroups: [
            {
              groupName: "key-ref",
              type: "unsorted",
              elementNamePattern: "/^(key|ref)$/i",
            },
            {
              groupName: "identification",
              type: "unsorted",
              elementNamePattern: "/^(id|name|testID|nativeID)$/i",
            },
            {
              groupName: "content",
              type: "unsorted",
              elementNamePattern:
                "/^(title|label|placeholder|children|source|icon|leftIcon)$/i",
            },
            {
              groupName: "accessibility",
              type: "unsorted",
              elementNamePattern:
                "/^(accessibilityLabel|accessibilityRole|accessibilityHint|accessibilityState|role|aria-.+)$/i",
            },
            {
              groupName: "form",
              type: "unsorted",
              elementNamePattern:
                "/^(placeholder|disabled|readOnly|required|editable|secureTextEntry|keyboardType|autoCapitalize|autoCorrect|maxLength)$/i",
            },
            {
              groupName: "styling",
              type: "unsorted",
              elementNamePattern:
                "/^(style|.+Style|className|width|height|size|color|backgroundColor)$/i",
            },
            {
              groupName: "callbacks",
              type: "unsorted",
              elementNamePattern: "^(on[A-Z]|render[A-Z].*)$",
            },
          ],
        },
      ],
      "perfectionist/sort-named-imports": [
        "warn",
        {
          type: "alphabetical",
          order: "asc",
        },
      ],
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    settings: {
      react: {
        version: "detect", // Automatically detect the React version from package.json
      },
    },
  },
]);
