/* eslint-env node */
const path = require('node:path');
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting',
    'prettier',
    'plugin:vitest-globals/recommended',
    'plugin:import/recommended',
  ],

  rules: {
    // Disable rule due to "exports" field not supported yet: https://github.com/browserify/resolve/issues/222
    'import/no-unresolved': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
      },
    ],

    'vue/block-order': [
      'error',
      {
        order: ['template', 'script', 'style'],
      },
    ],

    // Disabled to allow fair web component slot usage
    'vue/no-deprecated-slot-attribute': 'off',

    // Force pascalCase attributes to avoid issues with some web components
    'vue/attribute-hyphenation': ['error', 'never'],
  },

  env: {
    'vitest-globals/env': true,
  },

  parserOptions: {
    ecmaVersion: 'latest',
  },

  settings: {
    'import/resolver': {
      vite: {
        viteConfig: {
          resolve: {
            alias: {
              '~': path.resolve(__dirname, 'ui'),
            },
          },
        },
      },
    },
  },
};
