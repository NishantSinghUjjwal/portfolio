import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable unused imports/variables error
      "@typescript-eslint/no-unused-vars": "warn",
      "no-unused-vars": "warn",
      // Ensure import errors are warnings only
      "import/no-unresolved": "warn"
    }
  }
];

export default eslintConfig;
