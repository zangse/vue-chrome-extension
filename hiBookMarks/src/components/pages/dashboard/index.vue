<template>
  <div class="wrapper">
    <BookHeader
      :allNodes="allNodes"
      :selectedNode="selectedNode"
      @isSearching="isSearchingHandler"
      @cleanSearch="cleanSearchHandler"
      @cancelSelected="cancelSelectedHandler"
      @reloadCurrent="reloadCurrentHandler"
      :showMode="showMode"
      @toggleMode="toggleModeHandler"
      :isColorful="isColorful"
      @toggleColor="toggleColorHandler"
      :isHistory="isHistory"
      :autofocus="autofocus"
      @toast-show="toastShowHandler"
    />
    <Sidebar
      :folders="allFolder"
      @loadALL="loadALLHandler"
      :currentSelected="currentSelected"
      @currentSelected="currentSelectedHandler"
      @loadItem="loadItemHandler"
      :bookmarksNode="bookmarksNode"
    />
    <div class="content">
      <div class="topbar">
        <div class="tag-name">
          {{ currentNode.title }}
        </div>
        <ul class="tag-list" v-if="topbarList.length > 0">
          <li
            v-for="(item, index) in topbarList"
            :key="item.id"
            class="tag-item"
            :class="{ current: currentNode.id == item.id }"
            :style="{ 'z-index': 100 - index }"
            @click="getChildren(item, index)"
          >
            {{ item.title }}
          </li>
        </ul>
      </div>
      <ul class="bookmarks-list">
        <BookmarkItem
          :bookmarkitem="item"
          v-for="item in allNodes"
          :key="item.id"
          :selectedNode="selectedNode"
          @updateSelected="updateSelected"
          @click.native="getChildren(item)"
          :showMode="showMode"
          :isColorful="isColorful"
          :isHistory="isHistory"
        />
      </ul>
      <div v-if="isSearching && allNodes.length === 0" class="no-reault">
        {{ i18n.noMatchResult }}
      </div>
    </div>
    <Slider
      :selectedNode="selectedNode"
      @editNode="editNodeHandler"
      @toast-show="toastShowHandler"
    />
    <Toast
      v-model="showToast"
      :toastMsg="toastMsg"
      @toast-hide="toastHideHandler"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import BookmarkItem from "../../common/bookmarkItem/index.vue";
import Sidebar from "../../common/sidebar/index.vue";
import BookHeader from "../../common/header/index.vue";
import Slider from "../../common/slider/index.vue";
import Toast from "../../common/toast/index.vue";
import { getFaviconUrl } from "../../../utils/favicon.js";
import "./dashboard.scss";

const allNodes = ref([]);
const allFolder = ref([]);
const currentNode = ref({});
const currentSelected = ref(0);
const rootNode = reactive({
  title: "",
  id: "0",
});
const bookmarksNode = ref({});
const topbarList = ref([]);
const selectedNode = ref([]);
const isSearching = ref(false);
const isHistory = ref(false);
const showMode = ref(2);
const isColorful = ref(false);
const maxResults = ref(10000);
const startTime = ref(null);
const endTime = ref(null);
const autofocus = ref(true);
const showToast = ref(false);
const toastMsg = reactive({
  text: "",
  type: "wraning",
  padding: "22px",
});
const i18n = reactive({
  noMatchResult: "",
  searchText: "",
  allBookmarks: "",
  operateSuccess: "",
  browsingHistory: "",
});

onMounted(() => {
  i18n.noMatchResult = chrome.i18n.getMessage("noMatchResult");
  i18n.allBookmarks = chrome.i18n.getMessage("allBookmarks");
  i18n.operateSuccess = chrome.i18n.getMessage("operateSuccess");
  i18n.searchText = chrome.i18n.getMessage("searchText");
  i18n.browsingHistory = chrome.i18n.getMessage("browsingHistory");
  console.log(i18n.allBookmarks);
  rootNode.title = i18n.allBookmarks;
  toastMsg.text = i18n.operateSuccess;
  loadBookmarks();
});

const loadBookmarks = () => {
  allNodes.value = [];
  isHistory.value = false;
  chrome.bookmarks.getTree((treeNodes) => {
    allFolder.value = treeNodes[0].children[0].children;
    bookmarksNode.value = treeNodes[0].children[0];
    currentNode.value = JSON.parse(JSON.stringify(rootNode));
    topbarList.value = [];
    topbarList.value.push(rootNode);
    excuTree(allFolder.value);
  });
};

const loadHistory = () => {
  isHistory.value = true;
  allNodes.value = [];
  let nodes = [];
  startTime.value = null;
  console.log(startTime.value);
  const searchObj = {
    text: "",
    startTime: startTime.value,
    maxResults: maxResults.value,
  };
  chrome.history.search(searchObj, (data) => {
    nodes = data.filter((item) => {
      return item;
    });
    nodes.sort(sortRule);
    console.log(nodes);
    currentNode.value = {
      title: i18n.browsingHistory,
    };
    topbarList.value = [];
    allNodes.value = nodes;
  });
};

