<template>
  <div
    class="app"
    :style="styles"
  >
    <div class="dialogs-container" />
    <upload-schedule-card />
    <credentials-card />
  </div>
</template>

<script setup>
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { ref, computed, provide } from 'vue';

import CredentialsCard from '~/components/CredentialsCard.vue';
import UploadScheduleCard from '~/components/UploadScheduleCard.vue';

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

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
}
</style>
