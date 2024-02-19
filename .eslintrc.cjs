/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting',
    'prettier',
    'plugin:vitest-globals/recommended',
  ],

  rules: {
  'vue/block-order': ['error', {
      order: ['template', 'script', 'style'],
    }],
  },

  env: {
    'vitest-globals/env': true,
  },

  parserOptions: {
    ecmaVersion: 'latest',
  },
};
