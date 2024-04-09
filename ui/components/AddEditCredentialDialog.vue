<template>
  <simple-dialog
    v-model="value"
    :title="title"
    :actions="actions"
    :onSubmit="submit"
    height="auto"
    width="480px"
    :submitLabel="submitLabel"
    :isValid="isValid"
  >
    <text-field
      v-model="name"
      class="dialog-input"
      label="Name"
    />
    <text-field
      v-model="sasToken"
      class="dialog-input"
      label="SAS Token"
    />
  </simple-dialog>
</template>

<script setup>
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { computed, watch, ref } from 'vue';

import SimpleDialog from '~/components/SimpleDialog.vue';
import TextField from '~/components/TextField.vue';
import { useRequest } from '~/composables/api';

const emit = defineEmits(['created', 'edited']);

const props = defineProps({
  mode: {
    type: String,
    required: true,
  },
  credentialId: {
    type: String,
    default: '',
  },
});

const value = defineModel({
  type: Boolean,
  default: false,
});

const name = ref('');
const sasToken = ref('');

const isValid = computed(() => name.value?.length > 0 && sasToken.value?.length > 0);
const isEditMode = computed(() => props.mode === 'edit');
const title = computed(() => (isEditMode.value ? 'Edit Credentials' : 'Add Credentials'));
const submitLabel = computed(() => (isEditMode.value ? 'Save' : 'Add'));
const actions = ['cancel', 'submit'];

const createCredentialAction = useRequest(useToolkit());

const getCredential = async () => {
  const { result: credentialToEdit, request: credentialRequest } = useRequest(useToolkit());
  await credentialRequest(`/api/credentials/${props.credentialId}`);
  name.value = credentialToEdit.name;
  sasToken.value = credentialToEdit.sas_token;
};

const resetForm = () => {
  name.value = '';
  sasToken.value = '';
};

const submit = async () => {
  if (props.mode === 'create') {
    const status = await createCredentialAction.request('/api/credentials', 'POST', {
      name: name.value,
      sas_token: sasToken.value,
    });
    if (status < 400) emit('created');
  } else {
    const status = await createCredentialAction.request(
      `/api/credentials/${props.credentialId}`,
      'PUT',
      {
        name: name.value,
        sas_token: sasToken.value,
      },
    );
    if (status < 400) emit('edited');
  }
};

watch(
  () => value.value,
  () => {
    resetForm();
    if (props.mode === 'edit') getCredential();
  },
  { immediate: true },
);
</script>

<style scoped>
.dialog-input {
  display: block;
  margin-bottom: 24px;
}
</style>
