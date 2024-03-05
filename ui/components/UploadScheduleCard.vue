<template>
  <ui-card
    class="upload-schedule-card"
    title="Upload Schedule"
  >
    <div>
      <detail-item
        :bodyText="periodicityText"
        assistiveText="00:00 · UTC"
      />
    </div>
  </ui-card>
</template>

<script setup>
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { computed } from 'vue';

import DetailItem from '~/components/DetailItem.vue';
import { useRequest } from '~/composables/api';

const { result: uploadSchedule, request: uploadScheduleRequest } = useRequest(useToolkit());
uploadScheduleRequest('/api/settings/schedule-tasks/create-uploads');

const periodicityTextsDict = {
  days: 'Daily',
  weeks: 'Weekly',
};

const periodicityText = computed(() => periodicityTextsDict[uploadSchedule?.trigger?.unit]);
</script>

<style scoped>
.upload-schedule-card {
  display: block;
  margin-bottom: 24px;
}
</style>
