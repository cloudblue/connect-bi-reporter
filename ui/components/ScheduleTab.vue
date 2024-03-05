<template>
  <radio-table
    v-model="model"
    :items="filteredReportSchedules"
    searchPlaceholder="Search for Report Schedule name or ID"
    title="Select Report Schedule"
    @search="loadReportSchedulesDebounced"
  >
    <template #default="{ item }">
      <detail-item
        :bodyText="item.name"
        :assistiveText="item.id"
      />
    </template>
  </radio-table>
</template>

<script setup>
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { computed } from 'vue';

import DetailItem from '~/components/DetailItem.vue';
import RadioTable from '~/components/RadioTable.vue';
import { useRequest } from '~/composables/api';
import { debounce } from '~/utils/index';

const model = defineModel({
  type: String,
  required: true,
});

const { result: rawReportSchedules, request } = useRequest(useToolkit(), false, true);

const filteredReportSchedules = computed(() =>
  rawReportSchedules.filter((schedule) => schedule.renderer === 'csv'),
);

const loadReportSchedules = async (searchStr = '') => {
  let reportSchedulesEndpoint = '/public/v1/reporting/schedules?limit=100';
  if (searchStr) {
    reportSchedulesEndpoint += `&(((ilike(id,${searchStr}*))|(ilike(name,*${searchStr}*))))`;
  }

  await request(reportSchedulesEndpoint);
};
const loadReportSchedulesDebounced = debounce(loadReportSchedules, 500);

loadReportSchedules();
</script>
