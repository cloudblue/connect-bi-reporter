import { shallowMount } from '@vue/test-utils';

import EditFeedDialog from '~/components/EditFeedDialog.vue';
import FormDialog from '~/components/FormDialog.vue';
import { useRequest } from '~/composables/api';

vi.mock('~/composables/api');
vi.mock('@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin');
describe('EditFeedDialog component', () => {
  let wrapper;
  let useRequestStub;
  const feed = {
    id: 'RF-123',
    credential: {
      id: 'CRED-123',
    },
    file_name: 'foo_bar',
    description: 'Lorem ipsum dolor sit amet',
  };

  beforeEach(() => {
    useRequestStub = {
      request: vi.fn().mockReturnValue(200),
    };

    useRequest.mockReturnValue(useRequestStub);

    wrapper = shallowMount(EditFeedDialog, {
      props: {
        modelValue: true,
        feed,
      },
      global: {
        stubs: {
          FormDialog,
        },
        renderStubDefaultSlot: true,
      },
    });
  });

  describe('render', () => {
    test('renders the base component', () => {
      expect(wrapper.getComponent({ name: 'FormDialog' }).props()).toEqual(
        expect.objectContaining({
          title: 'Edit Feed',
          mode: 'edit',
        }),
      );
      expect(wrapper.get('destination-tab-stub').attributes()).toEqual(
        expect.objectContaining({
          credentialid: 'CRED-123',
          filename: 'foo_bar',
          description: 'Lorem ipsum dolor sit amet',
        }),
      );
    });
  });

  describe('actions', () => {
    describe('updateFeed', () => {
      beforeEach(async () => {
        await wrapper.vm.updateFeed();
      });

      test('makes a PUT request to the feed endpoint', () => {
        expect(useRequestStub.request).toHaveBeenCalledWith('/api/feeds/RF-123', 'PUT', {
          credential: {
            id: 'CRED-123',
          },
          file_name: 'foo_bar',
          description: 'Lorem ipsum dolor sit amet',
        });
      });

      test('emits the "updated" event', () => {
        expect(wrapper.emitted().updated).toBeTruthy();
      });
    });
  });
});
