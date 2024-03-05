import FeedActions from '~/components/FeedActions.vue';
import { COLORS_DICT } from '~/constants/colors';
import { STATUSES_DICT } from '~/constants/statuses';
import { createFactory } from '~/tests/utils';

const mockUseRequest = vi.hoisted(() => ({
  loading: false,
  request: vi.fn().mockReturnValue(200),
}));
vi.mock('~/composables/api', () => ({
  useRequest: vi.fn().mockReturnValue(mockUseRequest),
}));
vi.mock('@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin', () => ({
  useToolkit: vi.fn().mockReturnValue('useToolkitStub'),
}));

describe('FeedActions component', () => {
  let wrapper;
  const factory = createFactory(FeedActions, {
    props: {
      feed: {
        id: 'RF-123',
        status: STATUSES_DICT.ENABLED,
      },
    },
    global: {
      stubs: {
        'simple-dialog': true,
      },
    },
  });

  describe('render', () => {
    test('renders the correct buttons if the feed status is "enabled"', () => {
      wrapper = factory();

      const buttons = wrapper.findAll('.actions-menu__action ui-button');

      expect(buttons[0].text()).toContain('Disable');
      expect(buttons[0].find('ui-icon').attributes('iconname')).toEqual('googleToggleOffBaseline');
      expect(buttons[0].attributes().color).toEqual(COLORS_DICT.TEXT);

      expect(buttons[1].text()).toContain('Force upload');
      expect(buttons[1].find('ui-icon').attributes('iconname')).toEqual('googleUploadBaseline');
      expect(buttons[1].attributes().color).toEqual(COLORS_DICT.TEXT);

      expect(buttons[2].text()).toContain('Delete');
      expect(buttons[2].find('ui-icon').attributes('iconname')).toEqual(
        'googleDeleteForeverBaseline',
      );
      expect(buttons[2].attributes().color).toEqual(COLORS_DICT.NICE_RED);
    });

    test('renders the correct buttons if the feed status is "disabled"', () => {
      wrapper = factory({
        props: {
          feed: { status: STATUSES_DICT.DISABLED },
        },
      });

      const buttons = wrapper.findAll('.actions-menu__action ui-button');

      expect(buttons[0].text()).toContain('Enable');
      expect(buttons[0].find('ui-icon').attributes('iconname')).toEqual('googleToggleOnBaseline');
      expect(buttons[0].attributes().color).toEqual(COLORS_DICT.TEXT);

      expect(buttons[1].text()).toContain('Force upload');
      expect(buttons[1].find('ui-icon').attributes('iconname')).toEqual('googleUploadBaseline');
      expect(buttons[1].attributes().color).toEqual(COLORS_DICT.TEXT);
      expect(buttons[1].attributes().disabled).toEqual('true');

      expect(buttons[2].text()).toContain('Delete');
      expect(buttons[2].find('ui-icon').attributes('iconname')).toEqual(
        'googleDeleteForeverBaseline',
      );
      expect(buttons[2].attributes().color).toEqual(COLORS_DICT.NICE_RED);
    });
  });

  describe('actions', () => {
    describe('click on the "disable" button', () => {
      beforeEach(async () => {
        wrapper = factory({
          props: {
            feed: {
              status: STATUSES_DICT.ENABLED,
            },
          },
        });

        await wrapper
          .findComponent({ name: 'actions-menu' })
          .find({ ref: 'disable' })
          .trigger('clicked');
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
        wrapper = factory({
          props: {
            feed: {
              status: STATUSES_DICT.DISABLED,
            },
          },
        });

        await wrapper
          .findComponent({ name: 'actions-menu' })
          .find({ ref: 'enable' })
          .trigger('clicked');
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
        wrapper = factory({
          props: {
            feed: {
              status: STATUSES_DICT.ENABLED,
            },
          },
        });

        await wrapper
          .findComponent({ name: 'actions-menu' })
          .find({ ref: 'forceUpload' })
          .trigger('clicked');
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
        wrapper = factory({
          props: {
            feed: {
              status: STATUSES_DICT.ENABLED,
            },
          },
        });

        await wrapper
          .findComponent({ name: 'actions-menu' })
          .find({ ref: 'delete' })
          .trigger('clicked');
      });

      test('opens the delete feed dialog', () => {
        expect(wrapper.getComponent({ name: 'delete-feed-dialog' }).props().modelValue).toEqual(
          true,
        );
      });
    });
  });

  describe('events', () => {
    test('emits the deleted event when the delete feed dialog emits the deleted event', async () => {
      await wrapper.getComponent({ name: 'delete-feed-dialog' }).vm.$emit('deleted');

      expect(wrapper.emitted().deleted).toBeTruthy();
    });
  });
});
