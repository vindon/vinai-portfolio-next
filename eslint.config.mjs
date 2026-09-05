import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: ["e2e/**", "playwright-report/**", "test-results/**", ".next/**", ".claude/**"],
  },
];

export default eslintConfig;
