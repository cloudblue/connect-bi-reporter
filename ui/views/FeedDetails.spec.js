import { flushPromises, mount } from '@vue/test-utils';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useRequest } from '~/composables/api';
import { STATUSES_DICT } from '~/constants/statuses.js';
import FeedDetails from '~/views/FeedDetails.vue';

const feed = {
  id: 'RF-123',
  schedule: { id: 'RS-456' },
  credential: { id: 'CR-123' },
  description: 'Lorem ipsum',
  status: STATUSES_DICT.ENABLED,
  events: {
    created: {
      at: '2024-02-16T14:01:51.991856',
      by: 'John Doe',
    },
    updated: {
      at: '2024-02-16T14:01:51.991856',
      by: 'John Doe',
    },
  },
};
vi.mock('~/composables/api', () => ({
  useRequest: vi.fn(),
}));
vi.mock('vue-router', () => ({
  useRoute: vi.fn().mockReturnValue({ params: { id: 'RF-123' } }),
  useRouter: vi.fn().mockReturnValue({ replace: vi.fn() }),
}));
vi.mock('@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin', () => ({
  useToolkit: vi.fn().mockReturnValue('useToolkitStub'),
}));

describe('FeedDetails component', () => {
  let wrapper;
  const mockRequest = vi.fn();
  const mockReplace = vi.fn();

  beforeAll(() => {
    useRequest.mockImplementation(() => {
      const loading = ref(false);

      return {
        loading,
        request: mockRequest,
        result: feed,
      };
    });

    useRouter.mockImplementation(() => ({
      replace: mockReplace,
    }));
  });

  beforeEach(async () => {
    wrapper = mount(FeedDetails, { shallow: true });

    await flushPromises();
  });

  describe('lifecycle', () => {
    test('immediately loads the feed', () => {
      expect(mockRequest).toHaveBeenCalledWith('/api/feeds/RF-123');
    });
  });

  describe('render', () => {
    test('renders the loading indicator if loading is true', async () => {
      wrapper.vm.loading = true;
      await wrapper.vm.$nextTick();

      expect(wrapper.find('loading-indicator-stub').exists()).toEqual(true);
    });

    test('does not render the loading indicator if loading is false', async () => {
      wrapper.vm.loading = false;
      await wrapper.vm.$nextTick();

      expect(wrapper.find('loading-indicator-stub').exists()).toEqual(false);
    });

    test('renders the general tab if currentTab=general', () => {
      expect(wrapper.find('.general-tab').exists()).toEqual(true);
    });
  });

  describe('actions', () => {
    test('replaces the current route if ui-view triggers the "go-back" event', async () => {
      await wrapper.find('ui-view').trigger('go-back');

      expect(mockReplace).toHaveBeenCalledWith({ name: 'feeds' });
    });

    test('sets currentTab to the given value if ui-tabs triggers the "click-tab" event', async () => {
      await wrapper.find('ui-tabs').trigger('click-tab', { detail: 'foo' });

      expect(wrapper.vm.currentTab).toEqual('foo');
    });
  });
});