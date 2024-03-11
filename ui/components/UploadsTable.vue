<template>
  <div class="uploads-table">
    <loading-indicator v-if="loading" />
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
        v-for="item in preparedUploads"
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
          <detail-item
            v-else-if="header.key === 'report'"
            :assistiveText="item.report.id"
          >
            <template #body-text>
              <spa-link
                :to="connectPortalRoutes.reportDetails"
                :params="item.report.id"
              >
                {{ item.report.name }}
              </spa-link>
            </template>
          </detail-item>
          <template v-else-if="header.key === 'file'">
            <link-button
              :text="item.file.name"
              icon="googleFileDownloadBaseline"
              @click="downloadFile(item)"
            />
          </template>
          <span v-else-if="header.key === 'status'">
            <ui-status
              :iconName="item.status.icon"
              :iconColor="item.status.color"
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
import { computed, reactive, ref } from 'vue';

import ActionsMenu from '~/components/ActionsMenu.vue';
import DateItem from '~/components/DateItem.vue';
import DetailItem from '~/components/DetailItem.vue';
import LinkButton from '~/components/LinkButton.vue';
import LoadingIndicator from '~/components/LoadingIndicator.vue';
import SpaLink from '~/components/SpaLink.vue';
import { useRequest } from '~/composables/api';
import { STATUSES, STATUSES_DICT } from '~/constants/statuses.js';
import { downloader, getFileSize } from '~/utils';
import { request } from '~/utils/api';

const props = defineProps({
  feedId: {
    type: String,
    required: true,
  },
});

const {
  items: uploads,
  page,
  total,
  load: loadUploads,
  next: loadNextUploads,
  previous: loadPreviousUploads,
} = useFastApiTableAdapter(`/api/feeds/${props.feedId}/uploads`);
const loading = ref(false);
const reports = ref([]);
const preparedUploads = ref([]);

const isAnyUploadFailed = computed(() => preparedUploads.value.some((item) => item.isFailed));

const prepareUploads = () => {
  preparedUploads.value = uploads.value.map((upload) => ({
    id: upload.id,
    date: upload.events.updated.at,
    report: reports.value.find((report) => report.id === upload.report.id),
    status: STATUSES[upload.status],
    file: {
      name: getReportFileName(upload.report.id),
      size: getFileSize(upload.size || 0),
    },
    isFailed: upload.status === STATUSES_DICT.FAILED,
  }));
};

const loadReports = async () => {
  if (!uploads.value.length) {
    preparedUploads.value = [];
    return;
  }

  const reportIds = uploads.value.map((upload) => upload.report.id);
  reports.value = await request(`/public/v1/reporting/reports?(in(id,(${reportIds.join(',')})))`);
};

const load = async () => {
  await loadData(loadUploads);
};

const next = async () => {
  await loadData(loadNextUploads);
};

const previous = async () => {
  await loadData(loadPreviousUploads);
};

const loadData = async (loadFn) => {
  loading.value = true;

  await loadFn();
  await loadReports();
  prepareUploads();

  loading.value = false;
};

const getReportFileName = (id) => `${id}.zip`;
const getReportDownloadUrl = (id) => `/public/v1/reporting/reports/${id}/download`;

const headers = computed(() => {
  const items = [
    { key: 'date', text: 'Date', width: '190px' },
    { key: 'report', text: 'Report' },
    { key: 'file', text: 'File', width: '165px' },
    { key: 'status', text: 'Status', width: '145px' },
  ];

  if (isAnyUploadFailed.value) items.push({ key: 'actions', width: '36px' });

  return items;
});

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
