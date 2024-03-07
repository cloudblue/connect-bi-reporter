import { _ as _export_sfc, u as useRequest, a as _sfc_main$6, S as SimpleDialog, A as ActionsMenu, C as COLORS_DICT, D as DetailItem } from "./ActionsMenu-D7LkUb7G.js";
import { s, H, d as a, o, l, w, e as c, r, c as l$1 } from "./connect-CncOCzNp.js";
import { m as mergeModels, u as useModel, a as ref, c as computed, s as watch, o as openBlock, x as createBlock, k as withCtx, j as createVNode, b as createElementBlock, d as createBaseVNode, g as renderSlot, l as createTextVNode, t as toDisplayString, n as normalizeClass, r as reactive, h as unref, F as Fragment, f as renderList, p as pushScopeId, q as popScopeId, E as provide, H as normalizeStyle, I as createApp } from "./vendor-DqRMwRLa.js";
const _sfc_main$5 = {
  __name: "AddEditCredentialDialog",
  props: /* @__PURE__ */ mergeModels({
    mode: {
      type: String,
      required: true
    },
    credentialId: {
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
  emits: /* @__PURE__ */ mergeModels(["created", "edited"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const props = __props;
    const value = useModel(__props, "modelValue");
    const name = ref("");
    const connectionString = ref("");
    const isValid = computed(() => {
      var _a, _b;
      return ((_a = name.value) == null ? void 0 : _a.length) > 0 && ((_b = connectionString.value) == null ? void 0 : _b.length) > 0;
    });
    const isEditMode = computed(() => props.mode === "edit");
    const title = computed(() => isEditMode.value ? "Edit Credentials" : "Add Credentials");
    const submitLabel = computed(() => isEditMode.value ? "Save" : "Add");
    const actions = ["cancel", "submit"];
    const createCredentialAction = useRequest(s());
    const getCredential = async () => {
      const { result: credentialToEdit, request: credentialRequest } = useRequest(s());
      await credentialRequest(`/api/credentials/${props.credentialId}`);
      name.value = credentialToEdit.name;
      connectionString.value = credentialToEdit.connection_string;
    };
    const resetForm = () => {
      name.value = "";
      connectionString.value = "";
    };
    const submit = async () => {
      if (props.mode === "create") {
        const status = await createCredentialAction.request("/api/credentials", "POST", {
          name: name.value,
          connection_string: connectionString.value
        });
        if (status < 400)
          emit("created");
      } else {
        const status = await createCredentialAction.request(
          `/api/credentials/${props.credentialId}`,
          "PUT",
          {
            name: name.value,
            connection_string: connectionString.value
          }
        );
        if (status < 400)
          emit("edited");
      }
    };
    watch(
      () => value.value,
      () => {
        resetForm();
        if (props.mode === "edit")
          getCredential();
      },
      { immediate: true }
    );
    return (_ctx, _cache) => {
      return openBlock(), createBlock(SimpleDialog, {
        modelValue: value.value,
        "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => value.value = $event),
        title: title.value,
        actions,
        onSubmit: submit,
        height: "auto",
        width: "480px",
        submitLabel: submitLabel.value,
        isValid: isValid.value
      }, {
        default: withCtx(() => [
          createVNode(_sfc_main$6, {
            modelValue: name.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => name.value = $event),
            class: "dialog-input",
            label: "Name"
          }, null, 8, ["modelValue"]),
          createVNode(_sfc_main$6, {
            modelValue: connectionString.value,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => connectionString.value = $event),
            class: "dialog-input",
            label: "Connection String"
          }, null, 8, ["modelValue"])
        ]),
        _: 1
      }, 8, ["modelValue", "title", "submitLabel", "isValid"]);
    };
  }
};
const AddEditCredentialDialog = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-6d4e2352"]]);
const _hoisted_1$3 = { class: "alert" };
const _hoisted_2$2 = { class: "alert__icon" };
const _hoisted_3$1 = ["iconName", "color"];
const _hoisted_4$1 = { class: "alert__text" };
const _sfc_main$4 = {
  __name: "AlertItem",
  props: {
    message: {
      type: String,
      default: "List is empty. Please add item."
    },
    icon: {
      type: String,
      default: "googleInfoBaseline"
    },
    type: {
      type: String,
      default: "default"
    }
  },
  setup(__props) {
    const typeAlert = {
      info: "#0055ff",
      error: "#FF6A6A",
      success: "#0bb071",
      warning: "#FFC700",
      default: "#bdbdbd"
    };
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["alert-holder", `alert_${__props.type}`])
      }, [
        createBaseVNode("div", _hoisted_1$3, [
          createBaseVNode("div", _hoisted_2$2, [
            createBaseVNode("ui-icon", {
              iconName: __props.icon,
              color: typeAlert[__props.type],
              size: "24"
            }, null, 8, _hoisted_3$1)
          ]),
          createBaseVNode("div", _hoisted_4$1, [
            renderSlot(_ctx.$slots, "message", {}, () => [
              createTextVNode(toDisplayString(__props.message), 1)
            ], true)
          ])
        ])
      ], 2);
    };
  }
};
const AlertItem = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-1d238166"]]);
const _hoisted_1$2 = /* @__PURE__ */ createBaseVNode("br", null, null, -1);
const _hoisted_2$1 = /* @__PURE__ */ createBaseVNode("span", null, "You cannot undo this action once performed.", -1);
const _sfc_main$3 = {
  __name: "DeleteCredentialDialog",
  props: /* @__PURE__ */ mergeModels({
    credentialId: {
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
    const value = useModel(__props, "modelValue");
    const emit = __emit;
    const actions = ["cancel", "delete"];
    const { request } = useRequest(s());
    const deleteCredential = async () => {
      const status = await request(`/api/credentials/${props.credentialId}`, "DELETE");
      if (status < 400)
        emit("deleted");
    };
    return (_ctx, _cache) => {
      return openBlock(), createBlock(SimpleDialog, {
        modelValue: value.value,
        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => value.value = $event),
        actions,
        onSubmit: deleteCredential,
        height: "auto",
        title: "Delete Credential",
        width: "480px"
      }, {
        default: withCtx(() => [
          createBaseVNode("p", null, [
            createBaseVNode("span", null, "Are you sure you want to delete this credential (" + toDisplayString(__props.credentialId) + ")?", 1),
            _hoisted_1$2,
            _hoisted_2$1
          ])
        ]),
        _: 1
      }, 8, ["modelValue"]);
    };
  }
};
const _withScopeId = (n) => (pushScopeId("data-v-f4793745"), n = n(), popScopeId(), n);
const _hoisted_1$1 = {
  class: "credentials-card",
  title: "Credentials"
};
const _hoisted_2 = { slot: "actions" };
const _hoisted_3 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("ui-icon", {
  iconName: "googleAddBaseline",
  color: "#fff",
  size: "14"
}, null, -1));
const _hoisted_4 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("span", { class: "add-button-text" }, "Add", -1));
const _hoisted_5 = [
  _hoisted_3,
  _hoisted_4
];
const _hoisted_6 = ["headers"];
const _sfc_main$2 = {
  __name: "CredentialsCard",
  setup(__props) {
    const { result: credentials, request: credentialRequest } = useRequest(s(), false, true);
    credentialRequest("/api/credentials");
    const headers = reactive([
      { value: "name", text: "Name" },
      { value: "actions", text: "", width: "48px" }
    ]);
    const isAddEditDialogOpen = ref(false);
    const addEditDialogMode = ref("create");
    const isDeleteDialogOpen = ref(false);
    const deleteCredentialId = ref("");
    const editCredentialId = ref("");
    const openDeleteCredentialDialog = (id) => {
      deleteCredentialId.value = id;
      isDeleteDialogOpen.value = true;
    };
    const openAddEditCredentialDialog = (mode, credentialId) => {
      addEditDialogMode.value = mode;
      isAddEditDialogOpen.value = true;
      editCredentialId.value = credentialId;
    };
    const onUpdated = () => {
      credentialRequest("/api/credentials");
      isAddEditDialogOpen.value = false;
    };
    const onDeleted = () => {
      deleteCredentialId.value = "";
      isDeleteDialogOpen.value = false;
      credentialRequest("/api/credentials");
    };
    const getCredentialsActions = (id) => [
      {
        key: "edit",
        color: COLORS_DICT.TEXT,
        text: "Edit",
        icon: "googleEditBaseline",
        handler: () => openAddEditCredentialDialog("edit", id)
      },
      {
        separated: true,
        key: "delete",
        color: COLORS_DICT.NICE_RED,
        text: "Delete",
        icon: "googleDeleteForeverBaseline",
        handler: () => openDeleteCredentialDialog(id)
      }
    ];
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("ui-card", _hoisted_1$1, [
          createBaseVNode("div", _hoisted_2, [
            createBaseVNode("ui-button", {
              backgroundColor: "#2C98F0",
              width: "61px",
              height: "28px",
              onClick: _cache[0] || (_cache[0] = ($event) => openAddEditCredentialDialog("create"))
            }, _hoisted_5)
          ]),
          createBaseVNode("div", null, [
            unref(credentials).length > 0 ? (openBlock(), createElementBlock("ui-table", {
              key: 0,
              headers
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(credentials), (credential) => {
                return openBlock(), createElementBlock("tr", {
                  key: credential.id
                }, [
                  createBaseVNode("td", null, toDisplayString(credential.name), 1),
                  createBaseVNode("td", null, [
                    createVNode(ActionsMenu, {
                      class: "credentials-actions",
                      actions: getCredentialsActions(credential.id)
                    }, null, 8, ["actions"])
                  ])
                ]);
              }), 128))
            ], 8, _hoisted_6)) : (openBlock(), createBlock(AlertItem, {
              key: 1,
              message: "No credentials added"
            }))
          ])
        ]),
        createVNode(AddEditCredentialDialog, {
          modelValue: isAddEditDialogOpen.value,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => isAddEditDialogOpen.value = $event),
          mode: addEditDialogMode.value,
          credentialId: editCredentialId.value,
          onCreated: onUpdated,
          onEdited: onUpdated
        }, null, 8, ["modelValue", "mode", "credentialId"]),
        createVNode(_sfc_main$3, {
          modelValue: isDeleteDialogOpen.value,
          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => isDeleteDialogOpen.value = $event),
          credentialId: deleteCredentialId.value,
          onDeleted
        }, null, 8, ["modelValue", "credentialId"])
      ], 64);
    };
  }
};
const CredentialsCard = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-f4793745"]]);
const _hoisted_1 = {
  class: "upload-schedule-card",
  title: "Upload Schedule"
};
const _sfc_main$1 = {
  __name: "UploadScheduleCard",
  setup(__props) {
    const { result: uploadSchedule, request: uploadScheduleRequest } = useRequest(s());
    uploadScheduleRequest("/api/settings/schedule-tasks/create-uploads");
    const periodicityTextsDict = {
      days: "Daily",
      weeks: "Weekly"
    };
    const periodicityText = computed(() => {
      var _a;
      return periodicityTextsDict[(_a = uploadSchedule == null ? void 0 : uploadSchedule.trigger) == null ? void 0 : _a.unit];
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("ui-card", _hoisted_1, [
        createBaseVNode("div", null, [
          createVNode(DetailItem, {
            bodyText: periodicityText.value,
            assistiveText: "00:00 · UTC"
          }, null, 8, ["bodyText"])
        ])
      ]);
    };
  }
};
const UploadScheduleCard = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-cc40f2b1"]]);
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
        createVNode(UploadScheduleCard),
        createVNode(CredentialsCard)
      ], 4);
    };
  }
};
const MainPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2073f1a4"]]);
H({
  "ui-table": a,
  "ui-icon": o,
  "ui-button": l,
  "ui-menu": w,
  "ui-card": c,
  "ui-textfield": r
}).then((toolkitInstance) => {
  const app = createApp(MainPage);
  app.use(l$1, toolkitInstance);
  app.mount("#app");
});
