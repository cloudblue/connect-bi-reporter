import DetailItemGroup from '~/components/DetailItemGroup.vue';
import { createFactory } from '~/tests/utils';

describe('DetailItemGroup component', () => {
  let wrapper;
  const factory = createFactory(DetailItemGroup, {
    props: {
      separated: true,
    },
  });

  describe('classes', () => {
    test('adds the "detail-item-group_separated" class if separated is true', () => {
      wrapper = factory();

      expect(wrapper.find('.detail-item-group_separated').exists()).toEqual(true);
    });

    test('does not add the "detail-item-group_separated" class if separated is false', () => {
      wrapper = factory({
        props: {
          separated: false,
        },
      });

      expect(wrapper.find('.detail-item-group_separated').exists()).toEqual(false);
    });
  });
});
