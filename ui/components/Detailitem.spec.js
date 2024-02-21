import { mount } from '@vue/test-utils';

import DetailItem from '~/components/DetailItem.vue';

describe('DetailItem component', () => {
  let wrapper;

  describe('render', () => {
    test('renders the title element if the title prop is truthy', () => {
      wrapper = mount(DetailItem, {
        props: {
          title: 'Foo',
        },
      });

      expect(wrapper.find('.detail-item__head').exists()).toEqual(true);
    });

    test('renders the subtitle element if the title and subtitle props are truthy', () => {
      wrapper = mount(DetailItem, {
        props: {
          title: 'Foo',
          subtitle: 'Bar',
        },
      });

      expect(wrapper.find('.detail-item__subhead').exists()).toEqual(true);
    });

    test('renders the title element if the title slot is used', () => {
      wrapper = mount(DetailItem, {
        slots: {
          title: '<p>Foo</p>',
        },
      });

      expect(wrapper.find('.detail-item__head').exists()).toEqual(true);
    });

    test('does not render the title element if the title prop is falsy and the title slot is not used', () => {
      wrapper = mount(DetailItem);

      expect(wrapper.find('.detail-item__head').exists()).toEqual(false);
    });

    test('renders the image element if the image slot is used', () => {
      wrapper = mount(DetailItem, {
        slots: {
          image: '<img />',
        },
      });

      expect(wrapper.find('.detail-item__image').exists()).toEqual(true);
    });

    test('does not render the image element if the image slot is not used', () => {
      wrapper = mount(DetailItem);

      expect(wrapper.find('.detail-item__image').exists()).toEqual(false);
    });

    test('renders the text element if the bodyText prop is truthy', () => {
      wrapper = mount(DetailItem, {
        props: {
          bodyText: 'Lorem ipsum',
        },
      });

      expect(wrapper.find('.detail-item__text').exists()).toEqual(true);
    });

    test('renders the text element if the body-text slot is used', () => {
      wrapper = mount(DetailItem, {
        slots: {
          'body-text': '<p>Lorem ipsum</p>',
        },
      });

      expect(wrapper.find('.detail-item__text').exists()).toEqual(true);
    });

    test('does not render the text element if the bodyText prop is falsy and the body-text slot is not used', () => {
      wrapper = mount(DetailItem);

      expect(wrapper.find('.detail-item__text').exists()).toEqual(false);
    });

    test('renders the assistive text element if the assistiveText prop is truthy', () => {
      wrapper = mount(DetailItem, {
        props: {
          assistiveText: 'Lorem ipsum',
        },
      });

      expect(wrapper.find('.detail-item__assistive-text').exists()).toEqual(true);
    });

    test('renders the assistive text element if the assistive-text slot is used', () => {
      wrapper = mount(DetailItem, {
        slots: {
          'assistive-text': '<p>Lorem ipsum</p>',
        },
      });

      expect(wrapper.find('.detail-item__assistive-text').exists()).toEqual(true);
    });

    test('does not render the assistive text element if the assistiveText prop is falsy and the assistive-text slot is not used', () => {
      wrapper = mount(DetailItem);

      expect(wrapper.find('.detail-item__assistive-text').exists()).toEqual(false);
    });

    test('renders the content slot if used', () => {
      wrapper = mount(DetailItem, {
        slots: {
          content: '<p class="content-slot">Foo</p>',
        },
      });

      expect(wrapper.find('.content-slot').exists()).toEqual(true);
    });

    test('adds the "detail-item_dense" class if dense is true', () => {
      wrapper = mount(DetailItem, {
        props: {
          dense: true,
        },
      });

      expect(wrapper.find('.detail-item_dense').exists()).toEqual(true);
    });

    test('does not add the "detail-item_dense" class if dense is false', () => {
      wrapper = mount(DetailItem, {
        props: {
          dense: false,
        },
      });

      expect(wrapper.find('.detail-item_dense').exists()).toEqual(false);
    });
  });
});
