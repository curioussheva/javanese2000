import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    // Folder yang diabaikan
    ignores: [
      "**/node_modules/**",
      ".expo/**",
      "dist/**",
      "babel.config.js",
      "metro.config.js",
      "assets/**",
      "**/temp/**", 
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: {
        version: "19.0"
      },
    },
    rules: {
      // Aturan Dasar
      "no-console": "warn",
      
      // Aturan React (Manual agar tidak crash)
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react/no-direct-mutation-state": "error",
      "react/react-in-jsx-scope": "off",
      
      // Aturan Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      
      // Aturan TypeScript
      "@typescript-eslint/no-unused-vars": "warn",
      
      // Matikan aturan yang bentrok dengan Prettier
      ...prettierConfig.rules,
    },
  },
];
 