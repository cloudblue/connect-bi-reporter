import { reactive, ref } from 'vue';

import { request } from '~/utils/api';

export const useRequest = (toolkitInstance, propagateErrors = false) => {
  const loading = ref(false);
  const responseObject = reactive({});

  const doRequest = async (endpoint, method, body) => {
    loading.value = true;

    try {
      const responseBody = await request(endpoint, method, body);
      Object.assign(responseObject, responseBody);
    } catch (e) {
      toolkitInstance.emit('snackbar:error', e.message);
      if (propagateErrors) throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    responseObject,
    request: doRequest,
  };
};
