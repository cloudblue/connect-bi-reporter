import DetailItem from '~/components/DetailItem.vue';
import { createFactory } from '~/tests/utils';

describe('DetailItem component', () => {
  let wrapper;
  const factory = createFactory(DetailItem, {
    props: {
      title: 'Foo',
    },
  });

  describe('render', () => {
    test('renders the title element if the title prop is truthy', () => {
      wrapper = factory();

      expect(wrapper.find('.detail-item__head').exists()).toEqual(true);
    });

    test('renders the subtitle element if the title and subtitle props are truthy', () => {
      wrapper = factory({
        props: {
          subtitle: 'Bar',
        },
      });

      expect(wrapper.find('.detail-item__subhead').exists()).toEqual(true);
    });

    test('renders the title element if the title slot is used', () => {
      wrapper = factory({
        slots: {
          title: '<p>Foo</p>',
        },
      });

      expect(wrapper.find('.detail-item__head').exists()).toEqual(true);
    });

    test('does not render the title element if the title prop is falsy and the title slot is not used', () => {
      wrapper = factory({
        props: {
          title: '',
        },
      });

      expect(wrapper.find('.detail-item__head').exists()).toEqual(false);
    });

    test('renders the image element if the image slot is used', () => {
      wrapper = factory({
        slots: {
          image: '<img />',
        },
      });

      expect(wrapper.find('.detail-item__image').exists()).toEqual(true);
    });

    test('does not render the image element if the image slot is not used', () => {
      wrapper = factory();

      expect(wrapper.find('.detail-item__image').exists()).toEqual(false);
    });

    test('renders the text element if the bodyText prop is truthy', () => {
      wrapper = factory({
        props: {
          bodyText: 'Lorem ipsum',
        },
      });

      expect(wrapper.find('.detail-item__text').exists()).toEqual(true);
    });

    test('renders the text element if the body-text slot is used', () => {
      wrapper = factory({
        slots: {
          'body-text': '<p>Lorem ipsum</p>',
        },
      });

      expect(wrapper.find('.detail-item__text').exists()).toEqual(true);
    });

    test('does not render the text element if the bodyText prop is falsy and the body-text slot is not used', () => {
      wrapper = factory();

      expect(wrapper.find('.detail-item__text').exists()).toEqual(false);
    });

    test('renders the assistive text element if the assistiveText prop is truthy', () => {
      wrapper = factory({
        props: {
          assistiveText: 'Lorem ipsum',
        },
      });

      expect(wrapper.find('.detail-item__assistive-text').exists()).toEqual(true);
    });

    test('renders the assistive text element if the assistive-text slot is used', () => {
      wrapper = factory({
        slots: {
          'assistive-text': '<p>Lorem ipsum</p>',
        },
      });

      expect(wrapper.find('.detail-item__assistive-text').exists()).toEqual(true);
    });

    test('does not render the assistive text element if the assistiveText prop is falsy and the assistive-text slot is not used', () => {
      wrapper = factory();

      expect(wrapper.find('.detail-item__assistive-text').exists()).toEqual(false);
    });

    test('renders the content slot if used', () => {
      wrapper = factory({
        slots: {
          content: '<p class="content-slot">Foo</p>',
        },
      });

      expect(wrapper.find('.content-slot').exists()).toEqual(true);
    });
  });
});