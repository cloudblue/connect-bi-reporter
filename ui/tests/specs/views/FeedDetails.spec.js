import { flushPromises, mount } from '@vue/test-utils';
import { useRouter } from 'vue-router';

import { STATUSES_DICT } from '~/constants/statuses';
import { request } from '~/utils/api';
import FeedDetails from '~/views/FeedDetails.vue';

vi.mock('~/utils/api');
vi.mock('vue-router', () => ({
  useRoute: vi.fn().mockReturnValue({ params: { id: 'RF-123' } }),
  useRouter: vi.fn().mockReturnValue({ replace: vi.fn() }),
}));
vi.mock('@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin', () => ({
  useToolkit: vi.fn().mockReturnValue('useToolkitStub'),
}));

describe('FeedDetails component', () => {
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
  const schedule = {
    id: 'RS-456',
    name: 'Foo schedule',
    template: {
      id: 'RT-123',
      name: 'Foo report template',
      local_id: 'foo_report',
    },
  };
  let wrapper;
  const mockReplace = vi.fn();

  beforeAll(() => {
    request.mockImplementation((url) => {
      if (url.startsWith('/api/feeds')) return feed;
      return schedule;
    });

    useRouter.mockImplementation(() => ({
      replace: mockReplace,
    }));
  });

  beforeEach(async () => {
    wrapper = mount(FeedDetails, { shallow: true });

    await flushPromises();
  });

  describe('setup', () => {
    test('loads the feed', () => {
      expect(request).toHaveBeenCalledWith('/api/feeds/RF-123');
    });

    test('loads the schedule', () => {
      expect(request).toHaveBeenCalledWith('/public/v1/reporting/schedules/RS-456');
    });
  });

  describe('render', () => {
    test('renders the loading indicator if loading is true', async () => {
      wrapper.vm.loading = true;
      await wrapper.vm.$nextTick();

      expect(wrapper.get('loading-indicator-stub')).toBeDefined();
    });

    test('does not render the loading indicator if loading is false', async () => {
      wrapper.vm.loading = false;
      await wrapper.vm.$nextTick();

      expect(wrapper.find('loading-indicator-stub').exists()).toEqual(false);
    });

    test('renders the general tab if currentTab=general', () => {
      expect(wrapper.get('.general-tab')).toBeDefined();
    });

    test('renders the uploads tab if currentTab=uploads', async () => {
      wrapper.vm.currentTab = 'uploads';
      await wrapper.vm.$nextTick();

      expect(wrapper.get('.uploads-tab')).toBeDefined();
    });
  });

  describe('events', () => {
    test('replaces the current route if ui-view triggers the "go-back" event', async () => {
      await wrapper.get('ui-view').trigger('go-back');

      expect(mockReplace).toHaveBeenCalledWith({ name: 'feeds' });
    });

    test('sets currentTab to the given value if ui-tabs triggers the "click-tab" event', async () => {
      await wrapper.get('ui-tabs').trigger('click-tab', { detail: 'foo' });

      expect(wrapper.vm.currentTab).toEqual('foo');
    });

    test('opens the edit feed dialog if the edit header action button is clicked', async () => {
      await wrapper.get('.header-button').trigger('clicked');

      expect(wrapper.getComponent({ name: 'edit-feed-dialog' }).props('modelValue')).toEqual(true);
    });

    describe('if the edit feed dialog emits the updated event', () => {
      beforeEach(async () => {
        await flushPromises();
        vi.clearAllMocks();

        wrapper.getComponent({ name: 'edit-feed-dialog' }).vm.$emit('updated');
        await wrapper.vm.$nextTick();
      });

      test('loads the feed', () => {
        expect(request).toHaveBeenCalledWith('/api/feeds/RF-123');
      });

      test('loads the schedule', () => {
        expect(request).toHaveBeenCalledWith('/public/v1/reporting/schedules/RS-456');
      });
    });

    describe('if the feed actions emits the enabled event', () => {
      beforeEach(async () => {
        await flushPromises();
        vi.clearAllMocks();

        wrapper.getComponent({ name: 'feed-actions' }).vm.$emit('enabled');
        await wrapper.vm.$nextTick();
      });

      test('loads the feed', () => {
        expect(request).toHaveBeenCalledWith('/api/feeds/RF-123');
      });

      test('loads the schedule', () => {
        expect(request).toHaveBeenCalledWith('/public/v1/reporting/schedules/RS-456');
      });
    });

    describe('if the feed actions emits the disabled event', () => {
      beforeEach(async () => {
        await flushPromises();
        vi.clearAllMocks();

        wrapper.getComponent({ name: 'feed-actions' }).vm.$emit('disabled');
        await wrapper.vm.$nextTick();
      });

      test('loads the feed', () => {
        expect(request).toHaveBeenCalledWith('/api/feeds/RF-123');
      });

      test('loads the schedule', () => {
        expect(request).toHaveBeenCalledWith('/public/v1/reporting/schedules/RS-456');
      });
    });

    describe('if the feed actions emits the uploaded event', () => {
      beforeEach(async () => {
        await flushPromises();
        vi.clearAllMocks();

        wrapper.getComponent({ name: 'feed-actions' }).vm.$emit('uploaded');
        await wrapper.vm.$nextTick();
      });

      test('loads the feed', () => {
        expect(request).toHaveBeenCalledWith('/api/feeds/RF-123');
      });

      test('loads the schedule', () => {
        expect(request).toHaveBeenCalledWith('/public/v1/reporting/schedules/RS-456');
      });
    });

    describe('if the feed actions emits the deleted event', () => {
      beforeEach(async () => {
        await flushPromises();
        vi.clearAllMocks();

        wrapper.getComponent({ name: 'feed-actions' }).vm.$emit('deleted');
        await wrapper.vm.$nextTick();
      });

      test('calls router.replace to go to the feeds view', () => {
        expect(mockReplace).toHaveBeenCalledWith({ name: 'feeds' });
      });
    });
  });
});
