import { shallowMount } from '@vue/test-utils';

import DeleteFeedDialog from '~/components/DeleteFeedDialog.vue';
import { useRequest } from '~/composables/api';

vi.mock('@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin');
vi.mock('~/composables/api');

describe('DeleteFeedDialog component', () => {
  let wrapper;
  const mockRequest = vi.fn().mockReturnValue(200);

  beforeEach(() => {
    useRequest.mockReturnValue({ request: mockRequest });

    wrapper = shallowMount(DeleteFeedDialog, {
      props: {
        feedId: 'RF-123',
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
          title: 'Delete Feed',
          width: '480px',
        }),
      );
      expect(wrapper.text()).toContain('Are you sure you want to delete this feed (RF-123)?');
      expect(wrapper.text()).toContain('You cannot undo this action once performed.');
    });
  });

  describe('actions', () => {
    describe('onSubmit', () => {
      test('makes a DELETE request to the feed endpoint', async () => {
        await wrapper.vm.deleteFeed();

        expect(mockRequest).toHaveBeenCalledWith('/api/feeds/RF-123', 'DELETE');
      });

      test('emits the deleted event if the request is successful', async () => {
        await wrapper.vm.deleteFeed();

        expect(wrapper.emitted().deleted).toBeTruthy();
      });

      test('does not emit the deleted event if the request fails', async () => {
        mockRequest.mockReturnValueOnce(403);
        await wrapper.vm.deleteFeed();

        expect(wrapper.emitted().deleted).toBeFalsy();
      });
    });
  });
});