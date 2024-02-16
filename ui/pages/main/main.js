import { createApp } from 'vue';
import createToolkitApp from '@cloudblueconnect/connect-ui-toolkit';
import { toolkitPlugin } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';

import '~/assets/main.css';
import MainPage from './MainPage.vue';

createToolkitApp().then((toolkitInstance) => {
  const app = createApp(MainPage);
  app.use(toolkitPlugin, toolkitInstance);

  app.mount('#app');
});
