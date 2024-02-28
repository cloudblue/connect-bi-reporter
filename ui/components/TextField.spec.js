import { mount } from '@vue/test-utils';

import TextField from '~/components/TextField.vue';

describe('TextField component', () => {
  let wrapper;

  describe('render', () => {
    test('passes down all props to the ui-textfield element', () => {
      wrapper = mount(TextField, {
        props: {
          label: 'Foo',
          placeholder: 'Bar',
          suffix: 'Baz',

          // v-model
          modelValue: 'initialValue',
          'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
        },
      });

      const uiTextfieldEl = wrapper.get('ui-textfield');

      expect(uiTextfieldEl.attributes('value')).toEqual('initialValue');
      expect(uiTextfieldEl.attributes('label')).toEqual('Foo');
      expect(uiTextfieldEl.attributes('placeholder')).toEqual('Bar');
      expect(uiTextfieldEl.attributes('suffix')).toEqual('Baz');
    });

    test('updates the v-model when the ui-textfield emits the input event', async () => {
      wrapper = mount(TextField, {
        props: {
          label: 'Foo',
          placeholder: 'Bar',
          suffix: 'Baz',

          // v-model
          modelValue: 'initialValue',
          'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
        },
      });

      await wrapper.get('ui-textfield').trigger('input', { detail: ['new value'] });

      expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['new value']);
      expect(wrapper.get('ui-textfield').attributes('value')).toEqual('new value');
    });
  });
});
