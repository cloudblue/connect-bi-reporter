/* global __dirname */
import path from 'node:path';
import { URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import { defineExtensionConfig } from '@cloudblueconnect/connect-ui-toolkit/tools/build/vite';


export default defineConfig(defineExtensionConfig({
  srcDir: path.resolve(__dirname, 'ui'),
  srcUrl: new URL('./ui', import.meta.url),
  outputDir: path.resolve(__dirname, 'connect_bi_reporter/static'),
  vuePlugin: vue(),
}));
