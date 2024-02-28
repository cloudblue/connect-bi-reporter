import { ApiError, request } from '~/utils/api.js';

describe('api utils', () => {
  describe('request', () => {
    let response;
    beforeEach(() => {
      response = {
        status: 200,
        statusText: 'SUCCESS',
        ok: true,
        clone: vi.fn().mockImplementation(() => response),
        json: vi.fn().mockReturnValue({}),
        text: vi.fn().mockReturnValue(''),
      };

      Object.defineProperty(global, 'fetch', {
        value: vi.fn().mockImplementation(
          () =>
            new Promise((resolve) => {
              resolve(response);
            }),
        ),
      });
    });

    test('calls fetch with endpoint and method', async () => {
      await request('/foo', 'DELETE');

      expect(fetch).toHaveBeenCalledWith('/foo', { method: 'DELETE' });
    });

    test('calls fetch with endpoint, method and body', async () => {
      await request('/foo', 'PUT', { foo: 'bar' });

      expect(fetch).toHaveBeenCalledWith('/foo', { method: 'PUT', body: { foo: 'bar' } });
    });

    describe('if there is an error', () => {
      test('returns an ApiError instance', async () => {
        let error;
        response.ok = false;
        response.status = 404;

        try {
          await request('/foo');
        } catch (e) {
          error = e;
        }

        expect(error).toBeInstanceOf(ApiError);
      });

      test('returns an error with the status and status text', async () => {
        let error;
        response.ok = false;
        response.status = 404;
        response.statusText = 'NOT FOUND';

        try {
          await request('/foo');
        } catch (e) {
          error = e;
        }

        expect(error.message).toEqual('Error 404: NOT FOUND.');
      });

      test('returns an error with the status, status text and error_code', async () => {
        let error;
        response.ok = false;
        response.status = 404;
        response.statusText = 'NOT FOUND';
        response.json.mockReturnValueOnce({ error_code: 'err_003' });

        try {
          await request('/foo');
        } catch (e) {
          error = e;
        }

        expect(error.message).toEqual('Error 404: NOT FOUND. Error code: err_003.');
      });

      test('returns an error with the status, status text, error_code and errors', async () => {
        let error;
        response.ok = false;
        response.status = 404;
        response.statusText = 'NOT FOUND';
        response.json.mockReturnValueOnce({
          error_code: 'err_003',
          errors: ['Foo >:( .', 'Lorem ipsum.'],
        });

        try {
          await request('/foo');
        } catch (e) {
          error = e;
        }

        expect(error.message).toEqual(
          'Error 404: NOT FOUND. Error code: err_003. Foo >:( . Lorem ipsum.',
        );
      });
    });

    describe('if there is no error', () => {
      test('returns the parsed body as json', async () => {
        response.json.mockReturnValueOnce({ id: 'foo' });

        const result = await request('/foo');

        expect(result).toEqual({ id: 'foo' });
      });

      test('returns the parsed body as test if json parsing fails', async () => {
        response.text.mockReturnValueOnce('foo');
        response.json.mockRejectedValueOnce(new Error('>:('));

        const result = await request('/foo');

        expect(result).toEqual('foo');
      });

      test('returns the full response if fullResponse is true', async () => {
        response.json.mockReturnValueOnce({ id: 'foo' });

        const result = await request('/foo', 'GET', null, true);

        expect(result).toEqual({
          ...response,
          body: { id: 'foo' },
        });
      });
    });
  });
});
