<template>
  <div class="radio-table">
    <p class="radio-table__title">{{ title }}</p>
    <div
      v-if="!hideSearch"
      class="radio-table__search"
    >
      <ui-textfield
        :placeholder="searchPlaceholder"
        @input="setSearch"
      />
    </div>
    <div class="radio-table__table">
      <div
        v-for="item in items"
        :key="item[valueProp]"
        class="radio-table__item"
        @click="selectItem(item)"
      >
        <div class="radio-table__item-content">
          <slot :item="item" />
        </div>
        <radio-input
          v-model="value"
          :value="item[valueProp]"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import RadioInput from '~/components/RadioInput.vue';
import { processEvent } from '~/utils/webComponents';

const value = defineModel({
  type: String,
  default: '',
});
const emit = defineEmits(['search']);

const props = defineProps({
  valueProp: {
    type: String,
    default: 'id',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array,
    default: () => [],
  },
  hideSearch: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  searchPlaceholder: {
    type: String,
    default: '',
  },
});

const selectItem = (item) => {
  value.value = item[props.valueProp];
};

const setSearch = processEvent((searchStr) => {
  emit('search', searchStr);
});
</script>

<style scoped>
.radio-table__title {
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  margin-bottom: 24px;
}

.radio-table__search {
  margin-bottom: 12px;
}

.radio-table__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
}

.radio-table__item:last-child {
  border-bottom: none;
}

.radio-table__item-content {
  flex-grow: 1;
}

.radio-table__item :deep(.radio-input) {
  flex-shrink: 0;
  margin-left: 24px;
}
</style>
