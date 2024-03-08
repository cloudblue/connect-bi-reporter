<template>
  <div class="detail-item">
    <div
      v-if="title || $slots.title"
      class="detail-item__head"
    >
      <slot name="title">
        <span>{{ title }}</span>
        <span
          v-if="subtitle"
          class="detail-item__subhead"
        >
          {{ subtitle }}
        </span>
      </slot>
    </div>
    <div class="detail-item__content-holder">
      <div
        v-if="$slots.image"
        class="detail-item__image"
      >
        <slot name="image" />
      </div>
      <div class="detail-item__content">
        <slot name="content">
          <div
            v-if="bodyText || $slots['body-text']"
            class="detail-item__text"
          >
            <slot name="body-text">
              <span>{{ bodyText }}</span>
            </slot>
          </div>
          <div
            v-if="assistiveText || $slots['assistive-text']"
            class="detail-item__assistive-text"
          >
            <slot name="assistive-text">
              <span>{{ assistiveText }}</span>
            </slot>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  bodyText: {
    type: String,
    default: '',
  },
  assistiveText: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.detail-item {
  min-width: 0;
  margin-top: 24px;
}

.detail-item:first-child {
  margin-top: 0;
}

.detail-item__head {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: var(--font-size-regular);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-small);
}

.detail-item__subhead {
  line-height: var(--line-height-small);
  color: var(--color-assistive-grey);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-regular);
  margin-left: 16px;
}

.detail-item__image {
  flex: 0 0 auto;
  margin-right: 4px;
}

.detail-item__content {
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 0;
}

.detail-item__text {
  line-height: var(--line-height-regular);
  font-size: var(--font-size-regular);
  word-wrap: break-word;
  word-break: break-word;
}

.detail-item__assistive-text {
  line-height: var(--line-height-small);
  color: var(--color-assistive-grey);
  font-size: var(--font-size-small);
  font-weight: var(--font-weight-regular);
}
</style>
