<template>
  <ul
    class="slider-warpper"
    :class="{ show: selectedNode.length == 1, hide: selectedNode.length !== 1 }"
  >
    <li class="item">
      <span class="title">{{ i18n.bookmarksEdit }}</span>
    </li>
    <li class="item">
      <div class="icon-wrapper">
        <span class="icon-content">
          <img :src="nodeIcon" />
        </span>
      </div>
    </li>
    <li class="item input-group">
      <span class="input-label">{{ i18n.title }}:</span>
      <input type="text" class="input-edit" v-model="currentNode.title" />
    </li>
    <li class="item input-group" v-if="!currentNode.dateGroupModified">
      <span class="input-label">{{ i18n.url }}:</span>
      <input type="text" class="input-edit" v-model="currentNode.url" />
    </li>
    <li class="item">
      <span class="btn cancel" @click="cancel">{{ i18n.cancel }}</span>
      <span class="btn save" @click="save">{{ i18n.save }}</span>
    </li>
  </ul>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, onMounted, watch } from "vue";
import { getFaviconUrl } from "../../../utils/favicon.js";
import "./slider.scss";

const props = defineProps({
  selectedNode: Array,
});

const emit = defineEmits(["editNode", "toast-show"]);

const isShow = ref(false);
const currentNode = ref({});
const nodeIcon = ref("");
const i18n = reactive({
  bookmarksEdit: "",
  title: "",
  url: "",
  cancel: "",
  save: "",
  editCancel: "",
  editSuccess: "",
});

onMounted(() => {
  i18n.bookmarksEdit = chrome.i18n.getMessage("bookmarksEdit");
  i18n.title = chrome.i18n.getMessage("title");
  i18n.url = chrome.i18n.getMessage("url");
  i18n.cancel = chrome.i18n.getMessage("cancel");
  i18n.save = chrome.i18n.getMessage("save");
  i18n.editCancel = chrome.i18n.getMessage("editCancel");
  i18n.editSuccess = chrome.i18n.getMessage("editSuccess");
});

watch(
  () => props.selectedNode,
  (val) => {
    if (val.length === 1) {
      loadCurrent(val[0]);
    }
  }
);

const loadCurrent = (data) => {
  chrome.bookmarks.get(data, (res) => {
    console.log(res);
    if (res.length > 0) {
      currentNode.value = res[0];
      nodeIcon.value = getFaviconUrl(res[0].url);
    }
  });
};

const cancel = () => {
  props.selectedNode.length = 0;
  emit("editNode");
  const data = {
    type: "cancel",
    text: i18n.editCancel,
  };
  emit("toast-show", data);
};

const save = () => {
  chrome.bookmarks.update(
    currentNode.value.id,
    {
      title: currentNode.value.title,
      url: currentNode.value.url,
    },
    (res) => {
      console.log(res);
      const data = {
        type: "success",
        text: i18n.editSuccess,
      };
      emit("editNode");
      emit("toast-show", data);
    }
  );
};
</script>

<style lang="scss" src="./slider.scss"></style> 