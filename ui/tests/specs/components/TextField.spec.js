import TextField from '~/components/TextField.vue';
import { createFactory } from '~/tests/utils';

describe('TextField component', () => {
  let wrapper;
  const factory = createFactory(TextField, {
    props: {
      label: 'Foo',
      placeholder: 'Bar',
      suffix: 'Baz',

      // v-model
      modelValue: 'initialValue',
      'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
    },
  });

  describe('render', () => {
    test('passes down all props to the ui-textfield element', () => {
      wrapper = factory();

      const uiTextfieldEl = wrapper.get('ui-textfield');

      expect(uiTextfieldEl.attributes('value')).toEqual('initialValue');
      expect(uiTextfieldEl.attributes('label')).toEqual('Foo');
      expect(uiTextfieldEl.attributes('placeholder')).toEqual('Bar');
      expect(uiTextfieldEl.attributes('suffix')).toEqual('Baz');
    });

    test('updates the v-model when the ui-textfield emits the input event', async () => {
      wrapper = factory();

      await wrapper.get('ui-textfield').trigger('input', { detail: ['new value'] });

      expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['new value']);
      expect(wrapper.get('ui-textfield').attributes('value')).toEqual('new value');
    });
  });
});
