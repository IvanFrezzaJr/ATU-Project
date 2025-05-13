import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintPluginPreact from 'eslint-plugin-preact'
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from '@typescript-eslint/eslint-plugin'
import parser from '@typescript-eslint/parser'

export default [
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.app.json',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: eslintPluginPrettier,
      preact: eslintPluginPreact,
      'jsx-a11y': eslintPluginJsxA11y,
    },
    settings: {
      react: {
        pragma: 'h',
        version: 'detect',
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'prettier/prettier': 'warn',
    },
  },
]
