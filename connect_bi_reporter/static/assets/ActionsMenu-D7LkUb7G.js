import { m as mergeModels, u as useModel, o as openBlock, b as createElementBlock, h as unref, a as ref, r as reactive, J as useRouter, c as computed, i as inject, s as watch, K as onBeforeUnmount, d as createBaseVNode, g as renderSlot, t as toDisplayString, e as createCommentVNode, F as Fragment, f as renderList, H as normalizeStyle, L as mergeProps } from "./vendor-DqRMwRLa.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const COLORS_DICT = {
  NICE_GREEN: "#0BB071",
  NICE_RED: "#FF6A6A",
  MIDDLE_GREY: "#BDBDBD",
  DARK_GREY: "#666666",
  NICE_BLUE: "#2C98F0",
  DARKER_BLUE: "#4797f2",
  TEXT: "#212121",
  WHITE: "#FFFFFF",
  TRANSPARENT: "transparent"
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const processEvent = (fn) => (event) => fn(...event.detail);
const _hoisted_1$3 = ["value", "label", "placeholder", "suffix"];
const _sfc_main$3 = {
  __name: "TextField",
  props: /* @__PURE__ */ mergeModels({
    label: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: ""
    },
    suffix: {
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
  emits: ["update:modelValue"],
  setup(__props) {
    const value = useModel(__props, "modelValue");
    const setValue = processEvent((newValue) => value.value = newValue);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("ui-textfield", {
        value: value.value,
        label: __props.label,
        placeholder: __props.placeholder,
        suffix: __props.suffix,
        onInput: _cache[0] || (_cache[0] = (...args) => unref(setValue) && unref(setValue)(...args))
      }, null, 40, _hoisted_1$3);
    };
  }
};
class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
const buildErrorMessage = (response, responseBody) => {
  let errorMessage = `Error ${response.status}: ${response.statusText}.`;
  if (responseBody) {
    if (responseBody.error_code)
      errorMessage += ` Error code: ${responseBody.error_code}.`;
    if (responseBody.errors)
      errorMessage += responseBody.errors.map((err) => ` ${err}`).join("");
  }
  return errorMessage;
};
const parseResponseBody = async (response) => {
  let parsedBody;
  try {
    parsedBody = await response.clone().json();
  } catch (e) {
    parsedBody = await response.text();
  }
  return parsedBody;
};
const request = async (endpoint, method = "GET", body = null, fullResponse = false) => {
  const options = { method, headers: { "Content-Type": "application/json" } };
  if (body)
    options.body = JSON.stringify(body);
  const response = await fetch(endpoint, options);
  const responseBody = await parseResponseBody(response);
  if (!response.ok) {
    const errorMessage = buildErrorMessage(response, responseBody);
    throw new ApiError(errorMessage);
  }
  return fullResponse ? { status: response.status, body: responseBody } : responseBody;
};
const useRequest = (toolkitInstance, propagateErrors = false, isList = false) => {
  const loading = ref(false);
  const result = isList ? reactive([]) : reactive({});
  const doRequest = async (endpoint, method, body) => {
    loading.value = true;
    try {
      const response = await request(endpoint, method, body, true);
      if (isList) {
        result.splice(0);
        result.push(...response.body);
      } else {
        Object.assign(result, {});
        Object.assign(result, response.body);
      }
      return response.status;
    } catch (e) {
      toolkitInstance.emit("snackbar:error", e.message);
      if (propagateErrors)
        throw e;
      else
        return e.status;
    } finally {
      loading.value = false;
    }
  };
  return {
    loading,
    result,
    request: doRequest
  };
};
const ACTIONS_DICT = {
  CANCEL: "cancel",
  CLOSE: "close",
  DETAILS: "details",
  SAVE: "save",
  SUBMIT: "submit",
  DELETE: "delete",
  SPACER: "spacer",
  NEXT: "next",
  BACK: "back"
};
const ACTIONS_LABELS = {
  [ACTIONS_DICT.CANCEL]: "Cancel",
  [ACTIONS_DICT.CLOSE]: "Close",
  [ACTIONS_DICT.DETAILS]: "Go to details",
  [ACTIONS_DICT.SAVE]: "Save",
  [ACTIONS_DICT.SUBMIT]: "Submit",
  [ACTIONS_DICT.DELETE]: "Delete",
  [ACTIONS_DICT.NEXT]: "Next",
  [ACTIONS_DICT.BACK]: "Back"
};
const FORM_DIALOG_TYPES_DICT = {
  WIZARD: "wizard",
  EDIT: "edit"
};
const buildAction = (action, opts = {}) => {
  if (action === ACTIONS_DICT.SPACER)
    return { key: "spacer" };
  return {
    key: action,
    label: opts.label || ACTIONS_LABELS[action],
    handler: opts.handler,
    disabled: opts.disabled,
    loading: opts.loading,
    color: opts.color
  };
};
const _hoisted_1$2 = { class: "dialog__header" };
const _hoisted_2$2 = { class: "dialog__title" };
const _hoisted_3$2 = { class: "dialog__body" };
const _hoisted_4$2 = {
  key: 0,
  class: "dialog__sidebar"
};
const _hoisted_5$2 = { class: "dialog__content-wrapper" };
const _hoisted_6$2 = { class: "dialog__content" };
const _hoisted_7$2 = { class: "dialog__actions" };
const _hoisted_8$2 = ["disabled", "color", "onClicked"];
const _hoisted_9$1 = ["color"];
const _hoisted_10 = {
  key: 1,
  class: "dialog__action-label"
};
const _sfc_main$2 = {
  __name: "SimpleDialog",
  props: /* @__PURE__ */ mergeModels({
    title: {
      type: String,
      required: true
    },
    actions: {
      type: Array,
      required: true,
      validator(value) {
        return value.every((action) => Object.values(ACTIONS_DICT).includes(action));
      }
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
    isValid: {
      type: Boolean,
      default: true
    },
    backDisabled: {
      type: Boolean,
      default: false
    },
    detailsRoute: {
      type: Object,
      default: () => ({})
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
  emits: /* @__PURE__ */ mergeModels(["next", "back"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const value = useModel(__props, "modelValue");
    const props = __props;
    const emit = __emit;
    const router = useRouter();
    const isSubmitting = ref(false);
    const submit = async () => {
      isSubmitting.value = true;
      try {
        await props.onSubmit();
      } finally {
        isSubmitting.value = false;
      }
    };
    const close = () => value.value = false;
    const actionDict = computed(() => ({
      [ACTIONS_DICT.CANCEL]: buildAction(ACTIONS_DICT.CANCEL, { handler: close }),
      [ACTIONS_DICT.CLOSE]: buildAction(ACTIONS_DICT.CLOSE, { handler: close }),
      [ACTIONS_DICT.SUBMIT]: buildAction(ACTIONS_DICT.SUBMIT, {
        disabled: !props.isValid,
        handler: submit,
        label: props.submitLabel,
        loading: isSubmitting.value,
        color: COLORS_DICT.NICE_BLUE
      }),
      [ACTIONS_DICT.SAVE]: buildAction(ACTIONS_DICT.SAVE, {
        disabled: !props.isValid,
        handler: async () => {
          await submit();
          close();
        },
        loading: isSubmitting.value,
        color: COLORS_DICT.NICE_BLUE
      }),
      [ACTIONS_DICT.DELETE]: buildAction(ACTIONS_DICT.DELETE, {
        disabled: !props.isValid,
        handler: async () => {
          await submit();
          close();
        },
        loading: isSubmitting.value,
        color: COLORS_DICT.NICE_RED
      }),
      [ACTIONS_DICT.DETAILS]: buildAction(ACTIONS_DICT.DETAILS, {
        handler: () => router.push(props.detailsRoute)
      }),
      [ACTIONS_DICT.SPACER]: buildAction(ACTIONS_DICT.SPACER),
      [ACTIONS_DICT.NEXT]: buildAction(ACTIONS_DICT.NEXT, {
        disabled: !props.isValid,
        handler: () => emit("next"),
        color: COLORS_DICT.NICE_BLUE
      }),
      [ACTIONS_DICT.BACK]: buildAction(ACTIONS_DICT.BACK, {
        disabled: props.backDisabled,
        handler: () => emit("back")
      })
    }));
    const computedActions = computed(() => props.actions.map((act) => actionDict.value[act]));
    const containerHeight = inject("fullscreen-height");
    watch(
      value,
      (isOpen) => {
        if (isOpen)
          document.documentElement.classList.add("is-clipped");
        else
          document.documentElement.classList.remove("is-clipped");
      },
      { immediate: true }
    );
    onBeforeUnmount(() => {
      document.documentElement.classList.remove("is-clipped");
    });
    return (_ctx, _cache) => {
      return value.value ? (openBlock(), createElementBlock("div", mergeProps({ key: 0 }, _ctx.$attrs, {
        class: "dialog",
        style: { height: unref(containerHeight) }
      }), [
        createBaseVNode("div", {
          class: "dialog__container",
          style: normalizeStyle({ height: __props.height, width: __props.width })
        }, [
          createBaseVNode("div", _hoisted_1$2, [
            renderSlot(_ctx.$slots, "header", {}, () => [
              createBaseVNode("p", _hoisted_2$2, toDisplayString(__props.title), 1)
            ], true)
          ]),
          createBaseVNode("div", _hoisted_3$2, [
            _ctx.$slots.sidebar ? (openBlock(), createElementBlock("div", _hoisted_4$2, [
              renderSlot(_ctx.$slots, "sidebar", {}, void 0, true)
            ])) : createCommentVNode("", true),
            createBaseVNode("div", _hoisted_5$2, [
              createBaseVNode("div", _hoisted_6$2, [
                renderSlot(_ctx.$slots, "default", {}, void 0, true)
              ]),
              createBaseVNode("div", _hoisted_7$2, [
                (openBlock(true), createElementBlock(Fragment, null, renderList(computedActions.value, (action) => {
                  return openBlock(), createElementBlock(Fragment, null, [
                    action.key === "spacer" ? (openBlock(), createElementBlock("div", {
                      key: action.key,
                      class: "dialog__spacer"
                    })) : (openBlock(), createElementBlock("ui-button", {
                      key: action.key,
                      class: "dialog__action",
                      disabled: action.disabled,
                      color: action.color || unref(COLORS_DICT).TEXT,
                      height: "36px",
                      backgroundColor: "transparent",
                      onClicked: action.handler
                    }, [
                      action.loading ? (openBlock(), createElementBlock("ui-icon", {
                        key: 0,
                        class: "dialog__action-icon",
                        color: action.color || unref(COLORS_DICT).TEXT,
                        iconName: "connectLoaderAnimated",
                        size: "24"
                      }, null, 8, _hoisted_9$1)) : (openBlock(), createElementBlock("span", _hoisted_10, toDisplayString(action.label), 1))
                    ], 40, _hoisted_8$2))
                  ], 64);
                }), 256))
              ])
            ])
          ])
        ], 4)
      ], 16)) : createCommentVNode("", true);
    };
  }
};
const SimpleDialog = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-15fcb727"]]);
const _hoisted_1$1 = { class: "detail-item" };
const _hoisted_2$1 = {
  key: 0,
  class: "detail-item__head"
};
const _hoisted_3$1 = {
  key: 0,
  class: "detail-item__subhead"
};
const _hoisted_4$1 = { class: "detail-item__content-holder" };
const _hoisted_5$1 = {
  key: 0,
  class: "detail-item__image"
};
const _hoisted_6$1 = { class: "detail-item__content" };
const _hoisted_7$1 = {
  key: 0,
  class: "detail-item__text"
};
const _hoisted_8$1 = {
  key: 1,
  class: "detail-item__assistive-text"
};
const _sfc_main$1 = {
  __name: "DetailItem",
  props: {
    title: {
      type: String,
      default: ""
    },
    subtitle: {
      type: String,
      default: ""
    },
    bodyText: {
      type: String,
      default: ""
    },
    assistiveText: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        __props.title || _ctx.$slots.title ? (openBlock(), createElementBlock("div", _hoisted_2$1, [
          renderSlot(_ctx.$slots, "title", {}, () => [
            createBaseVNode("span", null, toDisplayString(__props.title), 1),
            __props.subtitle ? (openBlock(), createElementBlock("span", _hoisted_3$1, toDisplayString(__props.subtitle), 1)) : createCommentVNode("", true)
          ], true)
        ])) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_4$1, [
          _ctx.$slots.image ? (openBlock(), createElementBlock("div", _hoisted_5$1, [
            renderSlot(_ctx.$slots, "image", {}, void 0, true)
          ])) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_6$1, [
            renderSlot(_ctx.$slots, "content", {}, () => [
              __props.bodyText || _ctx.$slots["body-text"] ? (openBlock(), createElementBlock("div", _hoisted_7$1, [
                renderSlot(_ctx.$slots, "body-text", {}, () => [
                  createBaseVNode("span", null, toDisplayString(__props.bodyText), 1)
                ], true)
              ])) : createCommentVNode("", true),
              __props.assistiveText || _ctx.$slots["assistive-text"] ? (openBlock(), createElementBlock("div", _hoisted_8$1, [
                renderSlot(_ctx.$slots, "assistive-text", {}, () => [
                  createBaseVNode("span", null, toDisplayString(__props.assistiveText), 1)
                ], true)
              ])) : createCommentVNode("", true)
            ], true)
          ])
        ])
      ]);
    };
  }
};
const DetailItem = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-54319148"]]);
const _hoisted_1 = {
  class: "actions-menu",
  align: "right",
  closeOnClickInside: false
};
const _hoisted_2 = {
  slot: "trigger",
  class: "actions-menu__trigger"
};
const _hoisted_3 = ["backgroundColor"];
const _hoisted_4 = ["color"];
const _hoisted_5 = {
  slot: "content",
  class: "actions-menu__content"
};
const _hoisted_6 = {
  key: 0,
  class: "horizontal-divider"
};
const _hoisted_7 = ["backgroundColor", "color", "disabled", "onClicked"];
const _hoisted_8 = { class: "actions-menu__action-content" };
const _hoisted_9 = ["iconName", "color"];
const _sfc_main = {
  __name: "ActionsMenu",
  props: {
    actions: {
      type: Array,
      required: true,
      validator(actions) {
        return actions.length > 0 && actions.every(
          (action) => Boolean(action.key && action.text && action.icon && action.handler)
        );
      }
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("ui-menu", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          renderSlot(_ctx.$slots, "trigger", {}, () => [
            createBaseVNode("ui-button", {
              class: "actions-menu__trigger-button",
              backgroundColor: unref(COLORS_DICT).WHITE,
              height: "36px",
              width: "36px"
            }, [
              createBaseVNode("ui-icon", {
                class: "actions-menu__trigger-icon",
                color: unref(COLORS_DICT).TEXT,
                iconName: "googleMoreVertBaseline"
              }, null, 8, _hoisted_4)
            ], 8, _hoisted_3)
          ], true)
        ]),
        createBaseVNode("div", _hoisted_5, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.actions, (action) => {
            return openBlock(), createElementBlock("div", {
              key: action.key,
              class: "actions-menu__action"
            }, [
              action.separated ? (openBlock(), createElementBlock("div", _hoisted_6)) : createCommentVNode("", true),
              !action.hide ? (openBlock(), createElementBlock("ui-button", {
                key: 1,
                ref_for: true,
                ref: action.key,
                backgroundColor: unref(COLORS_DICT).TRANSPARENT,
                color: action.color || unref(COLORS_DICT).TEXT,
                disabled: action.disabled,
                height: "32px",
                width: "156px",
                onClicked: action.handler
              }, [
                createBaseVNode("div", _hoisted_8, [
                  createBaseVNode("ui-icon", {
                    iconName: action.loading ? "connectLoaderAnimated" : action.icon,
                    color: action.color || unref(COLORS_DICT).TEXT,
                    size: "18"
                  }, null, 8, _hoisted_9),
                  createBaseVNode("span", null, toDisplayString(action.text), 1)
                ])
              ], 40, _hoisted_7)) : createCommentVNode("", true)
            ]);
          }), 128))
        ])
      ]);
    };
  }
};
const ActionsMenu = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e54fa3fe"]]);
export {
  ActionsMenu as A,
  COLORS_DICT as C,
  DetailItem as D,
  FORM_DIALOG_TYPES_DICT as F,
  SimpleDialog as S,
  _export_sfc as _,
  _sfc_main$3 as a,
  processEvent as p,
  useRequest as u
};
