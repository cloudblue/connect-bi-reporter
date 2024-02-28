import { mount, shallowMount } from '@vue/test-utils';
import merge from 'lodash.merge';

export const createFactory =
  (component, defaultOptions = {}, shallow = false) =>
  (options = {}) => {
    const mountMethod = shallow ? shallowMount : mount;
    const mergedOptions = merge({}, defaultOptions, options);

    return mountMethod(component, mergedOptions);
  };
