import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { mount } from '@vue/test-utils';

import DateItem from '~/components/DateItem.vue';

vi.mock('@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin', () => ({
  useToolkit: vi.fn(),
}));

describe('DateItem component', () => {
  let wrapper;
  let toolkitStub;
  const intlDateTimeFormatCtorSpy = vi.spyOn(Intl, 'DateTimeFormat');
  const DATE_STR = '2024-02-16T14:01:51.991856';

  beforeEach(async () => {
    toolkitStub = {
      sharedContext: {
        timezoneInfo: {
          region: 'en_US',
          timezone: 'America/Los_Angeles',
          time_24h: false,
        },
      },
    };

    useToolkit.mockReturnValue(toolkitStub);

    wrapper = mount(DateItem, {
      props: { date: DATE_STR },
    });
  });

  test('creates a new Intl.DateTimeFormat instance with the user timezone info', () => {
    expect(intlDateTimeFormatCtorSpy).toHaveBeenCalledWith('en-US', {
      timeZone: 'America/Los_Angeles',
      hourCycle: 'h12',
      timeStyle: 'short',
      dateStyle: 'short',
    });
  });

  test('the component renders the formatted date', () => {
    expect(wrapper.text()).toContain('2/16/24, 6:01 AM');
  });
});
