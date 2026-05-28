import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Animation/lifecycle hooks legitimately need to call setState
      // in effect bodies (CSS transition coordination, mount tracking).
      // The new `set-state-in-effect` rule is overly strict for these patterns.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
