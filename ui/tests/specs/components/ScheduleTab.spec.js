import { mount } from '@vue/test-utils';

import ScheduleTab from '~/components/ScheduleTab.vue';
import { useRequest } from '~/composables/api';

vi.mock('~/composables/api');
vi.mock('@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin');
describe('ScheduleTab component', () => {
  let wrapper;
  let useRequestStub;
  const reportSchedules = [
    {
      name: 'Foo',
      id: 'RS-123',
      renderer: 'csv',
    },
    {
      name: 'Bar',
      id: 'RS-456',
      renderer: 'csv',
    },
    {
      name: 'Baz',
      id: 'RS-789',
      renderer: 'json',
    },
    {
      name: 'Qux',
      id: 'RS-012',
      renderer: 'csv',
    },
  ];

  beforeEach(() => {
    useRequestStub = {
      loading: false,
      request: vi.fn().mockReturnValue(200),
      result: reportSchedules,
    };

    useRequest.mockReturnValue(useRequestStub);

    wrapper = mount(ScheduleTab, {
      props: {
        modelValue: 'RS-123',
      },
    });
  });

  describe('render', () => {
    test('renders the base component', () => {
      const detailItems = wrapper.findAll('.detail-item');

      expect(wrapper.getComponent({ name: 'radio-table' }).props()).toEqual(
        expect.objectContaining({
          searchPlaceholder: 'Search for Report Schedule name or ID',
          title: 'Select Report Schedule',
        }),
      );
      expect(detailItems.length).toEqual(3);
      expect(detailItems[0].text()).toContain('Foo');
      expect(detailItems[0].text()).toContain('RS-123');
      expect(detailItems[1].text()).toContain('Bar');
      expect(detailItems[1].text()).toContain('RS-456');
      expect(detailItems[2].text()).toContain('Qux');
      expect(detailItems[2].text()).toContain('RS-012');
    });
  });

  describe('events', () => {
    beforeAll(() => {
      vi.useFakeTimers();
    });
    afterAll(() => {
      vi.useRealTimers();
    });

    describe('when radio-table emits the "search" event', () => {
      test('loads the report schedules filtering by the search value', async () => {
        wrapper.getComponent({ name: 'radio-table' }).vm.$emit('search', 'foo');
        await wrapper.vm.$nextTick();
        vi.runAllTimers();

        expect(useRequestStub.request).toHaveBeenLastCalledWith(
          '/public/v1/reporting/schedules?limit=100&(((ilike(id,foo*))|(ilike(name,*foo*))))',
        );
      });
    });
  });

  describe('lifecycle', () => {
    test('loads report schedules on setup', () => {
      expect(useRequestStub.request).toHaveBeenCalledWith(
        '/public/v1/reporting/schedules?limit=100',
      );
    });
  });
});
