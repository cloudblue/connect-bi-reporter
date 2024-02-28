import { mount } from '@vue/test-utils';

import FormDialog from '~/components/FormDialog.vue';
import { validationRules } from '~/utils/validation.js';

describe('FormDialog component', () => {
  const factory = (options = {}) =>
    mount(FormDialog, {
      ...options,
      props: {
        modelValue: true,
        title: 'My dialog',
        mode: 'wizard',
        rules: {
          three: [validationRules.required()],
        },
        form: {
          three: null,
        },
        tabs: [
          { key: 'one' },
          { key: 'two' },
          { key: 'three', includes: ['three'] },
          { key: 'four', submittable: true },
          { key: 'summary' },
        ],
        ...options.props,
      },
      slots: {
        one: '<p class="one-tab">Content for one tab</p>',
        two: '<p class="two-tab">Content for two tab</p>',
        three: '<p class="three-tab">Content for three tab</p>',
        four: '<p class="four-tab">Content for four tab</p>',
        summary: '<p class="summary-tab">Content for summary tab</p>',
        ...options.slots,
      },
      shallow: true,
      global: {
        ...options.global,
        stubs: {
          'simple-dialog': {
            name: 'SimpleDialog',
            template: '<div class="simple-dialog"><slot name="sidebar" /><slot /></div>',
          },
        },
      },
    });

  let wrapper;

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
          'back-disabled': 'true',
          height: '400px',
          width: '400px',
          'is-valid': 'true',
          title: 'Lorem Ipsum – Step 1',
        }),
      );
    });

    describe('if mode=edit', () => {
      beforeEach(() => {
        wrapper = factory({ props: { mode: 'edit' } });
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
        wrapper = factory({ props: { mode: 'wizard' } });
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
              'back-disabled': 'true',
            }),
          );
        });

        test('sends the correct actions if the current tab is a middle tab', async () => {
          wrapper.vm.activeTabKey = 'two';
          await wrapper.vm.$nextTick();

          expect(wrapper.getComponent({ name: 'SimpleDialog' }).attributes()).toEqual(
            expect.objectContaining({
              actions: 'cancel,spacer,back,next',
              'back-disabled': 'false',
              'is-valid': 'true',
            }),
          );
        });

        test('sends the correct actions if the current tab is a middle tab and validation fails', async () => {
          wrapper.vm.activeTabKey = 'three';
          await wrapper.vm.$nextTick();

          expect(wrapper.getComponent({ name: 'SimpleDialog' }).attributes()).toEqual(
            expect.objectContaining({
              actions: 'cancel,spacer,back,next',
              'back-disabled': 'false',
              'is-valid': 'false',
            }),
          );
        });

        test('sends the correct actions if the current tab is submittable', async () => {
          wrapper.vm.activeTabKey = 'four';
          await wrapper.vm.$nextTick();

          expect(wrapper.getComponent({ name: 'SimpleDialog' }).attributes()).toEqual(
            expect.objectContaining({
              actions: 'cancel,spacer,back,submit',
              'back-disabled': 'false',
              'is-valid': 'true',
            }),
          );
        });

        test('sends the correct actions if the current tab is summary', async () => {
          wrapper.vm.activeTabKey = 'summary';
          await wrapper.vm.$nextTick();

          expect(wrapper.getComponent({ name: 'SimpleDialog' }).attributes()).toEqual(
            expect.objectContaining({
              actions: 'spacer,details,close',
              'back-disabled': 'false',
              'is-valid': 'true',
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
