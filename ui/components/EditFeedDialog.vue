<template>
  <form-dialog
    v-model="isDialogOpen"
    :form="form"
    :on-submit="updateFeed"
    :rules="rules"
    :tabs="tabs"
    title="Edit Feed"
    mode="edit"
  >
    <template #destination>
      <destination-tab
        v-model:credential-id="form.credentialId"
        v-model:file-name="form.fileName"
        v-model:description="form.description"
      />
    </template>
  </form-dialog>
</template>

<script setup>
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { reactive, watch } from 'vue';

import DestinationTab from '~/components/DestinationTab.vue';
import FormDialog from '~/components/FormDialog.vue';
import { useRequest } from '~/composables/api';
import { validationRules } from '~/utils/validation';

const isDialogOpen = defineModel({
  type: Boolean,
  default: false,
});

const props = defineProps({
  feed: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['updated']);

const toolkit = useToolkit();
const { request } = useRequest(toolkit, true);

const form = reactive({
  credentialId: '',
  fileName: '',
  description: '',
});

const rules = {
  credentialId: [validationRules.required()],
  fileName: [validationRules.required()],
};

const tabs = [
  {
    key: 'destination',
    label: 'Destination',
    includes: ['credentialId', 'fileName'],
  },
];

const updateFeed = async () => {
  await request(`/api/feeds/${props.feed.id}`, 'PUT', {
    credential: { id: form.credentialId },
    file_name: form.fileName,
    description: form.description,
  });

  emit('updated');
};

watch(
  [() => props.feed, isDialogOpen],
  () => {
    form.credentialId = props.feed.credential?.id || '';
    form.fileName = props.feed.file_name || '';
    form.description = props.feed.description || '';
  },
  { immediate: true },
);
</script>
