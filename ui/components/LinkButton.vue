<template>
  <button class="reset-button link-button">
    <ui-icon
      v-if="icon"
      :iconName="icon"
      size="16px"
      :color="COLORS_DICT.NICE_BLUE"
    />
    <slot>
      {{ text }}
    </slot>
  </button>
</template>

<script setup>
import { COLORS_DICT } from '~/constants/colors.js';

defineProps({
  text: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.link-button {
  text-decoration: underline;
  color: var(--color-nice-blue);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

.link-button ui-icon {
  margin-right: 4px;
  display: inline-flex;
}
</style>
