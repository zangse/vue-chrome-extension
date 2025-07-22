<template>
  <div class="sidebar">
    <ul class="nav-list">
      <li class="item" :class="{ active: currentSelectedLocal == '-1' }">
        <span @click="targetItem(-1, historyNode)"
          ><span class="iconfont icon-default font-18">&#xe6d1;</span
          ><span>{{ i18n.browsingHistory }}</span></span
        >
      </li>
      <li class="item" :class="{ active: currentSelectedLocal == '0' }">
        <span @click="targetItem(0, allNode)"
          ><span class="iconfont icon-default">&#xe63a;</span
          ><span>{{ i18n.allBookmarks }}</span></span
        >
      </li>
      <li class="item" :class="{ active: currentSelectedLocal == '1' }">
        <span @click="targetItem(1, bookmarksNode)">
          <span class="iconfont icon-default">&#xe650;</span
          ><span>{{ i18n.bookmarksBar }}</span></span
        >
      </li>
      <li
        class="item"
        v-for="item in folders"
        :key="item.id"
        :class="{ active: currentSelectedLocal == item.id }"
        @click="targetItem(1, item)"
      >
        <span v-if="!item.children">
          <span class="icon"><img :src="getFaviconUrl(item.url)" /></span>
          <span class="title">{{ item.title }}</span>
        </span>
        <span v-if="item.children">
          <span class="iconfont folder-icon">&#xe632;</span>
          <span class="title">{{ item.title }}</span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, onMounted } from "vue";
import { getFaviconUrl } from "../../../utils/favicon.js";
import "./sidebar.scss";

const props = defineProps({
  folders: Array,
  bookmarksNode: Object,
  currentSelected: String,
});

const emit = defineEmits(["currentSelected", "loadItem"]);

const currentSelectedLocal = ref(0);
const historyNode = reactive({ id: -1 });
const allNode = reactive({ id: 0 });
const i18n = reactive({
  browsingHistory: "",
  bookmarksBar: "",
  allBookmarks: "",
});

onMounted(() => {
  i18n.allBookmarks = chrome.i18n.getMessage("allBookmarks");
  i18n.browsingHistory = chrome.i18n.getMessage("browsingHistory");
  i18n.bookmarksBar = chrome.i18n.getMessage("bookmarksBar");
});

const targetItem = (type, item) => {
  currentSelectedLocal.value = item.id;
  emit("currentSelected", currentSelectedLocal.value);
  emit("loadItem", type, item);
};
</script> 