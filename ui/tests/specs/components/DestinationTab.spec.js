import { connectPortalRoutes } from '@cloudblueconnect/connect-ui-toolkit';
import { useToolkit } from '@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin';
import { mount } from '@vue/test-utils';

import DestinationTab from '~/components/DestinationTab.vue';
import { useRequest } from '~/composables/api';

vi.mock('~/composables/api');

vi.mock('@cloudblueconnect/connect-ui-toolkit/tools/vue/toolkitPlugin');
describe('DestinationTab component', () => {
  let wrapper;
  let toolkitStub;
  let useRequestStub;

  describe('render', () => {
    beforeEach(async () => {
      useRequestStub = {
        loading: false,
        request: vi.fn().mockReturnValue(200),
        result: [{ id: 'CRED-001', name: 'Credential' }],
      };

      useRequest.mockReturnValue(useRequestStub);

      toolkitStub = {
        listen: vi.fn().mockImplementation((_, cb) => cb({ height: 400 })),
        sharedContext: {
          currentInstallation: {
            id: 'EIN-123',
            environment: {
              extension: {
                name: 'My extension',
              },
            },
          },
        },
      };
      useToolkit.mockReturnValue(toolkitStub);

      wrapper = mount(DestinationTab, {
        props: {
          credentialId: 'CRED-001',
          fileName: 'bar',
          description: 'baz',
        },
      });
    });

    test('renders the base component', () => {
      expect(wrapper.get('.select-input__selected').text()).toContain('Credential');
      expect(wrapper.get('.select-input__option').text()).toContain('Credential');
      expect(wrapper.get('.select-input__hint').text()).toContain(
        'You may add credentials in theMy extensionsettings page',
      );
      expect(
        wrapper.getComponent('.destination-tab__input .destination-tab__hint').props(),
      ).toEqual(
        expect.objectContaining({
          to: connectPortalRoutes.extensionSettings,
          params: 'EIN-123',
        }),
      );
      expect(wrapper.getComponent('[label="Filename Template"]').props()).toEqual(
        expect.objectContaining({
          suffix: '_yyyymmdd hh:mm:ss.csv',
          label: 'Filename Template',
          modelValue: 'bar',
        }),
      );
      expect(wrapper.getComponent('[label="Description (optional)"]').props()).toEqual(
        expect.objectContaining({
          label: 'Description (optional)',
          modelValue: 'baz',
        }),
      );
    });

    test('loads the credentials', () => {
      expect(useRequestStub.request).toHaveBeenCalledWith('/api/credentials');
    });
  });
});
