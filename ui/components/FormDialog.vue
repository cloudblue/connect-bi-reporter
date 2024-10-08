<template>
  <simple-dialog
    v-model="value"
    class="form-dialog"
    :class="`form-dialog_${mode}`"
    :actions="actions"
    :backDisabled="isFirstTab"
    :detailsRoute="detailsRoute"
    :height="height"
    :isValid="isTabValid"
    :onSubmit="submit"
    :title="computedTitle"
    :width="width"
    @back="goToPreviousTab"
    @next="goToNextTab"
  >
    <template #sidebar>
      <vertical-tabs
        v-model:active-tab-key="activeTabKey"
        :tabs="tabs"
        :linear="isWizardMode"
      />
    </template>
    <template #default>
      <slot :name="activeTabKey" />
    </template>
  </simple-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

import SimpleDialog from '~/components/SimpleDialog.vue';
import VerticalTabs from '~/components/VerticalTabs.vue';
import { FORM_DIALOG_TYPES_DICT } from '~/constants/dialogs';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  tabs: {
    type: Array,
    required: true,
    validator(value) {
      return value.length > 0;
    },
  },
  mode: {
    type: String,
    required: true,
    validator(value) {
      return Object.values(FORM_DIALOG_TYPES_DICT).includes(value);
    },
  },
  form: {
    type: Object,
    required: true,
  },
  height: {
    type: String,
    default: '600px',
  },
  width: {
    type: String,
    default: '800px',
  },
  onSubmit: {
    type: Function,
    default: () => {},
  },
  detailsRoute: {
    type: Object,
    default: null,
  },
  rules: {
    type: Object,
    default: () => {},
  },
  submitLabel: {
    type: String,
    default: '',
  },
});

const value = defineModel({
  type: Boolean,
  default: false,
});

const isWizardMode = computed(() => props.mode === FORM_DIALOG_TYPES_DICT.WIZARD);
const isEditMode = computed(() => props.mode === FORM_DIALOG_TYPES_DICT.EDIT);

const activeTabKey = ref('');
const activeTabIdx = computed(() => props.tabs.findIndex((tab) => tab.key === activeTabKey.value));
const activeTab = computed(() => props.tabs.find((tab) => tab.key === activeTabKey.value));
const isFirstTab = computed(() => activeTabIdx.value === 0);
const isLastTab = computed(() => activeTabIdx.value === props.tabs.length - 1);
const isSummaryTab = computed(() => activeTabKey.value === 'summary');
const isSubmittableTab = computed(() => activeTab.value.submittable);

const computedTitle = computed(() => {
  if (isEditMode.value) return props.title;
  if (isSummaryTab.value) return `${props.title} – Summary`;
  return `${props.title} – Step ${activeTabIdx.value + 1}`;
});

const isTabValid = computed(() => {
  const fieldsToCheck = activeTab.value.includes || [];

  return fieldsToCheck.every((field) => {
    const fieldRules = props.rules[field];

    if (fieldRules) return fieldRules.every((rule) => rule(props.form[field]));
    return true;
  });
});

const goToTab = (index) => {
  activeTabKey.value = props.tabs[index].key;
};
const goToNextTab = () => {
  const tabIndex = activeTabIdx.value + 1;
  goToTab(tabIndex);
};
const goToPreviousTab = () => {
  const tabIndex = activeTabIdx.value - 1;
  goToTab(tabIndex);
};

const submit = async () => {
  try {
    await props.onSubmit();
    if (isWizardMode.value && !isLastTab.value) goToNextTab();
  } catch (e) {
    // empty
    // TODO: Set text error in dialog?
  }
};

const actions = computed(() => {
  if (isEditMode.value) {
    return ['spacer', 'close', 'save'];
  }

  if (isSummaryTab.value) {
    return ['spacer', 'details', 'close'];
  }

  if (isSubmittableTab.value) {
    return ['cancel', 'spacer', 'back', 'submit'];
  }

  return ['cancel', 'spacer', 'back', 'next'];
});

watch(value, () => goToTab(0), { immediate: true });
</script>
