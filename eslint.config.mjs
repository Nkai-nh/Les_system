import pluginJs from "@eslint/js";
import globals from "globals";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node, 
      },
    },
    rules: {
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],  
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
];
