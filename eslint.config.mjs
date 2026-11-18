import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  {
    // react-three-fiber works by mutating three.js objects inside useFrame, and uses
    // props that are not DOM attributes (position, args, castShadow...). The React Compiler
    // immutability rule and the DOM-oriented unknown-property rule do not apply to it.
    files: ["src/components/three/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/immutability": "off",
      "react/no-unknown-property": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "public/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
