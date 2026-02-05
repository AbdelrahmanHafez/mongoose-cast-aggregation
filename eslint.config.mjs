import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  {
    files: ['src/**/*.ts', 'test/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
      },
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      'comma-dangle': ['error', 'never'],
      'comma-spacing': ['error', { before: false, after: true }],
      'arrow-spacing': ['error', { before: true, after: true }],
      'curly': ['error', 'all'],
      'eqeqeq': ['error', 'smart'],
      'guard-for-in': 'error',
      'indent': ['error', 2, { SwitchCase: 1 }],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'keyword-spacing': ['error', { before: true, after: true }],
      'no-caller': 'error',
      'no-multi-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 5, maxBOF: 0 }],
      'no-throw-literal': 'error',
      'no-trailing-spaces': 'error',
      'no-unneeded-ternary': 'error',
      'no-unreachable': 'error',
      'no-const-assign': 'error',
      'object-shorthand': 'error',
      'no-useless-rename': 'error',
      'require-await': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
      'eol-last': ['error', 'never'],
      'no-var': 'error',
      'no-dupe-keys': 'error',
      'object-curly-spacing': ['error', 'always'],
      'one-var': ['error', 'never'],
      'space-before-blocks': ['error', 'always'],
      'space-before-function-paren': ['error', 'always'],
      'space-infix-ops': 'error',
      'space-in-parens': ['error', 'never'],
      'spaced-comment': ['error', 'always'],
      'template-curly-spacing': ['error', 'never'],
      'no-whitespace-before-property': 'error',
      'quote-props': ['error', 'as-needed'],
      'quotes': ['error', 'single'],
      'semi': 'error',
      'no-extra-semi': 'error',
      'semi-spacing': 'error',
      'prefer-template': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
      '@typescript-eslint/no-explicit-any': 'error'
    }
  }
];