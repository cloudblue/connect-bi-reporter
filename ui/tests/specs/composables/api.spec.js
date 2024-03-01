import { useRequest } from '~/composables/api';
import { ApiError, request as apiRequest } from '~/utils/api';

vi.mock('~/utils/api', async (importOriginal) => {
  const originalModule = await importOriginal();

  return {
    ...originalModule,
    request: vi.fn(),
  };
});

describe('api composables', () => {
  describe('useRequest', () => {
    let responseBody;
    let toolkitInstance;
    let loading;
    let result;
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

      ({ loading, result, request } = useRequest(toolkitInstance));
    });

    test('returns the required properties', () => {
      expect(loading.value).toEqual(false);
      expect(result).toEqual({});
      expect(request).toEqual(expect.any(Function));
    });

    test('returns the required properties if the isList parameter is true', () => {
      ({ loading, result, request } = useRequest(toolkitInstance, false, true));

      expect(loading.value).toEqual(false);
      expect(result).toEqual([]);
      expect(request).toEqual(expect.any(Function));
    });

    describe('request call', () => {
      test('calls api utils request with the given args and fullResponse=true', async () => {
        await request('/foo/1', 'PUT', { description: 'bar' });

        expect(apiRequest).toHaveBeenCalledWith('/foo/1', 'PUT', { description: 'bar' }, true);
      });

      test('sets loading to true', () => {
        request('/foo', 'GET');

        expect(loading.value).toEqual(true);
      });

      test('sets loading to false after request completes', async () => {
        await request('/foo', 'GET');

        expect(loading.value).toEqual(false);
      });

      describe("assigns the response's body to result", () => {
        test('if isList is false', async () => {
          ({ loading, result, request } = useRequest(toolkitInstance, false, false));
          apiRequest.mockResolvedValueOnce({ body: { id: '1', description: 'foo' } });

          await request('/foo');

          expect(result).toEqual({ id: '1', description: 'foo' });
        });

        test('if isList is true', async () => {
          ({ loading, result, request } = useRequest(toolkitInstance, false, true));
          apiRequest.mockResolvedValueOnce({ body: [{ id: '1', description: 'foo' }] });

          await request('/foo');

          expect(result).toEqual([{ id: '1', description: 'foo' }]);
        });
      });

      test('returns the response status', async () => {
        apiRequest.mockResolvedValueOnce({ status: 200, body: { id: '1', description: 'foo' } });

        const status = await request('/foo');

        expect(status).toEqual(200);
      });

      describe('if there are errors', () => {
        test('emits a "snackbar:error" event to the toolkit', async () => {
          const err = new ApiError('Foo >:(', 404);
          apiRequest.mockRejectedValueOnce(err);

          await request('/foo');

          expect(toolkitInstance.emit).toHaveBeenCalledWith('snackbar:error', 'Foo >:(');
        });

        test('does not throw if propagateErrors is false', async () => {
          const err = new ApiError('Foo >:(', 404);
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
          const err = new ApiError('Foo >:(', 404);
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

        test('returns the error status if propagateErrors is false', async () => {
          const err = new ApiError('Foo >:(', 404);
          apiRequest.mockRejectedValueOnce(err);

          ({ request } = useRequest(toolkitInstance, false));

          const status = await request('/foo');

          expect(status).toEqual(404);
        });
      });
    });
  });
});
