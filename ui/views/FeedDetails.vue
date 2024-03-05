<template>
  <ui-view
    :title="feedId"
    assistiveTitle="Feed Details"
    style="height: inherit"
    showBackButton
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
          :backgroundColor="COLORS_DICT.WHITE"
          :color="COLORS_DICT.TEXT"
          height="36px"
          @clicked="openEditFeedDialog"
        >
          <span>Edit</span>
        </ui-button>
        <feed-actions
          :feed="feed"
          @enabled="loadFeed"
          @disabled="loadFeed"
          @uploaded="loadFeed"
          @deleted="goToFeeds"
        >
          <ui-button
            class="header-button header-button_menu"
            :backgroundColor="COLORS_DICT.WHITE"
            height="36px"
            width="36px"
          >
            <ui-icon
              class="header-button__trigger-icon"
              :color="COLORS_DICT.TEXT"
              iconName="googleArrowDropDownBaseline"
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
                :iconName="feedStatus.icon"
                :iconColor="feedStatus.color"
                :text="feedStatus.text"
              />
            </template>
          </detail-item>
        </detail-item-group>
      </div>

      <ui-tabs
        :currentTab="currentTab"
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
            :bodyText="feed.credential.id"
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
              :assistiveText="feed.events.created.by.id"
            >
              <template #body-text>
                <date-item :date="feed.events.created.at" />
              </template>
            </detail-item>
            <detail-item
              title="Updated"
              :assistiveText="feed.events.updated.by.id"
            >
              <template #body-text>
                <date-item :date="feed.events.updated.at" />
              </template>
            </detail-item>
          </detail-item-group>
        </div>

        <div
          v-if="currentTab === 'uploads'"
          slot="uploads"
          class="uploads-tab"
        >
          <uploads-table :feedId="feedId" />
        </div>
      </ui-tabs>
    </template>
    <edit-feed-dialog
      v-model="isDialogOpen"
      :feed="feed"
      @updated="loadFeed"
    />
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
import EditFeedDialog from '~/components/EditFeedDialog.vue';
import FeedActions from '~/components/FeedActions.vue';
import LoadingIndicator from '~/components/LoadingIndicator.vue';
import SpaLink from '~/components/SpaLink.vue';
import UploadsTable from '~/components/UploadsTable.vue';
import { useRequest } from '~/composables/api';
import { COLORS_DICT } from '~/constants/colors';
import { STATUSES } from '~/constants/statuses';

const route = useRoute();
const router = useRouter();
const toolkit = useToolkit();

const { loading, request, result: feed } = useRequest(toolkit);

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

const isDialogOpen = ref(false);
const openEditFeedDialog = () => {
  isDialogOpen.value = true;
};

watch(feedId, loadFeed, { immediate: true });
</script>

<style scoped>
.header-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.general-tab {
  max-width: 640px;
}
</style>
