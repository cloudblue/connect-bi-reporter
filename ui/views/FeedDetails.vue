<template>
  <ui-view
    :title="feedId"
    assistive-title="Feed Details"
    style="min-height: inherit"
    show-back-button
    @go-back="goToFeeds"
  >
    <loading-indicator v-if="loading" />
    <template v-else>
      <div
        slot="actions"
        class="header-actions"
      >
        <ui-button
          class="header-button"
          :background-color="COLORS_DICT.WHITE"
          :color="COLORS_DICT.TEXT"
          height="36px"
        >
          <span>EDIT</span>
        </ui-button>
        <feed-actions
          :feed="feed"
          @enabled="loadFeed"
          @disabled="loadFeed"
          @uploaded="loadFeed"
          @deleted="goToFeeds"
        >
          <ui-button
            class="header-button"
            :background-color="COLORS_DICT.WHITE"
            height="36px"
            width="36px"
          >
            <ui-icon
              class="actions-menu__trigger-icon"
              :color="COLORS_DICT.TEXT"
              icon-name="googleArrowDropDownBaseline"
            />
          </ui-button>
        </feed-actions>
      </div>

      <div class="header">
        <detail-item-group>
          <detail-item title="Report Schedule">
            <template #body-text>
              <spa-link
                :to="connectPortalRoutes.reportsScheduleDetails"
                :params="feed.schedule?.id"
              >
                {{ feed.schedule?.id }}
              </spa-link>
            </template>
          </detail-item>
          <detail-item title="Status">
            <template #content>
              <ui-status
                v-if="feedStatus"
                :icon-name="feedStatus.icon"
                :icon-color="feedStatus.color"
                :text="feedStatus.text"
              />
            </template>
          </detail-item>
        </detail-item-group>
      </div>

      <ui-tabs
        :current-tab="currentTab"
        :tabs="tabs"
        @click-tab="setCurrentTab"
      >
        <div
          v-if="currentTab === 'general'"
          slot="general"
          class="general-tab"
        >
          <detail-item
            title="Credentials"
            :body-text="feed.credential.id"
          />
          <detail-item title="Description">
            <template #body-text>
              <span :class="{ 'assistive-color': !feed.description }">
                {{ feed.description || '—' }}
              </span>
            </template>
          </detail-item>
          <detail-item-group separated>
            <detail-item
              title="Created"
              :assistive-text="feed.events.created.by.id"
            >
              <template #body-text>
                <date-item :date="feed.events.created.at" />
              </template>
            </detail-item>
            <detail-item
              title="Updated"
              :assistive-text="feed.events.updated.by.id"
            >
              <template #body-text>
                <date-item :date="feed.events.updated.at" />
              </template>
            </detail-item>
          </detail-item-group>
        </div>
      </ui-tabs>
    </template>
  </ui-view>
</template>

<script setup>
import { connectPortalRoutes } from '@cloudblueconnect/connect-ui-toolkit';
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import DateItem from '~/components/DateItem.vue';
import DetailItem from '~/components/DetailItem.vue';
import DetailItemGroup from '~/components/DetailItemGroup.vue';
import FeedActions from '~/components/FeedActions.vue';
import LoadingIndicator from '~/components/LoadingIndicator.vue';
import SpaLink from '~/components/SpaLink.vue';
import { useRequest } from '~/composables/api';
import { COLORS_DICT } from '~/constants/colors';
import { STATUSES } from '~/constants/statuses';

const route = useRoute();
const router = useRouter();
const toolkit = useToolkit();

const { loading, request, responseObject: feed } = useRequest(toolkit);

const feedId = computed(() => route.params.id);
const feedStatus = computed(() => STATUSES[feed.status]);

const tabs = [
  {
    value: 'general',
    label: 'General',
  },
  {
    value: 'uploads',
    label: 'Uploads',
  },
];
const currentTab = ref('general');

const goToFeeds = () => {
  router.replace({ name: 'feeds' });
};
const loadFeed = () => request(`/api/feeds/${feedId.value}`);
const setCurrentTab = ({ detail: tab }) => {
  currentTab.value = tab;
};

watch(feedId, loadFeed, { immediate: true });
</script>

<style scoped>
.header-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.header-actions .feed-actions .header-button {
  margin-left: 16px;
}

.header-button {
  display: block;
  height: 36px;
  border: 1px solid #e0e0e0;
  border-radius: 2px;
}

.header-button span {
  padding: 0 8px;
  font-weight: 500;
  letter-spacing: 0.4px;
}

.actions-menu__trigger-icon {
  margin: 0 -8px;
}

.general-tab {
  max-width: 640px;
}
</style>
