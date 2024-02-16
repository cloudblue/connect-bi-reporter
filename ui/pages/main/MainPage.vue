<script setup>
import { ref, computed } from 'vue';
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';

const height = ref('');
const styles = computed(() => ({
  minHeight: height.value,
}));

const toolkit = useToolkit();

toolkit.listen('containerSize', (containerSize) => {
  height.value = containerSize.height;
});
</script>

<template>
  <div
    class="app"
    :style="styles"
  >
    <p>Connect BI Reporter Extension UI</p>
  </div>
</template>
