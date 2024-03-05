<template>
  <simple-dialog
    v-model="isOpen"
    :actions="actions"
    :onSubmit="deleteFeed"
    height="auto"
    title="Delete Feed"
    width="480px"
  >
    <p>
      <span>Are you sure you want to delete this feed ({{ feedId }})?</span>
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
  feedId: {
    type: String,
    required: true,
  },
});

const isOpen = defineModel({
  type: Boolean,
  required: true,
});

const emit = defineEmits(['deleted']);

const actions = ['cancel', 'delete'];

const { request } = useRequest(useToolkit());

const deleteFeed = async () => {
  const status = await request(`/api/feeds/${props.feedId}`, 'DELETE');
  if (status < 400) emit('deleted');
};
</script>
