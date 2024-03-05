<template>
  <div class="loading-indicator">
    <ui-icon
      iconName="connectLoaderAnimated"
      :size="size"
      :color="COLORS_DICT.DARKER_BLUE"
    />
  </div>
</template>

<script setup>
import { COLORS_DICT } from '~/constants/colors';

defineProps({
  size: {
    type: [Number, String],
    default: 76,
  },
});
</script>

<style scoped>
.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 200px;
}
</style>
