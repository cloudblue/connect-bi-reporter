import { useFastApiTableAdapter } from '@cloudblueconnect/connect-ui-toolkit/tools/fastApi/vue';
import { shallowMount, flushPromises } from '@vue/test-utils';
import { ref } from 'vue';

import { COLORS_DICT } from '~/constants/colors';
import { request } from '~/utils/api';
import FeedsView from '~/views/FeedsView.vue';

vi.mock('~/utils/api');
vi.mock('@cloudblueconnect/connect-ui-toolkit/tools/fastApi/vue');

describe('Feeds View component', () => {
  const feedItems = [
    {
      id: 'RF-123',
      schedule: { id: 'RS-123' },
      events: { created: { at: '2024-02-16T14:01:51.991856' } },
      description: 'Lorem ipsum',
      status: 'enabled',
    },
    {
      id: 'RF-456',
      schedule: { id: 'RS-456' },
      events: { created: { at: '2024-02-15T14:01:51.991856' } },
      description: 'Dolor sit amet',
      status: 'disabled',
    },
  ];
  const schedules = [
    {
      id: 'RS-123',
      name: 'Foo schedule',
    },
    {
      id: 'RS-456',
      name: 'Bar schedule',
    },
  ];
  let wrapper;
  let useFastApiAdapterStub;

  beforeEach(async () => {
    useFastApiAdapterStub = {
      load: vi.fn(),
      next: vi.fn(),
      previous: vi.fn(),
      items: ref(feedItems),
      page: 1,
      total: feedItems.length,
    };

    request.mockReturnValue(schedules);
    useFastApiTableAdapter.mockReturnValue(useFastApiAdapterStub);

    wrapper = shallowMount(FeedsView);

    await flushPromises();
  });

  describe('setup', () => {
    test('calls useFastApiTableAdapter composable with the correct endpoint', () => {
      expect(useFastApiTableAdapter).toHaveBeenCalledWith('/api/feeds');
    });

    test('loads the feeds', () => {
      expect(useFastApiAdapterStub.load).toHaveBeenCalled();
    });

    test('loads the schedules', () => {
      expect(request).toHaveBeenCalledWith(
        '/public/v1/reporting/schedules?(in(id,(RS-123,RS-456)))',
      );
    });

    test('prepares the items to be rendered in the table', () => {
      expect(wrapper.vm.preparedFeeds).toEqual([
        {
          id: 'RF-123',
          schedule: {
            id: 'RS-123',
            name: 'Foo schedule',
          },
          createdAt: '2024-02-16T14:01:51.991856',
          description: 'Lorem ipsum',
          status: {
            text: 'Enabled',
            icon: 'googleFiberManualRecordBaseline',
            color: COLORS_DICT.NICE_GREEN,
          },
          rawFeed: feedItems[0],
        },
        {
          id: 'RF-456',
          schedule: {
            id: 'RS-456',
            name: 'Bar schedule',
          },
          createdAt: '2024-02-15T14:01:51.991856',
          description: 'Dolor sit amet',
          status: {
            text: 'Disabled',
            icon: 'googleFiberManualRecordBaseline',
            color: COLORS_DICT.MIDDLE_GREY,
          },
          rawFeed: feedItems[1],
        },
      ]);
    });
  });

  describe('render', () => {
    test('shows the empty placeholder if there are no items', async () => {
      wrapper.vm.feeds = [];
      await wrapper.vm.$nextTick();

      expect(wrapper.get('empty-placeholder-stub').attributes()).toEqual(
        expect.objectContaining({
          title: 'No Feeds',
          action: 'Create Feed',
          icon: 'googleAutoGraphBaseline',
        }),
      );
    });

    test('shows the loading indicator if loading is truthy', async () => {
      wrapper = shallowMount(FeedsView);
      wrapper.vm.loading = true;
      await wrapper.vm.$nextTick();

      expect(wrapper.get('loading-indicator-stub')).toBeDefined();
    });

    describe('otherwise', () => {
      test('shows the ui-complex-table component', () => {
        expect(wrapper.get('ui-complex-table')).toBeDefined();
      });

      test('shows the header action to create a feed', () => {
        expect(wrapper.get('.header-actions ui-button').text()).toEqual('Create Feed');
      });
    });
  });

  describe('events', () => {
    test('loads next page when ui-complex-table emits the "next-clicked" event', async () => {
      await wrapper.get('ui-complex-table').trigger('next-clicked');

      expect(useFastApiAdapterStub.next).toHaveBeenCalled();
    });

    test('loads the schedules when ui-complex-table emits the "next-clicked" event', async () => {
      vi.clearAllMocks();
      await wrapper.get('ui-complex-table').trigger('next-clicked');

      expect(request).toHaveBeenCalledWith(
        '/public/v1/reporting/schedules?(in(id,(RS-123,RS-456)))',
      );
    });

    test('loads previous page when ui-complex-table emits the "previous-clicked" event', async () => {
      await wrapper.get('ui-complex-table').trigger('previous-clicked');

      expect(useFastApiAdapterStub.previous).toHaveBeenCalled();
    });

    test('loads the schedules when ui-complex-table emits the "previous-clicked" event', async () => {
      vi.clearAllMocks();
      await wrapper.get('ui-complex-table').trigger('previous-clicked');

      expect(request).toHaveBeenCalledWith(
        '/public/v1/reporting/schedules?(in(id,(RS-123,RS-456)))',
      );
    });

    test('opens the create feed dialog when the header action button to create a feed is clicked', async () => {
      await wrapper.get('.header-actions ui-button').trigger('clicked');

      expect(wrapper.get('create-feed-dialog-stub').attributes('modelvalue')).toEqual('true');
    });

    test('opens the create feed dialog when the empty placeholder emits the "action-clicked" event', async () => {
      wrapper.vm.feeds = [];
      await wrapper.vm.$nextTick();

      await wrapper.get('empty-placeholder-stub').trigger('action-clicked');

      expect(wrapper.get('create-feed-dialog-stub').attributes('modelvalue')).toEqual('true');
    });
  });
});
