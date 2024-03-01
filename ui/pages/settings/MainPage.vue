<template>
  <div
    class="app"
  >
    <ui-card title="Upload Schedule">
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
      <div slot="default">
        algo
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
        <alert message="No credentials added"></alert>
        <ui-table
          :headers="headers"
        >
          <tr v-for="item in items" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.url }}</td>
            <td>actions</td>
          </tr>
       </ui-table>
      </div>
    </ui-card>
  </div>
</template>

<script setup>
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';

import Alert from '~/components/Alert.vue';
import { useRequest } from '~/composables/api';

const toolkit = useToolkit();



const bla = await useRequest(toolkit).request('/api/credentials');

console.log(bla);
const headers = [
  {value: 'name', text: 'Name'},
  {value: 'url', text: 'Url'},
  {value: 'actions', text: ''},
]

const items = []

const editSchedule = () => {
  console.log('editSchedule');
}

const addCredential = () => {
  console.log('addCredential');
}

</script>

<style scoped>
.add-button-text {
  color: #fff;
}

.edit-schedule-button {
  border: 1px solid #e0e0e0;
}
</style>
