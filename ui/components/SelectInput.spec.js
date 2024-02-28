import { mount } from '@vue/test-utils';

import SelectInput from '~/components/SelectInput.vue';

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

  describe('render', () => {
    test('renders the base component', () => {
      wrapper = mount(SelectInput, {
        props: {
          modelValue: 'foo',
          options: items,
          label: 'My select input',
        },
      });

      expect(wrapper.get('.select-input__label').text()).toEqual('My select input');
      expect(wrapper.get('.select-input__real-input select')).toBeDefined();
      expect(wrapper.findAll('.select-input__real-input select option').length).toEqual(2);
      expect(wrapper.get('ui-menu').attributes()['full-width']).toBeDefined();
      expect(wrapper.get('ui-menu').attributes()['close-on-click-inside']).toBeDefined();
      expect(wrapper.get('.select-input__selected').text()).toEqual('foo');
      expect(wrapper.findAll('.select-input__option').length).toEqual(2);
      expect(wrapper.findAll('.select-input__option')[0].classes()).toContain(
        'select-input__option_selected',
      );
      expect(wrapper.find('.select-input__hint').exists()).toBeFalsy();
    });

    test('renders the hint element if hint prop is truthy', () => {
      wrapper = mount(SelectInput, {
        props: {
          modelValue: 'foo',
          options: items,
          label: 'My select input',
          hint: 'My hint',
        },
      });

      expect(wrapper.find('.select-input__hint').text()).toEqual('My hint');
    });

    test('renders the hint element if hint slot is used', () => {
      wrapper = mount(SelectInput, {
        props: {
          modelValue: 'foo',
          options: items,
          label: 'My select input',
        },
        slots: {
          hint: 'My slotted hint',
        },
      });

      expect(wrapper.find('.select-input__hint').text()).toEqual('My slotted hint');
    });
  });

  describe('events', () => {
    test('clicking an option selects the option', async () => {
      wrapper = mount(SelectInput, {
        props: {
          modelValue: 'foo',
          options: items,
        },
      });

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
