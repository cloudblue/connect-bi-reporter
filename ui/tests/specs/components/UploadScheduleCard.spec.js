import { shallowMount } from '@vue/test-utils';

import UploadScheduleCard from '~/components/UploadScheduleCard.vue';
import { useRequest } from '~/composables/api';

vi.mock('~/composables/api', () => ({
  useRequest: vi.fn(),
}));

vi.mock('@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin');

describe('UploadScheduleCard component', () => {
  let wrapper;
  let useRequestStub;

  const requestResult = {
    trigger: {
      type: 'recurring',
      start: '2024-03-06T00:00:00+00:00',
      unit: 'days',
      amount: 1,
    },
  };

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
      wrapper = shallowMount(UploadScheduleCard, {
        global: {
          renderStubDefaultSlot: true,
        },
      });
    });

    test('makes the call to get the create upload schedule', () => {
      expect(useRequestStub.request).toHaveBeenCalledWith(
        '/api/settings/schedule-tasks/create-uploads',
      );
    });

    test('renders the base component', () => {
      expect(wrapper.get('ui-card').attributes()).toEqual(
        expect.objectContaining({
          title: 'Upload Schedule',
          class: 'upload-schedule-card',
        }),
      );
    });

    test('displays correctly the info', () => {
      expect(wrapper.get('detail-item-stub').attributes()).toEqual(
        expect.objectContaining({
          bodytext: 'Daily',
          assistivetext: '00:00 · UTC',
        }),
      );
    });

    test('#periodicityText', () => {
      expect(wrapper.vm.periodicityText).toEqual('Daily');
    });
  });
});
