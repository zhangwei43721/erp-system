<script setup>
import { defineProps, defineEmits } from 'vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { Refresh } from '@element-plus/icons-vue'

const props = defineProps({
  menus: Array,
  activeMenuId: String,
  isLoading: Boolean,
  error: String,
  hasMenus: Boolean
})

const emit = defineEmits(['select'])

// 预定义图标映射提高性能
const iconCache = new Map()
const getIcon = (iconName) => {
  if (!iconName) return ElementPlusIconsVue.Document
  if (iconCache.has(iconName)) return iconCache.get(iconName)
  
  const icon = ElementPlusIconsVue[iconName] || ElementPlusIconsVue.Document
  iconCache.set(iconName, icon)
  return icon
}

const handleSelect = (index) => {
  emit('select', index)
}
</script>

<template>
  <el-aside class="app-sidebar" width="240px">
    <div class="menu-header">
      <el-icon>
        <component :is="ElementPlusIconsVue.Menu" />
      </el-icon>
      系统菜单
    </div>

    <!-- 加载状态 -->
    <el-skeleton v-if="isLoading && !hasMenus" :count="3" animated>
      <template #template>
        <div style="padding: 12px">
          <el-skeleton-item style="width: 90%" variant="text" />
          <div style="margin-left: 24px; margin-top: 12px">
            <el-skeleton-item style="width: 80%" variant="text" />
            <el-skeleton-item style="width: 80%; margin-top: 8px" variant="text" />
          </div>
        </div>
      </template>
    </el-skeleton>

    <!-- 错误提示 -->
    <el-alert 
      v-if="error && !hasMenus" 
      :title="error" 
      show-icon 
      type="error" 
      @close="$emit('clear-error')" 
    />

    <!-- 菜单内容 -->
    <el-menu 
      v-if="hasMenus"
      :default-active="activeMenuId"
      class="app-menu"
      unique-opened
      @select="handleSelect"
    >
      <el-sub-menu 
        v-for="menu in menus" 
        :key="menu.id" 
        :index="menu.id.toString()"
      >
        <template #title>
          <el-icon>
            <component :is="getIcon(menu.iconName)" />
          </el-icon>
          <span>{{ menu.label }}</span>
        </template>
        <el-menu-item 
          v-for="subMenu in menu.subMenu" 
          :key="subMenu.id" 
          :index="subMenu.id.toString()"
        >
          <el-icon>
            <component :is="getIcon(subMenu.iconName)" />
          </el-icon>
          <span>{{ subMenu.label }}</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>

    <!-- 空菜单提示 -->
    <el-empty v-if="!isLoading && !hasMenus && !error" description="暂无菜单数据">
      <el-button :icon="Refresh" type="primary" @click="$emit('refresh')">刷新</el-button>
    </el-empty>
  </el-aside>
</template>

<style scoped>
.app-sidebar {
  background-color: #ffffff;
  border-right: 1px solid #e8ecef;
  overflow-y: auto;
  height: 100%;
  transition: width 0.3s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  scrollbar-width: none;
}

.app-sidebar::-webkit-scrollbar {
  display: none;
}

.menu-header {
  padding: 16px 20px;
  font-weight: 600;
  font-size: 1.15rem;
  color: #303133;
  border-bottom: 1px solid #e8ecef;
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-menu {
  border-right: none;
  background-color: transparent;
}

@media (max-width: 768px) {
  .app-sidebar {
    width: 200px !important;
  }
}
</style>