import { connectPortalRoutes } from '@cloudblueconnect/connect-ui-toolkit';
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';

import SpaLink from '~/components/SpaLink.vue';
import { createFactory } from '~/tests/utils';

vi.mock('@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin', () => ({
  useToolkit: vi.fn(),
}));

describe('SpaLink component', () => {
  let wrapper;
  let toolkitStub;
  const factory = createFactory(SpaLink, {
    props: { to: '/dashboard' },
    slots: {
      default: 'Go to the SPA Dashboard page',
    },
  });

  beforeEach(async () => {
    toolkitStub = {
      navigateTo: vi.fn(),
    };
    useToolkit.mockReturnValue(toolkitStub);

    wrapper = factory();
  });

  test('the component renders a link', () => {
    expect(wrapper.find('a').exists()).toEqual(true);
    expect(wrapper.text()).toContain('Go to the SPA Dashboard page');
  });

  describe('when the component is clicked', () => {
    let clickEvent;

    beforeEach(async () => {
      clickEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
      };
      await wrapper.trigger('click', clickEvent);
    });

    test('prevents default', () => {
      expect(clickEvent.preventDefault).toHaveBeenCalled();
    });

    test('stops propagation', () => {
      expect(clickEvent.stopPropagation).toHaveBeenCalled();
    });

    test("calls the toolkit's navigateTo method", () => {
      expect(toolkitStub.navigateTo).toHaveBeenCalledWith('/dashboard', undefined);
    });

    test("calls the toolkit's navigateTo method with the params prop", async () => {
      wrapper = factory({
        props: {
          to: connectPortalRoutes.productDetails,
          params: 'PRD-123',
        },
      });

      await wrapper.trigger('click', clickEvent);

      expect(toolkitStub.navigateTo).toHaveBeenCalledWith(
        connectPortalRoutes.productDetails,
        'PRD-123',
      );
    });
  });
});
