import RadioTable from '~/components/RadioTable.vue';
import { createFactory } from '~/tests/utils';

describe('RadioTable component', () => {
  let wrapper;
  const initialItems = [
    { id: 'foo', name: 'Foo' },
    { id: 'bar', name: 'Bar' },
  ];
  const factory = createFactory(RadioTable, {
    props: {
      modelValue: '',
      items: initialItems,
      title: 'Lorem ipsum',
    },
    slots: {
      default: `{{ params.item.name }}`,
    },
  });

  describe('render', () => {
    test('renders the base component', () => {
      wrapper = factory();

      expect(wrapper.get('.radio-table__title').text()).toEqual('Lorem ipsum');
      expect(wrapper.get('.radio-table__search')).toBeDefined();
      expect(wrapper.findAll('.radio-table__item').length).toEqual(2);
      expect(wrapper.findAll('.radio-table__item')[0].text()).toEqual('Foo');
      expect(wrapper.findAll('.radio-table__item')[1].text()).toEqual('Bar');
    });

    test('does not render the search input if hideSearch is true', () => {
      wrapper = factory({
        props: {
          hideSearch: true,
        },
      });

      expect(wrapper.find('.radio-table__search').exists()).toBeFalsy();
    });
  });

  describe('events', () => {
    test('clicking an "radio-table__item" selects it', async () => {
      wrapper = factory({
        shallow: true,
      });

      expect(
        wrapper.findAll('.radio-table__item')[1].find('radio-input-stub').attributes(),
      ).toEqual(
        expect.objectContaining({
          modelvalue: '',
          value: 'bar',
        }),
      );
      await wrapper.findAll('.radio-table__item')[1].trigger('click');

      expect(
        wrapper.findAll('.radio-table__item')[1].find('radio-input-stub').attributes(),
      ).toEqual(
        expect.objectContaining({
          modelvalue: 'bar',
          value: 'bar',
        }),
      );
    });

    test('the "search" event is triggered if the ui-textfield search element emits "input"', async () => {
      wrapper = factory();

      await wrapper.find('.radio-table__search ui-textfield').trigger('input', { detail: ['foo'] });

      expect(wrapper.emitted().search[0]).toEqual(['foo']);
    });
  });
});
