<template>
  <div
    class="alert-holder"
    :class="`alert_${type}`"
  >
    <div class="alert">
      <div class="alert__icon">
        <ui-icon
          :iconName="icon"
          :color="typeAlert[type]"
          size="24"
        />
      </div>
      <div class="alert__text">
        <slot name="message"> {{ message }} </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { COLORS_DICT } from '~/constants/colors.js';

defineProps({
  message: {
    type: String,
    default: 'List is empty. Please add item.',
  },

  icon: {
    type: String,
    default: 'googleInfoBaseline',
  },

  type: {
    type: String,
    default: 'default',
  },
});

const typeAlert = {
  info: COLORS_DICT.DEEP_BLUE,
  error: COLORS_DICT.NICE_RED,
  success: COLORS_DICT.NICE_GREEN,
  warning: COLORS_DICT.NICE_YELLOW,
  default: COLORS_DICT.MIDDLE_GREY,
};
</script>

<style scoped>
.alert-holder {
  width: 100%;
  background-color: #bdbdbd26;
}
.alert {
  align-items: center;
  box-sizing: border-box;
  display: inline-flex;
  min-height: 64px;
  min-width: 240px;
  max-width: 600px;
  padding: 16px;
  border-radius: 2px;
  color: var(--color-middle-grey);
}

.alert_error {
  background-color: #ff6a6a33;
}

.alert_info {
  background-color: #0055ff26;
}
.alert_success {
  background-color: #0bb07126;
}
.alert_warning {
  background-color: #ffc70026;
}

.alert__icon {
  flex: 0 0 auto;
  margin-right: 12px;
  display: flex;
}

.alert__text {
  flex: 1 1 auto;
  font-size: var(--font-size-regular);
  line-height: var(--line-height-regular);
  text-align: left;
  color: var(--color-text);
}
</style>
