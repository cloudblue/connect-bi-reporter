import { mount } from '@vue/test-utils';

import FeedActions from '~/components/FeedActions.vue';
import { COLORS_DICT } from '~/constants/colors';
import { STATUSES_DICT } from '~/constants/statuses';

const mockUseRequest = vi.hoisted(() => ({
  loading: false,
  request: vi.fn(),
}));
vi.mock('~/composables/api', () => ({
  useRequest: vi.fn().mockReturnValue(mockUseRequest),
}));
vi.mock('@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin', () => ({
  useToolkit: vi.fn().mockReturnValue('useToolkitStub'),
}));

describe('FeedActions component', () => {
  let wrapper;

  describe('render', () => {
    test('renders the correct buttons if the feed status is "enabled"', () => {
      wrapper = mount(FeedActions, {
        props: {
          feed: { status: STATUSES_DICT.ENABLED },
        },
      });

      const buttons = wrapper.findAll('.action-button__wrapper ui-button');

      expect(buttons[0].text()).toContain('Disable');
      expect(buttons[0].find('ui-icon').attributes()['icon-name']).toEqual(
        'googleToggleOffBaseline',
      );
      expect(buttons[0].attributes().color).toEqual(COLORS_DICT.TEXT);

      expect(buttons[1].text()).toContain('Force upload');
      expect(buttons[1].find('ui-icon').attributes()['icon-name']).toEqual('googleUploadBaseline');
      expect(buttons[1].attributes().color).toEqual(COLORS_DICT.TEXT);

      expect(buttons[2].text()).toContain('Delete');
      expect(buttons[2].find('ui-icon').attributes()['icon-name']).toEqual(
        'googleDeleteForeverBaseline',
      );
      expect(buttons[2].attributes().color).toEqual(COLORS_DICT.NICE_RED);
    });

    test('renders the correct buttons if the feed status is "disabled"', () => {
      wrapper = mount(FeedActions, {
        props: {
          feed: { status: STATUSES_DICT.DISABLED },
        },
      });

      const buttons = wrapper.findAll('.action-button__wrapper ui-button');

      expect(buttons[0].text()).toContain('Enable');
      expect(buttons[0].find('ui-icon').attributes()['icon-name']).toEqual(
        'googleToggleOnBaseline',
      );
      expect(buttons[0].attributes().color).toEqual(COLORS_DICT.TEXT);

      expect(buttons[1].text()).toContain('Force upload');
      expect(buttons[1].find('ui-icon').attributes()['icon-name']).toEqual('googleUploadBaseline');
      expect(buttons[1].attributes().color).toEqual(COLORS_DICT.TEXT);
      expect(buttons[1].attributes().disabled).toEqual('true');

      expect(buttons[2].text()).toContain('Delete');
      expect(buttons[2].find('ui-icon').attributes()['icon-name']).toEqual(
        'googleDeleteForeverBaseline',
      );
      expect(buttons[2].attributes().color).toEqual(COLORS_DICT.NICE_RED);
    });
  });

  describe('actions', () => {
    describe('click on the "disable" button', () => {
      beforeEach(async () => {
        wrapper = mount(FeedActions, {
          props: {
            feed: {
              id: 'RF-123',
              status: STATUSES_DICT.ENABLED,
            },
          },
        });

        await wrapper.find({ ref: 'disable' }).trigger('clicked');
      });

      test('calls the disable endpoint', () => {
        expect(mockUseRequest.request).toHaveBeenCalledWith('/api/feeds/RF-123/disable', 'POST');
      });

      test('emits the "disabled" event', () => {
        expect(wrapper.emitted().disabled).toBeTruthy();
      });
    });

    describe('click on the "enable" button', () => {
      beforeEach(async () => {
        wrapper = mount(FeedActions, {
          props: {
            feed: {
              id: 'RF-123',
              status: STATUSES_DICT.DISABLED,
            },
          },
        });

        await wrapper.find({ ref: 'enable' }).trigger('clicked');
      });

      test('calls the enable endpoint', () => {
        expect(mockUseRequest.request).toHaveBeenCalledWith('/api/feeds/RF-123/enable', 'POST');
      });

      test('emits the "enabled" event', () => {
        expect(wrapper.emitted().enabled).toBeTruthy();
      });
    });

    describe('click on the "force upload" button', () => {
      beforeEach(async () => {
        wrapper = mount(FeedActions, {
          props: {
            feed: {
              id: 'RF-123',
              status: STATUSES_DICT.ENABLED,
            },
          },
        });

        await wrapper.find({ ref: 'forceUpload' }).trigger('clicked');
      });

      test('calls the forceUpload endpoint', () => {
        expect(mockUseRequest.request).toHaveBeenCalledWith(
          '/api/feeds/RF-123/uploads/force',
          'POST',
        );
      });

      test('emits the "uploaded" event', () => {
        expect(wrapper.emitted().uploaded).toBeTruthy();
      });
    });

    describe('click on the "delete" button', () => {
      beforeEach(async () => {
        wrapper = mount(FeedActions, {
          props: {
            feed: {
              id: 'RF-123',
              status: STATUSES_DICT.ENABLED,
            },
          },
        });

        await wrapper.find({ ref: 'delete' }).trigger('clicked');
      });

      test('calls the delete endpoint', () => {
        expect(mockUseRequest.request).toHaveBeenCalledWith('/api/feeds/RF-123', 'DELETE');
      });

      test('emits the "deleted" event', () => {
        expect(wrapper.emitted().deleted).toBeTruthy();
      });
    });
  });
});
