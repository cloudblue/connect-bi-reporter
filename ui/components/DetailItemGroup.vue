<template>
  <div
    class="detail-item-group"
    :class="{ 'detail-item-group_separated': separated }"
  >
    <slot />
  </div>
</template>

<script setup>
defineProps({
  separated: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.detail-item-group {
  margin-top: 24px;
  display: inline-flex;
  align-items: flex-start;
  vertical-align: top;
}

.detail-item-group_separated {
  margin-top: 32px;
  border-top: 1px solid #e0e0e0;
  padding-top: 32px;
}

.detail-item-group:first-child {
  margin-top: 0;
}

.detail-item-group :deep(.detail-item) {
  margin-right: 32px;
  margin-top: 0;
}
</style>