const getTimeStamp = (day) => {
  const date = new Date();
  const timeStamp = date.getTime();
  return (timeStamp - 24 * 3600 * 1000 * day) / 1000;
};

const sortRule = (a, b) => {
  return b.visitCount - a.visitCount;
};

const excuTree = (treeNodes) => {
  treeNodes.forEach((item) => {
    if (item.children) {
      excuTree(item.children);
    } else {
      item.icon = getFaviconUrl(item.url);
      allNodes.value.push(item);
    }
  });
};

const getChildren = (item, index) => {
  isSearching.value = false;
  isHistory.value = false;
  // 如果有 文件夹或书签被选中，则不跳转或打开
  if (selectedNode.value.length > 0) {
    return;
  }
  let treeNodes = [];
  const node = JSON.parse(JSON.stringify(item));
  if (node.id === "0") {
    loadBookmarks();
  } else if (node.url) {
    openOnNewTab(node);
  } else {
    selectedNode.value = [];
    delete node.children;
    currentNode.value = node;
    if (index !== null && index !== undefined) {
      currentSelected.value = item.id;
      if (index >= 0) {
        topbarList.value = topbarList.value.slice(0, index + 1);
      }
    } else {
      const length = topbarList.value.length;
      if (length === 0) {
        topbarList.value = [];
        topbarList.value.push(rootNode);
        topbarList.value.push(bookmarksNode.value);
        if (bookmarksNode.value.id !== node.id) {
          topbarList.value.push(node);
        }
      } else {
        if (node.id === 1 && length >= 2) {
          topbarList.value = topbarList.value.slice(0, 2);
        } else if (node.id === 1 && length === 1) {
          topbarList.value = [];
          topbarList.value.push(rootNode);
          topbarList.value.push(bookmarksNode.value);
        } else if (topbarList.value[length - 1].id === node.parentId) {
          topbarList.value.push(node);
        } else if (topbarList.value[length - 1].parentId === node.parentId) {
          topbarList.value.splice(length - 1, 1, node);
        } else {
          topbarList.value = [];
          topbarList.value.push(rootNode);
          topbarList.value.push(bookmarksNode.value);
          topbarList.value.push(node);
        }
      }
    }
    treeNodes = chrome.bookmarks.getChildren(item.id, (nodes) => {
      console.log(nodes);
      allNodes.value = nodes.sort(listSort);
    });
  }
};

const listSort = (x, y) => {
  // console.log(x, y)
  if (x.url && !y.url) {
    return 1;
  } else if (!x.url && y.url) {
    return -1;
  } else if ((x.url && y.url) || (!x.url && !y.url)) {
    // 按照首字母顺序排序
    return x.title.localeCompare(y.title, "zh-Hans-CN");
  }
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

const updateSelected = (selectedNodeValue) => {
  selectedNode.value = selectedNodeValue;
  console.log(selectedNode.value);
};

const loadALLHandler = () => {
  loadBookmarks();
};

const loadItemHandler = (type, item) => {
  if (type === 0) {
    loadBookmarks();
  } else if (type === 1) {
    return item.url ? openOnNewTab(item) : getChildren(item);
  } else if (type === -1) {
    loadHistory();
  }
};

const isSearchingHandler = (data) => {
  isSearching.value = true;
  allNodes.value = data.sort(listSort);
  currentNode.value.title = i18n.searchText;
  topbarList.value = [];
};

const cleanSearchHandler = () => {
  selectedNode.value = [];
  currentSelected.value = 0;
  getChildren(bookmarksNode.value);
};

const cancelSelectedHandler = () => {
  selectedNode.value = [];
};

// 删除，移动操作，刷新当前节点
const reloadCurrentHandler = () => {
  selectedNode.value = [];
  console.log(currentNode.value);
  currentNode.value.id && getChildren(currentNode.value);
};

const editNodeHandler = (data) => {
  console.log("editNodeHandler");
  console.log(data);
};

const toastHideHandler = () => {
  showToast.value = false;
};

const toggleModeHandler = () => {
  console.log("toggleModeHandler");
  showMode.value = showMode.value === 1 ? 2 : 1;
};

const toggleColorHandler = () => {
  console.log("toggleColorHandler");
  isColorful.value = !isColorful.value;
};

const currentSelectedHandler = (data) => {
  currentSelected.value = data;
};

const toastShowHandler = (data) => {
  console.log("toastHideHandler");
  console.log(data);
  toastMsg.type = data.type ? data.type : "success";
  toastMsg.text = data.text ? data.text : i18n.operateSuccess;
  toastMsg.padding = data.padding ? data.padding : "22px";
  showToast.value = true;
};
</script> 