const isTruthy = (value) => Boolean(value);

export const validationRules = {
  required: (options) => (value) => {
    if (options && options.prop) return isTruthy(value[options.prop]);

    return isTruthy(value);
  },
};
