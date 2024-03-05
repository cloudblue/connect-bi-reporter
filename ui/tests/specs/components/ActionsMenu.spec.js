import ActionsMenu from '~/components/ActionsMenu.vue';
import { COLORS_DICT } from '~/constants/colors.js';
import { createFactory } from '~/tests/utils';

describe('ActionsMenu component', () => {
  const defaultAction = {
    key: 'foo',
    text: 'Foo',
    icon: 'googleCheckBaseline',
    handler: vi.fn(),
  };
  let factory;
  let wrapper;

  describe('props validation', () => {
    describe('actions prop', () => {
      test.each([
        // expected, actions
        [false, []],
        [false, [{ text: 'Foo', icon: 'fooIcon', handler: () => {} }]],
        [false, [{ key: 'foo', icon: 'fooIcon', handler: () => {} }]],
        [false, [{ key: 'foo', text: 'Foo', handler: () => {} }]],
        [false, [{ key: 'foo', text: 'Foo', icon: 'fooIcon' }]],
        [true, [{ key: 'foo', text: 'Foo', icon: 'fooIcon', handler: () => {} }]],
        [true, [{ loading: true, key: 'foo', text: 'Foo', icon: 'fooIcon', handler: () => {} }]],
        [true, [{ hide: true, key: 'foo', text: 'Foo', icon: 'fooIcon', handler: () => {} }]],
        [true, [{ disabled: true, key: 'foo', text: 'Foo', icon: 'fooIcon', handler: () => {} }]],
        [true, [{ color: 'red', key: 'foo', text: 'Foo', icon: 'fooIcon', handler: () => {} }]],
        [true, [{ separated: true, key: 'foo', text: 'Foo', icon: 'fooIcon', handler: () => {} }]],
        [
          false,
          [
            { key: 'foo', text: 'Foo', icon: 'fooIcon', handler: () => {} },
            { key: 'foo', icon: 'fooIcon', handler: () => {} },
          ],
        ],
      ])('returns %s if actions=%o', (expected, actions) => {
        const result = ActionsMenu.props.actions.validator(actions);

        expect(result).toEqual(expected);
      });
    });
  });

  describe('render', () => {
    beforeEach(() => {
      factory = createFactory(ActionsMenu, {
        props: {
          actions: [defaultAction],
        },
      });
    });

    test('renders the base component', () => {
      wrapper = factory();

      expect(wrapper.classes()).toEqual(['actions-menu']);
      expect(
        wrapper.get('.actions-menu__trigger-button .actions-menu__trigger-icon').attributes(),
      ).toEqual(
        expect.objectContaining({
          color: COLORS_DICT.TEXT,
          'icon-name': 'googleMoreVertBaseline',
        }),
      );
      expect(wrapper.findAll('.actions-menu__action').length).toEqual(1);
      expect(wrapper.get('.actions-menu__action ui-button').attributes()).toEqual(
        expect.objectContaining({
          'background-color': COLORS_DICT.TRANSPARENT,
          color: COLORS_DICT.TEXT,
          height: '32px',
          width: '156px',
        }),
      );
      expect(wrapper.get('.actions-menu__action ui-button').text()).toEqual('Foo');
      expect(wrapper.get('.actions-menu__action ui-icon').attributes()).toEqual(
        expect.objectContaining({
          'icon-name': 'googleCheckBaseline',
          color: COLORS_DICT.TEXT,
          size: '18',
        }),
      );
    });

    test('renders the content of the trigger slot if used', () => {
      wrapper = factory({
        slots: {
          trigger: '<div class="custom-trigger-slot">Custom Trigger Slot</div>',
        },
      });

      expect(wrapper.get('.custom-trigger-slot').text()).toEqual('Custom Trigger Slot');
    });

    describe('action conditional rendering', () => {
      test('renders the separator if action.separated is truthy', () => {
        wrapper = factory({
          props: {
            actions: [
              {
                ...defaultAction,
                separated: true,
              },
            ],
          },
        });

        expect(wrapper.get('.actions-menu__action .horizontal-divider')).toBeDefined();
      });

      test('does not renders the action button if action.hide is truthy', () => {
        wrapper = factory({
          props: {
            actions: [
              {
                ...defaultAction,
                hide: true,
              },
            ],
          },
        });

        expect(wrapper.find('.actions-menu__action ui-button').exists()).toBeFalsy();
      });

      test('renders button and icon with the action.color', () => {
        wrapper = factory({
          props: {
            actions: [
              {
                ...defaultAction,
                color: 'cyan',
              },
            ],
          },
        });

        expect(wrapper.get('.actions-menu__action ui-button').attributes('color')).toEqual('cyan');
        expect(wrapper.get('.actions-menu__action ui-icon').attributes('color')).toEqual('cyan');
      });

      test('renders the button as disabled if action.disabled is truthy', () => {
        wrapper = factory({
          props: {
            actions: [
              {
                ...defaultAction,
                disabled: true,
              },
            ],
          },
        });

        expect(wrapper.get('.actions-menu__action ui-button').attributes('disabled')).toEqual(
          'true',
        );
      });

      test('renders the icon as loading if action.loading is truthy', () => {
        wrapper = factory({
          props: {
            actions: [
              {
                ...defaultAction,
                loading: true,
              },
            ],
          },
        });

        expect(wrapper.get('.actions-menu__action ui-icon').attributes('icon-name')).toEqual(
          'connectLoaderAnimated',
        );
      });
    });
  });

  describe('events', () => {
    test('if an action is clicked, its handler is called', async () => {
      wrapper = factory();

      await wrapper.get('.actions-menu__action ui-button').trigger('clicked');

      expect(defaultAction.handler).toHaveBeenCalled();
    });
  });
});
