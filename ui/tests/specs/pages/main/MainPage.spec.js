import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { shallowMount } from '@vue/test-utils';

import MainPage from '~/pages/main/MainPage.vue';

vi.mock('@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin');

describe('MainPage component', () => {
  let wrapper;
  let toolkitStub;

  beforeEach(async () => {
    toolkitStub = {
      listen: vi.fn().mockImplementation((_, cb) => cb({ height: 400 })),
    };
    useToolkit.mockReturnValue(toolkitStub);

    wrapper = shallowMount(MainPage);
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
});
