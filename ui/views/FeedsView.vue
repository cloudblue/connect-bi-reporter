<template>
  <ui-view
    title="Feeds"
    style="height: inherit"
    noPadded
  >
    <div
      v-if="!noFeeds"
      slot="actions"
      class="header-actions"
    >
      <ui-button
        class="header-button"
        :backgroundColor="COLORS_DICT.WHITE"
        :color="COLORS_DICT.TEXT"
        height="36px"
        @clicked="openCreateFeedDialog"
      >
        <span>Create Feed</span>
      </ui-button>
    </div>
    <loading-indicator v-if="loading" />
    <empty-placeholder
      v-else-if="noFeeds"
      title="No Feeds"
      icon="googleAutoGraphBaseline"
      action="Create Feed"
      @action-clicked="openCreateFeedDialog"
    />
    <ui-complex-table
      v-else
      :headers="headers"
      :totalItems="total"
      :currentPage="page"
      fixed
      @next-clicked="next"
      @previous-clicked="previous"
    >
      <tr
        v-for="item in preparedFeeds"
        :key="item.id"
      >
        <td
          v-for="header in headers"
          :key="header.key"
        >
          <router-link
            v-if="header.key === 'id'"
            :to="{ name: 'feeds.details', params: { id: item.id } }"
            >{{ item.id }}</router-link
          >
          <detail-item
            v-else-if="header.key === 'schedule'"
            :assistiveText="item.schedule.id"
          >
            <template #body-text>
              <spa-link
                :to="connectPortalRoutes.reportsScheduleDetails"
                :params="item.schedule.id"
              >
                {{ item.schedule.name }}
              </spa-link>
            </template>
          </detail-item>
          <ui-status
            v-else-if="header.key === 'status'"
            :iconName="item.status.icon"
            :iconColor="item.status.color"
            :text="item.status.text"
          />
          <date-item
            v-else-if="header.key === 'createdAt'"
            :date="item.createdAt"
          />
          <feed-actions
            v-if="header.key === 'actions'"
            :feed="item.rawFeed"
            @enabled="load"
            @disabled="load"
            @uploaded="load"
            @deleted="load"
          />
          <div
            v-else-if="header.key === 'description'"
            class="truncator"
          >
            <span
              class="truncate-text"
              :class="{ 'assistive-color': !item[header.key] }"
            >
              {{ item[header.key] || '—' }}
            </span>
          </div>
        </td>
      </tr>
    </ui-complex-table>

    <create-feed-dialog
      v-model="isCreateFeedDialogOpen"
      @created="load"
    />
  </ui-view>
</template>

<script setup>
import { connectPortalRoutes } from '@cloudblueconnect/connect-ui-toolkit';
import { useFastApiTableAdapter } from '@cloudblueconnect/connect-ui-toolkit/tools/fastApi/vue';
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';

import CreateFeedDialog from '~/components/CreateFeedDialog.vue';
import DateItem from '~/components/DateItem.vue';
import DetailItem from '~/components/DetailItem.vue';
import EmptyPlaceholder from '~/components/EmptyPlaceholder.vue';
import FeedActions from '~/components/FeedActions.vue';
import LoadingIndicator from '~/components/LoadingIndicator.vue';
import SpaLink from '~/components/SpaLink.vue';
import { COLORS_DICT } from '~/constants/colors';
import { STATUSES } from '~/constants/statuses';
import { request } from '~/utils/api.js';

const headers = [
  { key: 'id', text: 'ID', width: '130px' },
  { key: 'schedule', text: 'Report Schedule', width: '215px' },
  { key: 'createdAt', text: 'created', width: '200px' },
  { key: 'description', text: 'description' },
  { key: 'status', text: 'status', width: '105px' },
  { key: 'actions', width: '36px' },
];

const {
  items: feeds,
  page,
  total,
  load: loadFeeds,
  next: loadNextFeeds,
  previous: loadPreviousFeeds,
} = useFastApiTableAdapter('/api/feeds');
const loading = ref(false);
const schedules = ref([]);
const preparedFeeds = ref([]);

const noFeeds = computed(() => {
  return !feeds.value.length;
});

const prepareFeeds = () => {
  preparedFeeds.value = feeds.value.map((feed) => ({
    id: feed.id,
    schedule: schedules.value.find((schedule) => schedule.id === feed.schedule.id),
    createdAt: feed.events.created.at,
    description: feed.description,
    status: STATUSES[feed.status],
    rawFeed: feed,
  }));
};

const loadSchedules = async () => {
  if (!feeds.value.length) {
    preparedFeeds.value = [];
    return;
  }

  const scheduleIds = feeds.value.map((feed) => feed.schedule.id);
  schedules.value = await request(
    `/public/v1/reporting/schedules?(in(id,(${scheduleIds.join(',')})))`,
  );
};

const load = async () => {
  await loadData(loadFeeds);
};

const next = async () => {
  await loadData(loadNextFeeds);
};

const previous = async () => {
  await loadData(loadPreviousFeeds);
};

const loadData = async (loadFn) => {
  loading.value = true;

  await loadFn();
  await loadSchedules();
  prepareFeeds();

  loading.value = false;
};

const isCreateFeedDialogOpen = ref(false);
const openCreateFeedDialog = () => {
  isCreateFeedDialogOpen.value = true;
};

load();
</script>

<style scoped>
.actions-button__trigger-icon {
  margin: 0 -8px;
}
</style>
