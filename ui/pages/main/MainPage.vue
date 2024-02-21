<template>
  <div
    class="app"
    :style="styles"
  >
    <router-view />
  </div>
</template>

<script setup>
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { ref, computed } from 'vue';
import { RouterView } from 'vue-router';

const height = ref('');
const styles = computed(() => ({
  minHeight: height.value,
}));

const toolkit = useToolkit();

toolkit.listen('containerSize', (containerSize) => {
  height.value = containerSize.height;
});
</script>
