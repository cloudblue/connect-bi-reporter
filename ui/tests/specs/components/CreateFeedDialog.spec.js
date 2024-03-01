import { shallowMount } from '@vue/test-utils';

import CreateFeedDialog from '~/components/CreateFeedDialog.vue';
import FormDialog from '~/components/FormDialog.vue';
import { useRequest } from '~/composables/api';

vi.mock('~/composables/api');
vi.mock('@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin');
describe('CreateFeedDialog component', () => {
  let wrapper;
  let useRequestStub;
  const createdFeed = {
    id: 'RF-123',
    credential: {
      id: 'CRED-123',
    },
    schedule: {
      id: 'RS-123',
    },
    status: 'enabled',
    description: 'Lorem ipsum dolor sit amet',
  };

  beforeEach(() => {
    useRequestStub = {
      result: createdFeed,
      request: vi.fn().mockReturnValue(200),
    };

    useRequest.mockReturnValue(useRequestStub);

    wrapper = shallowMount(CreateFeedDialog, {
      props: {
        modelValue: true,
      },
      global: {
        stubs: {
          FormDialog,
        },
        renderStubDefaultSlot: true,
      },
    });
  });

  describe('render', () => {
    test('renders the base component', () => {
      expect(wrapper.getComponent({ name: 'FormDialog' }).props()).toEqual(
        expect.objectContaining({
          title: 'Create Feed',
          mode: 'wizard',
        }),
      );
    });

    test("renders the schedule tab if it's the active tab", () => {
      expect(wrapper.get('schedule-tab-stub').attributes()).toEqual(
        expect.objectContaining({
          modelvalue: '',
        }),
      );
    });

    test("renders the destination tab if it's the active tab", async () => {
      wrapper.getComponent({ name: 'form-dialog' }).vm.activeTabKey = 'destination';
      await wrapper.vm.$nextTick();

      expect(wrapper.get('destination-tab-stub').attributes()).toEqual(
        expect.objectContaining({
          credentialid: '',
          filename: '',
          description: '',
        }),
      );
    });

    test("renders the summary tab if it's the active tab", async () => {
      wrapper.vm.createdFeed = createdFeed;
      wrapper.getComponent({ name: 'form-dialog' }).vm.activeTabKey = 'summary';
      await wrapper.vm.$nextTick();

      expect(wrapper.get('feed-summary-stub').attributes()).toEqual(
        expect.objectContaining({
          id: 'RF-123',
          credential: 'CRED-123',
          scheduleid: 'RS-123',
          status: 'enabled',
          description: 'Lorem ipsum dolor sit amet',
        }),
      );
    });
  });

  describe('actions', () => {
    describe('createFeed', () => {
      beforeEach(async () => {
        wrapper.vm.form.scheduleId = 'RS-456';
        wrapper.vm.form.credentialId = 'CRED-456';
        wrapper.vm.form.fileName = 'baz_qux';
        wrapper.vm.form.description = 'Lorem ipsum dolor sit amet';

        await wrapper.vm.createFeed();
      });

      test('makes a POST request to the feeds endpoint', () => {
        expect(useRequestStub.request).toHaveBeenCalledWith('/api/feeds', 'POST', {
          schedule: { id: 'RS-456' },
          credential: { id: 'CRED-456' },
          file_name: 'baz_qux',
          description: 'Lorem ipsum dolor sit amet',
        });
      });

      test('emits the "created" event', () => {
        expect(wrapper.emitted().created).toBeTruthy();
      });
    });
  });
});
