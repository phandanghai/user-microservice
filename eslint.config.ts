// eslint.config.js
import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import type { TSESLint } from '@typescript-eslint/utils';

export default [
  {
    files: ['**/*.ts'],
    ignores: ['dist/**'],
    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
] as TSESLint.FlatConfig.ConfigArray;
