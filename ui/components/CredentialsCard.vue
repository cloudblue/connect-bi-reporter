<template>
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
</template>


<script setup>
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { reactive } from 'vue'

import AlertItem from '~/components/AlertItem.vue';
import { useRequest } from '~/composables/api';

const { result: credentials, request: credentialRequest } = useRequest(useToolkit(), false, true);
credentialRequest('/api/credentials');

// request('/api/credentials', 'POST', {
//   name: 'marta',
//   connection_string: 'DefaultEndpointsProtocol=https;AccountName=juan;AccountKey=llavecita;EndpointSuffix=core.windows.net'
// });


const headers = reactive([
  {value: 'name', text: 'Name'},
  {value: 'actions', text: '', width: '48px'},
])



const addCredential = () => {
  console.log('addCredential');
}
</script>

<style scoped>
.add-button-text {
  color: #fff;
}
</style>