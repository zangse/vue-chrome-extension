<template>
  <li
    class="extension-item"
    :class="{
      enable: extendItem.enabled && extendItem.isOperatable,
      disable: !extendItem.enabled,
      readonly: !extendItem.isOperatable,
    }"
  >
    <div class="extension-content" @click.stop="toggle(extendItem)">
      <span class="extension-icon">
        <img :src="showIcon" v-if="showIcon" />
      </span>
      <div class="extension-body">
        <p class="item-title">{{ extendItem.name }}</p>
        <p class="version">
          <i class="iconfont">&#xe601;</i><span>{{ extendItem.version }}</span>
          <span
            v-if="extendItem.statusText"
            class="status-tag"
            :class="getStatusClass(extendItem)"
            >{{ extendItem.statusText }}</span
          >
        </p>
      </div>
      <span class="option">
        <i
          class="iconfont option-icon view"
          :class="{ disabled: !extendItem.homepageUrl }"
          @click.stop="openOnNewTab(extendItem.homepageUrl)"
          >&#xe619;</i
        >
        <i
          class="iconfont option-icon config"
          :class="{ disabled: !extendItem.optionsUrl }"
          @click.stop="openOnNewTab(extendItem.optionsUrl)"
          >&#xe602;</i
        >
        <i
          class="iconfont option-icon uninstall"
          :class="{ disabled: isUninstallDisabled(extendItem) }"
          @click.stop="unInstall(extendItem)"
          >&#xe642;</i
        >
      </span>
    </div>
  </li>
</template>

<script setup>
import { computed } from 'vue'

// 定义props
const props = defineProps({
  extendItem: {
    type: Object,
    required: true,
  },
})

// 定义emits
const emit = defineEmits(['setEnabled'])

// 切换扩展启用/禁用状态
const toggle = (item) => {
  // 检查扩展是否可以操作
  if (!item.isOperatable) {
    console.log('扩展不能被操作:', item.name, '原因:', item.statusText)
    return
  }

  item.enabled = !item.enabled
  chrome.management.setEnabled(item.id, item.enabled, () => {
    if (chrome.runtime.lastError) {
      console.error('修改扩展状态失败:', chrome.runtime.lastError.message)
      // 恢复原状态
      item.enabled = !item.enabled
      return
    }
    emit('setEnabled')
  })
}

// 在新标签页打开URL
const openOnNewTab = (url) => {
  if (!url) {
    return
  }
  const newTab = {
    url: url,
    active: true,
  }
  chrome.tabs.create(newTab, () => {})
}

// 卸载扩展
const unInstall = (item) => {
  // 检查扩展是否可以卸载
  // 系统管理的扩展（如企业策略安装的）通常不能卸载
  if (item.installType === 'admin' || item.installType === 'policy') {
    console.log('扩展不能被卸载:', item.name, '安装类型:', item.installType)
    return
  }

  chrome.management.uninstall(item.id, { showConfirmDialog: true }, () => {
    if (chrome.runtime.lastError) {
      console.error('卸载扩展失败:', chrome.runtime.lastError.message)
      return
    }
    emit('setEnabled')
  })
}

// 获取状态标签的CSS类
const getStatusClass = (item) => {
  // 管理员或策略安装的扩展
  if (item.installType === 'admin' || item.installType === 'policy') {
    return 'admin-managed'
  }

  // 系统管理的扩展
  if (!item.mayDisable && !item.mayEnable) {
    return 'system-managed'
  }

  if (item.enabled) {
    // 扩展已启用
    if (item.mayDisable) {
      return '' // 正常启用状态不需要样式
    } else {
      return 'enabled-locked' // 已启用但不可禁用
    }
  } else {
    // 扩展已禁用
    if (item.mayEnable) {
      return '' // 正常禁用状态不需要样式
    } else {
      return 'chrome-disabled' // Chrome禁用且不可启用
    }
  }
}

// 判断扩展是否不能卸载
const isUninstallDisabled = (item) => {
  return item.installType === 'admin' || item.installType === 'policy'
}

// 计算属性：显示图标
const showIcon = computed(() => {
  let result = ''
  if (props.extendItem.icons && props.extendItem.icons.length > 0) {
    const length = props.extendItem.icons.length
    result = props.extendItem.icons[length - 1].url
  }
  return result
})
</script>

<style lang="scss" scoped src="./treeitem.scss">
</style>