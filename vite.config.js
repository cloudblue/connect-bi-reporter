import path from 'node:path';
import { URL } from 'node:url';

import { defineExtensionConfig } from '@cloudblueconnect/connect-ui-toolkit/tools/build/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig(
  defineExtensionConfig({
    srcDir: path.resolve(__dirname, 'ui'),
    srcUrl: new URL('./ui', import.meta.url),
    outputDir: path.resolve(__dirname, 'connect_bi_reporter/static'),
    vuePlugin: vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('ui-'),
        },
      },
    }),
  }),
);
