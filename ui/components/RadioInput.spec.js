import { mount } from '@vue/test-utils';

import RadioInput from '~/components/RadioInput.vue';
import { COLORS_DICT } from '~/constants/colors';

describe('RadioInput component', () => {
  let wrapper;

  describe('render', () => {
    test('renders the base component', () => {
      wrapper = mount(RadioInput, {
        props: {
          modelValue: 'foo',
          value: 'bar',
          label: 'My radio input',
        },
      });

      expect(wrapper.get('.radio-input ui-icon').attributes()).toEqual(
        expect.objectContaining({
          'icon-name': 'googleRadioButtonUncheckedBaseline',
          color: '',
        }),
      );
      expect(wrapper.get('.radio-input__label').classes()).not.toContain(
        'radio-input__label_empty',
      );
      expect(wrapper.get('.radio-input__label-text').text()).toEqual('My radio input');
    });

    test('adds the "radio-input__label_empty" class to the label element if there is no label', () => {
      wrapper = mount(RadioInput, {
        props: {
          modelValue: 'foo',
          value: 'bar',
        },
      });

      expect(wrapper.get('.radio-input__label').classes()).toContain('radio-input__label_empty');
    });
  });

  describe('events', () => {
    test('click the component selects the value', async () => {
      wrapper = mount(RadioInput, {
        props: {
          modelValue: 'foo',
          value: 'bar',
          label: 'My radio input',
          'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
        },
      });

      await wrapper.trigger('click');

      expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['bar']);
      expect(wrapper.get('.radio-input ui-icon').attributes()).toEqual(
        expect.objectContaining({
          'icon-name': 'googleRadioButtonCheckedBaseline',
          color: COLORS_DICT.NICE_BLUE,
        }),
      );
    });
  });
});
