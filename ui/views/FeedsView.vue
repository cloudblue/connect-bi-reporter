<template>
  <ui-view
    title="Feeds"
    style="height: inherit"
    no-padded
  >
    <div
      v-if="!noItems"
      slot="actions"
      class="header-actions"
    >
      <ui-button
        class="header-button"
        :background-color="COLORS_DICT.WHITE"
        :color="COLORS_DICT.TEXT"
        height="36px"
        @clicked="openCreateFeedDialog"
      >
        <span>Create Feed</span>
      </ui-button>
    </div>
    <loading-indicator v-if="loading" />
    <empty-placeholder
      v-else-if="noItems"
      title="No Feeds"
      icon="googleAutoGraphBaseline"
      action="Create Feed"
      @action-clicked="openCreateFeedDialog"
    />
    <ui-complex-table
      v-else
      :headers="headers"
      :total-items="total"
      :current-page="page"
      fixed
      @next-clicked="next"
      @previous-clicked="previous"
    >
      <tr
        v-for="item in preparedItems"
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
          <spa-link
            v-else-if="header.key === 'schedule'"
            :to="connectPortalRoutes.reportsScheduleDetails"
            :params="item.scheduleId"
          >
            {{ item.scheduleId }}
          </spa-link>
          <ui-status
            v-else-if="header.key === 'status'"
            :icon-name="item.status.icon"
            :icon-color="item.status.color"
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
          >
            <ui-button
              class="actions-button"
              :background-color="COLORS_DICT.WHITE"
              height="36px"
              width="36px"
            >
              <ui-icon
                class="actions-button__trigger-icon"
                :color="COLORS_DICT.TEXT"
                icon-name="googleMoreVertBaseline"
              />
            </ui-button>
          </feed-actions>
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
import { onMounted, computed, ref } from 'vue';
import { RouterLink } from 'vue-router';

import CreateFeedDialog from '~/components/CreateFeedDialog.vue';
import DateItem from '~/components/DateItem.vue';
import EmptyPlaceholder from '~/components/EmptyPlaceholder.vue';
import FeedActions from '~/components/FeedActions.vue';
import LoadingIndicator from '~/components/LoadingIndicator.vue';
import SpaLink from '~/components/SpaLink.vue';
import { COLORS_DICT } from '~/constants/colors';
import { STATUSES } from '~/constants/statuses';

const headers = [
  { key: 'id', text: 'ID', width: '130px' },
  { key: 'schedule', text: 'Report Schedule', width: '215px' },
  { key: 'createdAt', text: 'created', width: '200px' },
  { key: 'description', text: 'description' },
  { key: 'status', text: 'status', width: '105px' },
  { key: 'actions', width: '36px' },
];

const { items, page, total, load, loading, next, previous } = useFastApiTableAdapter('/api/feeds');

const noItems = computed(() => {
  return !items.value.length;
});
const preparedItems = computed(() =>
  items.value.map((item) => ({
    id: item.id,
    scheduleId: item.schedule.id,
    createdAt: item.events.created.at,
    description: item.description,
    status: STATUSES[item.status],
    rawFeed: item,
  })),
);

const isCreateFeedDialogOpen = ref(false);
const openCreateFeedDialog = () => {
  isCreateFeedDialogOpen.value = true;
};

onMounted(async () => {
  await load();
});
</script>

<style scoped>
.actions-button__trigger-icon {
  margin: 0 -8px;
}
</style>
