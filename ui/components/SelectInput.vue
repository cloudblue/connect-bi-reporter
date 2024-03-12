<template>
  <div class="select-input">
    <div
      v-if="label"
      class="select-input__label"
    >
      <p>{{ label }}</p>
    </div>
    <div class="select-input__real-input">
      <select v-model="model">
        <option
          v-for="option in options"
          :key="option[propValue]"
          :value="option[propValue]"
        />
      </select>
    </div>
    <ui-menu
      fullWidth
      closeOnClickInside
    >
      <div
        slot="trigger"
        class="select-input__selected"
      >
        <slot
          name="selected"
          :selectedItem="selectedItem"
        >
          <span>{{ model }}</span>
        </slot>
        <ui-icon
          iconName="googleArrowDropDownBaseline"
          :color="COLORS_DICT.DARK_GREY"
          size="24"
        />
      </div>
      <div
        slot="content"
        class="select-input__menu"
      >
        <div
          v-for="option in options"
          :key="option[propValue]"
          class="select-input__option"
          :class="{ 'select-input__option_selected': option[propValue] === model }"
          @click="setSelected(option)"
        >
          <slot
            name="option"
            :option="option"
            :isSelected="option[propValue] === model"
          >
            <span>{{ option[propValue] }}</span>
          </slot>
        </div>
      </div>
    </ui-menu>
    <div
      v-if="hint || $slots.hint"
      class="select-input__hint assistive-text"
    >
      <slot name="hint">
        <p>{{ hint }}</p>
      </slot>
    </div>
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
  options: {
    type: Array,
    required: true,
  },
  propValue: {
    type: String,
    default: 'id',
  },
  hint: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
});

const setSelected = (option) => {
  model.value = option[props.propValue];
};

const selectedItem = computed(
  () => props.options.find((option) => option[props.propValue] === model.value) || null,
);
</script>

<style scoped>
.select-input__selected {
  height: 44px;
  border-radius: 2px;
  border: 1px solid #d8d8d8;
  background-color: var(--color-darker-white);
  display: flex;
  padding: 4px 12px;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  cursor: pointer;
}
.select-input__menu {
  position: relative;
  z-index: 1;
  border: 1px solid #d8d8d8;
  border-radius: 2px;
  background-color: var(--color-darker-white);
  box-shadow: var(--box-shadow-simple);
}
.select-input__option {
  height: 48px;
  display: flex;
  align-items: center;
  padding: 4px 12px;
  box-sizing: border-box;
  cursor: pointer;
}
.select-input__option_selected {
  color: var(--color-nice-blue);
}
.select-input__real-input {
  display: none;
}

.select-input__hint {
  margin-top: 4px;
}

.select-input__label {
  font-size: var(--font-size-regular);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-regular);
  margin-bottom: 8px;
}
</style>
