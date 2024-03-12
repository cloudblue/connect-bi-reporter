import { useFastApiTableAdapter } from '@cloudblueconnect/connect-ui-toolkit/tools/fastApi/vue';
import { flushPromises } from '@vue/test-utils';
import { ref } from 'vue';

import UploadsTable from '~/components/UploadsTable.vue';
import { useRequest } from '~/composables/api.js';
import { STATUSES, STATUSES_DICT } from '~/constants/statuses.js';
import { createFactory } from '~/tests/utils';
import { downloader } from '~/utils';
import { request } from '~/utils/api.js';

vi.mock('@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin');
vi.mock('@cloudblueconnect/connect-ui-toolkit/tools/fastApi/vue');
vi.mock('~/composables/api');
vi.mock('~/utils/api');
vi.mock('~/utils', async (importOriginal) => {
  const originalModule = await importOriginal();

  return {
    ...originalModule,
    downloader: vi.fn(),
  };
});

describe('UploadsTable component', () => {
  let wrapper;
  let factory;
  const mockRequest = vi.fn();
  const mockFastApiAdapterLoad = vi.fn();
  let useFastApiTableAdapterStub;
  const reports = [
    {
      id: 'RP-123',
      name: 'Foo report',
    },
  ];
  const uploadsList = [
    {
      id: 'UFL-123',
      report: { id: 'RP-123' },
      status: STATUSES_DICT.UPLOADED,
      size: 1024,
      events: { updated: { at: '2024-02-16T14:01:51.991856' } },
    },
  ];

  beforeEach(() => {
    request.mockReturnValue(reports);
    useRequest.mockImplementation(() => {
      const loading = ref(false);

      return {
        loading,
        request: mockRequest,
      };
    });

    useFastApiTableAdapterStub = {
      page: 1,
      total: 3,
      load: mockFastApiAdapterLoad,
      next: vi.fn(),
      previous: vi.fn(),
      items: ref(uploadsList),
    };
    useFastApiTableAdapter.mockReturnValue(useFastApiTableAdapterStub);

    factory = createFactory(
      UploadsTable,
      {
        props: {
          feedId: 'RF-123',
        },
      },
      true,
    );
  });

  describe('setup', () => {
    beforeEach(() => {
      wrapper = factory();
    });

    test('calls useFastApiTableAdapter', () => {
      expect(useFastApiTableAdapter).toHaveBeenCalledWith('/api/feeds/RF-123/uploads');
    });

    test('triggers load', () => {
      expect(mockFastApiAdapterLoad).toHaveBeenCalled();
    });

    test('loads the reports', () => {
      expect(request).toHaveBeenCalledWith('/public/v1/reporting/reports?(in(id,(RP-123)))');
    });
  });

  describe('render', () => {
    test('renders the loading indicator if loading is true', async () => {
      wrapper = factory();
      wrapper.vm.loading = true;
      await wrapper.vm.$nextTick();

      expect(wrapper.get('loading-indicator-stub')).toBeDefined();
    });

    test('renders the uploads table otherwise', async () => {
      wrapper = factory();
      await flushPromises();

      const columns = wrapper.findAll('.uploads-table__row td');

      expect(wrapper.find('loading-indicator-stub').exists()).toBeFalsy();
      expect(wrapper.findAll('.uploads-table__row').length).toEqual(1);
      expect(columns[0].get('date-item-stub')).toBeDefined();
      expect(columns[1].get('detail-item-stub')).toBeDefined();
      expect(columns[2].get('link-button-stub')).toBeDefined();
      expect(columns[3].get('ui-status').attributes()).toEqual(
        expect.objectContaining({
          text: STATUSES[STATUSES_DICT.UPLOADED].text,
          iconname: STATUSES[STATUSES_DICT.UPLOADED].icon,
          iconcolor: STATUSES[STATUSES_DICT.UPLOADED].color,
        }),
      );
    });
  });

  describe('events', () => {
    beforeEach(async () => {
      wrapper = factory();
      await flushPromises();
    });

    test('calls the fast api table adapter next method when the complex table emits the "next-clicked" event', async () => {
      await wrapper.get('ui-complex-table').trigger('next-clicked');

      expect(useFastApiTableAdapterStub.next).toHaveBeenCalled();
    });

    test('calls the fast api table adapter previous method when the complex table emits the "previous-clicked" event', async () => {
      await wrapper.get('ui-complex-table').trigger('previous-clicked');

      expect(useFastApiTableAdapterStub.previous).toHaveBeenCalled();
    });

    test('calls downloader with the correct parameters if the download button is clicked', async () => {
      await wrapper.get('link-button-stub').trigger('click');

      expect(downloader).toHaveBeenCalledWith('/public/v1/reporting/reports/RP-123/download');
    });
  });
});
