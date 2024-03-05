<template>
  <actions-menu
    class="feed-actions"
    :actions="actions"
  >
    <template
      v-if="$slots.default"
      #trigger
    >
      <slot />
    </template>
  </actions-menu>
</template>

<script setup>
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { computed, reactive } from 'vue';

import ActionsMenu from '~/components/ActionsMenu.vue';
import { useRequest } from '~/composables/api';
import { COLORS_DICT } from '~/constants/colors';
import { STATUSES_DICT } from '~/constants/statuses';

const props = defineProps({
  feed: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['enabled', 'disabled', 'uploaded', 'deleted']);

const toolkit = useToolkit();

const enableAction = useRequest(toolkit);
const disableAction = useRequest(toolkit);
const deleteAction = useRequest(toolkit);
const forceUploadAction = useRequest(toolkit);

const feedId = computed(() => props.feed.id);
const isFeedDisabled = computed(() => props.feed.status === STATUSES_DICT.DISABLED);

const disableFeed = async () => {
  const status = await disableAction.request(`/api/feeds/${feedId.value}/disable`, 'POST');
  if (status < 400) emit('disabled');
};
const enableFeed = async () => {
  const status = await enableAction.request(`/api/feeds/${feedId.value}/enable`, 'POST');
  if (status < 400) emit('enabled');
};
const forceUpload = async () => {
  const status = await forceUploadAction.request(
    `/api/feeds/${feedId.value}/uploads/force`,
    'POST',
  );
  if (status < 400) emit('uploaded');
};
const deleteFeed = async () => {
  const status = await deleteAction.request(`/api/feeds/${feedId.value}`, 'DELETE');
  if (status < 400) emit('deleted');
};

const actions = reactive([
  {
    key: 'disable',
    color: COLORS_DICT.TEXT,
    text: 'Disable',
    icon: 'googleToggleOffBaseline',
    loading: disableAction.loading,
    hide: isFeedDisabled,
    handler: disableFeed,
  },
  {
    key: 'enable',
    color: COLORS_DICT.TEXT,
    text: 'Enable',
    icon: 'googleToggleOnBaseline',
    loading: enableAction.loading,
    hide: !isFeedDisabled.value,
    handler: enableFeed,
  },
  {
    key: 'forceUpload',
    color: COLORS_DICT.TEXT,
    text: 'Force upload',
    icon: 'googleUploadBaseline',
    loading: forceUploadAction.loading,
    disabled: isFeedDisabled.value,
    handler: forceUpload,
  },
  {
    separated: true,
    key: 'delete',
    color: COLORS_DICT.NICE_RED,
    text: 'Delete',
    icon: 'googleDeleteForeverBaseline',
    loading: deleteAction.loading,
    handler: deleteFeed,
  },
]);
</script>
