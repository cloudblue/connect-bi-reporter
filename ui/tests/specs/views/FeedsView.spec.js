import * as fastApiAdapter from '@cloudblueconnect/connect-ui-toolkit/tools/fastApi/vue';
import { shallowMount, flushPromises } from '@vue/test-utils';

import { COLORS_DICT } from '~/constants/colors';
import FeedsView from '~/views/FeedsView.vue';

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

Object.defineProperty(global, 'fetch', {
  value: vi.fn().mockImplementation(
    () =>
      new Promise((resolve) => {
        resolve({
          status: 200,
          ok: true,
          json: () => feedItems,
          headers: { get: () => '' },
        });
      }),
  ),
});

describe('Feeds View component', () => {
  let wrapper;
  let useFastApiAdapterSpy = vi.spyOn(fastApiAdapter, 'useFastApiTableAdapter');

  beforeEach(async () => {
    wrapper = shallowMount(FeedsView);

    await flushPromises();
  });

  describe('setup', () => {
    test('calls useFastApiTableAdapter composable with the correct endpoint', () => {
      expect(useFastApiAdapterSpy).toHaveBeenCalledWith('/api/feeds');
    });

    test('prepares the items to be rendered in the table', () => {
      expect(wrapper.vm.preparedItems).toEqual([
        {
          id: 'RF-123',
          scheduleId: 'RS-123',
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
          scheduleId: 'RS-456',
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
    test('shows the empty placeholder if there are no items', () => {
      wrapper = shallowMount(FeedsView);

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
      const nextSpy = vi.spyOn(wrapper.vm, 'next');

      await wrapper.get('ui-complex-table').trigger('next-clicked');

      expect(nextSpy).toHaveBeenCalled();
    });

    test('loads previous page when ui-complex-table emits the "previous-clicked" event', async () => {
      const previousSpy = vi.spyOn(wrapper.vm, 'previous');

      await wrapper.get('ui-complex-table').trigger('previous-clicked');

      expect(previousSpy).toHaveBeenCalled();
    });

    test('opens the create feed dialog when the header action button to create a feed is clicked', async () => {
      await wrapper.get('.header-actions ui-button').trigger('clicked');

      expect(wrapper.get('create-feed-dialog-stub').attributes('modelvalue')).toEqual('true');
    });

    test('opens the create feed dialog when the empty placeholder emits the "action-clicked" event', async () => {
      wrapper = shallowMount(FeedsView);

      await wrapper.get('empty-placeholder-stub').trigger('action-clicked');

      expect(wrapper.get('create-feed-dialog-stub').attributes('modelvalue')).toEqual('true');
    });
  });
});
