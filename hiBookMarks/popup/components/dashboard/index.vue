<template>
  <div class="wrapper" @keyup.tab="tabCall($event)">
    <div class="header">
      <span class="search-input">
        <input
          class="search"
          type="text"
          v-model="searchItem"
          v-bind:placeholder="i18n.searchPlaceholder"
          tabindex="0"
        />
        <i
          class="iconfont clear-icon"
          v-if="searchItem.length > 0 && isSearch"
          @click.stop="cleanSearch"
          >&#xe609;</i
        >
        <i class="iconfont serach-icon">&#xe60d;</i></span
      >
      <span @click="goHome" class="home"><i class="iconfont">&#xe601;</i></span>
    </div>
    <div class="main-content">
      <ul class="search-list" v-if="isSearch" @keyup.enter="openByTab($event)">
        <template v-if="searchList.length > 0">
          <a
            v-for="(item, index) in searchList"
            :key="item.id"
            class="list-item"
            @click.stop="openOnNewTab(item)"
            :class="{ selected: selectedId == item.id }"
            v-bind:tabindex="index + 1"
          >
            <i class="icon"><img :src="getFaviconUrl(item.url)" /></i>
            <span class="title" v-if="item.title">{{ item.title }}</span>
            <span class="title" v-if="!item.title">{{ item.url }}</span>
          </a>
        </template>
        <li class="no-reault" v-if="searchList.length == 0">
          {{ i18n.noMatchResult }}
        </li>
      </ul>
      <ul class="tree-list" v-if="!isSearch">
        <TreeItem
          v-for="item in allNodes"
          class="folder-item"
          :folders="item"
          :key="item.id"
        />
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import TreeItem from "../treeItem/index.vue";
import { getFaviconUrl } from "../../../src/utils/favicon.js";

const searchItem = ref("");
const allNodes = ref([]);
const isSearch = ref(false);
const searchList = ref([]);
const selectedId = ref(null);
const i18n = reactive({
  searchPlaceholder: "",
  noMatchResult: "",
});

onMounted(() => {
  i18n.searchPlaceholder = chrome.i18n.getMessage("searchPlaceholder");
  i18n.noMatchResult = chrome.i18n.getMessage("noMatchResult");
  loadAllNodes();
});

const loadAllNodes = () => {
  allNodes.value = [];
  chrome.bookmarks.getTree((treeNodes) => {
    console.log(treeNodes);
    allNodes.value = treeNodes[0].children;
    console.log(allNodes.value);
  });
};

const goHome = () => {
  chrome.tabs.create({
    url: "index.html",
    selected: true,
  });
};

const searchBookmarks = () => {
  if (searchItem.value === "") {
    return;
  }
  isSearch.value = true;
  chrome.bookmarks.search(searchItem.value, (data) => {
    console.log(data);
    searchList.value = data.filter(getTab);
  });
};

const cleanSearch = () => {
  searchItem.value = "";
  isSearch.value = false;
};

const openOnNewTab = (item) => {
  if (!item.url) {
    return;
  }
  const newTab = {
    url: item.url,
    active: true,
  };
  chrome.tabs.create(newTab);
};

const tabCall = (e) => {
  console.log(e.target);
  const tabIndex = e.target.tabIndex;
  if (!isSearch.value || searchList.value.length === 0) {
    return;
  }
  if (searchList.value[tabIndex - 1]) {
    selectedId.value = searchList.value[tabIndex - 1].id;
  }
};

const openByTab = (e) => {
  if (searchList.value.length === 0 || !selectedId.value) {
    return;
  }
  console.log("enter");
  console.log(e.target.tabIndex);
  const tabIndex = e.target.tabIndex;
  const newTab = searchList.value[tabIndex - 1];
  openOnNewTab(newTab);
};

const getTab = (item) => {
  return item.url;
};

watch(searchItem, (newVal) => {
  if (newVal.length === 0) {
    console.log(newVal);
    selectedId.value = null;
    isSearch.value = false;
  } else {
    selectedId.value = null;
    searchBookmarks();
  }
});
</script>

<style lang="scss" scoped src="./index.scss"></style>