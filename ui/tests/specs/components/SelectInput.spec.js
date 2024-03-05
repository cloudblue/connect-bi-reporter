import SelectInput from '~/components/SelectInput.vue';
import { createFactory } from '~/tests/utils';

describe('SelectInput component', () => {
  let wrapper;
  const items = [
    {
      id: 'foo',
      name: 'Foo',
    },
    {
      id: 'bar',
      name: 'Bar',
    },
  ];
  const factory = createFactory(SelectInput, {
    props: {
      modelValue: 'foo',
      options: items,
      label: 'My select input',
    },
  });

  describe('render', () => {
    test('renders the base component', () => {
      wrapper = factory();

      expect(wrapper.get('.select-input__label').text()).toEqual('My select input');
      expect(wrapper.get('.select-input__real-input select')).toBeDefined();
      expect(wrapper.findAll('.select-input__real-input select option').length).toEqual(2);
      expect(wrapper.get('ui-menu').attributes('fullwidth')).toBeDefined();
      expect(wrapper.get('ui-menu').attributes('closeonclickinside')).toBeDefined();
      expect(wrapper.get('.select-input__selected').text()).toEqual('foo');
      expect(wrapper.findAll('.select-input__option').length).toEqual(2);
      expect(wrapper.findAll('.select-input__option')[0].classes()).toContain(
        'select-input__option_selected',
      );
      expect(wrapper.find('.select-input__hint').exists()).toBeFalsy();
    });

    test('renders the hint element if hint prop is truthy', () => {
      wrapper = factory({
        props: {
          hint: 'My hint',
        },
      });

      expect(wrapper.find('.select-input__hint').text()).toEqual('My hint');
    });

    test('renders the hint element if hint slot is used', () => {
      wrapper = factory({
        slots: {
          hint: 'My slotted hint',
        },
      });

      expect(wrapper.find('.select-input__hint').text()).toEqual('My slotted hint');
    });
  });

  describe('events', () => {
    test('clicking an option selects the option', async () => {
      wrapper = factory();

      expect(wrapper.findAll('.select-input__option')[1].classes()).not.toContain(
        'select-input__option_selected',
      );
      await wrapper.findAll('.select-input__option')[1].trigger('click');

      expect(wrapper.findAll('.select-input__option')[1].classes()).toContain(
        'select-input__option_selected',
      );
    });
  });
});
