import { connectPortalRoutes } from '@cloudblueconnect/connect-ui-toolkit';
import { mount } from '@vue/test-utils';

describe('SpaLink component', () => {
  let wrapper;
  let toolkitStub;

  beforeEach(async () => {
    toolkitStub = {
      navigateTo: vi.fn(),
    };

    vi.doMock('@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin', () => {
      return {
        useToolkit: () => toolkitStub,
      };
    });

    // Import needs to be done here because vi.doMock is not hoisted and the toolkitPlugin
    // mock does not take effect until after the doMock declaration
    // See https://vitest.dev/api/vi.html#vi-domock
    const { default: SpaLink } = await import('./SpaLink.vue');
    wrapper = mount(SpaLink, {
      props: {
        to: '/dashboard',
      },
      slots: {
        default: 'Go to the SPA Dashboard page',
      },
    });
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
      const { default: SpaLink } = await import('./SpaLink.vue');
      wrapper = mount(SpaLink, {
        props: {
          to: connectPortalRoutes.productDetails,
          params: 'PRD-123',
        },
        slots: {
          default: 'Go to the SPA Dashboard page',
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
