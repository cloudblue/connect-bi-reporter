import { mount } from '@vue/test-utils';

describe('MainPage component', () => {
  let wrapper;
  let toolkitStub;

  beforeEach(async () => {
    toolkitStub = {
      listen: vi.fn().mockImplementation((_, cb) => cb({ height: 400 })),
    };

    vi.doMock('@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin', () => {
      return {
        useToolkit: () => toolkitStub,
      };
    });

    // Import needs to be done here because vi.doMock is not hoisted and the toolkitPlugin
    // mock does not take effect until after the doMock declaration
    // See https://vitest.dev/api/vi.html#vi-domock
    const { default: MainPage } = await import('./MainPage.vue');
    wrapper = mount(MainPage, { shallow: true });
  });

  test('uses the toolkit to listen to the fullscreenSize event', () => {
    expect(toolkitStub.listen).toHaveBeenCalledWith('fullscreenSize', expect.any(Function));
  });

  test('when the "fullscreenSize" event is triggered, the fullscreenHeight variable is updated', () => {
    expect(wrapper.vm.fullscreenHeight).toEqual('400px');
  });

  test('when the fullscreenHeight variable is updated, the styles variable is updated as well', () => {
    expect(wrapper.vm.styles).toEqual({
      height: '400px',
    });
  });

  test('the styles are applied to the component root element', () => {
    expect(wrapper.get('.app').attributes('style')).toEqual('height: 400px;');
  });

  test('renders the ".dialogs-container" element', () => {
    expect(wrapper.get('.dialogs-container')).toBeDefined();
  });
});
