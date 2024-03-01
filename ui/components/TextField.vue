<template>
  <ui-textfield
    :value="value"
    :label="label"
    :placeholder="placeholder"
    :suffix="suffix"
    @input="setValue"
  />
</template>

<script setup>
import { processEvent } from '~/utils/webComponents';

defineProps({
  label: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  suffix: {
    type: String,
    default: '',
  },
});

const value = defineModel({
  type: String,
  default: '',
});

const setValue = processEvent((newValue) => (value.value = newValue));
</script>
