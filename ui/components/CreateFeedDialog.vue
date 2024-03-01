<template>
  <form-dialog
    v-model="value"
    :form="form"
    :rules="rules"
    :on-submit="createFeed"
    :tabs="tabs"
    :details-route="detailsRoute"
    title="Create Feed"
    mode="wizard"
    submit-label="Create"
  >
    <template #schedule>
      <schedule-tab v-model="form.scheduleId" />
    </template>
    <template #destination>
      <destination-tab
        v-model:credential-id="form.credentialId"
        v-model:file-name="form.fileName"
        v-model:description="form.description"
      />
    </template>
    <template #summary>
      <feed-summary
        :id="feed.id"
        :status="feed.status"
        :description="feed.description"
        :credential="feed.credential"
        :schedule-id="feed.scheduleId"
      />
    </template>
  </form-dialog>
</template>

<script setup>
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { reactive, computed, watch } from 'vue';

import DestinationTab from '~/components/DestinationTab.vue';
import FeedSummary from '~/components/FeedSummary.vue';
import FormDialog from '~/components/FormDialog.vue';
import ScheduleTab from '~/components/ScheduleTab.vue';
import { useRequest } from '~/composables/api';
import { validationRules } from '~/utils/validation';

const value = defineModel({
  type: Boolean,
  default: false,
});

const emit = defineEmits(['created']);

const toolkit = useToolkit();
const { result: createdFeed, request } = useRequest(toolkit, true);

const tabs = [
  {
    key: 'schedule',
    label: 'Report Schedule',
    includes: ['scheduleId'],
  },
  {
    key: 'destination',
    label: 'Destination',
    includes: ['credentialId', 'fileName'],
    submittable: true,
  },
  {
    key: 'summary',
    label: 'Summary',
  },
];

const form = reactive({
  scheduleId: '',
  credentialId: '',
  fileName: '',
  description: '',
});

const rules = {
  scheduleId: [validationRules.required()],
  credentialId: [validationRules.required()],
  fileName: [validationRules.required()],
};

const feed = computed(() => ({
  id: createdFeed.id,
  scheduleId: createdFeed.schedule?.id,
  credential: createdFeed.credential?.id, // TODO: get credential name
  description: createdFeed.description,
  status: createdFeed.status,
}));

const detailsRoute = computed(() => ({
  name: 'feeds.details',
  params: { id: feed.value.id },
}));

const createFeed = async () => {
  await request('/api/feeds', 'POST', {
    schedule: { id: form.scheduleId },
    credential: { id: form.credentialId },
    file_name: form.fileName,
    description: form.description,
  });

  emit('created');
};

const resetForm = () => {
  form.scheduleId = '';
  form.credentialId = '';
  form.fileName = '';
  form.description = '';
};

watch(
  value,
  (isOpen) => {
    if (!isOpen) resetForm();
  },
  { immediate: true },
);
</script>
