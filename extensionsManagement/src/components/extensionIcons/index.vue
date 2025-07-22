<template>
  <div class="extension-icons-container">
    <!-- 常用扩展栏 -->
    <div class="section">
      <h3 class="section-title">常用扩展</h3>
      <div class="icons-grid">
        <div
          v-for="extension in favoriteExtensions"
          :key="extension.id"
          class="extension-item favorite"
          @click="removeFavorite(extension.id)"
        >
          <div class="icon-wrapper">
            <img
              :src="getExtensionIcon(extension)"
              :alt="extension.name"
              class="extension-icon"
              @error="handleIconError"
            />
            <div class="tooltip">{{ extension.name }} - 点击移除</div>
          </div>
        </div>
        <div v-if="favoriteExtensions.length === 0" class="empty-placeholder">
          暂无常用扩展，点击下方扩展添加
        </div>
      </div>
    </div>

    <!-- 所有扩展栏 -->
    <div class="section">
      <h3 class="section-title">所有扩展</h3>
      <div class="icons-grid">
        <div
          v-for="extension in allExtensions"
          :key="extension.id"
          class="extension-item"
          :class="{
            'is-favorite': isFavorite(extension.id),
            disabled: !isExtensionOperable(extension),
          }"
          @click="
            isExtensionOperable(extension) ? toggleFavorite(extension.id) : null
          "
        >
          <div class="icon-wrapper">
            <img
              :src="getExtensionIcon(extension)"
              :alt="extension.name"
              class="extension-icon"
              @error="handleIconError"
            />
            <div
              v-if="isFavorite(extension.id)"
              class="favorite-indicator"
            ></div>
            <div class="tooltip">
              {{ extension.name }} -
              {{
                !isExtensionOperable(extension)
                  ? "不可操作的扩展"
                  : isFavorite(extension.id)
                  ? "点击移除常用"
                  : "点击添加到常用"
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Props
const props = defineProps({
  extensions: {
    type: Array,
    default: () => [],
  },
})

// Emits
const emit = defineEmits(['refresh'])

// 响应式数据
const STORAGE_KEY = 'extension-favorites'
const favoriteIds = ref([])

// 计算属性
const favoriteExtensions = computed(() => {
  return props.extensions.filter((ext) => favoriteIds.value.includes(ext.id))
})

const allExtensions = computed(() => {
  return props.extensions.filter((ext) => ext.type === 'extension')
})

// 获取扩展的操作状态（与dashboard组件保持一致）
const getExtensionOperateStatus = (item) => {
  // 如果扩展当前是启用的，检查是否可以禁用
  if (item.enabled) {
    return item.mayDisable === true
  }

  // 如果扩展当前是禁用的，检查是否可以启用
  if (!item.enabled) {
    return item.mayEnable === true
  }

  return false
}

// 判断扩展是否可操作
const isExtensionOperable = (extension) => {
  return getExtensionOperateStatus(extension)
}

// 方法 - 使用chrome.storage.sync + localStorage双重保存
// 简单的localStorage保存
const saveFavorites = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds.value))
    console.log('保存常用扩展成功:', favoriteIds.value)
  } catch (error) {
    console.error('保存常用扩展失败:', error)
  }
}

// 简单的localStorage加载
const loadFavorites = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      favoriteIds.value = JSON.parse(stored)
      console.log('加载常用扩展成功:', favoriteIds.value)
    }
  } catch (error) {
    console.error('加载常用扩展失败:', error)
    favoriteIds.value = []
  }
}

const isFavorite = (extensionId) => {
  return favoriteIds.value.includes(extensionId)
}

const addFavorite = (extensionId) => {
  if (!isFavorite(extensionId)) {
    console.log(`添加常用扩展: ${extensionId}`)
    favoriteIds.value.push(extensionId)
    saveFavorites()
    console.log(`添加后的常用扩展列表:`, favoriteIds.value)
  }
}

const removeFavorite = (extensionId) => {
  const index = favoriteIds.value.indexOf(extensionId)
  if (index > -1) {
    console.log(`移除常用扩展: ${extensionId}`)
    favoriteIds.value.splice(index, 1)
    saveFavorites()
    console.log(`移除后的常用扩展列表:`, favoriteIds.value)
  }
}

const toggleFavorite = (extensionId) => {
  // 查找扩展对象，检查是否可操作
  const extension = props.extensions.find((ext) => ext.id === extensionId)
  if (!extension || !isExtensionOperable(extension)) {
    return // 不可操作的扩展不能添加到常用
  }

  if (isFavorite(extensionId)) {
    removeFavorite(extensionId)
  } else {
    addFavorite(extensionId)
  }
}

const getExtensionIcon = (extension) => {
  if (extension.icons && extension.icons.length > 0) {
    // 优先选择48x48的图标，如果没有则选择最大的
    const icon48 = extension.icons.find((icon) => icon.size === 48)
    if (icon48) return icon48.url

    const icon32 = extension.icons.find((icon) => icon.size === 32)
    if (icon32) return icon32.url

    const icon16 = extension.icons.find((icon) => icon.size === 16)
    if (icon16) return icon16.url

    // 如果都没有，返回最后一个
    return extension.icons[extension.icons.length - 1].url
  }

  // 如果没有图标，返回默认图标
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iIzU5ODhkYSIvPgo8cGF0aCBkPSJNMjQgMTJMMzIuNDg1MyAyMEgyNC41VjI4TDI0IDI4TDE1LjUxNDcgMjBIMjNWMTJIMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'
}

const handleIconError = (event) => {
  const target = event.target
  target.src =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iIzU5ODhkYSIvPgo8cGF0aCBkPSJNMjQgMTJMMzIuNDg1MyAyMEgyNC41VjI4TDI0IDI4TDE1LjUxNDcgMjBIMjNWMTJIMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K'
}

// 生命周期
onMounted(() => {
  console.log('ExtensionIcons组件挂载')
  loadFavorites()
})
</script>

<style lang="scss" scoped>
@use "./index.scss" as *;
</style> 