import { mount } from '@vue/test-utils';

import DetailItemGroup from '~/components/DetailItemGroup.vue';

describe('DetailItemGroup component', () => {
  let wrapper;

  describe('classes', () => {
    test('adds the "detail-item-group_separated" class if separated is true', () => {
      wrapper = mount(DetailItemGroup, {
        props: {
          separated: true,
        },
      });

      expect(wrapper.find('.detail-item-group_separated').exists()).toEqual(true);
    });

    test('does not add the "detail-item-group_separated" class if separated is false', () => {
      wrapper = mount(DetailItemGroup, {
        props: {
          separated: false,
        },
      });

      expect(wrapper.find('.detail-item-group_separated').exists()).toEqual(false);
    });
  });
});
