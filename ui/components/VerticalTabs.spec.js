import { mount } from '@vue/test-utils';

import VerticalTabs from '~/components/VerticalTabs.vue';

describe('VerticalTabs component', () => {
  let wrapper;
  const initialTabs = [
    {
      key: 'first',
      label: 'First',
      skipStep: false,
    },
    {
      key: 'second',
      label: 'Second',
      skipStep: false,
    },
    {
      key: 'third',
      label: 'Third',
      skipStep: true,
    },
    {
      key: 'fourth',
      label: 'Fourth',
      skipStep: false,
    },
  ];

  describe('render', () => {
    describe('base render', () => {
      test('renders the tabs', () => {
        wrapper = mount(VerticalTabs, {
          props: {
            tabs: initialTabs,
          },
        });

        const tabElements = wrapper.findAll('.vertical-tabs__tab');
        tabElements.forEach((tabEl, index) => {
          expect(tabEl.text()).toEqual(initialTabs[index].label);
        });
      });
    });

    describe('if the linear prop is true', () => {
      beforeAll(() => {
        wrapper = mount(VerticalTabs, {
          props: {
            linear: true,
            tabs: initialTabs,
            activeTabKey: initialTabs[1].key,
          },
        });
      });

      test('adds the "vertical-tabs_linear" class to the root element', () => {
        expect(wrapper.classes()).toContain('vertical-tabs_linear');
      });

      test('renders the index indicators', () => {
        const tabElements = wrapper.findAll('.vertical-tabs__tab');

        // First tab, already passed since the active tab is set to be the 2nd tab
        expect(
          tabElements[0].get('.vertical-tabs__tab-index ui-icon').attributes('icon-name'),
        ).toEqual('googleCheckBaseline');

        // Second tab, active (set by the prop activeTabKey)
        expect(tabElements[1].classes()).toContain('vertical-tabs__tab_active');
        expect(tabElements[1].get('.vertical-tabs__tab-index span').text()).toEqual('2');

        // Third tab, skipStep=true
        expect(
          tabElements[2].get('.vertical-tabs__tab-index ui-icon').attributes('icon-name'),
        ).toEqual('googleArrowDownwardBaseline');

        // Fourth tab, inactive
        expect(tabElements[3].classes()).toContain('vertical-tabs__tab_inactive');
        expect(tabElements[3].get('.vertical-tabs__tab-index span').text()).toEqual('4');
      });
    });

    describe('if the linear prop is false', () => {
      beforeAll(() => {
        wrapper = mount(VerticalTabs, {
          props: {
            linear: false,
            tabs: initialTabs,
            activeTabKey: initialTabs[1].key,
          },
        });
      });

      test('does not add the "vertical-tabs_linear" class to the root element', () => {
        expect(wrapper.classes()).not.toContain('vertical-tabs_linear');
      });

      test('does not render the index indicators', () => {
        const tabElements = wrapper.findAll('.vertical-tabs__tab vertical-tabs__tab-index');

        expect(tabElements.length).toEqual(0);
      });
    });
  });

  describe('events', () => {
    describe('on tab click', () => {
      test('sets the clicked tab as the active tab', async () => {
        wrapper = mount(VerticalTabs, {
          props: {
            tabs: initialTabs,
            activeTabKey: initialTabs[0].key,
          },
        });

        const tabElements = wrapper.findAll('.vertical-tabs__tab');
        expect(tabElements[0].classes()).toContain('vertical-tabs__tab_active');
        expect(tabElements[1].classes()).not.toContain('vertical-tabs__tab_active');

        await tabElements[1].trigger('click');

        expect(tabElements[0].classes()).not.toContain('vertical-tabs__tab_active');
        expect(tabElements[1].classes()).toContain('vertical-tabs__tab_active');
      });
    });
  });
});
