<template>
  <teleport to=".dialogs-container">
    <div
      v-if="value"
      v-bind="$attrs"
      class="dialog"
      :style="{ height: containerHeight }"
    >
      <div
        class="dialog__container"
        :style="{ height, width }"
      >
        <div class="dialog__header">
          <slot name="header">
            <p class="dialog__title">{{ title }}</p>
          </slot>
        </div>
        <div class="dialog__body">
          <div
            v-if="$slots.sidebar"
            class="dialog__sidebar"
          >
            <slot name="sidebar" />
          </div>
          <div class="dialog__content-wrapper">
            <div class="dialog__content">
              <slot name="default" />
            </div>
            <div class="dialog__actions">
              <template v-for="action in computedActions">
                <div
                  v-if="action.key === 'spacer'"
                  :key="action.key"
                  class="dialog__spacer"
                />
                <ui-button
                  v-else
                  :key="action.key"
                  class="dialog__action"
                  :disabled="action.disabled"
                  :color="action.color || COLORS_DICT.TEXT"
                  height="36px"
                  backgroundColor="transparent"
                  @clicked="action.handler"
                >
                  <ui-icon
                    v-if="action.loading"
                    class="dialog__action-icon"
                    :color="action.color || COLORS_DICT.TEXT"
                    iconName="connectLoaderAnimated"
                    size="24"
                  />
                  <span
                    v-else
                    class="dialog__action-label"
                  >
                    {{ action.label }}
                  </span>
                </ui-button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { inject, watch, onBeforeUnmount, computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { COLORS_DICT } from '~/constants/colors';
import { ACTIONS_DICT } from '~/constants/dialogs.js';
import { buildAction } from '~/utils/dialogs';

const value = defineModel({
  type: Boolean,
  default: false,
});

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  actions: {
    type: Array,
    required: true,
    validator(value) {
      return value.every((action) => Object.values(ACTIONS_DICT).includes(action));
    },
  },
  height: {
    type: String,
    default: '600px',
  },
  width: {
    type: String,
    default: '800px',
  },
  onSubmit: {
    type: Function,
    default: () => {},
  },
  isValid: {
    type: Boolean,
    default: true,
  },
  backDisabled: {
    type: Boolean,
    default: false,
  },
  detailsRoute: {
    type: Object,
    default: () => ({}),
  },
  submitLabel: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['next', 'back']);

const router = useRouter();
const isSubmitting = ref(false);

const submit = async () => {
  isSubmitting.value = true;

  try {
    await props.onSubmit();
  } finally {
    isSubmitting.value = false;
  }
};

const close = () => (value.value = false);

const actionDict = computed(() => ({
  [ACTIONS_DICT.CANCEL]: buildAction(ACTIONS_DICT.CANCEL, { handler: close }),
  [ACTIONS_DICT.CLOSE]: buildAction(ACTIONS_DICT.CLOSE, { handler: close }),
  [ACTIONS_DICT.SUBMIT]: buildAction(ACTIONS_DICT.SUBMIT, {
    disabled: !props.isValid,
    handler: submit,
    label: props.submitLabel,
    loading: isSubmitting.value,
    color: COLORS_DICT.NICE_BLUE,
  }),
  [ACTIONS_DICT.SAVE]: buildAction(ACTIONS_DICT.SAVE, {
    disabled: !props.isValid,
    handler: async () => {
      await submit();
      close();
    },
    loading: isSubmitting.value,
    color: COLORS_DICT.NICE_BLUE,
  }),
  [ACTIONS_DICT.DELETE]: buildAction(ACTIONS_DICT.DELETE, {
    disabled: !props.isValid,
    handler: async () => {
      await submit();
      close();
    },
    loading: isSubmitting.value,
    color: COLORS_DICT.NICE_RED,
  }),
  [ACTIONS_DICT.DETAILS]: buildAction(ACTIONS_DICT.DETAILS, {
    handler: () => router.push(props.detailsRoute),
  }),
  [ACTIONS_DICT.SPACER]: buildAction(ACTIONS_DICT.SPACER),
  [ACTIONS_DICT.NEXT]: buildAction(ACTIONS_DICT.NEXT, {
    disabled: !props.isValid,
    handler: () => emit('next'),
    color: COLORS_DICT.NICE_BLUE,
  }),
  [ACTIONS_DICT.BACK]: buildAction(ACTIONS_DICT.BACK, {
    disabled: props.backDisabled,
    handler: () => emit('back'),
  }),
}));

const computedActions = computed(() => props.actions.map((act) => actionDict.value[act]));

const containerHeight = inject('fullscreen-height');

watch(
  value,
  (isOpen) => {
    if (isOpen) document.documentElement.classList.add('is-clipped');
    else document.documentElement.classList.remove('is-clipped');
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  document.documentElement.classList.remove('is-clipped');
});
</script>

<style scoped>
.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  background-color: rgba(33, 33, 33, 0.46);
  z-index: 10;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog__container {
  max-height: 90%;
  max-width: calc(100% - 48px);
  display: flex;
  flex-direction: column;
  z-index: 11;
  overflow: hidden;
  background-color: white;
  border-radius: 4px;
  box-shadow:
    0 11px 15px -7px rgba(0, 0, 0, 0.2),
    0 24px 38px 3px rgba(0, 0, 0, 0.14),
    0 9px 46px 8px rgba(0, 0, 0, 0.12);
}

.dialog__header {
  height: 64px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  padding: 20px 24px;
  box-sizing: border-box;
}

.dialog__title {
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
}

.dialog__body {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  overflow: auto;
}

.dialog__sidebar {
  width: 220px;
  background: #f5f5f5;
  border-right: 1px solid #e0e0e0;
}

.dialog__content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dialog__content {
  flex-grow: 1;
  padding: 24px;
  overflow: scroll;
}

.dialog__actions {
  height: 52px;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 0 8px;
}

.dialog__action {
  margin: 0 8px;
}

.dialog__action-icon,
.dialog__action-label {
  display: inline-block;
  min-width: 64px;
}

.dialog__action-label {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
}

.dialog__spacer {
  flex-grow: 1;
}
</style>
