import { flushPromises } from '@vue/test-utils';
import * as router from 'vue-router';

import SimpleDialog from '~/components/SimpleDialog.vue';
import { COLORS_DICT } from '~/constants/colors';
import { createFactory } from '~/tests/utils';

vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
}));

describe('SimpleDialog component', () => {
  let wrapper;
  const routerPushMock = vi.fn();
  const factory = createFactory(SimpleDialog, {
    props: {
      modelValue: true,
      title: 'My dialog',
      actions: ['close', 'save'],
    },
    slots: {
      default: '<p>Default slot content</p>',
    },
    shallow: true,
    global: {
      renderStubDefaultSlot: true,
      provide: {
        'fullscreen-height': '800px',
      },
    },
  });

  beforeEach(() => {
    router.useRouter.mockReturnValue({
      push: routerPushMock,
    });
  });

  describe('render', () => {
    test('renders the base component', () => {
      wrapper = factory();

      expect(wrapper.get('.dialog__title').text()).toEqual('My dialog');
      expect(wrapper.find('.dialog__sidebar').exists()).toBeFalsy();
      expect(wrapper.get('.dialog__content').text()).toEqual('Default slot content');
      expect(wrapper.findAll('.dialog__actions ui-button .dialog__action-label')[0].text()).toEqual(
        'Close',
      );
      expect(wrapper.findAll('.dialog__actions ui-button .dialog__action-label')[1].text()).toEqual(
        'Save',
      );
    });

    test('renders the header if using the header slot', () => {
      wrapper = factory({
        slots: {
          header: '<p>My custom header</p>',
        },
      });

      expect(wrapper.get('.dialog__header').text()).toEqual('My custom header');
    });

    test('renders the sidebar if using the sidebar slot', () => {
      wrapper = factory({
        slots: {
          sidebar: '<p>My custom sidebar</p>',
        },
      });

      expect(wrapper.get('.dialog__sidebar').text()).toEqual('My custom sidebar');
    });
  });

  describe('action buttons', () => {
    beforeEach(() => {
      wrapper = factory({
        props: {
          actions: [],
        },
      });
    });

    describe('cancel action', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          actions: ['cancel'],
        });
      });

      test('renders the cancel action button', () => {
        const cancelButton = wrapper.get('.dialog__action');

        expect(cancelButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.TEXT,
            height: '36px',
            'background-color': 'transparent',
          }),
        );
        expect(cancelButton.text()).toEqual('Cancel');
      });

      test('closes the dialog when clicked', async () => {
        const cancelButton = wrapper.get('.dialog__action');

        await cancelButton.trigger('clicked');

        expect(wrapper.find('.dialog').exists()).toBeFalsy();
      });
    });

    describe('close action', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          actions: ['close'],
        });
      });

      test('renders the close action button', () => {
        const closeButton = wrapper.get('.dialog__action');

        expect(closeButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.TEXT,
            height: '36px',
            'background-color': 'transparent',
          }),
        );
        expect(closeButton.text()).toEqual('Close');
      });

      test('closes the dialog when clicked', async () => {
        const closeButton = wrapper.get('.dialog__action');

        await closeButton.trigger('clicked');

        expect(wrapper.find('.dialog').exists()).toBeFalsy();
      });
    });

    describe('spacer action', () => {
      test('renders the spacer element', async () => {
        await wrapper.setProps({
          actions: ['spacer'],
        });

        expect(wrapper.find('.dialog__spacer').exists()).toBeTruthy();
      });
    });

    describe('next action', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          actions: ['next'],
        });
      });

      test('renders the next action button', () => {
        const nextButton = wrapper.get('.dialog__action');

        expect(nextButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.NICE_BLUE,
            disabled: 'false',
            height: '36px',
            'background-color': 'transparent',
          }),
        );
        expect(nextButton.text()).toEqual('Next');
      });

      test('renders the next action button disabled if "isValid" is falsy', async () => {
        await wrapper.setProps({
          isValid: false,
        });

        const nextButton = wrapper.get('.dialog__action');

        expect(nextButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.NICE_BLUE,
            disabled: 'true',
            height: '36px',
            'background-color': 'transparent',
          }),
        );
        expect(nextButton.text()).toEqual('Next');
      });

      test('emits the "next" event when clicked', async () => {
        const nextButton = wrapper.get('.dialog__action');

        await nextButton.trigger('clicked');

        expect(wrapper.emitted().next).toBeTruthy();
      });
    });

    describe('back action', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          actions: ['back'],
        });
      });

      test('renders the back action button', () => {
        const backButton = wrapper.get('.dialog__action');

        expect(backButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.TEXT,
            disabled: 'false',
            height: '36px',
            'background-color': 'transparent',
          }),
        );
        expect(backButton.text()).toEqual('Back');
      });

      test('renders the back action button disabled if "backDisabled" is truthy', async () => {
        await wrapper.setProps({
          backDisabled: true,
        });

        const backButton = wrapper.get('.dialog__action');

        expect(backButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.TEXT,
            disabled: 'true',
            height: '36px',
            'background-color': 'transparent',
          }),
        );
        expect(backButton.text()).toEqual('Back');
      });

      test('emits the "back" event when clicked', async () => {
        const backButton = wrapper.get('.dialog__action');

        await backButton.trigger('clicked');

        expect(wrapper.emitted().back).toBeTruthy();
      });
    });

    describe('details action', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          actions: ['details'],
          detailsRoute: { name: 'foo' },
        });
      });

      test('renders the details action button', () => {
        const detailsButton = wrapper.get('.dialog__action');

        expect(detailsButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.TEXT,
            height: '36px',
            'background-color': 'transparent',
          }),
        );
        expect(detailsButton.text()).toEqual('Go to details');
      });

      test('navigates to the detailsRoute', async () => {
        const detailsButton = wrapper.get('.dialog__action');

        await detailsButton.trigger('clicked');

        expect(routerPushMock).toHaveBeenCalledWith({ name: 'foo' });
      });
    });

    describe('submit action', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          actions: ['submit'],
          isValid: true,
        });
      });

      test('renders the submit action button', () => {
        const submitButton = wrapper.get('.dialog__action');

        expect(submitButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.NICE_BLUE,
            disabled: 'false',
            height: '36px',
            'background-color': 'transparent',
          }),
        );
        expect(submitButton.text()).toEqual('Submit');
      });

      test('renders the submit action button disabled if "isValid" is falsy', async () => {
        await wrapper.setProps({
          isValid: false,
        });

        const submitButton = wrapper.get('.dialog__action');

        expect(submitButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.NICE_BLUE,
            disabled: 'true',
            height: '36px',
            'background-color': 'transparent',
          }),
        );
        expect(submitButton.text()).toEqual('Submit');
      });

      test('renders the submit action button with the submitLabel prop as text', async () => {
        await wrapper.setProps({
          submitLabel: 'Create',
        });

        const submitButton = wrapper.get('.dialog__action');

        expect(submitButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.NICE_BLUE,
            disabled: 'false',
            height: '36px',
            'background-color': 'transparent',
          }),
        );
        expect(submitButton.text()).toEqual('Create');
      });

      describe('when the button is clicked', () => {
        const onSubmitFn = vi.fn().mockImplementation(async () => {
          // wait for multiple next ticks to check loading state
          await wrapper.vm.$nextTick();
          await wrapper.vm.$nextTick();
          await wrapper.vm.$nextTick();
        });

        beforeEach(async () => {
          await wrapper.setProps({
            onSubmit: onSubmitFn,
          });

          const submitButton = wrapper.get('.dialog__action');
          await submitButton.trigger('clicked');
        });

        test('calls the onSubmit prop', () => {
          expect(onSubmitFn).toHaveBeenCalled();
        });

        test('renders the loading icon', async () => {
          expect(wrapper.get('.dialog__action ui-icon').attributes()).toEqual(
            expect.objectContaining({
              'icon-name': 'connectLoaderAnimated',
              color: COLORS_DICT.NICE_BLUE,
              size: '24',
            }),
          );
          await flushPromises();
        });

        test('renders the button text after handler resolves', async () => {
          await flushPromises();

          expect(wrapper.find('.dialog__action ui-icon').exists()).toBeFalsy();
        });
      });
    });

    describe('save action', () => {
      beforeEach(async () => {
        await wrapper.setProps({
          actions: ['save'],
          isValid: true,
        });
      });

      test('renders the save action button', () => {
        const saveButton = wrapper.get('.dialog__action');

        expect(saveButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.NICE_BLUE,
            disabled: 'false',
            height: '36px',
            'background-color': 'transparent',
          }),
        );
        expect(saveButton.text()).toEqual('Save');
      });

      test('renders the save action button disabled if "isValid" is falsy', async () => {
        await wrapper.setProps({
          isValid: false,
        });

        const saveButton = wrapper.get('.dialog__action');

        expect(saveButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.NICE_BLUE,
            disabled: 'true',
            height: '36px',
            'background-color': 'transparent',
          }),
        );
        expect(saveButton.text()).toEqual('Save');
      });

      test('renders the save action button with the submitLabel prop as text', async () => {
        await wrapper.setProps({
          submitLabel: 'Create',
        });

        const saveButton = wrapper.get('.dialog__action');

        expect(saveButton.attributes()).toEqual(
          expect.objectContaining({
            color: COLORS_DICT.NICE_BLUE,
            disabled: 'false',
            height: '36px',
            'background-color': 'transparent',
          }),
        );
        expect(saveButton.text()).toEqual('Create');
      });

      describe('when the button is clicked', () => {
        const onSubmitFn = vi.fn().mockImplementation(async () => {
          // wait for multiple next ticks to check loading state
          await wrapper.vm.$nextTick();
          await wrapper.vm.$nextTick();
          await wrapper.vm.$nextTick();
        });

        beforeEach(async () => {
          await wrapper.setProps({
            onSubmit: onSubmitFn,
          });

          const saveButton = wrapper.get('.dialog__action');
          await saveButton.trigger('clicked');
        });

        test('calls the onSubmit prop', () => {
          expect(onSubmitFn).toHaveBeenCalled();
        });

        test('renders the loading icon', async () => {
          expect(wrapper.get('.dialog__action ui-icon').attributes()).toEqual(
            expect.objectContaining({
              'icon-name': 'connectLoaderAnimated',
              color: COLORS_DICT.NICE_BLUE,
              size: '24',
            }),
          );
          await flushPromises();
        });

        test('renders the button text after handler resolves', async () => {
          await flushPromises();

          expect(wrapper.find('.dialog__action ui-icon').exists()).toBeFalsy();
        });
      });
    });
  });

  describe('watchers', () => {
    describe('value', () => {
      beforeEach(() => {
        wrapper = factory({
          props: {
            modelValue: false,
          },
        });
      });

      it('adds the "is-clipped" class to the document if true', async () => {
        await wrapper.setProps({
          modelValue: true,
        });

        expect(document.documentElement.classList.contains('is-clipped')).toBeTruthy();
      });

      it('removes the "is-clipped" class to the document if false', async () => {
        await wrapper.setProps({
          modelValue: true,
        });

        await wrapper.setProps({
          modelValue: false,
        });

        expect(document.documentElement.classList.contains('is-clipped')).toBeFalsy();
      });
    });
  });

  describe('lifecycle', () => {
    describe('unmounted', () => {
      test('removes the "is-clipped" class from the document', () => {
        wrapper = factory({
          props: {
            modelValue: false,
          },
        });
        document.documentElement.classList.add('is-clipped');

        wrapper.unmount();

        expect(document.documentElement.classList.contains('is-clipped')).toBeFalsy();
      });
    });
  });
});
