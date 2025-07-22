<template>
  <div class="switch-container">
    <span
      class="switch"
      :class="{
        enabled: !disabled,
        disabled: disabled,
        expanded: showActionButtons,
      }"
      @click.stop="toggleActionButtons"
    >
      <img
        src="../../../assets/images/svg/plus.svg"
        class="plus-icon"
        alt="switch"
      />
    </span>

    <!-- 扇形按钮组 -->
    <div class="action-buttons" :class="{ active: showActionButtons }">
      <!-- 开启常用扩展 - 正左方 0度 -->
      <span class="action-btn btn-common" @click.stop="handleCommonExtensions">
        <span class="label">开启常用扩展</span>
        <img
          src="../../../assets/images/svg/par-close.svg"
          class="btn-icon"
          alt="常用扩展"
        />
      </span>

      <!-- 开启所有扩展 - 左下方 45度 -->
      <span class="action-btn btn-all" @click.stop="handleAllExtensions">
        <span class="label">开启所有扩展</span>
        <img
          src="../../../assets/images/svg/open.svg"
          class="btn-icon"
          alt="所有扩展"
        />
      </span>

      <!-- 关闭所有扩展 - 正下方 90度 -->
      <span
        class="action-btn btn-disable"
        @click.stop="handleDisableExtensions"
      >
        <span class="label">关闭所有扩展</span>
        <img
          src="../../../assets/images/svg/close.svg"
          class="btn-icon"
          alt="关闭扩展"
        />
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Props
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['enable-common', 'enable-all', 'disable-all', 'buttons-toggle'])

// 响应式数据
const showActionButtons = ref(false)

// 方法
const toggleActionButtons = () => {
  showActionButtons.value = !showActionButtons.value
  emit('buttons-toggle', showActionButtons.value)
}

const handleCommonExtensions = () => {
  emit('enable-common')
  showActionButtons.value = false
  emit('buttons-toggle', false)
}

const handleAllExtensions = () => {
  emit('enable-all')
  showActionButtons.value = false
  emit('buttons-toggle', false)
}

const handleDisableExtensions = () => {
  emit('disable-all')
  showActionButtons.value = false
  emit('buttons-toggle', false)
}

// 暴露方法给父组件
defineExpose({
  hideButtons: () => {
    showActionButtons.value = false
  },
})
</script>

<style lang="scss" scoped src="./index.scss"></style>