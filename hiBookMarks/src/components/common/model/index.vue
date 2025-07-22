<template>
  <div class="model-wrapper" :class="{ show: showModel }">
    <div class="model-mask"></div>
    <transition name="fade">
      <div class="model-body" v-if="showModel">
        <div class="model-header">
          <span class="header-title">{{ i18n.moveTo }}</span>
          <span class="float-r" @click="cancel"
            ><i class="iconfont close-icon">&#xe622;</i></span
          >
        </div>
        <div class="model-content">
          <ul class="folder-list">
            <treeitem
              v-for="item in allFolder"
              class="folder-item"
              :folders="item"
              :key="item.id"
              :selectedItem="selectedItem"
              @update:selectedItem="handleUpdate"
              :isAdding="isAdding"
              @updateAdding="handleAddUpdate"
            />
          </ul>
        </div>
        <div class="model-footer">
          <span class="btn-md float-l" @click="addFolder"
            ><i class="iconfont new-folder">&#xe632;</i></span
          >
          <span class="btn-md float-r confirm" @click="move">{{
            i18n.confirm
          }}</span>
          <span class="btn-md float-r" @click="cancel">{{ i18n.close }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, onMounted, watch } from "vue";
import treeitem from "../treeitem/index.vue";

const props = defineProps({
  value: Boolean,
  selectedItem: Object,
});

const emit = defineEmits(["updateShow", "updateMove", "update:selectedItem"]);

const allFolder = ref([]);
const isAdding = ref(false);
const showModel = ref(false);
const i18n = reactive({
  moveTo: "",
  confirm: "",
  close: "",
});

onMounted(() => {
  i18n.moveTo = chrome.i18n.getMessage("moveTo");
  i18n.confirm = chrome.i18n.getMessage("confirm");
  i18n.close = chrome.i18n.getMessage("close");
  isAdding.value = false;
  allFolder.value = [];
  loadALlFolder();
});

const loadALlFolder = () => {
  allFolder.value = [];
  chrome.bookmarks.getTree((treeNodes) => {
    allFolder.value = treeNodes[0].children;
  });
};

const addFolder = () => {
  if (!props.selectedItem) {
    return;
  }
  if (isAdding.value) {
    return;
  }
  isAdding.value = true;
  const newFolder = {
    title: "新建文件夹",
    parentId: props.selectedItem.id,
    type: "new",
  };
  if (!props.selectedItem.children) {
    props.selectedItem.children = [];
  }
  props.selectedItem.children.push(newFolder);
};

const cancel = () => {
  emit("updateShow");
};

const move = () => {
  emit("updateMove");
};

const handleAddUpdate = () => {
  isAdding.value = false;
};

const handleUpdate = (val) => {
  emit("update:selectedItem", val);
};

watch(
  () => props.value,
  (newVal) => {
    showModel.value = newVal;
  }
);
</script>

<style lang="scss" src="./model.scss"></style> 