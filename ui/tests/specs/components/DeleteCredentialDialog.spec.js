import { shallowMount } from '@vue/test-utils';

import DeleteCredentialDialog from '~/components/DeleteCredentialDialog.vue';
import { useRequest } from '~/composables/api';

vi.mock('@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin');
vi.mock('~/composables/api');

describe('DeleteCredentialDialog component', () => {
  let wrapper;
  const mockRequest = vi.fn().mockReturnValue(200);

  beforeEach(() => {
    useRequest.mockReturnValue({ request: mockRequest });

    wrapper = shallowMount(DeleteCredentialDialog, {
      props: {
        credentialId: 'CRED-623-592-341',
        modelValue: true,
      },
      global: {
        renderStubDefaultSlot: true,
      },
    });
  });

  describe('render', () => {
    test('renders the base component', () => {
      expect(wrapper.get('simple-dialog-stub').attributes()).toEqual(
        expect.objectContaining({
          height: 'auto',
          title: 'Delete Credential',
          width: '480px',
        }),
      );
      expect(wrapper.text()).toContain(
        'Are you sure you want to delete this credential (CRED-623-592-341)?',
      );
      expect(wrapper.text()).toContain('You cannot undo this action once performed.');
    });
  });

  describe('actions', () => {
    describe('onSubmit', () => {
      test('makes a DELETE request to the credential endpoint', async () => {
        await wrapper.vm.deleteCredential();

        expect(mockRequest).toHaveBeenCalledWith('/api/credentials/CRED-623-592-341', 'DELETE');
      });

      test('emits the deleted event if the request is successful', async () => {
        await wrapper.vm.deleteCredential();

        expect(wrapper.emitted().deleted).toBeTruthy();
      });

      test('does not emit the deleted event if the request fails', async () => {
        mockRequest.mockReturnValueOnce(403);
        await wrapper.vm.deleteCredential();

        expect(wrapper.emitted().deleted).toBeFalsy();
      });
    });
  });
});
