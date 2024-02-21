<template>
  <ui-view
    title="Feeds"
    no-padded
  >
    <empty-placeholder
      v-if="noItems"
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
            >{{ item.scheduleId }}</spa-link
          >
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
          <div
            v-else
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
  </ui-view>
</template>

<script setup>
import { connectPortalRoutes } from '@cloudblueconnect/connect-ui-toolkit';
import { useFastApiTableAdapter } from '@cloudblueconnect/connect-ui-toolkit/tools/fastApi/vue';
import { onMounted, computed } from 'vue';
import { RouterLink } from 'vue-router';

import DateItem from '~/components/DateItem.vue';
import EmptyPlaceholder from '~/components/EmptyPlaceholder.vue';
import SpaLink from '~/components/SpaLink.vue';
import { STATUSES } from '~/constants/statuses';

const headers = [
  { key: 'id', text: 'ID', width: '130px' },
  { key: 'schedule', text: 'Report Schedule', width: '215px' },
  { key: 'createdAt', text: 'created', width: '200px' },
  { key: 'description', text: 'description' },
  { key: 'status', text: 'status', width: '105px' },
];

const { items, page, total, load, next, previous } = useFastApiTableAdapter('/api/feeds');

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
  })),
);

// noop
const openCreateFeedDialog = () => {};

onMounted(async () => {
  await load();
});
</script>
