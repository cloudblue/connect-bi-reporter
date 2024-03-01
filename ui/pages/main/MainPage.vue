<template>
  <div
    class="app"
    :style="styles"
  >
    <div class="dialogs-container" />
    <router-view />
  </div>
</template>

<script setup>
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { ref, computed, provide } from 'vue';
import { RouterView } from 'vue-router';

const fullscreenHeight = ref('');
const styles = computed(() => ({
  height: fullscreenHeight.value,
}));

const toolkit = useToolkit();
toolkit.listen('fullscreenSize', ({ height }) => {
  fullscreenHeight.value = `${height}px`;
});

provide('fullscreen-height', fullscreenHeight);
</script>
