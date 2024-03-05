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
  background-color: #f2f2f2;
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
  border: 1px solid #e0e0e0;
}

.empty-placeholder_action ui-icon {
  padding-right: 4px;
}

.empty-placeholder_action span {
  padding: 0 8px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}

h2 {
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 400;
  line-height: 1;
}

p {
  font-size: 16px;
  line-height: 1.5;
}

h2,
p {
  color: rgba(0, 0, 0, 0.5);
  text-align: center;
}
</style>
