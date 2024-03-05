import createToolkitApp, {
  Table,
  Icon,
  Button,
  Menu,
  Card,
} from '@cloudblueconnect/connect-ui-toolkit';
import { toolkitPlugin } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { createApp } from 'vue';

import '~/assets/main.css';

import MainPage from './MainPage.vue';

createToolkitApp({
  'ui-table': Table,
  'ui-icon': Icon,
  'ui-button': Button,
  'ui-menu': Menu,
  'ui-card': Card,
}).then((toolkitInstance) => {
  const app = createApp(MainPage);
  app.use(toolkitPlugin, toolkitInstance);

  app.mount('#app');
});
