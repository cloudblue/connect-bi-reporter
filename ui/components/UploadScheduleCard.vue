<template>
  <ui-card class="upload-schedule-card" title="Upload Schedule">
      <div slot="actions">
        <ui-button
          class="edit-schedule-button"
          background-color="#FFF"
          color="#212121"
          width="47px"
          height="28px"
          @click="editSchedule"
        >
          <div>
            EDIT
          </div>
        </ui-button>
      </div>
      <div>
        <detail-item
          :body-text="periodicityText"
          assistive-text="item.id"
        />
      </div>
    </ui-card>
</template>

<script setup>
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { computed } from 'vue'

import DetailItem from '~/components/DetailItem.vue';
import { useRequest } from '~/composables/api';

const { result: uploadSchedule, request: uploadScheduleRequest } = useRequest(useToolkit());
uploadScheduleRequest('/api/settings/schedule-tasks/create-uploads');

const periodicityTextsDict = {
  days: 'Daily',
  weeks: 'Weekly'
}

const periodicityText = computed(() => periodicityTextsDict[uploadSchedule?.trigger?.unit])

console.log({ uploadSchedule })

const editSchedule = () => {
  console.log('editSchedule');
}
</script>

<style scoped>
.upload-schedule-card {
  display: block;
  margin-bottom: 24px;
}

.edit-schedule-button {
  border: 1px solid #e0e0e0;
}
</style>