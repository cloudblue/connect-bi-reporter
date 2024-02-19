<template>
  <a @click="onLinkClick">
    <slot />
  </a>
</template>

<script setup>
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';

const props = defineProps({
  to: {
    type: [String, Object, Symbol],
    default: '',
  },
  params: {
    type: [String, Number, Object],
    required: false,
    default: undefined,
  },
});

const { navigateTo } = useToolkit();

const onLinkClick = (e) => {
  e.preventDefault();
  e.stopPropagation();

  navigateTo(props.to, props.params);
};
</script>
