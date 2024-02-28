import { validationRules } from '~/utils/validation';

describe('validation utils', () => {
  describe('validationRules', () => {
    describe('required', () => {
      test.each([
        // expected, value, options
        [true, 'foo'],
        [true, 1],
        [true, {}],
        [true, { id: 1 }, { prop: 'id' }],
        [false, ''],
        [false, 0],
        [false, undefined],
        [false, null],
        [false, {}, { prop: 'id' }],
      ])('returns %s if the value to test is %o and options=%s', (expected, value, options) => {
        const result = validationRules.required(options)(value);

        expect(result).toEqual(expected);
      });
    });
  });
});
