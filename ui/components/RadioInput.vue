<template>
  <div
    class="radio-input"
    @click="select"
  >
    <ui-icon
      class="radio-input__box"
      :iconName="icon"
      :color="iconColor"
    />
    <label
      class="radio-input__label"
      :class="{ 'radio-input__label_empty': !label }"
    >
      <input
        v-model="model"
        :value="value"
        class="radio-input__input"
        type="radio"
      />
      <span class="radio-input__label-text">{{ label }}</span>
    </label>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import { COLORS_DICT } from '~/constants/colors';

const model = defineModel({
  type: String,
  required: true,
});

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
});

const isSelected = computed(() => model.value === props.value);
const icon = computed(() =>
  isSelected.value ? 'googleRadioButtonCheckedBaseline' : 'googleRadioButtonUncheckedBaseline',
);
const iconColor = computed(() => (isSelected.value ? COLORS_DICT.NICE_BLUE : ''));

const select = () => {
  model.value = props.value;
};
</script>

<style scoped>
.radio-input {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
}
.radio-input__box {
  flex-shrink: 0;
  cursor: pointer;
}

.radio-input__input {
  display: none;
}

.radio-input__label {
  display: block;
  margin-left: 8px;
  user-select: none;
}
.radio-input__label_empty {
  display: none;
}

.radio-input__label-text {
  margin: 0;
  font-size: var(--font-size-regular);
  line-height: var(--line-height-big);
}
</style>
