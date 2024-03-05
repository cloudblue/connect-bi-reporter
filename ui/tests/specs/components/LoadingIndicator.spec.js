import { mount } from '@vue/test-utils';

import LoadingIndicator from '~/components/LoadingIndicator.vue';
import { COLORS_DICT } from '~/constants/colors';

describe('LoadingIndicator component', () => {
  test('renders the base component', () => {
    const wrapper = mount(LoadingIndicator, {
      props: {
        size: 42,
      },
    });

    expect(wrapper.find('.loading-indicator ui-icon').attributes()).toEqual(
      expect.objectContaining({
        iconname: 'connectLoaderAnimated',
        size: '42',
        color: COLORS_DICT.DARKER_BLUE,
      }),
    );
  });
});
