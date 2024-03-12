<template>
  <div class="empty-placeholder">
    <div class="empty-placeholder_content">
      <div class="empty-placeholder_icon">
        <ui-icon
          :iconName="icon"
          :color="COLORS_DICT.MIDDLE_GREY"
          size="56"
        />
      </div>
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <ui-button
        v-if="action"
        class="empty-placeholder_action"
        backgroundColor="transparent"
        :color="COLORS_DICT.NICE_BLUE"
        @clicked="$emit('actionClicked')"
      >
        <ui-icon
          iconName="googleAddBaseline"
          :color="COLORS_DICT.NICE_BLUE"
          size="18"
        />
        <span>{{ action }}</span>
      </ui-button>
    </div>
  </div>
</template>

<script setup>
import { COLORS_DICT } from '~/constants/colors';

defineProps({
  title: {
    type: String,
    default: 'No data',
  },
  message: {
    type: String,
    default: 'There is no data to be shown.',
  },
  icon: {
    type: String,
    default: 'googleQuestionMarkBaseline',
  },
  action: {
    type: String,
    default: '',
  },
});

defineEmits(['actionClicked']);
</script>

<style scoped>
.empty-placeholder {
  width: 100%;
  margin-top: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-placeholder_content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-placeholder_icon {
  height: 96px;
  width: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  background-color: var(--color-lightest-grey);
  border-radius: 50%;
}

.empty-placeholder_action {
  height: 36px;
  margin-top: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  border: 1px solid var(--color-light-grey);
}

.empty-placeholder_action ui-icon {
  padding-right: 4px;
}

.empty-placeholder_action span {
  padding: 0 8px;
  font-size: var(--font-size-regular);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-regular);
}

h2 {
  margin-bottom: 24px;
  font-size: var(--font-size-huge);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-smallest);
}

p {
  font-size: var(--font-size-medium);
  line-height: var(--line-height-big);
}

h2,
p {
  color: var(--color-assistive-grey);
  text-align: center;
}
</style>
