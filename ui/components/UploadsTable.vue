<template>
  <div class="uploads-table">
    <loading-indicator v-if="loading" />
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
        class="uploads-table__row"
      >
        <td
          v-for="header in headers"
          :key="header.key"
        >
          <date-item
            v-if="header.key === 'date'"
            :date="item.date"
          />
          <detail-item v-else-if="header.key === 'report'">
            <template #body-text>
              <spa-link
                :to="connectPortalRoutes.reportDetails"
                :params="item.report.id"
              >
                {{ item.report.id }}
              </spa-link>
            </template>
          </detail-item>
          <template v-else-if="header.key === 'file'">
            <span
              v-if="item.isFailed"
              class="assistive-color"
            >
              —
            </span>
            <!-- TODO: Show download link if status!=uploaded ? -->
            <detail-item
              v-else
              :assistive-text="item.file.size"
            >
              <template #body-text>
                <link-button
                  :text="item.file.name"
                  @click="downloadFile(item)"
                />
              </template>
            </detail-item>
          </template>
          <span v-else-if="header.key === 'status'">
            <ui-status
              :icon-name="item.status.icon"
              :icon-color="item.status.color"
              :text="item.status.text"
            />
            <template v-if="item.isFailed">
              <span class="dot-separator" />
              <!-- TODO: There is no way to see details about failed upload -->
              <link-button text="Details" />
            </template>
          </span>
          <div
            v-else-if="header.key === 'actions'"
            class="uploads-table__actions"
          >
            <!-- TODO: Show download button if status!=uploaded ? -->
            <ui-button
              class="actions-button"
              :background-color="COLORS_DICT.WHITE"
              height="36px"
              width="36px"
              @clicked="downloadFile(item)"
            >
              <ui-icon
                class="actions-button__trigger-icon"
                :color="COLORS_DICT.TEXT"
                icon-name="googleFileDownloadBaseline"
              />
            </ui-button>
            <actions-menu
              v-if="item.isFailed"
              :actions="getUploadActions(item)"
            />
          </div>
        </td>
      </tr>
    </ui-complex-table>
  </div>
</template>

<script setup>
import { connectPortalRoutes } from '@cloudblueconnect/connect-ui-toolkit';
import { useFastApiTableAdapter } from '@cloudblueconnect/connect-ui-toolkit/tools/fastApi/vue';
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { computed, reactive } from 'vue';

import ActionsMenu from '~/components/ActionsMenu.vue';
import DateItem from '~/components/DateItem.vue';
import DetailItem from '~/components/DetailItem.vue';
import LinkButton from '~/components/LinkButton.vue';
import LoadingIndicator from '~/components/LoadingIndicator.vue';
import SpaLink from '~/components/SpaLink.vue';
import { useRequest } from '~/composables/api';
import { COLORS_DICT } from '~/constants/colors.js';
import { STATUSES, STATUSES_DICT } from '~/constants/statuses.js';
import { downloader, getFileSize } from '~/utils';

const props = defineProps({
  feedId: {
    type: String,
    required: true,
  },
});

const { items, page, total, load, loading, next, previous } = useFastApiTableAdapter(
  `/api/feeds/${props.feedId}/uploads`,
);

const getReportFileName = (id) => `${id}.zip`;
const getReportDownloadUrl = (id) => `/public/v1/reporting/reports/${id}/download`;

const preparedItems = computed(() =>
  items.value.map((item) => ({
    id: item.id,
    date: item.events.updated.at,
    report: item.report,
    status: STATUSES[item.status],
    file: {
      name: getReportFileName(item.report.id),
      size: getFileSize(item.size || 0),
    },
    isFailed: item.status === STATUSES_DICT.FAILED,
  })),
);

const isAnyUploadFailed = computed(() => preparedItems.value.some((item) => item.isFailed));

const headers = computed(() => [
  { key: 'date', text: 'Date', width: '190px' },
  { key: 'report', text: 'Report' },
  { key: 'file', text: 'File', width: '165px' },
  { key: 'status', text: 'Status', width: '145px' },
  { key: 'actions', width: isAnyUploadFailed.value ? '80px' : '36px' },
]);

const retryAction = useRequest(useToolkit());
const retryUpload = async (upload) => {
  await retryAction.request(`/api/feeds/${props.feedId}/uploads/${upload.id}/retry`, 'POST');
  await load();
};

const downloadFile = ({ report }) => downloader(getReportDownloadUrl(report.id));

const getUploadActions = (upload) =>
  reactive([
    {
      icon: 'googleRefreshBaseline',
      key: 'retry',
      text: 'Retry',
      loading: retryAction.loading,
      handler: () => retryUpload(upload),
    },
  ]);

load();
</script>

<style scoped>
.uploads-table__actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  line-height: normal;
}
</style>
