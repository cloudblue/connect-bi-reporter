<template>
  <span class="spa-link">
    <a @click="onLinkClick">
      <slot />
    </a>
    <ui-icon
      iconName="googleOpenInNewBaseline"
      size="12px"
      :color="COLORS_DICT.NICE_BLUE"
    />
  </span>
</template>

<script setup>
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';

import { COLORS_DICT } from '~/constants/colors.js';

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

<style scoped>
.spa-link {
  display: inline-flex;
  align-items: center;
}

.spa-link a {
  text-decoration-style: dotted;
  line-height: inherit;
}

.spa-link a:hover {
  text-decoration-style: solid;
}

.spa-link ui-icon {
  margin-left: 4px;
  margin-top: -2px;
}
</style>
