module.exports = [
  {
    ignores: ['node_modules/**', 'user-data/**', 'playwright-report/**', 'test-results/**', 'coverage/**'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    rules: {
      // Add project-specific rule overrides here
    },
  },
  ...require('@typescript-eslint/eslint-plugin').configs['flat/recommended'],
];
