import { mount } from '@vue/test-utils';

import LinkButton from '~/components/LinkButton.vue';

describe('LinkButton component', () => {
  describe('render', () => {
    test('renders the base component', () => {
      const wrapper = mount(LinkButton, {
        props: {
          text: 'My button content',
        },
      });

      expect(wrapper.classes()).toEqual(['reset-button', 'link-button']);
      expect(wrapper.text()).toEqual('My button content');
    });
  });
});
