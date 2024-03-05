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
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
}

.detail-item__subhead {
  line-height: 16px;
  color: #707070;
  font-size: 12px;
  font-weight: 400;
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
  line-height: 20px;
  font-size: 14px;
  word-wrap: break-word;
  word-break: break-word;
}

.detail-item__assistive-text {
  line-height: 16px;
  color: #707070;
  font-size: 12px;
  font-weight: 400;
}
</style>
