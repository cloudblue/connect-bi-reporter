import createToolkitApp, {
  View,
  ComplexTable,
  Icon,
  Button,
  Status,
  Menu,
  Tabs,
  Card,
} from '@cloudblueconnect/connect-ui-toolkit';
import { toolkitPlugin } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { createApp } from 'vue';

import '~/assets/main.css';

import MainPage from './MainPage.vue';

createToolkitApp({
  'ui-view': View,
  'ui-complex-table': ComplexTable,
  'ui-icon': Icon,
  'ui-button': Button,
  'ui-status': Status,
  'ui-menu': Menu,
  'ui-tabs': Tabs,
  'ui-card': Card,
}).then((toolkitInstance) => {
  const app = createApp(MainPage);
  app.use(toolkitPlugin, toolkitInstance);

  app.mount('#app');
});
