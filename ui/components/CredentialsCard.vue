<template>
  <ui-card
    class="credentials-card"
    title="Credentials"
  >
    <div slot="actions">
      <ui-button
        backgroundColor="#2C98F0"
        width="61px"
        height="28px"
        @click="addCredential"
      >
        <ui-icon
          iconName="googleAddBaseline"
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
        <tr
          v-for="credential in credentials"
          :key="credential.id"
        >
          <td>{{ credential.name }}</td>
          <td>
            <actions-menu
              class="credentials-actions"
              :actions="getCredentialsActions(credential.id)"
            >
            </actions-menu>
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
import { reactive } from 'vue';

import ActionsMenu from '~/components/ActionsMenu.vue';
import AlertItem from '~/components/AlertItem.vue';
import { useRequest } from '~/composables/api';
import { COLORS_DICT } from '~/constants/colors';

const { result: credentials, request: credentialRequest } = useRequest(useToolkit(), false, true);
credentialRequest('/api/credentials');

const headers = reactive([
  { value: 'name', text: 'Name' },
  { value: 'actions', text: '', width: '48px' },
]);

const openEditCredentialDialog = (id) => {
  // TODO
  console.log(id);
};

const openDeleteCredentialDialog = (id) => {
  // TODO
  console.log(id);
};

const addCredential = () => {
  // TODO
};

const getCredentialsActions = (id) => [
  {
    key: 'edit',
    color: COLORS_DICT.TEXT,
    text: 'Edit',
    icon: 'googleEditBaseline',
    handler: () => openEditCredentialDialog(id),
  },
  {
    separated: true,
    key: 'delete',
    color: COLORS_DICT.NICE_RED,
    text: 'Delete',
    icon: 'googleDeleteForeverBaseline',
    handler: () => openDeleteCredentialDialog(id),
  },
];
</script>

<style scoped>
.credentials-card {
  overflow: visible;
}
.add-button-text {
  color: #fff;
}
</style>
