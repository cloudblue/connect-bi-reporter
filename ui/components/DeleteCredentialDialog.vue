<template>
  <simple-dialog
    v-model="value"
    :actions="actions"
    :onSubmit="deleteCredential"
    height="auto"
    title="Delete Credential"
    width="480px"
  >
    <p>
      <span>Are you sure you want to delete this credential ({{ credentialId }})?</span>
      <br />
      <span>You cannot undo this action once performed.</span>
    </p>
  </simple-dialog>
</template>

<script setup>
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';

import SimpleDialog from '~/components/SimpleDialog.vue';
import { useRequest } from '~/composables/api';

const props = defineProps({
  credentialId: {
    type: String,
    required: true,
  },
});

const value = defineModel({
  type: Boolean,
  required: true,
});

const emit = defineEmits(['deleted']);

const actions = ['cancel', 'delete'];

const { request } = useRequest(useToolkit());

const deleteCredential = async () => {
  const status = await request(`/api/credentials/${props.credentialId}`, 'DELETE');
  if (status < 400) emit('deleted');
};
</script>
