import { useRequest } from '~/composables/api';
import { request as apiRequest } from '~/utils/api';

vi.mock('~/utils/api', () => ({
  request: vi.fn(),
}));

describe('api composables', () => {
  describe('useRequest', () => {
    let responseBody;
    let toolkitInstance;
    let loading;
    let responseObject;
    let request;

    beforeEach(() => {
      toolkitInstance = { emit: vi.fn() };
      responseBody = {};
      apiRequest.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolve(responseBody);
          }),
      );

      ({ loading, responseObject, request } = useRequest(toolkitInstance));
    });

    test('returns the required properties', () => {
      expect(loading.value).toEqual(false);
      expect(responseObject).toEqual({});
      expect(request).toEqual(expect.any(Function));
    });

    describe('request call', () => {
      test('calls api utils request with the given args', async () => {
        await request('/foo/1', 'PUT', { description: 'bar' });

        expect(apiRequest).toHaveBeenCalledWith('/foo/1', 'PUT', { description: 'bar' });
      });

      test('sets loading to true', () => {
        request('/foo', 'GET');

        expect(loading.value).toEqual(true);
      });

      test('sets loading to false after request completes', async () => {
        await request('/foo', 'GET');

        expect(loading.value).toEqual(false);
      });

      test('assigns the returned value to responseObject', async () => {
        apiRequest.mockResolvedValueOnce({ id: '1', description: 'foo' });

        await request('/foo');

        expect(responseObject).toEqual({ id: '1', description: 'foo' });
      });

      describe('if there are errors', () => {
        test('emits a "snackbar:error" event to the toolkit', async () => {
          const err = new Error('Foo >:(');
          apiRequest.mockRejectedValueOnce(err);

          await request('/foo');

          expect(toolkitInstance.emit).toHaveBeenCalledWith('snackbar:error', 'Foo >:(');
        });

        test('does not throw if propagateErrors is false', async () => {
          const err = new Error('Foo >:(');
          apiRequest.mockRejectedValueOnce(err);

          ({ request } = useRequest(toolkitInstance, false));

          let error;
          try {
            await request('/foo');
          } catch (e) {
            error = e;
          }

          expect(error).toEqual(undefined);
        });

        test('throws if propagateErrors is true', async () => {
          const err = new Error('Foo >:(');
          apiRequest.mockRejectedValueOnce(err);

          ({ request } = useRequest(toolkitInstance, true));

          let error;
          try {
            await request('/foo');
          } catch (e) {
            error = e;
          }

          expect(error).toEqual(err);
        });
      });
    });
  });
});
