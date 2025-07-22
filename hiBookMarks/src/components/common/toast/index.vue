<template>
  <div class="toast-wrapper" :class="{ show: show }">
    <div class="toast-content">
      <i class="toast-icon iconfont success" v-if="toastMsg.type == 'success'"
        >&#xe62e;</i
      >
      <i class="toast-icon iconfont error" v-if="toastMsg.type == 'error'"
        >&#xe60e;</i
      >
      <i class="toast-icon iconfont cancel" v-if="toastMsg.type == 'cancel'"
        >&#xe60e;</i
      >
      <i class="toast-icon iconfont wraning" v-if="toastMsg.type == 'wraning'"
        >&#xe6d5;</i
      >
      <span class="toast-text" :class="toastMsg.type">{{ toastMsg.text }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, watch } from "vue";
import "./toast.scss";

const props = defineProps({
  value: Boolean,
  toastMsg: Object,
});

const emit = defineEmits(["toast-hide"]);

const time = ref(2000);
const show = ref(false);

onMounted(() => {
  if (props.value) {
    time.value = 2000;
    show.value = true;
  }
});

watch(show, (val) => {
  if (val) {
    setTimeout(() => {
      show.value = false;
      emit("toast-hide");
    }, time.value);
  }
});

watch(
  () => props.value,
  (val) => {
    show.value = val;
  }
);
</script> 