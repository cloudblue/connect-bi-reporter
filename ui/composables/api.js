import { reactive, ref } from 'vue';

import { request } from '~/utils/api';

export const useRequest = (toolkitInstance, propagateErrors = false, isList = false) => {
  const loading = ref(false);
  const result = isList ? reactive([]) : reactive({});

  const doRequest = async (endpoint, method, body) => {
    loading.value = true;

    try {
      const response = await request(endpoint, method, body, true);
      if (isList) {
        result.splice(0);
        result.push(...response.body);
      } else {
        Object.assign(result, {});
        Object.assign(result, response.body);
      }

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
