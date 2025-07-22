<template>
  <div v-if="!folders.url" @click.stop="toggle(folders)">
    <div
      class="folder-body"
      :class="{ checked: isChecked }"
      v-if="!folders.type"
    >
      <i class="iconfont expend-icon" v-if="!isOpen && isFolder">&#xe60c;</i>
      <i class="iconfont expend-icon" v-if="isOpen && isFolder">&#xe6b1;</i>
      <i class="expend-icon" v-if="!isFolder"></i>
      <span class="iconfont folder-icon">&#xe632;</span>
      <span>{{ folders.title }}</span>
    </div>
    <div v-if="folders.type == 'new'">
      <i class="expend-icon"></i>
      <span class="iconfont folder-icon">&#xe632;</span>
      <input type="text" v-model="folders.title" />
      <span class="iconfont cancel-icon" @click.stop="cancel(folders)"
        >&#xe609;</span
      >
      <span class="iconfont confirm-icon" @click.stop="create(folders)"
        >&#xe6a7;</span
      >
    </div>
    <div v-if="folders.children && isOpen">
      <TreeItem
        v-for="child in folders.children"
        :folders="child"
        :key="child.id"
        :selectedItem="selectedItem"
        @update:selectedItem="handleUpdate"
        :isAdding="isAdding"
        @updateAdding="handleAddUpdate"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from "vue";

const props = defineProps({
  folders: Object,
  selectedItem: Object,
  isAdding: Boolean,
});

const emit = defineEmits(["update:selectedItem", "updateAdding"]);

const isOpen = ref(false);

const toggle = (item) => {
  isOpen.value = !isOpen.value;
  emit("update:selectedItem", item);
};

const handleUpdate = (val) => {
  emit("update:selectedItem", val);
};

const cancel = (item) => {
  if (props.selectedItem?.children) {
    const index = props.selectedItem.children.indexOf(item);
    props.selectedItem.children.splice(index, 1);
  }
  emit("updateAdding", false);
};

const create = (item) => {
  const newFolder = {
    title: item.title,
    parentId: item.parentId,
  };
  chrome.bookmarks.create(newFolder, (data) => {
    cancel(item);
    if (props.selectedItem?.children) {
      props.selectedItem.children.push(data);
    }
    emit("update:selectedItem", data);
  });
};

const handleAddUpdate = () => {
  emit("updateAdding", props.isAdding);
};

const isFolder = computed(() => {
  if (props.folders.children && props.folders.children.length > 0) {
    return props.folders.children.some((item) => item.dateGroupModified);
  }
  return false;
});

const isChecked = computed(() => {
  return props.selectedItem?.id === props.folders.id;
});
</script>

<style lang="scss" src="./treeitem.scss"></style> 