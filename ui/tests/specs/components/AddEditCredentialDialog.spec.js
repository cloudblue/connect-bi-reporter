import { shallowMount } from '@vue/test-utils';
import { ref } from 'vue';

import AddEditCredentialDialog from '~/components/AddEditCredentialDialog.vue';
import { useRequest } from '~/composables/api';

vi.mock('~/composables/api', () => ({
  useRequest: vi.fn(),
}));

vi.mock('@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin');

const requestResult = {
  name: 'credName',
  connection_string: 'someconnnection',
};

describe('AddEditCredentialDialog component', () => {
  let wrapper;
  let useRequestStub;

  beforeAll(() => {
    const loading = ref(false);
    useRequestStub = {
      loading,
      result: requestResult,
      request: vi.fn().mockReturnValue(200),
    };
    useRequest.mockImplementation(() => {
      return useRequestStub;
    });
  });

  describe('create mode', () => {
    beforeEach(() => {
      wrapper = shallowMount(AddEditCredentialDialog, {
        props: {
          credentialId: 'CRED-623-592-341',
          modelValue: true,
          mode: 'create',
        },
        global: {
          renderStubDefaultSlot: true,
        },
        stubs: {
          TextField: true,
        },
      });
    });
    describe('render', () => {
      test('renders the base component', () => {
        expect(wrapper.get('simple-dialog-stub').attributes()).toEqual(
          expect.objectContaining({
            height: 'auto',
            title: 'Add Credentials',
            width: '480px',
          }),
        );
        const textfields = wrapper.findAll('text-field-stub');
        expect(textfields.length).toEqual(2);

        const nameTextfield = textfields[0];
        expect(nameTextfield.attributes()).toEqual(
          expect.objectContaining({
            label: 'Name',
          }),
        );

        const connectionStringTexfield = textfields[1];
        expect(connectionStringTexfield.attributes()).toEqual(
          expect.objectContaining({
            label: 'Connection String',
          }),
        );
      });
    });

    describe('#isValid', () => {
      test('isValid is true', () => {
        expect(wrapper.vm.isValid).toEqual(false);
      });
    });

    describe('#isEditMode', () => {
      test('isEditMode is true', () => {
        expect(wrapper.vm.isEditMode).toEqual(false);
      });
    });

    describe('#title', () => {
      test('title is "Add Credential"', () => {
        expect(wrapper.vm.title).toEqual('Add Credentials');
      });
    });

    describe('#submitLabel', () => {
      test('submitLabel is "Add"', () => {
        expect(wrapper.vm.submitLabel).toEqual('Add');
      });
    });

    describe('#submit', () => {
      test('makes the call to update the credential', () => {
        wrapper.vm.submit();
        expect(useRequestStub.request).toHaveBeenCalledWith('/api/credentials', 'POST', {
          name: '',
          connection_string: '',
        });
      });
    });
  });

  describe('edit mode', () => {
    beforeEach(() => {
      wrapper = shallowMount(AddEditCredentialDialog, {
        props: {
          credentialId: 'CRED-623-592-341',
          modelValue: true,
          mode: 'edit',
        },
        global: {
          renderStubDefaultSlot: true,
        },
        stubs: {
          TextField: true,
        },
      });
    });

    describe('render', () => {
      test('renders the base component in edit', () => {
        expect(wrapper.get('simple-dialog-stub').attributes()).toEqual(
          expect.objectContaining({
            height: 'auto',
            title: 'Edit Credentials',
            width: '480px',
          }),
        );
        const textfields = wrapper.findAll('text-field-stub');
        expect(textfields.length).toEqual(2);

        const nameTextfield = textfields[0];
        expect(nameTextfield.attributes()).toEqual(
          expect.objectContaining({
            label: 'Name',
            modelvalue: 'credName',
          }),
        );

        const connectionStringTexfield = textfields[1];
        expect(connectionStringTexfield.attributes()).toEqual(
          expect.objectContaining({
            label: 'Connection String',
            modelvalue: 'someconnnection',
          }),
        );
      });
    });

    describe('#isValid', () => {
      test('isValid is true', () => {
        expect(wrapper.vm.isValid).toEqual(true);
      });
    });

    describe('#isEditMode', () => {
      test('isEditMode is true', () => {
        expect(wrapper.vm.isEditMode).toEqual(true);
      });
    });

    describe('#title', () => {
      test('title is "Edit Credential"', () => {
        expect(wrapper.vm.title).toEqual('Edit Credentials');
      });
    });

    describe('#submitLabel', () => {
      test('submitLabel is "Save"', () => {
        expect(wrapper.vm.submitLabel).toEqual('Save');
      });
    });

    describe('#getCredential', () => {
      test('getCredential makes a call to /api/credentials/CRED-623-592-341', () => {
        expect(useRequestStub.request).toHaveBeenCalledWith('/api/credentials/CRED-623-592-341');
      });
    });

    describe('#submitLabel', () => {
      test('makes the call to update the credential', () => {
        wrapper.vm.submit();
        expect(useRequestStub.request).toHaveBeenCalledWith(
          '/api/credentials/CRED-623-592-341',
          'PUT',
          {
            name: 'credName',
            connection_string: 'someconnnection',
          },
        );
      });
    });
  });
});
