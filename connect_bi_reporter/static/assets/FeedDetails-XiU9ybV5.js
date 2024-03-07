import { s, a as s$1, V } from "./connect-CncOCzNp.js";
import { o as openBlock, b as createElementBlock, g as renderSlot, n as normalizeClass, m as mergeModels, u as useModel, r as reactive, s as watch, x as createBlock, k as withCtx, j as createVNode, l as createTextVNode, t as toDisplayString, c as computed, h as unref, F as Fragment, f as renderList, d as createBaseVNode, e as createCommentVNode, p as pushScopeId, q as popScopeId, M as useRoute, J as useRouter, a as ref } from "./vendor-DqRMwRLa.js";
import { D as DestinationTab, _ as _sfc_main$5, v as validationRules, S as STATUSES, g as getFileSize, a as STATUSES_DICT, L as LoadingIndicator, b as _sfc_main$6, c as _sfc_main$7, d as downloader, e as _sfc_main$8 } from "./main-D2WDdAcd.js";
import { _ as _export_sfc, u as useRequest, D as DetailItem, C as COLORS_DICT, A as ActionsMenu } from "./ActionsMenu-D7LkUb7G.js";
const _sfc_main$4 = {
  __name: "DetailItemGroup",
  props: {
    separated: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["detail-item-group", { "detail-item-group_separated": __props.separated }])
      }, [
        renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ], 2);
    };
  }
};
const DetailItemGroup = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-98561949"]]);
const _sfc_main$3 = {
  __name: "EditFeedDialog",
  props: /* @__PURE__ */ mergeModels({
    feed: {
      type: Object,
      required: true
    }
  }, {
    "modelValue": {
      type: Boolean,
      default: false
    },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["updated"], ["update:modelValue"]),
  setup(__props, { emit: __emit }) {
    const isDialogOpen = useModel(__props, "modelValue");
    const props = __props;
    const emit = __emit;
    const toolkit = s();
    const { request } = useRequest(toolkit, true);
    const form = reactive({
      credentialId: "",
      fileName: "",
      description: ""
    });
    const rules = {
      credentialId: [validationRules.required()],
      fileName: [validationRules.required()]
    };
    const tabs = [
      {
        key: "destination",
        label: "Destination",
        includes: ["credentialId", "fileName"]
      }
    ];
    const updateFeed = async () => {
      await request(`/api/feeds/${props.feed.id}`, "PUT", {
        credential: { id: form.credentialId },
        file_name: form.fileName,
        description: form.description
      });
      emit("updated");
    };
    watch(
      [() => props.feed, isDialogOpen],
      () => {
        var _a;
        form.credentialId = ((_a = props.feed.credential) == null ? void 0 : _a.id) || "";
        form.fileName = props.feed.file_name || "";
        form.description = props.feed.description || "";
      },
      { immediate: true }
    );
    return (_ctx, _cache) => {
      return openBlock(), createBlock(_sfc_main$5, {
        modelValue: isDialogOpen.value,
        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => isDialogOpen.value = $event),
        form,
        onSubmit: updateFeed,
        rules,
        tabs,
        title: "Edit Feed",
        mode: "edit"
      }, {
        destination: withCtx(() => [
          createVNode(DestinationTab, {
            "credential-id": form.credentialId,
            "onUpdate:credentialId": _cache[0] || (_cache[0] = ($event) => form.credentialId = $event),
            "file-name": form.fileName,
            "onUpdate:fileName": _cache[1] || (_cache[1] = ($event) => form.fileName = $event),
            description: form.description,
            "onUpdate:description": _cache[2] || (_cache[2] = ($event) => form.description = $event)
          }, null, 8, ["credential-id", "file-name", "description"])
        ]),
        _: 1
      }, 8, ["modelValue", "form"]);
    };
  }
};
const _hoisted_1$2 = { class: "link-button reset-button" };
const _sfc_main$2 = {
  __name: "LinkButton",
  props: {
    text: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("button", _hoisted_1$2, [
        renderSlot(_ctx.$slots, "default", {}, () => [
          createTextVNode(toDisplayString(__props.text), 1)
        ], true)
      ]);
    };
  }
};
const LinkButton = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-fb10cc6c"]]);
const _withScopeId$1 = (n) => (pushScopeId("data-v-6192f044"), n = n(), popScopeId(), n);
const _hoisted_1$1 = { class: "uploads-table" };
const _hoisted_2$1 = ["headers", "totalItems", "currentPage"];
const _hoisted_3$1 = {
  key: 0,
  class: "assistive-color"
};
const _hoisted_4$1 = { key: 3 };
const _hoisted_5$1 = ["iconName", "iconColor", "text"];
const _hoisted_6$1 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("span", { class: "dot-separator" }, null, -1));
const _hoisted_7$1 = {
  key: 4,
  class: "uploads-table__actions"
};
const _hoisted_8$1 = ["backgroundColor", "onClicked"];
const _hoisted_9$1 = ["color"];
const _sfc_main$1 = {
  __name: "UploadsTable",
  props: {
    feedId: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const { items, page, total, load, loading, next, previous } = s$1(
      `/api/feeds/${props.feedId}/uploads`
    );
    const getReportFileName = (id) => `${id}.zip`;
    const getReportDownloadUrl = (id) => `/public/v1/reporting/reports/${id}/download`;
    const preparedItems = computed(
      () => items.value.map((item) => ({
        id: item.id,
        date: item.events.updated.at,
        report: item.report,
        status: STATUSES[item.status],
        file: {
          name: getReportFileName(item.report.id),
          size: getFileSize(item.size || 0)
        },
        isFailed: item.status === STATUSES_DICT.FAILED
      }))
    );
    const isAnyUploadFailed = computed(() => preparedItems.value.some((item) => item.isFailed));
    const headers = computed(() => [
      { key: "date", text: "Date", width: "190px" },
      { key: "report", text: "Report" },
      { key: "file", text: "File", width: "165px" },
      { key: "status", text: "Status", width: "145px" },
      { key: "actions", width: isAnyUploadFailed.value ? "80px" : "36px" }
    ]);
    const retryAction = useRequest(s());
    const retryUpload = async (upload) => {
      await retryAction.request(`/api/feeds/${props.feedId}/uploads/${upload.id}/retry`, "POST");
      await load();
    };
    const downloadFile = ({ report }) => downloader(getReportDownloadUrl(report.id));
    const getUploadActions = (upload) => reactive([
      {
        icon: "googleRefreshBaseline",
        key: "retry",
        text: "Retry",
        loading: retryAction.loading,
        handler: () => retryUpload(upload)
      }
    ]);
    load();
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        unref(loading) ? (openBlock(), createBlock(LoadingIndicator, { key: 0 })) : (openBlock(), createElementBlock("ui-complex-table", {
          key: 1,
          headers: headers.value,
          totalItems: unref(total),
          currentPage: unref(page),
          fixed: "",
          onNextClicked: _cache[0] || (_cache[0] = (...args) => unref(next) && unref(next)(...args)),
          onPreviousClicked: _cache[1] || (_cache[1] = (...args) => unref(previous) && unref(previous)(...args))
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(preparedItems.value, (item) => {
            return openBlock(), createElementBlock("tr", {
              key: item.id,
              class: "uploads-table__row"
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(headers.value, (header) => {
                return openBlock(), createElementBlock("td", {
                  key: header.key
                }, [
                  header.key === "date" ? (openBlock(), createBlock(_sfc_main$6, {
                    key: 0,
                    date: item.date
                  }, null, 8, ["date"])) : header.key === "report" ? (openBlock(), createBlock(DetailItem, { key: 1 }, {
                    "body-text": withCtx(() => [
                      createVNode(_sfc_main$7, {
                        to: unref(V).reportDetails,
                        params: item.report.id
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item.report.id), 1)
                        ]),
                        _: 2
                      }, 1032, ["to", "params"])
                    ]),
                    _: 2
                  }, 1024)) : header.key === "file" ? (openBlock(), createElementBlock(Fragment, { key: 2 }, [
                    item.isFailed ? (openBlock(), createElementBlock("span", _hoisted_3$1, " — ")) : (openBlock(), createBlock(DetailItem, {
                      key: 1,
                      assistiveText: item.file.size
                    }, {
                      "body-text": withCtx(() => [
                        createVNode(LinkButton, {
                          text: item.file.name,
                          onClick: ($event) => downloadFile(item)
                        }, null, 8, ["text", "onClick"])
                      ]),
                      _: 2
                    }, 1032, ["assistiveText"]))
                  ], 64)) : header.key === "status" ? (openBlock(), createElementBlock("span", _hoisted_4$1, [
                    createBaseVNode("ui-status", {
                      iconName: item.status.icon,
                      iconColor: item.status.color,
                      text: item.status.text
                    }, null, 8, _hoisted_5$1),
                    item.isFailed ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
                      _hoisted_6$1,
                      createVNode(LinkButton, { text: "Details" })
                    ], 64)) : createCommentVNode("", true)
                  ])) : header.key === "actions" ? (openBlock(), createElementBlock("div", _hoisted_7$1, [
                    createBaseVNode("ui-button", {
                      class: "actions-button",
                      backgroundColor: unref(COLORS_DICT).WHITE,
                      height: "36px",
                      width: "36px",
                      onClicked: ($event) => downloadFile(item)
                    }, [
                      createBaseVNode("ui-icon", {
                        class: "actions-button__trigger-icon",
                        color: unref(COLORS_DICT).TEXT,
                        iconName: "googleFileDownloadBaseline"
                      }, null, 8, _hoisted_9$1)
                    ], 40, _hoisted_8$1),
                    item.isFailed ? (openBlock(), createBlock(ActionsMenu, {
                      key: 0,
                      actions: getUploadActions(item)
                    }, null, 8, ["actions"])) : createCommentVNode("", true)
                  ])) : createCommentVNode("", true)
                ]);
              }), 128))
            ]);
          }), 128))
        ], 40, _hoisted_2$1))
      ]);
    };
  }
};
const UploadsTable = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-6192f044"]]);
const _withScopeId = (n) => (pushScopeId("data-v-e3c1e02f"), n = n(), popScopeId(), n);
const _hoisted_1 = ["title"];
const _hoisted_2 = {
  slot: "actions",
  class: "header-actions"
};
const _hoisted_3 = ["backgroundColor", "color"];
const _hoisted_4 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("span", null, "Edit", -1));
const _hoisted_5 = [
  _hoisted_4
];
const _hoisted_6 = ["backgroundColor"];
const _hoisted_7 = ["color"];
const _hoisted_8 = { class: "header" };
const _hoisted_9 = ["iconName", "iconColor", "text"];
const _hoisted_10 = ["currentTab"];
const _hoisted_11 = {
  key: 0,
  slot: "general",
  class: "general-tab"
};
const _hoisted_12 = {
  key: 1,
  slot: "uploads",
  class: "uploads-tab"
};
const _sfc_main = {
  __name: "FeedDetails",
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const toolkit = s();
    const { loading, request, result: feed } = useRequest(toolkit);
    const feedId = computed(() => route.params.id);
    const feedStatus = computed(() => STATUSES[feed.status]);
    const tabs = [
      {
        value: "general",
        label: "General"
      },
      {
        value: "uploads",
        label: "Uploads"
      }
    ];
    const currentTab = ref("general");
    const goToFeeds = () => {
      router.replace({ name: "feeds" });
    };
    const loadFeed = () => request(`/api/feeds/${feedId.value}`);
    const setCurrentTab = ({ detail: tab }) => {
      currentTab.value = tab;
    };
    const isDialogOpen = ref(false);
    const openEditFeedDialog = () => {
      isDialogOpen.value = true;
    };
    watch(feedId, loadFeed, { immediate: true });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("ui-view", {
        title: feedId.value,
        assistiveTitle: "Feed Details",
        style: { "height": "inherit" },
        showBackButton: "",
        onGoBack: goToFeeds
      }, [
        unref(loading) ? (openBlock(), createBlock(LoadingIndicator, { key: 0 })) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          createBaseVNode("div", _hoisted_2, [
            createBaseVNode("ui-button", {
              class: "header-button",
              backgroundColor: unref(COLORS_DICT).WHITE,
              color: unref(COLORS_DICT).TEXT,
              height: "36px",
              onClicked: openEditFeedDialog
            }, _hoisted_5, 40, _hoisted_3),
            createVNode(_sfc_main$8, {
              feed: unref(feed),
              onEnabled: loadFeed,
              onDisabled: loadFeed,
              onUploaded: loadFeed,
              onDeleted: goToFeeds
            }, {
              default: withCtx(() => [
                createBaseVNode("ui-button", {
                  class: "header-button header-button_menu",
                  backgroundColor: unref(COLORS_DICT).WHITE,
                  height: "36px",
                  width: "36px"
                }, [
                  createBaseVNode("ui-icon", {
                    class: "header-button__trigger-icon",
                    color: unref(COLORS_DICT).TEXT,
                    iconName: "googleArrowDropDownBaseline"
                  }, null, 8, _hoisted_7)
                ], 8, _hoisted_6)
              ]),
              _: 1
            }, 8, ["feed"])
          ]),
          createBaseVNode("div", _hoisted_8, [
            createVNode(DetailItemGroup, null, {
              default: withCtx(() => [
                createVNode(DetailItem, { title: "Report Schedule" }, {
                  "body-text": withCtx(() => {
                    var _a;
                    return [
                      createVNode(_sfc_main$7, {
                        to: unref(V).reportsScheduleDetails,
                        params: (_a = unref(feed).schedule) == null ? void 0 : _a.id
                      }, {
                        default: withCtx(() => {
                          var _a2;
                          return [
                            createTextVNode(toDisplayString((_a2 = unref(feed).schedule) == null ? void 0 : _a2.id), 1)
                          ];
                        }),
                        _: 1
                      }, 8, ["to", "params"])
                    ];
                  }),
                  _: 1
                }),
                createVNode(DetailItem, { title: "Status" }, {
                  content: withCtx(() => [
                    feedStatus.value ? (openBlock(), createElementBlock("ui-status", {
                      key: 0,
                      iconName: feedStatus.value.icon,
                      iconColor: feedStatus.value.color,
                      text: feedStatus.value.text
                    }, null, 8, _hoisted_9)) : createCommentVNode("", true)
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          createBaseVNode("ui-tabs", {
            currentTab: currentTab.value,
            tabs,
            onClickTab: setCurrentTab
          }, [
            currentTab.value === "general" ? (openBlock(), createElementBlock("div", _hoisted_11, [
              createVNode(DetailItem, {
                title: "Credentials",
                bodyText: unref(feed).credential.id
              }, null, 8, ["bodyText"]),
              createVNode(DetailItem, { title: "Description" }, {
                "body-text": withCtx(() => [
                  createBaseVNode("span", {
                    class: normalizeClass({ "assistive-color": !unref(feed).description })
                  }, toDisplayString(unref(feed).description || "—"), 3)
                ]),
                _: 1
              }),
              createVNode(DetailItemGroup, { separated: "" }, {
                default: withCtx(() => [
                  createVNode(DetailItem, {
                    title: "Created",
                    assistiveText: unref(feed).events.created.by.id
                  }, {
                    "body-text": withCtx(() => [
                      createVNode(_sfc_main$6, {
                        date: unref(feed).events.created.at
                      }, null, 8, ["date"])
                    ]),
                    _: 1
                  }, 8, ["assistiveText"]),
                  createVNode(DetailItem, {
                    title: "Updated",
                    assistiveText: unref(feed).events.updated.by.id
                  }, {
                    "body-text": withCtx(() => [
                      createVNode(_sfc_main$6, {
                        date: unref(feed).events.updated.at
                      }, null, 8, ["date"])
                    ]),
                    _: 1
                  }, 8, ["assistiveText"])
                ]),
                _: 1
              })
            ])) : createCommentVNode("", true),
            currentTab.value === "uploads" ? (openBlock(), createElementBlock("div", _hoisted_12, [
              createVNode(UploadsTable, { feedId: feedId.value }, null, 8, ["feedId"])
            ])) : createCommentVNode("", true)
          ], 40, _hoisted_10)
        ], 64)),
        createVNode(_sfc_main$3, {
          modelValue: isDialogOpen.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isDialogOpen.value = $event),
          feed: unref(feed),
          onUpdated: loadFeed
        }, null, 8, ["modelValue", "feed"])
      ], 40, _hoisted_1);
    };
  }
};
const FeedDetails = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e3c1e02f"]]);
export {
  FeedDetails as default
};
