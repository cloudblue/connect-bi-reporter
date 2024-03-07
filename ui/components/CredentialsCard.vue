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
        @click="openAddEditCredentialDialog('create')"
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
  <add-edit-credential-dialog
    v-model="isAddEditDialogOpen"
    :mode="addEditDialogMode"
    :credentialId="editCredentialId"
    @created="onUpdated"
    @edited="onUpdated"
  />
  <delete-credential-dialog
    v-model="isDeleteDialogOpen"
    :credentialId="deleteCredentialId"
    @deleted="onDeleted"
  />
</template>

<script setup>
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { reactive, ref } from 'vue';

import ActionsMenu from '~/components/ActionsMenu.vue';
import AddEditCredentialDialog from '~/components/AddEditCredentialDialog.vue';
import AlertItem from '~/components/AlertItem.vue';
import DeleteCredentialDialog from '~/components/DeleteCredentialDialog.vue';
import { useRequest } from '~/composables/api';
import { COLORS_DICT } from '~/constants/colors';

const { result: credentials, request: credentialRequest } = useRequest(useToolkit(), false, true);
credentialRequest('/api/credentials');

const headers = reactive([
  { value: 'name', text: 'Name' },
  { value: 'actions', text: '', width: '48px' },
]);

const isAddEditDialogOpen = ref(false);
const addEditDialogMode = ref('create');
const isDeleteDialogOpen = ref(false);
const deleteCredentialId = ref('');
const editCredentialId = ref('');

const openDeleteCredentialDialog = (id) => {
  deleteCredentialId.value = id;
  isDeleteDialogOpen.value = true;
};

const openAddEditCredentialDialog = (mode, credentialId) => {
  addEditDialogMode.value = mode;
  isAddEditDialogOpen.value = true;
  editCredentialId.value = credentialId;
};

const onUpdated = () => {
  credentialRequest('/api/credentials');
  isAddEditDialogOpen.value = false;
};

const onDeleted = () => {
  deleteCredentialId.value = '';
  isDeleteDialogOpen.value = false;
  credentialRequest('/api/credentials');
};

const getCredentialsActions = (id) => [
  {
    key: 'edit',
    color: COLORS_DICT.TEXT,
    text: 'Edit',
    icon: 'googleEditBaseline',
    handler: () => openAddEditCredentialDialog('edit', id),
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
