<template>
  <div>
    <li v-if="!folders.url" @click.stop="toggle($event, folders)">
      <div class="folder-body" :class="{ checked: isChecked }">
        <i class="iconfont expend-icon" v-if="!isOpen && isFolder">&#xe60c;</i>
        <i class="iconfont expend-icon" v-if="isOpen && isFolder">&#xe6b1;</i>
        <i class="expend-icon" v-if="!isFolder"></i>
        <span class="iconfont folder-icon">&#xe632;</span>
        <span>{{ folders.title }}</span>
      </div>
      <ul v-show="folders.children && isOpen" :class="{ expend: isOpen }">
        <TreeItem
          v-for="child in folders.children"
          :folders="child"
          :key="child.id"
        />
      </ul>
    </li>
    <li
      v-if="folders.url"
      @click.stop="openOnNewTab($event, folders)"
      @mouseup.middle="openOnNewTab($event, folders, true)"
    >
      <div class="folder-body">
        <i class="expend-icon"></i>
        <span class="folder-icon"
          ><img :src="getFaviconUrl(folders.url)" alt=""
        /></span>
        <span class="item-title">{{ folders.title }}</span>
      </div>
    </li>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from "vue";
import { getFaviconUrl } from "../../../src/utils/favicon.js";

const props = defineProps({
  folders: {
    type: Object,
    required: true,
  },
});

const isOpen = ref(false);
const selectedItem = ref(null);

const toggle = (e, item) => {
  if (e.type === "mouseenter" && isOpen.value) {
    return;
  } else {
    isOpen.value = !isOpen.value;
    selectedItem.value = item;
  }
};

const openOnNewTab = (e, item, type) => {
  console.log(e);
  if (!item.url) {
    return;
  }
  const newTab = {
    url: item.url,
    active: true,
  };
  if (type) {
    newTab.active = false;
  }
  chrome.tabs.create(newTab, () => {
    // console.log('1111')
  });
};

const isFolder = computed(() => {
  return props.folders.children && props.folders.children.length > 0;
});

const isChecked = computed(() => false); // 需要根据实际需求定义
</script>

<style lang="scss" scoped src="./index.scss"></style>