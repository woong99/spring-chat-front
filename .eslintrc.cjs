module.exports = {
  root: true,
  extends: ['plugin:tailwindcss/recommended'],
  plugins: ['unused-imports', 'import'],
  parser: '@typescript-eslint/parser',
  settings: {
    tailwindcss: {
      callees: ['cn'],
    },
  },
  rules: {
    // https://github.com/sweepline/eslint-plugin-unused-imports
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
      },
    ],
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/prefer-default-export': 'off',
    'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
    // https://nextjs.org/docs/basic-features/eslint
    'react-hooks/exhaustive-deps': 'off',
  },
};
