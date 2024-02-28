import { mount } from '@vue/test-utils';

import { COLORS_DICT } from '~/constants/colors';

import EmptyPlaceholder from './EmptyPlaceholder.vue';

describe('EmptyPlaceholder component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(EmptyPlaceholder, {
      props: {
        title: 'Foo',
        message: 'Lorem ipsum',
        icon: 'googleAppleMicrosoft',
        action: 'Bar',
      },
    });
  });

  test('renders the icon', () => {
    expect(wrapper.find('.empty-placeholder_icon ui-icon').attributes()).toEqual(
      expect.objectContaining({
        color: COLORS_DICT.MIDDLE_GREY,
        'icon-name': 'googleAppleMicrosoft',
      }),
    );
  });

  test('renders the title', () => {
    expect(wrapper.find('h2').text()).toEqual('Foo');
  });

  test('renders the subtitle', () => {
    expect(wrapper.find('p').text()).toEqual('Lorem ipsum');
  });

  test('renders the action, if any', () => {
    expect(wrapper.find('.empty-placeholder_action').attributes()).toEqual(
      expect.objectContaining({
        'background-color': 'transparent',
        color: COLORS_DICT.NICE_BLUE,
      }),
    );
    expect(wrapper.find('.empty-placeholder_action ui-icon').attributes()).toEqual(
      expect.objectContaining({
        'icon-name': 'googleAddBaseline',
        size: '18',
        color: COLORS_DICT.NICE_BLUE,
      }),
    );
    expect(wrapper.find('.empty-placeholder_action').text()).toContain('Bar');
  });

  test('emits the "actionClicked" event when the action button is clicked', () => {
    wrapper.find('.empty-placeholder_action').trigger('clicked');

    expect(wrapper.emitted().actionClicked).toBeTruthy();
  });

  test('does not render the action button if there is none', () => {
    wrapper = mount(EmptyPlaceholder, {
      props: {
        title: 'Foo',
        message: 'Lorem ipsum',
        icon: 'googleAppleMicrosoft',
      },
    });

    expect(wrapper.find('.empty-placeholder_action').exists()).toEqual(false);
  });
});
