import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { mergeConfig, defineConfig, configDefaults } from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      globalSetup: resolve(__dirname, 'ui/tests/config/vitest-global-setup.js'),
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./ui/', import.meta.url)),
      reporters: ['json', 'default'],
      outputFile: resolve(__dirname, 'ui/tests/report.json'),
      coverage: {
        enabled: false,
        provider: 'v8',
        reportsDirectory: resolve(__dirname, 'ui/tests/coverage'),
      },
    },
  }),
);
