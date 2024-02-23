import { reactive, ref } from 'vue';

import { request } from '~/utils/api';

export const useRequest = (toolkitInstance, propagateErrors = false) => {
  const loading = ref(false);
  const result = reactive({});

  const doRequest = async (endpoint, method, body) => {
    loading.value = true;

    try {
      const response = await request(endpoint, method, body, true);
      Object.assign(result, response.body);

      return response.status;
    } catch (e) {
      toolkitInstance.emit('snackbar:error', e.message);
      if (propagateErrors) throw e;
      else return e.status;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    result,
    request: doRequest,
  };
};
