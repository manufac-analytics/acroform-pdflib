import manufacEslintConfig from "@manufac/eslint-config";

export default [
  ...manufacEslintConfig,
  {
    ignores: [".prettierrc.mjs"],
  },
];
