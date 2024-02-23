import * as fastApiAdapter from '@cloudblueconnect/connect-ui-toolkit/tools/fastApi/vue';
import { mount, flushPromises } from '@vue/test-utils';

import { COLORS_DICT } from '~/constants/colors';

import FeedsView from './FeedsView.vue';

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
    wrapper = mount(FeedsView, { shallow: true });

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
      wrapper = mount(FeedsView, { shallow: true });

      expect(wrapper.find('empty-placeholder-stub').exists()).toEqual(true);
    });

    test('shows the ui-complex-table component otherwise', () => {
      expect(wrapper.find('ui-complex-table').exists()).toEqual(true);
    });
  });

  describe('actions', () => {
    test('loads next page when ui-complex-table emits the "next-clicked" event', () => {
      const nextSpy = vi.spyOn(wrapper.vm, 'next');

      wrapper.find('ui-complex-table').trigger('next-clicked');

      expect(nextSpy).toHaveBeenCalled();
    });

    test('loads previous page when ui-complex-table emits the "previous-clicked" event', () => {
      const previousSpy = vi.spyOn(wrapper.vm, 'previous');

      wrapper.find('ui-complex-table').trigger('previous-clicked');

      expect(previousSpy).toHaveBeenCalled();
    });
  });
});
