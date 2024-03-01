<template>
  <div class="destination-tab">
    <select-input
      v-model="credential"
      class="destination-tab__input"
      :options="credentials"
      label="Credentials"
      prop-display="name"
      prop-value="id"
    >
      <template #selected="{ selectedItem }">{{ selectedItem?.name || '–' }}</template>
      <template #option="{ option }">{{ option.name }}</template>
      <template #hint>
        <span>You may add credentials in the</span>
        <spa-link
          class="destination-tab__hint"
          :to="connectPortalRoutes.extensionSettings"
          :params="extensionId"
        >
          {{ extensionName }}
        </spa-link>
        <span>settings page</span>
      </template>
    </select-input>
    <text-field
      v-model="fileName"
      class="destination-tab__input"
      label="Filename Template"
      suffix="_yyyymmdd hh:mm:ss.csv"
    />
    <text-field
      v-model="description"
      class="destination-tab__input"
      label="Description (optional)"
    />
  </div>
</template>

<script setup>
import { connectPortalRoutes } from '@cloudblueconnect/connect-ui-toolkit';
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { computed } from 'vue';

import SelectInput from '~/components/SelectInput.vue';
import SpaLink from '~/components/SpaLink.vue';
import TextField from '~/components/TextField.vue';
import { useRequest } from '~/composables/api';

const credential = defineModel('credentialId', {
  type: String,
  required: true,
});
const fileName = defineModel('fileName', {
  type: String,
  required: true,
});
const description = defineModel('description', {
  type: String,
  required: true,
});

const toolkit = useToolkit();
const { result: credentials, request } = useRequest(toolkit, false, true);

const extensionId = computed(() => toolkit.sharedContext.currentInstallation?.id);
const extensionName = computed(
  () => toolkit.sharedContext.currentInstallation?.environment?.extension?.name,
);

request('/api/credentials');
</script>

<style scoped>
.destination-tab__input {
  display: block;
  margin-bottom: 24px;
}
.destination-tab__hint {
  font-size: 12px;
  line-height: 16px;
  margin: 0 4px;
}
</style>
