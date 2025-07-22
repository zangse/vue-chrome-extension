<template>
  <li
    class="item-wrapper"
    :class="{ 'wra-col-5': showMode == 2, 'no-color': !isColorful }"
  >
    <div class="item" :class="{ 'folder-item': !bookmarkitem.url }">
      <div
        class="mask"
        :class="{ checked: isSelected(bookmarkitem) }"
        v-if="!isHistory"
      ></div>
      <span
        class="check-icon iconfont"
        :class="{ folder: !bookmarkitem.url }"
        @click.stop="checkItem(bookmarkitem)"
        v-if="!isSelected(bookmarkitem) && !isHistory"
        >&#xe637;</span
      >
      <span
        class="icon-checked iconfont"
        @click.stop="checkItem(bookmarkitem)"
        v-if="isSelected(bookmarkitem) && !isHistory"
        >&#xe614;</span
      >
      <span class="visited-count" v-if="isHistory">{{
        bookmarkitem.visitCount
      }}</span>
      <i class="item-light"></i>
      <div class="item-content">
        <div class="item-body">
          <div class="folder iconfont" v-if="!bookmarkitem.url">&#xe632;</div>
          <div class="link" v-if="bookmarkitem.url">
            <span class="icon-wrapper">
              <img :src="getFaviconUrl(bookmarkitem.url)" class="icon-item" />
            </span>
          </div>
        </div>
        <div class="item-footer">
          <span
            v-if="!bookmarkitem.url"
            class="title"
            :title="bookmarkitem.tiutle"
          >
            {{ bookmarkitem.title }}
          </span>
          <a v-if="bookmarkitem.url" class="title" :title="bookmarkitem.url">
            <span v-if="bookmarkitem.title">{{ bookmarkitem.title }}</span>
            <span v-if="!bookmarkitem.title">{{ bookmarkitem.url }}</span></a
          >
        </div>
      </div>
    </div>
  </li>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { getFaviconUrl } from "../../../utils/favicon.js";
import "./bookmarkItem.scss";

const props = defineProps({
  bookmarkitem: Object,
  selectedNode: Array,
  showMode: Number,
  isColorful: Boolean,
  isHistory: Boolean,
});

const emit = defineEmits(["updateSelected"]);

const checkItem = (item) => {
  const index = props.selectedNode.indexOf(item.id);
  if (index >= 0) {
    props.selectedNode.splice(index, 1);
  } else if (index === -1) {
    props.selectedNode.push(item.id);
  }
  emit("updateSelected", props.selectedNode);
};

const isSelected = (item) => {
  return props.selectedNode.indexOf(item.id) !== -1;
};
</script> 