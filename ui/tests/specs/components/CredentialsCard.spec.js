import { shallowMount } from '@vue/test-utils';

import CredentialsCard from '~/components/CredentialsCard.vue';
import { useRequest } from '~/composables/api';
import { COLORS_DICT } from '~/constants/colors';

vi.mock('~/composables/api', () => ({
  useRequest: vi.fn(),
}));

vi.mock('@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin');

describe('CredentialsCard component', () => {
  let wrapper;
  let useRequestStub;

  const requestResult = [
    {
      id: 'CRED-173-206-751',
      name: 'neri',
      owner: {
        id: 'PA-047-102',
      },
      events: {
        created: {
          at: '2024-03-04T13:04:41.740054',
          by: {
            id: 'UR-047-000-003',
          },
        },
        updated: {
          at: '2024-03-06T16:13:06.984704',
          by: {
            id: 'UR-047-000-003',
          },
        },
      },
    },
  ];

  beforeAll(() => {
    useRequestStub = {
      result: requestResult,
      request: vi.fn().mockReturnValue(200),
    };

    useRequest.mockImplementation(() => {
      return useRequestStub;
    });
  });

  describe('render', () => {
    beforeEach(() => {
      wrapper = shallowMount(CredentialsCard, {
        global: {
          renderStubDefaultSlot: true,
        },
      });
    });

    test('makes the call to get the credentials', () => {
      expect(useRequestStub.request).toHaveBeenCalledWith('/api/credentials');
    });

    test('renders the base component', () => {
      expect(wrapper.get('ui-card').attributes()).toEqual(
        expect.objectContaining({
          title: 'Credentials',
          class: 'credentials-card',
        }),
      );
    });

    test('add edit credential dialog is rendered', () => {
      expect(wrapper.find('add-edit-credential-dialog-stub').exists()).toEqual(true);
    });

    test('delete credential dialog is rendered', () => {
      expect(wrapper.find('delete-credential-dialog-stub').exists()).toEqual(true);
    });

    test('table is rendered ', () => {
      expect(wrapper.find('ui-table').exists()).toEqual(true);
    });

    test('table has a row ', () => {
      expect(wrapper.find('ui-table tr').exists()).toEqual(true);
    });

    test('row has actions ', () => {
      expect(wrapper.find('ui-table tr actions-menu-stub').exists()).toEqual(true);
    });
  });

  describe('#onUpdated', () => {
    test('makes the call to get the credentials', () => {
      wrapper.vm.onUpdated();
      expect(useRequestStub.request).toHaveBeenCalledWith('/api/credentials');
    });
  });

  describe('#onDeleted', () => {
    test('makes the call to get the credentials', () => {
      wrapper.vm.onDeleted();
      expect(useRequestStub.request).toHaveBeenCalledWith('/api/credentials');
    });
  });

  describe('#onDeleted', () => {
    test('makes the call to get the credentials', () => {
      const result = wrapper.vm.getCredentialsActions(1);
      expect(result).toEqual([
        {
          key: 'edit',
          color: COLORS_DICT.TEXT,
          text: 'Edit',
          icon: 'googleEditBaseline',
          handler: expect.any(Function),
        },
        {
          separated: true,
          key: 'delete',
          color: COLORS_DICT.NICE_RED,
          text: 'Delete',
          icon: 'googleDeleteForeverBaseline',
          handler: expect.any(Function),
        },
      ]);
    });
  });
});
