import { debounce } from '~/utils';

describe('utils', () => {
  describe('debounce', () => {
    beforeAll(() => {
      vi.useFakeTimers();
    });
    afterAll(() => {
      vi.useRealTimers();
    });

    let callbackFn;
    beforeEach(() => {
      callbackFn = vi.fn();
    });

    test('calls the callback function after timer finishes', () => {
      const debouncedFn = debounce(callbackFn, 100);

      debouncedFn('foo', 42);
      vi.runAllTimers();

      expect(callbackFn).toHaveBeenCalledWith('foo', 42);
    });

    test('only calls the callback function once if there are multiple executions before timer finishes', () => {
      const debouncedFn = debounce(callbackFn, 200);

      debouncedFn();
      debouncedFn();
      debouncedFn();
      debouncedFn();
      vi.runAllTimers();

      expect(callbackFn).toHaveBeenCalledTimes(1);
    });

    test('calls the callback function once every time the timer finishes', () => {
      const debouncedFn = debounce(callbackFn, 200);

      debouncedFn();
      debouncedFn();
      vi.advanceTimersByTime(250);

      debouncedFn();
      debouncedFn();
      vi.runAllTimers();

      expect(callbackFn).toHaveBeenCalledTimes(2);
    });
  });
});
