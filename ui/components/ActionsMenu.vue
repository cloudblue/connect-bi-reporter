<template>
  <ui-menu
    class="actions-menu"
    align="right"
    :closeOnClickInside="false"
  >
    <div
      slot="trigger"
      class="actions-menu__trigger"
    >
      <slot name="trigger">
        <ui-button
          class="actions-menu__trigger-button"
          :backgroundColor="COLORS_DICT.WHITE"
          height="36px"
          width="36px"
        >
          <ui-icon
            class="actions-menu__trigger-icon"
            :color="COLORS_DICT.TEXT"
            iconName="googleMoreVertBaseline"
          />
        </ui-button>
      </slot>
    </div>
    <div
      slot="content"
      class="actions-menu__content"
    >
      <div
        v-for="action in actions"
        :key="action.key"
        class="actions-menu__action"
      >
        <div
          v-if="action.separated"
          class="horizontal-divider"
        />
        <ui-button
          v-if="!action.hide"
          :ref="action.key"
          :backgroundColor="COLORS_DICT.TRANSPARENT"
          :color="action.color || COLORS_DICT.TEXT"
          :disabled="action.disabled"
          height="32px"
          width="156px"
          @clicked="action.handler"
        >
          <div class="actions-menu__action-content">
            <ui-icon
              :iconName="action.loading ? 'connectLoaderAnimated' : action.icon"
              :color="action.color || COLORS_DICT.TEXT"
              size="18"
            />
            <span>{{ action.text }}</span>
          </div>
        </ui-button>
      </div>
    </div>
  </ui-menu>
</template>

<script setup>
import { COLORS_DICT } from '~/constants/colors.js';

defineProps({
  actions: {
    type: Array,
    required: true,
    validator(actions) {
      return (
        actions.length > 0 &&
        actions.every((action) =>
          Boolean(action.key && action.text && action.icon && action.handler),
        )
      );
    },
  },
});
</script>

<style scoped>
.actions-menu {
}

.actions-menu__trigger {
}

.actions-menu__trigger-button {
}

.actions-menu__trigger-icon {
  margin: 0 -8px;
}

.actions-menu__content {
  position: relative;
  width: 156px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  border-radius: 2px;
  padding: 8px 0;
  box-shadow: 0 4px 20px 0 #00000040;
  z-index: 1;
}

.actions-menu__action {
  width: 100%;
}

.actions-menu__action ui-button {
  width: 100%;
  display: flex;
  padding: 0 8px;
  box-sizing: border-box;
}

.actions-menu__action-content {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  text-transform: none;
}
.actions-menu__action-content ui-icon {
  margin-right: 8px;
}
</style>
