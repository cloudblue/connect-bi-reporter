<template>
  <ui-menu
    class="feed-actions"
    align="right"
  >
    <div slot="trigger">
      <slot />
    </div>
    <div
      slot="content"
      class="actions-menu"
    >
      <div
        v-for="button in buttons"
        :key="button.action"
        class="action-button__wrapper"
      >
        <div
          v-if="button.separated"
          class="horizontal-divider"
        />
        <ui-button
          v-if="!button.hide"
          :ref="button.action"
          class="action-button"
          :background-color="COLORS_DICT.TRANSPARENT"
          :color="button.color"
          :disabled="button.disabled"
          height="32px"
          width="156px"
          @clicked="button.handler"
        >
          <div class="button-content">
            <ui-icon
              :icon-name="button.loading ? 'connectLoaderAnimated' : button.icon"
              :color="button.color"
              size="18"
            />
            <span>{{ button.text }}</span>
          </div>
        </ui-button>
      </div>
    </div>
  </ui-menu>
</template>

<script setup>
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { computed, reactive } from 'vue';

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

const enableAction = useRequest(toolkit, true);
const disableAction = useRequest(toolkit, true);
const deleteAction = useRequest(toolkit, true);
const forceUploadAction = useRequest(toolkit, true);

const feedId = computed(() => props.feed.id);
const isFeedDisabled = computed(() => props.feed.status === STATUSES_DICT.DISABLED);

const buttons = reactive([
  {
    action: 'disable',
    color: COLORS_DICT.TEXT,
    text: 'Disable',
    icon: 'googleToggleOffBaseline',
    loading: disableAction.loading,
    hide: isFeedDisabled,
    handler: async () => {
      try {
        await disableAction.request(`/api/feeds/${feedId.value}/disable`, 'POST');
        emit('disabled');
      } catch (e) {
        /* empty */
      }
    },
  },
  {
    action: 'enable',
    color: COLORS_DICT.TEXT,
    text: 'Enable',
    icon: 'googleToggleOnBaseline',
    loading: enableAction.loading,
    hide: !isFeedDisabled.value,
    handler: async () => {
      try {
        await enableAction.request(`/api/feeds/${feedId.value}/enable`, 'POST');
        emit('enabled');
      } catch (e) {
        /* empty */
      }
    },
  },
  {
    action: 'forceUpload',
    color: COLORS_DICT.TEXT,
    text: 'Force upload',
    icon: 'googleUploadBaseline',
    loading: forceUploadAction.loading,
    disabled: isFeedDisabled.value,
    handler: async () => {
      try {
        await forceUploadAction.request(`/api/feeds/${feedId.value}/uploads/force`, 'POST');
        emit('uploaded');
      } catch (e) {
        /* empty */
      }
    },
  },
  {
    separated: true,
    action: 'delete',
    color: COLORS_DICT.NICE_RED,
    text: 'Delete',
    icon: 'googleDeleteForeverBaseline',
    loading: deleteAction.loading,
    handler: async () => {
      try {
        await deleteAction.request(`/api/feeds/${feedId.value}`, 'DELETE');
        emit('deleted');
      } catch (e) {
        /* empty */
      }
    },
  },
]);
</script>

<style scoped>
.actions-menu {
  position: relative;
  width: 156px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  border-radius: 2px;
  padding: 8px 0;
  box-shadow: 0 4px 20px 0 #00000040;
  z-index: 1;
}

.action-button {
  width: 100%;
  display: flex;
  padding: 0 8px;
  box-sizing: border-box;
}

.action-button__wrapper {
  width: 100%;
}

.button-content {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  text-transform: none;
}

.button-content ui-icon {
  margin-right: 8px;
}
</style>
