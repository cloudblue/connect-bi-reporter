import { createApp } from 'vue';
import createToolkitApp, {
  View,
  ComplexTable,
  Icon,
  Button,
  Status,
} from '@cloudblueconnect/connect-ui-toolkit';
import { toolkitPlugin } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';

import '~/assets/main.css';
import router from '~/router';
import MainPage from './MainPage.vue';

createToolkitApp({
  'ui-view': View,
  'ui-complex-table': ComplexTable,
  'ui-icon': Icon,
  'ui-button': Button,
  'ui-status': Status,
}).then((toolkitInstance) => {
  const app = createApp(MainPage);
  app.use(router);
  app.use(toolkitPlugin, toolkitInstance);

  app.mount('#app');
});
