import FormDialog from '~/components/FormDialog.vue';
import { FORM_DIALOG_TYPES_DICT } from '~/constants/dialogs.js';
import { createFactory } from '~/tests/utils';
import { validationRules } from '~/utils/validation';

describe('FormDialog component', () => {
  const factory = createFactory(FormDialog, {
    props: {
      modelValue: true,
      title: 'My dialog',
      mode: FORM_DIALOG_TYPES_DICT.WIZARD,
      rules: { three: [validationRules.required()] },
      form: { three: null },
      tabs: [
        { key: 'one' },
        { key: 'two' },
        { key: 'three', includes: ['three'] },
        { key: 'four', submittable: true },
        { key: 'summary' },
      ],
    },
    slots: {
      one: '<p class="one-tab">Content for one tab</p>',
      two: '<p class="two-tab">Content for two tab</p>',
      three: '<p class="three-tab">Content for three tab</p>',
      four: '<p class="four-tab">Content for four tab</p>',
      summary: '<p class="summary-tab">Content for summary tab</p>',
    },
    shallow: true,
    global: {
      stubs: {
        'simple-dialog': {
          name: 'SimpleDialog',
          template: '<div class="simple-dialog"><slot name="sidebar" /><slot /></div>',
        },
      },
    },
  });

  let wrapper;

  describe('props validation', () => {
    describe('tabs prop validator', () => {
      it.each([
        // expected, value
        [true, [1]],
        [true, ['a', 'b']],
        [false, []],
      ])('returns %s if the prop tabs is %s', (expected, value) => {
        const result = FormDialog.props.tabs.validator(value);

        expect(result).toEqual(expected);
      });
    });

    describe('mode prop validator', () => {
      it.each([
        // expected, value
        [true, FORM_DIALOG_TYPES_DICT.EDIT],
        [true, FORM_DIALOG_TYPES_DICT.WIZARD],
        [false, 'foo'],
        [false, ''],
      ])('returns %s if the prop mode is %s', (expected, value) => {
        const result = FormDialog.props.mode.validator(value);

        expect(result).toEqual(expected);
      });
    });
  });

  describe('render', () => {
    test('renders the base component', () => {
      wrapper = factory();

      expect(wrapper.get('vertical-tabs-stub')).toBeDefined();
      expect(wrapper.get('.one-tab').text()).toEqual('Content for one tab');
    });

    test('sends the correct props to the SimpleDialog component', () => {
      wrapper = factory({
        props: {
          height: '400px',
          width: '400px',
          title: 'Lorem Ipsum',
        },
      });

      expect(wrapper.getComponent({ name: 'SimpleDialog' }).attributes()).toEqual(
        expect.objectContaining({
          actions: 'cancel,spacer,back,next',
          backdisabled: 'true',
          height: '400px',
          width: '400px',
          isvalid: 'true',
          title: 'Lorem Ipsum – Step 1',
        }),
      );
    });

    describe('if mode=edit', () => {
      beforeEach(() => {
        wrapper = factory({ props: { mode: FORM_DIALOG_TYPES_DICT.EDIT } });
      });

      test('adds the "form-dialog_edit" class', () => {
        expect(wrapper.classes()).toContain('form-dialog_edit');
      });

      test('sends "linear" set to false to vertical tabs', () => {
        expect(wrapper.get('vertical-tabs-stub').attributes('linear')).toEqual('false');
      });

      test('sends the edit mode actions to the SimpleDialog component', () => {
        expect(wrapper.getComponent({ name: 'SimpleDialog' }).attributes('actions')).toEqual(
          'spacer,close,save',
        );
      });
    });

    describe('if mode=wizard', () => {
      beforeEach(() => {
        wrapper = factory({ props: { mode: FORM_DIALOG_TYPES_DICT.WIZARD } });
      });

      test('adds the "form-dialog_wizard" class', () => {
        expect(wrapper.classes()).toContain('form-dialog_wizard');
      });

      test('sends "linear" set to true to vertical tabs', () => {
        expect(wrapper.get('vertical-tabs-stub').attributes('linear')).toEqual('true');
      });

      describe('wizard mode actions', () => {
        test('sends the correct actions if the current tab is the first tab', () => {
          expect(wrapper.getComponent({ name: 'SimpleDialog' }).attributes()).toEqual(
            expect.objectContaining({
              actions: 'cancel,spacer,back,next',
              backdisabled: 'true',
            }),
          );
        });

        test('sends the correct actions if the current tab is a middle tab', async () => {
          wrapper.vm.activeTabKey = 'two';
          await wrapper.vm.$nextTick();

          expect(wrapper.getComponent({ name: 'SimpleDialog' }).attributes()).toEqual(
            expect.objectContaining({
              actions: 'cancel,spacer,back,next',
              backdisabled: 'false',
              isvalid: 'true',
            }),
          );
        });

        test('sends the correct actions if the current tab is a middle tab and validation fails', async () => {
          wrapper.vm.activeTabKey = 'three';
          await wrapper.vm.$nextTick();

          expect(wrapper.getComponent({ name: 'SimpleDialog' }).attributes()).toEqual(
            expect.objectContaining({
              actions: 'cancel,spacer,back,next',
              backdisabled: 'false',
              isvalid: 'false',
            }),
          );
        });

        test('sends the correct actions if the current tab is submittable', async () => {
          wrapper.vm.activeTabKey = 'four';
          await wrapper.vm.$nextTick();

          expect(wrapper.getComponent({ name: 'SimpleDialog' }).attributes()).toEqual(
            expect.objectContaining({
              actions: 'cancel,spacer,back,submit',
              backdisabled: 'false',
              isvalid: 'true',
            }),
          );
        });

        test('sends the correct actions if the current tab is summary', async () => {
          wrapper.vm.activeTabKey = 'summary';
          await wrapper.vm.$nextTick();

          expect(wrapper.getComponent({ name: 'SimpleDialog' }).attributes()).toEqual(
            expect.objectContaining({
              actions: 'spacer,details,close',
              backdisabled: 'false',
              isvalid: 'true',
            }),
          );
        });
      });
    });
  });

  describe('events', () => {
    test('goes to the next tab when SimpleDialog emits the "next" event', async () => {
      wrapper = factory();

      await wrapper.getComponent('.simple-dialog').trigger('next');

      expect(wrapper.get('.two-tab').text()).toEqual('Content for two tab');
    });

    test('goes to the previous tab when SimpleDialog emits the "back" event', async () => {
      wrapper = factory();
      wrapper.vm.activeTabKey = 'four';
      await wrapper.vm.$nextTick();

      await wrapper.getComponent('.simple-dialog').trigger('back');

      expect(wrapper.get('.three-tab').text()).toEqual('Content for three tab');
    });
  });
});
