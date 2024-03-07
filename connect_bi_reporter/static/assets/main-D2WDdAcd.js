import { _ as _export_sfc, C as COLORS_DICT, u as useRequest, a as _sfc_main$h, F as FORM_DIALOG_TYPES_DICT, S as SimpleDialog, p as processEvent, D as DetailItem, A as ActionsMenu } from "./ActionsMenu-D7LkUb7G.js";
import { s, V, a as s$1, H, p, v, o, l, b as s$2, w, z, r, c as l$1 } from "./connect-CncOCzNp.js";
import { m as mergeModels, u as useModel, c as computed, o as openBlock, b as createElementBlock, d as createBaseVNode, t as toDisplayString, e as createCommentVNode, w as withDirectives, v as vModelSelect, F as Fragment, f as renderList, g as renderSlot, h as unref, n as normalizeClass, j as createVNode, k as withCtx, l as createTextVNode, p as pushScopeId, q as popScopeId, R as RouterLink, a as ref, s as watch, x as createBlock, y as vModelRadio, z as filesize, r as reactive, A as createSlots, B as onMounted, C as createRouter, D as createWebHashHistory, E as provide, G as RouterView, H as normalizeStyle, I as createApp } from "./vendor-DqRMwRLa.js";
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/static/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    const links = document.getElementsByTagName("link");
    promise = Promise.all(deps.map((dep) => {
      dep = assetsURL(dep);
      if (dep in seen)
        return;
      seen[dep] = true;
      const isCss = dep.endsWith(".css");
      const cssSelector = isCss ? '[rel="stylesheet"]' : "";
      const isBaseRelative = !!importerUrl;
      if (isBaseRelative) {
        for (let i = links.length - 1; i >= 0; i--) {
          const link2 = links[i];
          if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
            return;
          }
        }
      } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
        return;
      }
      const link = document.createElement("link");
      link.rel = isCss ? "stylesheet" : scriptRel;
      if (!isCss) {
        link.as = "script";
        link.crossOrigin = "";
      }
      link.href = dep;
      document.head.appendChild(link);
      if (isCss) {
        return new Promise((res, rej) => {
          link.addEventListener("load", res);
          link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
        });
      }
    }));
  }
  return promise.then(() => baseModule()).catch((err) => {
    const e = new Event("vite:preloadError", { cancelable: true });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  });
};
const _hoisted_1$9 = { class: "select-input" };
const _hoisted_2$9 = {
  key: 0,
  class: "select-input__label"
};
const _hoisted_3$7 = { class: "select-input__real-input" };
const _hoisted_4$5 = ["value"];
const _hoisted_5$5 = {
  fullWidth: "",
  closeOnClickInside: ""
};
const _hoisted_6$4 = {
  slot: "trigger",
  class: "select-input__selected"
};
const _hoisted_7$3 = ["color"];
const _hoisted_8$2 = {
  slot: "content",
  class: "select-input__menu"
};
const _hoisted_9$1 = ["onClick"];
const _hoisted_10$1 = {
  key: 1,
  class: "select-input__hint assistive-text"
};
const _sfc_main$g = {
  __name: "SelectInput",
  props: /* @__PURE__ */ mergeModels({
    options: {
      type: Array,
      required: true
    },
    propValue: {
      type: String,
      default: "id"
    },
    hint: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: ""
    }
  }, {
    "modelValue": {
      type: String,
      required: true
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    const props = __props;
    const setSelected = (option) => {
      model.value = option[props.propValue];
    };
    const selectedItem = computed(
      () => props.options.find((option) => option[props.propValue] === model.value) || null
    );
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$9, [
        __props.label ? (openBlock(), createElementBlock("div", _hoisted_2$9, [
          createBaseVNode("p", null, toDisplayString(__props.label), 1)
        ])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_3$7, [
          withDirectives(createBaseVNode("select", {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event)
          }, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(__props.options, (option) => {
              return openBlock(), createElementBlock("option", {
                key: option[__props.propValue],
                value: option[__props.propValue]
              }, null, 8, _hoisted_4$5);
            }), 128))
          ], 512), [
            [vModelSelect, model.value]
          ])
        ]),
        createBaseVNode("ui-menu", _hoisted_5$5, [
          createBaseVNode("div", _hoisted_6$4, [
            renderSlot(_ctx.$slots, "selected", { selectedItem: selectedItem.value }, () => [
              createBaseVNode("span", null, toDisplayString(model.value), 1)
            ], true),
            createBaseVNode("ui-icon", {
              iconName: "googleArrowDropDownBaseline",
              color: unref(COLORS_DICT).DARK_GREY,
              size: "24"
            }, null, 8, _hoisted_7$3)
          ]),
          createBaseVNode("div", _hoisted_8$2, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(__props.options, (option) => {
              return openBlock(), createElementBlock("div", {
                key: option[__props.propValue],
                class: normalizeClass(["select-input__option", { "select-input__option_selected": option[__props.propValue] === model.value }]),
                onClick: ($event) => setSelected(option)
              }, [
                renderSlot(_ctx.$slots, "option", {
                  option,
                  isSelected: option[__props.propValue] === model.value
                }, () => [
                  createBaseVNode("span", null, toDisplayString(option[__props.propValue]), 1)
                ], true)
              ], 10, _hoisted_9$1);
            }), 128))
          ])
        ]),
        __props.hint || _ctx.$slots.hint ? (openBlock(), createElementBlock("div", _hoisted_10$1, [
          renderSlot(_ctx.$slots, "hint", {}, () => [
            createBaseVNode("p", null, toDisplayString(__props.hint), 1)
          ], true)
        ])) : createCommentVNode("", true)
      ]);
    };
  }
};
const SelectInput = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-a46b5290"]]);
const _sfc_main$f = {
  __name: "SpaLink",
  props: {
    to: {
      type: [String, Object, Symbol],
      default: ""
    },
    params: {
      type: [String, Number, Object],
      required: false,
      default: void 0
    }
  },
  setup(__props) {
    const props = __props;
    const { navigateTo } = s();
    const onLinkClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigateTo(props.to, props.params);
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("a", { onClick: onLinkClick }, [
        renderSlot(_ctx.$slots, "default")
      ]);
    };
  }
};
const _withScopeId$2 = (n) => (pushScopeId("data-v-a4975057"), n = n(), popScopeId(), n);
const _hoisted_1$8 = { class: "destination-tab" };
const _hoisted_2$8 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("span", null, "You may add credentials in the", -1));
const _hoisted_3$6 = /* @__PURE__ */ _withScopeId$2(() => /* @__PURE__ */ createBaseVNode("span", null, "settings page", -1));
const _sfc_main$e = {
  __name: "DestinationTab",
  props: {
    "credentialId": {
      type: String,
      required: true
    },
    "credentialIdModifiers": {},
    "fileName": {
      type: String,
      required: true
    },
    "fileNameModifiers": {},
    "description": {
      type: String,
      required: true
    },
    "descriptionModifiers": {}
  },
  emits: ["update:credentialId", "update:fileName", "update:description"],
  setup(__props) {
    const credential = useModel(__props, "credentialId");
    const fileName = useModel(__props, "fileName");
    const description = useModel(__props, "description");
    const toolkit = s();
    const { result: credentials, request } = useRequest(toolkit, false, true);
    const extensionId = computed(() => {
      var _a;
      return (_a = toolkit.sharedContext.currentInstallation) == null ? void 0 : _a.id;
    });
    const extensionName = computed(
      () => {
        var _a, _b, _c;
        return (_c = (_b = (_a = toolkit.sharedContext.currentInstallation) == null ? void 0 : _a.environment) == null ? void 0 : _b.extension) == null ? void 0 : _c.name;
      }
    );
    request("/api/credentials");
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$8, [
        createVNode(SelectInput, {
          modelValue: credential.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => credential.value = $event),
          class: "destination-tab__input",
          options: unref(credentials),
          label: "Credentials",
          propDisplay: "name",
          propValue: "id"
        }, {
          selected: withCtx(({ selectedItem }) => [
            createTextVNode(toDisplayString((selectedItem == null ? void 0 : selectedItem.name) || "–"), 1)
          ]),
          option: withCtx(({ option }) => [
            createTextVNode(toDisplayString(option.name), 1)
          ]),
          hint: withCtx(() => [
            _hoisted_2$8,
            createVNode(_sfc_main$f, {
              class: "destination-tab__hint",
              to: unref(V).extensionSettings,
              params: extensionId.value
            }, {
              default: withCtx(() => [
                createTextVNode(toDisplayString(extensionName.value), 1)
              ]),
              _: 1
            }, 8, ["to", "params"]),
            _hoisted_3$6
          ]),
          _: 1
        }, 8, ["modelValue", "options"]),
        createVNode(_sfc_main$h, {
          modelValue: fileName.value,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => fileName.value = $event),
          class: "destination-tab__input",
          label: "Filename Template",
          suffix: "_yyyymmdd hh:mm:ss.csv"
        }, null, 8, ["modelValue"]),
        createVNode(_sfc_main$h, {
          modelValue: description.value,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => description.value = $event),
          class: "destination-tab__input",
          label: "Description (optional)"
        }, null, 8, ["modelValue"])
      ]);
    };
  }
};
const DestinationTab = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-a4975057"]]);
const STATUSES_DICT = {
  ENABLED: "enabled",
  DISABLED: "disabled",
  FAILED: "failed",
  PENDING: "pending",
  PROCESSING: "processing",
  UPLOADED: "uploaded"
};
const STATUSES = {
  [STATUSES_DICT.ENABLED]: {
    text: "Enabled",
    icon: "googleFiberManualRecordBaseline",
    color: COLORS_DICT.NICE_GREEN
  },
  [STATUSES_DICT.DISABLED]: {
    text: "Disabled",
    icon: "googleFiberManualRecordBaseline",
    color: COLORS_DICT.MIDDLE_GREY
  },
  [STATUSES_DICT.FAILED]: {
    text: "Failed",
    icon: "googleCancelBaseline",
    color: COLORS_DICT.NICE_RED
  },
  [STATUSES_DICT.PENDING]: {
    text: "Pending",
    icon: "connectClockAnimated",
    color: COLORS_DICT.MIDDLE_GREY
  },
  [STATUSES_DICT.PROCESSING]: {
    text: "Processing",
    icon: "connectClockAnimated",
    color: COLORS_DICT.MIDDLE_GREY
  },
  [STATUSES_DICT.UPLOADED]: {
    text: "Uploaded",
    icon: "googleCheckCircleBaseline",
    color: COLORS_DICT.NICE_GREEN
  }
};
const _withScopeId$1 = (n) => (pushScopeId("data-v-2d2ed6fd"), n = n(), popScopeId(), n);
const _hoisted_1$7 = { class: "feed-summary" };
const _hoisted_2$7 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("p", { class: "feed-summary__title" }, "Summary", -1));
const _hoisted_3$5 = { class: "feed-summary__row" };
const _hoisted_4$4 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("p", { class: "feed-summary__label" }, "Feed", -1));
const _hoisted_5$4 = { class: "feed-summary__row" };
const _hoisted_6$3 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("p", { class: "feed-summary__label" }, "Status", -1));
const _hoisted_7$2 = ["iconName", "iconColor", "text"];
const _hoisted_8$1 = { class: "feed-summary__row" };
const _hoisted_9 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("p", { class: "feed-summary__label" }, "Report Schedule", -1));
const _hoisted_10 = { class: "feed-summary__row" };
const _hoisted_11 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("p", { class: "feed-summary__label" }, "Credential", -1));
const _hoisted_12 = { class: "feed-summary__row" };
const _hoisted_13 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("p", { class: "feed-summary__label" }, "Description", -1));
const _hoisted_14 = { class: "truncator" };
const _hoisted_15 = { class: "truncate-text" };
const _sfc_main$d = {
  __name: "FeedSummary",
  props: {
    id: {
      type: String,
      required: true
    },
    scheduleId: {
      type: String,
      required: true
    },
    credential: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const feedStatus = computed(() => STATUSES[props.status]);
    const detailsRoute = computed(() => ({
      name: "feeds.details",
      params: { id: props.id }
    }));
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$7, [
        _hoisted_2$7,
        createBaseVNode("div", _hoisted_3$5, [
          _hoisted_4$4,
          createVNode(unref(RouterLink), { to: detailsRoute.value }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(__props.id), 1)
            ]),
            _: 1
          }, 8, ["to"])
        ]),
        createBaseVNode("div", _hoisted_5$4, [
          _hoisted_6$3,
          createBaseVNode("ui-status", {
            iconName: feedStatus.value.icon,
            iconColor: feedStatus.value.color,
            text: feedStatus.value.text
          }, null, 8, _hoisted_7$2)
        ]),
        createBaseVNode("div", _hoisted_8$1, [
          _hoisted_9,
          createVNode(_sfc_main$f, {
            to: unref(V).reportsScheduleDetails,
            params: __props.scheduleId
          }, {
            default: withCtx(() => [
              createTextVNode(toDisplayString(__props.scheduleId), 1)
            ]),
            _: 1
          }, 8, ["to", "params"])
        ]),
        createBaseVNode("div", _hoisted_10, [
          _hoisted_11,
          createBaseVNode("p", null, toDisplayString(__props.credential), 1)
        ]),
        createBaseVNode("div", _hoisted_12, [
          _hoisted_13,
          createBaseVNode("div", _hoisted_14, [
            createBaseVNode("p", _hoisted_15, toDisplayString(__props.description), 1)
          ])
        ])
      ]);
    };
  }
};
const FeedSummary = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-2d2ed6fd"]]);
const _hoisted_1$6 = ["onClick"];
const _hoisted_2$6 = {
  key: 0,
  class: "vertical-tabs__tab-index"
};
const _hoisted_3$4 = ["color"];
const _hoisted_4$3 = { key: 1 };
const _hoisted_5$3 = ["color"];
const _sfc_main$c = {
  __name: "VerticalTabs",
  props: /* @__PURE__ */ mergeModels({
    tabs: {
      type: Array,
      required: true
    },
    linear: {
      type: Boolean,
      default: false
    }
  }, {
    "activeTabKey": {
      type: String,
      default: ""
    },
    "activeTabKeyModifiers": {}
  }),
  emits: ["update:activeTabKey"],
  setup(__props) {
    const props = __props;
    const activeTabKey = useModel(__props, "activeTabKey");
    const activeTabIndex = computed(
      () => props.tabs.findIndex((tab) => tab.key === activeTabKey.value)
    );
    const computedTabs = computed(
      () => props.tabs.map((tab, index) => ({
        ...tab,
        step: index + 1,
        active: index === activeTabIndex.value,
        inactive: props.linear && index > activeTabIndex.value,
        classes: {
          "vertical-tabs__tab_active": index === activeTabIndex.value,
          "vertical-tabs__tab_inactive": tab.skipStep || props.linear && index > activeTabIndex.value
        }
      }))
    );
    const computedRootClasses = computed(() => ({
      "vertical-tabs_linear": props.linear
    }));
    const onTabClick = (tab) => {
      if (!props.linear)
        activeTabKey.value = tab.key;
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["vertical-tabs", computedRootClasses.value])
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(computedTabs.value, (tab) => {
          return openBlock(), createElementBlock("div", {
            key: tab.key,
            class: normalizeClass(["vertical-tabs__tab", tab.classes]),
            onClick: ($event) => onTabClick(tab)
          }, [
            props.linear ? (openBlock(), createElementBlock("div", _hoisted_2$6, [
              tab.skipStep ? (openBlock(), createElementBlock("ui-icon", {
                key: 0,
                iconName: "googleArrowDownwardBaseline",
                color: unref(COLORS_DICT).NICE_BLUE,
                size: "18"
              }, null, 8, _hoisted_3$4)) : tab.inactive || tab.active ? (openBlock(), createElementBlock("span", _hoisted_4$3, toDisplayString(tab.step), 1)) : (openBlock(), createElementBlock("ui-icon", {
                key: 2,
                iconName: "googleCheckBaseline",
                color: unref(COLORS_DICT).NICE_BLUE,
                size: "18"
              }, null, 8, _hoisted_5$3))
            ])) : createCommentVNode("", true),
            createBaseVNode("p", null, toDisplayString(tab.label), 1)
          ], 10, _hoisted_1$6);
        }), 128))
      ], 2);
    };
  }
};
const VerticalTabs = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-aba18a93"]]);
const _sfc_main$b = {
  __name: "FormDialog",
  props: /* @__PURE__ */ mergeModels({
    title: {
      type: String,
      required: true
    },
    tabs: {
      type: Array,
      required: true,
      validator(value) {
        return value.length > 0;
      }
    },
    mode: {
      type: String,
      required: true,
      validator(value) {
        return Object.values(FORM_DIALOG_TYPES_DICT).includes(value);
      }
    },
    form: {
      type: Object,
      required: true
    },
    height: {
      type: String,
      default: "600px"
    },
    width: {
      type: String,
      default: "800px"
    },
    onSubmit: {
      type: Function,
      default: () => {
      }
    },
    detailsRoute: {
      type: Object,
      default: null
    },
    rules: {
      type: Object,
      default: () => {
      }
    },
    submitLabel: {
      type: String,
      default: ""
    }
  }, {
    "modelValue": {
      type: Boolean,
      default: false
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const value = useModel(__props, "modelValue");
    const isWizardMode = computed(() => props.mode === FORM_DIALOG_TYPES_DICT.WIZARD);
    const isEditMode = computed(() => props.mode === FORM_DIALOG_TYPES_DICT.EDIT);
    const activeTabKey = ref("");
    const activeTabIdx = computed(() => props.tabs.findIndex((tab) => tab.key === activeTabKey.value));
    const activeTab = computed(() => props.tabs.find((tab) => tab.key === activeTabKey.value));
    const isFirstTab = computed(() => activeTabIdx.value === 0);
    const isLastTab = computed(() => activeTabIdx.value === props.tabs.length - 1);
    const isSummaryTab = computed(() => activeTabKey.value === "summary");
    const isSubmittableTab = computed(() => activeTab.value.submittable);
    const computedTitle = computed(() => {
      if (isEditMode.value)
        return props.title;
      if (isSummaryTab.value)
        return `${props.title} – Summary`;
      return `${props.title} – Step ${activeTabIdx.value + 1}`;
    });
    const isTabValid = computed(() => {
      const fieldsToCheck = activeTab.value.includes || [];
      return fieldsToCheck.every((field) => {
        const fieldRules = props.rules[field];
        if (fieldRules)
          return fieldRules.every((rule) => rule(props.form[field]));
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
        if (isWizardMode.value && !isLastTab.value)
          goToNextTab();
      } catch (e) {
      }
    };
    const actions = computed(() => {
      if (isEditMode.value) {
        return ["spacer", "close", "save"];
      }
      if (isSummaryTab.value) {
        return ["spacer", "details", "close"];
      }
      if (isSubmittableTab.value) {
        return ["cancel", "spacer", "back", "submit"];
      }
      return ["cancel", "spacer", "back", "next"];
    });
    watch(value, () => goToTab(0), { immediate: true });
    return (_ctx, _cache) => {
      return openBlock(), createBlock(SimpleDialog, {
        modelValue: value.value,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => value.value = $event),
        class: normalizeClass(["form-dialog", `form-dialog_${__props.mode}`]),
        actions: actions.value,
        backDisabled: isFirstTab.value,
        detailsRoute: __props.detailsRoute,
        height: __props.height,
        isValid: isTabValid.value,
        onSubmit: submit,
        title: computedTitle.value,
        width: __props.width,
        onBack: goToPreviousTab,
        onNext: goToNextTab
      }, {
        sidebar: withCtx(() => [
          createVNode(VerticalTabs, {
            "active-tab-key": activeTabKey.value,
            "onUpdate:activeTabKey": _cache[0] || (_cache[0] = ($event) => activeTabKey.value = $event),
            tabs: __props.tabs,
            linear: isWizardMode.value
          }, null, 8, ["active-tab-key", "tabs", "linear"])
        ]),
        default: withCtx(() => [
          renderSlot(_ctx.$slots, activeTabKey.value)
        ]),
        _: 3
      }, 8, ["modelValue", "class", "actions", "backDisabled", "detailsRoute", "height", "isValid", "title", "width"]);
    };
  }
};
const _hoisted_1$5 = ["iconName", "color"];
const _hoisted_2$5 = ["value"];
const _hoisted_3$3 = { class: "radio-input__label-text" };
const _sfc_main$a = {
  __name: "RadioInput",
  props: /* @__PURE__ */ mergeModels({
    value: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ""
    }
  }, {
    "modelValue": {
      type: String,
      required: true
    },
    "modelModifiers": {}
  }),
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    const props = __props;
    const isSelected = computed(() => model.value === props.value);
    const icon = computed(
      () => isSelected.value ? "googleRadioButtonCheckedBaseline" : "googleRadioButtonUncheckedBaseline"
    );
    const iconColor = computed(() => isSelected.value ? COLORS_DICT.NICE_BLUE : "");
    const select = () => {
      model.value = props.value;
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "radio-input",
        onClick: select
      }, [
        createBaseVNode("ui-icon", {
          class: "radio-input__box",
          iconName: icon.value,
          color: iconColor.value
        }, null, 8, _hoisted_1$5),
        createBaseVNode("label", {
          class: normalizeClass(["radio-input__label", { "radio-input__label_empty": !__props.label }])
        }, [
          withDirectives(createBaseVNode("input", {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
            value: __props.value,
            class: "radio-input__input",
            type: "radio"
          }, null, 8, _hoisted_2$5), [
            [vModelRadio, model.value]
          ]),
          createBaseVNode("span", _hoisted_3$3, toDisplayString(__props.label), 1)
        ], 2)
      ]);
    };
  }
};
const RadioInput = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-c53c5700"]]);
const _hoisted_1$4 = { class: "radio-table" };
const _hoisted_2$4 = { class: "radio-table__title" };
const _hoisted_3$2 = {
  key: 0,
  class: "radio-table__search"
};
const _hoisted_4$2 = ["placeholder"];
const _hoisted_5$2 = { class: "radio-table__table" };
const _hoisted_6$2 = ["onClick"];
const _hoisted_7$1 = { class: "radio-table__item-content" };
const _sfc_main$9 = {
  __name: "RadioTable",
  props: /* @__PURE__ */ mergeModels({
    valueProp: {
      type: String,
      default: "id"
    },
    loading: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: () => []
    },
    hideSearch: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    searchPlaceholder: {
      type: String,
      default: ""
    }
  }, {
    "modelValue": {
      type: String,
      default: ""
    },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["search"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const value = useModel(__props, "modelValue");
    const emit = __emit;
    const props = __props;
    const selectItem = (item) => {
      value.value = item[props.valueProp];
    };
    const setSearch = processEvent((searchStr) => {
      emit("search", searchStr);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$4, [
        createBaseVNode("p", _hoisted_2$4, toDisplayString(__props.title), 1),
        !__props.hideSearch ? (openBlock(), createElementBlock("div", _hoisted_3$2, [
          createBaseVNode("ui-textfield", {
            placeholder: __props.searchPlaceholder,
            onInput: _cache[0] || (_cache[0] = (...args) => unref(setSearch) && unref(setSearch)(...args))
          }, null, 40, _hoisted_4$2)
        ])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_5$2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.items, (item) => {
            return openBlock(), createElementBlock("div", {
              key: item[__props.valueProp],
              class: "radio-table__item",
              onClick: ($event) => selectItem(item)
            }, [
              createBaseVNode("div", _hoisted_7$1, [
                renderSlot(_ctx.$slots, "default", { item }, void 0, true)
              ]),
              createVNode(RadioInput, {
                modelValue: value.value,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => value.value = $event),
                value: item[__props.valueProp]
              }, null, 8, ["modelValue", "value"])
            ], 8, _hoisted_6$2);
          }), 128))
        ])
      ]);
    };
  }
};
const RadioTable = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-7033db48"]]);
const debounce = (callback, wait = 200) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};
const getFileSize = (bytes = 0, options = {}) => filesize(bytes, {
  base: 2,
  locale: "en",
  standard: "jedec",
  ...options
});
const downloader = (url, name = "") => {
  const link = document.createElement("a");
  document.body.appendChild(link);
  link.href = url;
  if (name)
    link.download = name;
  else
    link.rel = "noopener noreferrer";
  link.click();
  document.body.removeChild(link);
};
const _sfc_main$8 = {
  __name: "ScheduleTab",
  props: {
    "modelValue": {
      type: String,
      required: true
    },
    "modelModifiers": {}
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const model = useModel(__props, "modelValue");
    const { result: rawReportSchedules, request } = useRequest(s(), false, true);
    const filteredReportSchedules = computed(
      () => rawReportSchedules.filter((schedule) => schedule.renderer === "csv")
    );
    const loadReportSchedules = async (searchStr = "") => {
      let reportSchedulesEndpoint = "/public/v1/reporting/schedules?limit=100";
      if (searchStr) {
        reportSchedulesEndpoint += `&(((ilike(id,${searchStr}*))|(ilike(name,*${searchStr}*))))`;
      }
      await request(reportSchedulesEndpoint);
    };
    const loadReportSchedulesDebounced = debounce(loadReportSchedules, 500);
    loadReportSchedules();
    return (_ctx, _cache) => {
      return openBlock(), createBlock(RadioTable, {
        modelValue: model.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => model.value = $event),
        items: filteredReportSchedules.value,
        searchPlaceholder: "Search for Report Schedule name or ID",
        title: "Select Report Schedule",
        onSearch: unref(loadReportSchedulesDebounced)
      }, {
        default: withCtx(({ item }) => [
          createVNode(DetailItem, {
            bodyText: item.name,
            assistiveText: item.id
          }, null, 8, ["bodyText", "assistiveText"])
        ]),
        _: 1
      }, 8, ["modelValue", "items", "onSearch"]);
    };
  }
};
const isTruthy = (value) => Boolean(value);
const validationRules = {
  required: (options) => (value) => {
    if (options && options.prop)
      return isTruthy(value[options.prop]);
    return isTruthy(value);
  }
};
const _sfc_main$7 = {
  __name: "CreateFeedDialog",
  props: {
    "modelValue": {
      type: Boolean,
      default: false
    },
    "modelModifiers": {}
  },
  emits: /* @__PURE__ */ mergeModels(["created"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const value = useModel(__props, "modelValue");
    const emit = __emit;
    const toolkit = s();
    const { result: createdFeed, request } = useRequest(toolkit, true);
    const tabs = [
      {
        key: "schedule",
        label: "Report Schedule",
        includes: ["scheduleId"]
      },
      {
        key: "destination",
        label: "Destination",
        includes: ["credentialId", "fileName"],
        submittable: true
      },
      {
        key: "summary",
        label: "Summary"
      }
    ];
    const form = reactive({
      scheduleId: "",
      credentialId: "",
      fileName: "",
      description: ""
    });
    const rules = {
      scheduleId: [validationRules.required()],
      credentialId: [validationRules.required()],
      fileName: [validationRules.required()]
    };
    const feed = computed(() => {
      var _a, _b;
      return {
        id: createdFeed.id,
        scheduleId: (_a = createdFeed.schedule) == null ? void 0 : _a.id,
        credential: (_b = createdFeed.credential) == null ? void 0 : _b.id,
        // TODO: get credential name
        description: createdFeed.description,
        status: createdFeed.status
      };
    });
    const detailsRoute = computed(() => ({
      name: "feeds.details",
      params: { id: feed.value.id }
    }));
    const createFeed = async () => {
      await request("/api/feeds", "POST", {
        schedule: { id: form.scheduleId },
        credential: { id: form.credentialId },
        file_name: form.fileName,
        description: form.description
      });
      emit("created");
    };
    const resetForm = () => {
      form.scheduleId = "";
      form.credentialId = "";
      form.fileName = "";
      form.description = "";
    };
    watch(
      value,
      (isOpen) => {
        if (!isOpen)
          resetForm();
      },
      { immediate: true }
    );
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$b, {
        modelValue: value.value,
        "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => value.value = $event),
        form,
        rules,
        onSubmit: createFeed,
        tabs,
        detailsRoute: detailsRoute.value,
        title: "Create Feed",
        mode: "wizard",
        submitLabel: "Create"
      }, {
        schedule: withCtx(() => [
          createVNode(_sfc_main$8, {
            modelValue: form.scheduleId,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.scheduleId = $event)
          }, null, 8, ["modelValue"])
        ]),
        destination: withCtx(() => [
          createVNode(DestinationTab, {
            "credential-id": form.credentialId,
            "onUpdate:credentialId": _cache[1] || (_cache[1] = ($event) => form.credentialId = $event),
            "file-name": form.fileName,
            "onUpdate:fileName": _cache[2] || (_cache[2] = ($event) => form.fileName = $event),
            description: form.description,
            "onUpdate:description": _cache[3] || (_cache[3] = ($event) => form.description = $event)
          }, null, 8, ["credential-id", "file-name", "description"])
        ]),
        summary: withCtx(() => [
          createVNode(FeedSummary, {
            id: feed.value.id,
            status: feed.value.status,
            description: feed.value.description,
            credential: feed.value.credential,
            scheduleId: feed.value.scheduleId
          }, null, 8, ["id", "status", "description", "credential", "scheduleId"])
        ]),
        _: 1
      }, 8, ["modelValue", "form", "detailsRoute"]);
    };
  }
};
const _sfc_main$6 = {
  __name: "DateItem",
  props: {
    date: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const { sharedContext } = s();
    const props = __props;
    const parsedDate = computed(() => {
      var _a, _b, _c;
      const formatter = new Intl.DateTimeFormat((_a = sharedContext == null ? void 0 : sharedContext.timezoneInfo) == null ? void 0 : _a.region.replace("_", "-"), {
        timeZone: (_b = sharedContext == null ? void 0 : sharedContext.timezoneInfo) == null ? void 0 : _b.timezone,
        hourCycle: ((_c = sharedContext == null ? void 0 : sharedContext.timezoneInfo) == null ? void 0 : _c.time_24h) ? "h23" : "h12",
        timeStyle: "short",
        dateStyle: "short"
      });
      return formatter.format(new Date(props.date));
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("span", null, toDisplayString(parsedDate.value), 1);
    };
  }
};
const _hoisted_1$3 = { class: "empty-placeholder" };
const _hoisted_2$3 = { class: "empty-placeholder_content" };
const _hoisted_3$1 = { class: "empty-placeholder_icon" };
const _hoisted_4$1 = ["iconName", "color"];
const _hoisted_5$1 = ["color"];
const _hoisted_6$1 = ["color"];
const _sfc_main$5 = {
  __name: "EmptyPlaceholder",
  props: {
    title: {
      type: String,
      default: "No data"
    },
    message: {
      type: String,
      default: "There is no data to be shown."
    },
    icon: {
      type: String,
      default: "googleQuestionMarkBaseline"
    },
    action: {
      type: String,
      default: ""
    }
  },
  emits: ["actionClicked"],
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$3, [
        createBaseVNode("div", _hoisted_2$3, [
          createBaseVNode("div", _hoisted_3$1, [
            createBaseVNode("ui-icon", {
              iconName: __props.icon,
              color: unref(COLORS_DICT).MIDDLE_GREY,
              size: "56"
            }, null, 8, _hoisted_4$1)
          ]),
          createBaseVNode("h2", null, toDisplayString(__props.title), 1),
          createBaseVNode("p", null, toDisplayString(__props.message), 1),
          __props.action ? (openBlock(), createElementBlock("ui-button", {
            key: 0,
            class: "empty-placeholder_action",
            backgroundColor: "transparent",
            color: unref(COLORS_DICT).NICE_BLUE,
            onClicked: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("actionClicked"))
          }, [
            createBaseVNode("ui-icon", {
              iconName: "googleAddBaseline",
              color: unref(COLORS_DICT).NICE_BLUE,
              size: "18"
            }, null, 8, _hoisted_6$1),
            createBaseVNode("span", null, toDisplayString(__props.action), 1)
          ], 40, _hoisted_5$1)) : createCommentVNode("", true)
        ])
      ]);
    };
  }
};
const EmptyPlaceholder = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-19daa194"]]);
const _hoisted_1$2 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_2$2 = /* @__PURE__ */ createBaseVNode("span", null, "You cannot undo this action once performed.", -1);
const _sfc_main$4 = {
  __name: "DeleteFeedDialog",
  props: /* @__PURE__ */ mergeModels({
    feedId: {
      type: String,
      required: true
    }
  }, {
    "modelValue": {
      type: Boolean,
      required: true
    },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["deleted"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const props = __props;
    const isOpen = useModel(__props, "modelValue");
    const emit = __emit;
    const actions = ["cancel", "delete"];
    const { request } = useRequest(s());
    const deleteFeed = async () => {
      const status = await request(`/api/feeds/${props.feedId}`, "DELETE");
      if (status < 400)
        emit("deleted");
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(SimpleDialog, {
        modelValue: isOpen.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isOpen.value = $event),
        actions,
        onSubmit: deleteFeed,
        height: "auto",
        title: "Delete Feed",
        width: "480px"
      }, {
        default: withCtx(() => [
          createBaseVNode("p", null, [
            createBaseVNode("span", null, "Are you sure you want to delete this feed (" + toDisplayString(__props.feedId) + ")?", 1),
            _hoisted_1$2,
            _hoisted_2$2
          ])
        ]),
        _: 1
      }, 8, ["modelValue"]);
    };
  }
};
const _sfc_main$3 = {
  __name: "FeedActions",
  props: {
    feed: {
      type: Object,
      required: true
    }
  },
  emits: ["enabled", "disabled", "uploaded", "deleted"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const toolkit = s();
    const enableAction = useRequest(toolkit);
    const disableAction = useRequest(toolkit);
    const forceUploadAction = useRequest(toolkit);
    const feedId = computed(() => props.feed.id);
    const isFeedDisabled = computed(() => props.feed.status === STATUSES_DICT.DISABLED);
    const disableFeed = async () => {
      const status = await disableAction.request(`/api/feeds/${feedId.value}/disable`, "POST");
      if (status < 400)
        emit("disabled");
    };
    const enableFeed = async () => {
      const status = await enableAction.request(`/api/feeds/${feedId.value}/enable`, "POST");
      if (status < 400)
        emit("enabled");
    };
    const forceUpload = async () => {
      const status = await forceUploadAction.request(
        `/api/feeds/${feedId.value}/uploads/force`,
        "POST"
      );
      if (status < 400)
        emit("uploaded");
    };
    const isDeleteFeedDialogOpen = ref(false);
    const openDeleteFeedDialog = () => {
      isDeleteFeedDialogOpen.value = true;
    };
    const actions = reactive([
      {
        key: "disable",
        color: COLORS_DICT.TEXT,
        text: "Disable",
        icon: "googleToggleOffBaseline",
        loading: disableAction.loading,
        hide: isFeedDisabled,
        handler: disableFeed
      },
      {
        key: "enable",
        color: COLORS_DICT.TEXT,
        text: "Enable",
        icon: "googleToggleOnBaseline",
        loading: enableAction.loading,
        hide: !isFeedDisabled.value,
        handler: enableFeed
      },
      {
        key: "forceUpload",
        color: COLORS_DICT.TEXT,
        text: "Force upload",
        icon: "googleUploadBaseline",
        loading: forceUploadAction.loading,
        disabled: isFeedDisabled.value,
        handler: forceUpload
      },
      {
        separated: true,
        key: "delete",
        color: COLORS_DICT.NICE_RED,
        text: "Delete",
        icon: "googleDeleteForeverBaseline",
        handler: openDeleteFeedDialog
      }
    ]);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(ActionsMenu, {
          class: "feed-actions",
          actions
        }, createSlots({ _: 2 }, [
          _ctx.$slots.default ? {
            name: "trigger",
            fn: withCtx(() => [
              renderSlot(_ctx.$slots, "default")
            ]),
            key: "0"
          } : void 0
        ]), 1032, ["actions"]),
        createVNode(_sfc_main$4, {
          modelValue: isDeleteFeedDialogOpen.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isDeleteFeedDialogOpen.value = $event),
          feedId: feedId.value,
          onDeleted: _cache[1] || (_cache[1] = ($event) => emit("deleted"))
        }, null, 8, ["modelValue", "feedId"])
      ], 64);
    };
  }
};
const _hoisted_1$1 = { class: "loading-indicator" };
const _hoisted_2$1 = ["size", "color"];
const _sfc_main$2 = {
  __name: "LoadingIndicator",
  props: {
    size: {
      type: [Number, String],
      default: 76
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createBaseVNode("ui-icon", {
          iconName: "connectLoaderAnimated",
          size: __props.size,
          color: unref(COLORS_DICT).DARKER_BLUE
        }, null, 8, _hoisted_2$1)
      ]);
    };
  }
};
const LoadingIndicator = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-bec31191"]]);
const _withScopeId = (n) => (pushScopeId("data-v-b72ddafa"), n = n(), popScopeId(), n);
const _hoisted_1 = {
  title: "Feeds",
  style: { "height": "inherit" },
  noPadded: ""
};
const _hoisted_2 = {
  key: 0,
  slot: "actions",
  class: "header-actions"
};
const _hoisted_3 = ["backgroundColor", "color"];
const _hoisted_4 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("span", null, "Create Feed", -1));
const _hoisted_5 = [
  _hoisted_4
];
const _hoisted_6 = ["totalItems", "currentPage"];
const _hoisted_7 = ["iconName", "iconColor", "text"];
const _hoisted_8 = {
  key: 5,
  class: "truncator"
};
const _sfc_main$1 = {
  __name: "FeedsView",
  setup(__props) {
    const headers = [
      { key: "id", text: "ID", width: "130px" },
      { key: "schedule", text: "Report Schedule", width: "215px" },
      { key: "createdAt", text: "created", width: "200px" },
      { key: "description", text: "description" },
      { key: "status", text: "status", width: "105px" },
      { key: "actions", width: "36px" }
    ];
    const { items, page, total, load, loading, next, previous } = s$1("/api/feeds");
    const noItems = computed(() => {
      return !items.value.length;
    });
    const preparedItems = computed(
      () => items.value.map((item) => ({
        id: item.id,
        scheduleId: item.schedule.id,
        createdAt: item.events.created.at,
        description: item.description,
        status: STATUSES[item.status],
        rawFeed: item
      }))
    );
    const isCreateFeedDialogOpen = ref(false);
    const openCreateFeedDialog = () => {
      isCreateFeedDialogOpen.value = true;
    };
    onMounted(async () => {
      await load();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("ui-view", _hoisted_1, [
        !noItems.value ? (openBlock(), createElementBlock("div", _hoisted_2, [
          createBaseVNode("ui-button", {
            class: "header-button",
            backgroundColor: unref(COLORS_DICT).WHITE,
            color: unref(COLORS_DICT).TEXT,
            height: "36px",
            onClicked: openCreateFeedDialog
          }, _hoisted_5, 40, _hoisted_3)
        ])) : createCommentVNode("", true),
        unref(loading) ? (openBlock(), createBlock(LoadingIndicator, { key: 1 })) : noItems.value ? (openBlock(), createBlock(EmptyPlaceholder, {
          key: 2,
          title: "No Feeds",
          icon: "googleAutoGraphBaseline",
          action: "Create Feed",
          onActionClicked: openCreateFeedDialog
        })) : (openBlock(), createElementBlock("ui-complex-table", {
          key: 3,
          headers,
          totalItems: unref(total),
          currentPage: unref(page),
          fixed: "",
          onNextClicked: _cache[0] || (_cache[0] = (...args) => unref(next) && unref(next)(...args)),
          onPreviousClicked: _cache[1] || (_cache[1] = (...args) => unref(previous) && unref(previous)(...args))
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(preparedItems.value, (item) => {
            return openBlock(), createElementBlock("tr", {
              key: item.id
            }, [
              (openBlock(), createElementBlock(Fragment, null, renderList(headers, (header) => {
                return createBaseVNode("td", {
                  key: header.key
                }, [
                  header.key === "id" ? (openBlock(), createBlock(unref(RouterLink), {
                    key: 0,
                    to: { name: "feeds.details", params: { id: item.id } }
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(item.id), 1)
                    ]),
                    _: 2
                  }, 1032, ["to"])) : header.key === "schedule" ? (openBlock(), createBlock(_sfc_main$f, {
                    key: 1,
                    to: unref(V).reportsScheduleDetails,
                    params: item.scheduleId
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(item.scheduleId), 1)
                    ]),
                    _: 2
                  }, 1032, ["to", "params"])) : header.key === "status" ? (openBlock(), createElementBlock("ui-status", {
                    key: 2,
                    iconName: item.status.icon,
                    iconColor: item.status.color,
                    text: item.status.text
                  }, null, 8, _hoisted_7)) : header.key === "createdAt" ? (openBlock(), createBlock(_sfc_main$6, {
                    key: 3,
                    date: item.createdAt
                  }, null, 8, ["date"])) : createCommentVNode("", true),
                  header.key === "actions" ? (openBlock(), createBlock(_sfc_main$3, {
                    key: 4,
                    feed: item.rawFeed,
                    onEnabled: unref(load),
                    onDisabled: unref(load),
                    onUploaded: unref(load),
                    onDeleted: unref(load)
                  }, null, 8, ["feed", "onEnabled", "onDisabled", "onUploaded", "onDeleted"])) : header.key === "description" ? (openBlock(), createElementBlock("div", _hoisted_8, [
                    createBaseVNode("span", {
                      class: normalizeClass(["truncate-text", { "assistive-color": !item[header.key] }])
                    }, toDisplayString(item[header.key] || "—"), 3)
                  ])) : createCommentVNode("", true)
                ]);
              }), 64))
            ]);
          }), 128))
        ], 40, _hoisted_6)),
        createVNode(_sfc_main$7, {
          modelValue: isCreateFeedDialogOpen.value,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => isCreateFeedDialogOpen.value = $event),
          onCreated: unref(load)
        }, null, 8, ["modelValue", "onCreated"])
      ]);
    };
  }
};
const FeedsView = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-b72ddafa"]]);
const routes = [
  {
    path: "/",
    redirect: { name: "feeds" }
  },
  {
    name: "feeds",
    path: "/feeds",
    component: FeedsView
  },
  {
    name: "feeds.details",
    path: "/feeds/:id",
    component: () => __vitePreload(() => import("./FeedDetails-XiU9ybV5.js"), true ? __vite__mapDeps([0,1,2,3,4,5]) : void 0)
  }
];
const router = createRouter({
  history: createWebHashHistory(),
  routes
});
const _sfc_main = {
  __name: "MainPage",
  setup(__props) {
    const fullscreenHeight = ref("");
    const styles = computed(() => ({
      height: fullscreenHeight.value
    }));
    const toolkit = s();
    toolkit.listen("fullscreenSize", ({ height }) => {
      fullscreenHeight.value = `${height}px`;
    });
    provide("fullscreen-height", fullscreenHeight);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "app",
        style: normalizeStyle(styles.value)
      }, [
        createVNode(unref(RouterView))
      ], 4);
    };
  }
};
H({
  "ui-view": p,
  "ui-complex-table": v,
  "ui-icon": o,
  "ui-button": l,
  "ui-status": s$2,
  "ui-menu": w,
  "ui-tabs": z,
  "ui-textfield": r
}).then((toolkitInstance) => {
  const app = createApp(_sfc_main);
  app.use(router);
  app.use(l$1, toolkitInstance);
  app.mount("#app");
});
export {
  DestinationTab as D,
  LoadingIndicator as L,
  STATUSES as S,
  _sfc_main$b as _,
  STATUSES_DICT as a,
  _sfc_main$6 as b,
  _sfc_main$f as c,
  downloader as d,
  _sfc_main$3 as e,
  getFileSize as g,
  validationRules as v
};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = ["assets/FeedDetails-XiU9ybV5.js","assets/connect-CncOCzNp.js","assets/vendor-DqRMwRLa.js","assets/ActionsMenu-D7LkUb7G.js","assets/ActionsMenu-BH4lXONi.css","assets/FeedDetails-B6UIKJXs.css"]
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i])
}
