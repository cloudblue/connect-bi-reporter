import { processEvent } from '~/utils/webComponents';

describe('web components utils', () => {
  let result;

  describe('processEvent', () => {
    test('returns a function', () => {
      result = processEvent(() => {});

      expect(result).toEqual(expect.any(Function));
    });

    test('calls the given function with the event.detail arguments spread when the returned function is called', () => {
      const fn = vi.fn();
      const wrappedFn = processEvent(fn);

      wrappedFn({ detail: ['my', 'args'] });

      expect(fn).toHaveBeenCalledWith('my', 'args');
    });
  });
});
