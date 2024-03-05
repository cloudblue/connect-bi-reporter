import { filesize } from 'filesize';

import { debounce, downloader, getFileSize } from '~/utils';

vi.mock('filesize', async (importOriginal) => {
  const originalModule = await importOriginal();

  return {
    ...originalModule,
    filesize: vi.fn().mockImplementation(originalModule.filesize),
  };
});

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

  describe('getFileSize', () => {
    test('calls the filesize library with the correct arguments', () => {
      getFileSize(1024);

      expect(filesize).toHaveBeenCalledWith(1024, {
        base: 2,
        locale: 'en',
        standard: 'jedec',
      });
    });

    test('returns the filesize as a human-readable string', () => {
      const result = getFileSize(1024);

      expect(result).toEqual('1 KB');
    });
  });

  describe('downloader', () => {
    let anchorElementStub;
    let createElementSpy;
    let bodyAppendSpy;
    let bodyRemoveSpy;

    beforeEach(() => {
      anchorElementStub = {
        href: null,
        download: null,
        rel: null,
        click: vi.fn(),
      };

      createElementSpy = vi
        .spyOn(document, 'createElement')
        .mockImplementation(() => anchorElementStub);
      bodyAppendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {
        /* noop */
      });
      bodyRemoveSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {
        /* noop */
      });
    });

    test('creates an anchor element', () => {
      downloader('http://example.com');

      expect(createElementSpy).toHaveBeenCalledWith('a');
    });

    test('appends the anchor element to the document body', () => {
      downloader('http://example.com');

      expect(bodyAppendSpy).toHaveBeenCalledWith(anchorElementStub);
    });

    test('sets the href attribute', () => {
      downloader('http://example.com');

      expect(anchorElementStub.href).toEqual('http://example.com');
    });

    test('sets the download attribute if a name is given', () => {
      downloader('http://example.com', 'foo');

      expect(anchorElementStub.download).toEqual('foo');
    });

    test('sets the rel attribute if a name is not given', () => {
      downloader('http://example.com');

      expect(anchorElementStub.rel).toEqual('noopener noreferrer');
    });

    test("calls the element's click method", () => {
      downloader('http://example.com');

      expect(anchorElementStub.click).toHaveBeenCalled();
    });

    test('removes the anchor element from the document body', () => {
      downloader('http://example.com');

      expect(bodyRemoveSpy).toHaveBeenCalledWith(anchorElementStub);
    });
  });
});
