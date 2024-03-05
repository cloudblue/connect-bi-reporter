<template>
  <div class="feed-summary">
    <p class="feed-summary__title">Summary</p>
    <div class="feed-summary__row">
      <p class="feed-summary__label">Feed</p>
      <router-link :to="detailsRoute">{{ id }}</router-link>
    </div>
    <div class="feed-summary__row">
      <p class="feed-summary__label">Status</p>
      <ui-status
        :iconName="feedStatus.icon"
        :iconColor="feedStatus.color"
        :text="feedStatus.text"
      />
    </div>
    <div class="feed-summary__row">
      <p class="feed-summary__label">Report Schedule</p>
      <spa-link
        :to="connectPortalRoutes.reportsScheduleDetails"
        :params="scheduleId"
      >
        {{ scheduleId }}
      </spa-link>
    </div>
    <div class="feed-summary__row">
      <p class="feed-summary__label">Credential</p>
      <p>{{ credential }}</p>
    </div>
    <div class="feed-summary__row">
      <p class="feed-summary__label">Description</p>
      <div class="truncator">
        <p class="truncate-text">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { connectPortalRoutes } from '@cloudblueconnect/connect-ui-toolkit';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import SpaLink from '~/components/SpaLink.vue';
import { STATUSES } from '~/constants/statuses';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  scheduleId: {
    type: String,
    required: true,
  },
  credential: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const feedStatus = computed(() => STATUSES[props.status]);

const detailsRoute = computed(() => ({
  name: 'feeds.details',
  params: { id: props.id },
}));
</script>

<style scoped>
.feed-summary__title {
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
  margin-bottom: 24px;
}
.feed-summary__row {
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
}
.feed-summary__row:last-child {
  border-bottom: none;
}
.feed-summary__label {
  font-weight: 500;
  width: 170px;
  flex-shrink: 0;
}
</style>
