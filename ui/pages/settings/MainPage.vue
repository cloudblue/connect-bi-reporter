<template>
  <div
    class="app"
  >
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
    <ui-card title="Credentials">
      <div slot="actions">
        <ui-button
          background-color="#2C98F0"
          width="61px"
          height="28px"
          @click="addCredential"
        >
          <ui-icon
            icon-name="googleAddBaseline"
            color="#fff"
            size="14"
          />
          <span class="add-button-text">Add</span>
        </ui-button>
      </div>
      <div>

        <ui-table
          v-if="credentials.length > 0"
          :headers="headers"
        >
          <tr v-for="credential in credentials" :key="credential.id">
            <td>{{ credential.name }}</td>
            <td>
              <ui-button
                class="actions-button"
                background-color="white"
                height="36px"
                width="36px"
              >
                <ui-icon
                  class="actions-button__trigger-icon"
                  :color="black"
                  icon-name="googleMoreVertBaseline"
                />
              </ui-button>
            </td>
          </tr>
       </ui-table>
       <alert-item
        v-else
        message="No credentials added"
       />
      </div>
    </ui-card>
  </div>
</template>

<script setup>
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { reactive, computed } from 'vue'

import AlertItem from '~/components/AlertItem.vue';
import DetailItem from '~/components/DetailItem.vue';
import { useRequest } from '~/composables/api';

const { result: credentials, request: credentialRequest } = useRequest(useToolkit(), false, true);
credentialRequest('/api/credentials');

const { result: uploadSchedule, request: uploadScheduleRequest } = useRequest(useToolkit());
uploadScheduleRequest('/api/settings/schedule-tasks/create-uploads');

console.log({ uploadSchedule })

const periodicityTextsDict = {
  days: 'Daily',
  weeks: 'Weekly'
}

const periodicityText = computed(() => periodicityTextsDict[uploadSchedule?.trigger?.unit])

// request('/api/credentials', 'POST', {
//   name: 'marta',
//   connection_string: 'DefaultEndpointsProtocol=https;AccountName=juan;AccountKey=llavecita;EndpointSuffix=core.windows.net'
// });


const headers = reactive([
  {value: 'name', text: 'Name'},
  {value: 'actions', text: '', width: '48px'},
])

const editSchedule = () => {
  console.log('editSchedule');
}

const addCredential = () => {
  console.log('addCredential');
}
</script>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
}

.upload-schedule-card {
  display: block;
  margin-bottom: 24px;
}
.add-button-text {
  color: #fff;
}
.edit-schedule-button {
  border: 1px solid #e0e0e0;
}
</style>