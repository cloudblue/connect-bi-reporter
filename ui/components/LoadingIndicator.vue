<template>
  <div class="loading-indicator">
    <ui-icon
      icon-name="connectLoaderAnimated"
      :size="size"
      color="#4797f2"
    />
  </div>
</template>

<script setup>
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
