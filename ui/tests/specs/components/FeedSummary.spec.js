import { mount } from '@vue/test-utils';

import FeedSummary from '~/components/FeedSummary.vue';
import { COLORS_DICT } from '~/constants/colors';
import { STATUSES_DICT } from '~/constants/statuses';

describe('FeedSummary component', () => {
  describe('render', () => {
    test('renders the base component', () => {
      const wrapper = mount(FeedSummary, {
        props: {
          id: 'RF-123-456',
          scheduleId: 'RS-1234-5678',
          credential: 'foo',
          description: 'Lorem ipsum dolor sit amet',
          status: STATUSES_DICT.ENABLED,
        },
        shallow: true,
      });

      const summaryRows = wrapper.findAll('.feed-summary__row');

      expect(wrapper.find('.feed-summary__title').text()).toEqual('Summary');
      expect(summaryRows[0].text()).toContain('Feed');
      expect(summaryRows[0].get('router-link-stub').attributes('to')).toBeDefined();
      expect(summaryRows[1].text()).toContain('Status');
      expect(summaryRows[1].get('ui-status').attributes()).toEqual(
        expect.objectContaining({
          iconname: 'googleFiberManualRecordBaseline',
          iconcolor: COLORS_DICT.NICE_GREEN,
          text: 'Enabled',
        }),
      );
      expect(summaryRows[2].text()).toContain('Report Schedule');
      expect(summaryRows[2].get('spa-link-stub').attributes('params')).toEqual('RS-1234-5678');
      expect(summaryRows[2].get('spa-link-stub').attributes('to')).toBeDefined();
      expect(summaryRows[3].text()).toContain('Credential');
      expect(summaryRows[3].text()).toContain('foo');
      expect(summaryRows[4].text()).toContain('Description');
      expect(summaryRows[4].text()).toContain('Lorem ipsum dolor sit amet');
    });
  });
});
