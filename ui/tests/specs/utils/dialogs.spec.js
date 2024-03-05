import { ACTIONS_DICT, ACTIONS_LABELS } from '~/constants/dialogs';
import { buildAction } from '~/utils/dialogs';

describe('dialog utils', () => {
  describe('buildAction', () => {
    const actionHandler = vi.fn();

    test.each([
      // expected, action, options
      [{ key: ACTIONS_DICT.SPACER }, ACTIONS_DICT.SPACER],
      [
        {
          key: ACTIONS_DICT.BACK,
          label: ACTIONS_LABELS[ACTIONS_DICT.BACK],
          handler: undefined,
          disabled: undefined,
          loading: undefined,
          color: undefined,
        },
        ACTIONS_DICT.BACK,
      ],
      [
        {
          key: ACTIONS_DICT.NEXT,
          label: ACTIONS_LABELS[ACTIONS_DICT.NEXT],
          handler: actionHandler,
          disabled: false,
          loading: true,
          color: 'red',
        },
        ACTIONS_DICT.NEXT,
        {
          handler: actionHandler,
          disabled: false,
          loading: true,
          color: 'red',
        },
      ],
      [
        {
          key: ACTIONS_DICT.NEXT,
          label: 'Foo bar baz',
          handler: actionHandler,
          disabled: false,
          loading: true,
          color: 'red',
        },
        ACTIONS_DICT.NEXT,
        {
          label: 'Foo bar baz',
          handler: actionHandler,
          disabled: false,
          loading: true,
          color: 'red',
        },
      ],
      [
        {
          key: 'foo',
          label: 'Foo',
          handler: actionHandler,
          disabled: true,
          loading: false,
          color: 'blue',
        },
        'foo',
        {
          label: 'Foo',
          handler: actionHandler,
          disabled: true,
          loading: false,
          color: 'blue',
        },
      ],
    ])('returns %o when action=%s and options=%o', (expected, action, options) => {
      const result = buildAction(action, options);

      expect(result).toEqual(expected);
    });
  });
});
