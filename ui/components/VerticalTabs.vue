<template>
  <div
    class="vertical-tabs"
    :class="computedRootClasses"
  >
    <div
      v-for="tab in computedTabs"
      :key="tab.key"
      class="vertical-tabs__tab"
      :class="tab.classes"
      @click="onTabClick(tab)"
    >
      <div
        v-if="props.linear"
        class="vertical-tabs__tab-index"
      >
        <ui-icon
          v-if="tab.skipStep"
          icon-name="googleArrowDownwardBaseline"
          :color="COLORS_DICT.NICE_BLUE"
          size="18"
        />
        <span v-else-if="tab.inactive || tab.active">{{ tab.step }}</span>
        <ui-icon
          v-else
          icon-name="googleCheckBaseline"
          :color="COLORS_DICT.NICE_BLUE"
          size="18"
        />
      </div>
      <p>{{ tab.label }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import { COLORS_DICT } from '~/constants/colors';

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  linear: {
    type: Boolean,
    default: false,
  },
});

const activeTabKey = defineModel('activeTabKey', {
  type: String,
  default: '',
});

const activeTabIndex = computed(() =>
  props.tabs.findIndex((tab) => tab.key === activeTabKey.value),
);

const computedTabs = computed(() =>
  props.tabs.map((tab, index) => ({
    ...tab,
    step: index + 1,
    active: index === activeTabIndex.value,
    inactive: props.linear && index > activeTabIndex.value,
    classes: {
      'vertical-tabs__tab_active': index === activeTabIndex.value,
      'vertical-tabs__tab_inactive': tab.skipStep || (props.linear && index > activeTabIndex.value),
    },
  })),
);

const computedRootClasses = computed(() => ({
  'vertical-tabs_linear': props.linear,
}));

const onTabClick = (tab) => {
  if (!props.linear) activeTabKey.value = tab.key;
};
</script>

<style scoped>
.vertical-tabs {
  width: 100%;
  height: 100%;
  overflow: scroll;
  display: flex;
  flex-direction: column;
}

.vertical-tabs_linear .vertical-tabs__tab {
  cursor: default;
}

.vertical-tabs__tab {
  height: 64px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 24px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  cursor: pointer;
  position: relative;
}

.vertical-tabs__tab_active {
  border-right: 3px solid #2c98f0;
  color: #2c98f0;
  font-weight: 500;
  background-color: #2c98f026;
}

.vertical-tabs__tab_inactive {
  color: #707070;
}

.vertical-tabs__tab-index {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  border-radius: 50%;
  font-weight: 500;
  text-align: center;
  letter-spacing: -1px;
  background-color: #2c98f033;
}

.vertical-tabs__tab_active .vertical-tabs__tab-index {
  opacity: 1;
  background-color: #2c98ef;
  color: white;
}

.vertical-tabs__tab_inactive .vertical-tabs__tab-index {
  background-color: #bdbdbd33;
  color: #00000033;
}

.vertical-tabs__tab-index::before {
  top: 0;
}
.vertical-tabs__tab-index::after {
  bottom: 0;
}
.vertical-tabs__tab-index::before,
.vertical-tabs__tab-index::after {
  content: '';
  position: absolute;
  left: 36px;
  z-index: 0;
  width: 1px;
  height: 25%;
  margin-left: -0.5px;
  background-color: #2c98ef;
  opacity: 15%;
}

.vertical-tabs__tab_active .vertical-tabs__tab-index::before,
.vertical-tabs__tab_active .vertical-tabs__tab-index::after,
.vertical-tabs__tab:first-of-type .vertical-tabs__tab-index::before,
.vertical-tabs__tab:last-of-type .vertical-tabs__tab-index::after {
  content: none;
}
</style>
