<template>
  <div class="confirm-wrapper" :class="{ show: show }">
    <div class="confirm-mask"></div>
    <transition name="fade">
      <div class="confirm-body" :style="confirmPadding" v-if="show">
        <div class="confirm-header">
          <span class="title">{{ i18n.tipsText }}</span>
        </div>
        <div class="confirm-content">
          <span class="confirm-icon iconfont wraning">&#xe6d5;</span>
          <span class="confirm-text">{{ confirmMsg.text }}</span>
        </div>
        <div class="confirm-footer">
          <span class="btn cancel" @click="onConfirm(1)">{{
            i18n.cancel
          }}</span>
          <span class="btn confirm" @click="onConfirm(2)">{{
            i18n.confirm
          }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, onMounted, watch } from "vue";
import "./confirm.scss";

const props = defineProps({
  value: Boolean,
  confirmMsg: Object,
});

const emit = defineEmits(["on-confirm"]);

const show = ref(false);
const i18n = reactive({
  tipsText: "",
  cancel: "",
  confirm: "",
});

onMounted(() => {
  i18n.tipsText = chrome.i18n.getMessage("tipsText");
  i18n.confirm = chrome.i18n.getMessage("confirm");
  i18n.cancel = chrome.i18n.getMessage("cancel");
  if (props.value) {
    show.value = true;
  }
});

const onConfirm = (type) => {
  if (!show.value) {
    return;
  }
  emit("on-confirm", type);
};

watch(
  () => props.value,
  (val) => {
    show.value = val;
  }
);
</script> 