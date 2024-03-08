<template>
  <button class="link-button reset-button">
    <slot>
      {{ text }}
    </slot>
  </button>
</template>

<script setup>
defineProps({
  text: {
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
}
</style>
