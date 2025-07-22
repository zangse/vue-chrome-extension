<template>
  <div class="wrapper">
    <div class="header">
      <div class="header-content">
        <span class="tabs">
          <span
            class="iconfont icon extension"
            :class="{ active: currentActive === 1 }"
            @click.stop="setTab(1)"
            >&#xe62b;</span
          >
          <span
            class="iconfont icon link"
            :class="{ active: currentActive === 2 }"
            @click.stop="setTab(2)"
            >&#xe612;</span
          >
        </span>
        <span
          class="switch"
          :class="{ enabled: !disabledAll, disabled: disabledAll }"
          @click.stop="toggleDisable"
          v-if="currentActive === 1"
        >
          <i class="icon-i"></i>
          <i class="icon-o"></i>
          <span
            class="icon-round"
            :class="{ enabled: !disabledAll, disabled: disabledAll }"
          ></span>
        </span>
      </div>
    </div>
    <div class="main-content">
      <ul class="tree-list" v-show="currentActive === 1">
        <TreeItem
          v-for="item in allNodes"
          class="folder-item"
          :extendItem="item"
          :key="item.id"
          @setEnabled="setEnabledHandler"
        />
      </ul>
      <ul class="shortcut-list" v-show="currentActive === 2">
        <li class="list-item">
          <div
            class="item download"
            @click.stop="newTab('chrome://downloads/')"
          >
            <i class="iconfont icon">&#xe60f;</i
            ><span class="title">{{ i18n.downloads }}</span>
          </div>
        </li>
        <li class="list-item">
          <div class="item" @click.stop="newTab('chrome://history/')">
            <i class="iconfont icon">&#xe7d8;</i
            ><span class="title">{{ i18n.history }}</span>
          </div>
        </li>
        <li class="list-item">
          <div class="item" @click.stop="newTab('chrome://extensions/')">
            <i class="iconfont icon">&#xe641;</i
            ><span class="title">{{ i18n.extensions }}</span>
          </div>
        </li>
        <li class="list-item">
          <div class="item" @click.stop="newTab('chrome://settings/')">
            <i class="iconfont icon">&#xe63b;</i
            ><span class="title">{{ i18n.settings }}</span>
          </div>
        </li>
        <li class="list-item">
          <div
            class="item remove"
            @click.stop="newTab('chrome://settings/clearBrowserData')"
          >
            <i class="iconfont icon">&#xe642;</i
            ><span class="title">{{ i18n.clearBrowserData }}</span>
          </div>
        </li>
        <li class="list-item">
          <div
            class="item shop"
            @click.stop="
              newTab('https://chrome.google.com/webstore/category/extensions')
            "
          >
            <i class="iconfont icon">&#xe62f;</i
            ><span class="title">{{ i18n.webstore }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import TreeItem from '../treeitem/treeitem.vue'

// 响应式数据
const allNodes = ref([])
const disabledAll = ref(true)
const selfId = ref(null)
const currentActive = ref(1)

const i18n = reactive({
  downloads: '',
  history: '',
  extensions: '',
  settings: '',
  clearBrowserData: '',
  webstore: '',
})

// 初始化i18n
const initI18n = () => {
  i18n.downloads = chrome.i18n.getMessage('downloads')
  i18n.history = chrome.i18n.getMessage('history')
  i18n.extensions = chrome.i18n.getMessage('extensions')
  i18n.settings = chrome.i18n.getMessage('settings')
  i18n.clearBrowserData = chrome.i18n.getMessage('clearBrowserData')
  i18n.webstore = chrome.i18n.getMessage('webstore')
}

// 获取扩展的操作状态
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

// 获取扩展状态文本
const getExtensionStatusText = (item) => {
  // 管理员安装的扩展
  if (item.installType === 'admin') {
    return '公司管理安装'
  }

  // 策略安装的扩展
  if (item.installType === 'policy') {
    return '策略安装'
  }

  // 系统管理的扩展（不能被用户修改）
  if (!item.mayDisable && !item.mayEnable) {
    return '系统管理'
  }

  if (item.enabled) {
    // 扩展当前已启用
    if (item.mayDisable) {
      return '' // 正常启用状态不显示标签
    } else {
      return '已启用-不可禁用'
    }
  } else {
    // 扩展当前已禁用
    if (item.mayEnable) {
      if (item.disabledReason === 'disable_user_action') {
        return '' // 用户主动禁用也不显示标签
      }
      return '' // 正常禁用状态不显示标签
    } else {
      // 不能启用，显示具体原因
      if (item.disabledReason) {
        const reasonMap = {
          permissions_increase: 'Chrome禁用-权限增加',
          disable_update_required_by_policy: 'Chrome禁用-策略要求',
          disable_extension_with_policy: 'Chrome禁用-策略限制',
          disable_reload: 'Chrome禁用-需重载',
          disable_unsupported_requirement: 'Chrome禁用-不支持',
          disable_sideload_wipeout: 'Chrome禁用-侧载清除',
          disable_unknown_from_sync: 'Chrome禁用-同步错误',
          disable_not_verified: 'Chrome禁用-未验证',
          disable_greylist: 'Chrome禁用-灰名单',
          unknown: 'Chrome禁用-未知原因',
        }
        return reasonMap[item.disabledReason] || 'Chrome禁用'
      }
      return 'Chrome禁用'
    }
  }
}

// 获取扩展排序优先级
const getExtensionSortPriority = (item) => {
  // 1. 已启用且可操作的扩展 (最高优先级)
  if (item.enabled && item.mayDisable) {
    return 1
  }

  // 2. 已禁用但可启用的扩展
  if (!item.enabled && item.mayEnable) {
    return 2
  }

  // 3. 已启用但不可禁用的扩展
  if (item.enabled && !item.mayDisable) {
    return 3
  }

  // 5. 系统管理的扩展（完全不可修改）
  if (!item.mayDisable && !item.mayEnable) {
    return 4
  }

  // 6. Chrome禁用且不可启用的扩展 (最低优先级)
  if (!item.enabled && !item.mayEnable) {
    return 5
  }

  // 4. 管理员或策略安装的扩展（可以卸载但不能启用/禁用）
  if (item.installType === 'admin' || item.installType === 'policy') {
    return 6
  }

  return 7 // 其他情况
}

// 获取自身信息
const getSelfInfo = () => {
  try {
    chrome.management.getSelf((data) => {
      if (chrome.runtime.lastError) {
        console.error('获取扩展信息失败:', chrome.runtime.lastError)
        // 即使获取自身信息失败，也尝试加载所有扩展
        loadAllNodes()
        return
      }
      selfId.value = data.id
      loadAllNodes()
    })
  } catch (error) {
    console.error('调用 chrome.management.getSelf 失败:', error)
    // 如果出错，仍然尝试加载所有扩展
    loadAllNodes()
  }
}

// 加载所有扩展
const loadAllNodes = () => {
  try {
    chrome.management.getAll((data) => {
      if (chrome.runtime.lastError) {
        console.error('获取扩展列表失败:', chrome.runtime.lastError)
        return
      }

      allNodes.value = []
      let nodes = data.filter((item) => {
        // 过滤掉当前扩展（如果有 selfId 的话）
        return !selfId.value || item.id !== selfId.value
      })

      // 为每个扩展添加操作状态信息
      nodes = nodes.map((item) => {
        return {
          ...item,
          isOperatable: getExtensionOperateStatus(item),
          statusText: getExtensionStatusText(item),
          sortPriority: getExtensionSortPriority(item),
        }
      })

      // 按照可操作性排序：可操作的在前，不可操作的在后
      nodes.sort((a, b) => {
        if (a.sortPriority !== b.sortPriority) {
          return a.sortPriority - b.sortPriority
        }
        // 同等级内按名称排序
        return a.name.localeCompare(b.name)
      })

      // 只计算可以修改的扩展的启用状态
      let enabledCount = 0
      let modifiableCount = 0
      nodes.forEach((item) => {
        if (item.isOperatable) {
          modifiableCount++
          if (item.enabled) {
            enabledCount += 1
          }
        }
      })

      // 如果没有可修改的扩展，或者所有可修改的扩展都被禁用，则显示为禁用状态
      disabledAll.value = modifiableCount === 0 || enabledCount === 0
      allNodes.value = nodes
      console.log('加载扩展程序列表:', nodes.length, '个扩展，', modifiableCount, '个可操作')
    })
  } catch (error) {
    console.error('调用 chrome.management.getAll 失败:', error)
  }
}

// 处理扩展状态变化
const setEnabledHandler = () => {
  loadAllNodes()
}

// 切换所有扩展的启用/禁用状态
const toggleDisable = () => {
  if (allNodes.value.length === 0) {
    return
  }

  const newState = disabledAll.value
  let processedCount = 0

  // 只处理可以修改的扩展
  const modifiableExtensions = allNodes.value.filter((item) => item.isOperatable)
  const totalCount = modifiableExtensions.length

  if (totalCount === 0) {
    console.log('没有可以修改的扩展')
    return
  }

  modifiableExtensions.forEach((item) => {
    chrome.management.setEnabled(item.id, newState, () => {
      if (chrome.runtime.lastError) {
        console.error('修改扩展状态失败:', item.name, chrome.runtime.lastError.message)
      }
      processedCount++
      // 当所有扩展都处理完后，重新加载列表
      if (processedCount === totalCount) {
        setTimeout(() => {
          loadAllNodes()
        }, 100)
      }
    })
  })
}

// 设置当前标签页
const setTab = (tab) => {
  currentActive.value = tab
}

// 打开新标签页
const newTab = (url) => {
  if (!url) {
    return
  }
  const newTabData = {
    url: url,
    active: true,
  }
  chrome.tabs.create(newTabData, () => {})
}

// 组件挂载时初始化
onMounted(() => {
  initI18n()
  getSelfInfo()
})
</script>

<style lang="scss" scoped src="./dashboard.scss"></style>