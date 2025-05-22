<script setup>
// --- 模块导入 ---
import AddCustomer from "@/views/Custom_Manage/AddCustomer.vue";
import ListCustomer from "@/views/Custom_Manage/ListCustomer.vue";
import AddSellJh from "@/views/Custom_Manage/AddSellJh.vue";
import ListSellJh from "@/views/Custom_Manage/ListSellJh.vue";
import ListCustOrder from "@/views/Custom_Manage/ListCustOrder.vue";
import ListAfterSale from "@/views/Custom_Manage/ListAfterSale.vue";
import AddMenus from "@/views/Sys_Manage/AddMenus.vue";
import RolerManager from "@/views/Sys_Manage/RolerManager.vue";
import UserManager from "@/views/Sys_Manage/UserManager.vue";
import emitter from "@/eventBus";

// Vue核心
import { computed, onMounted, ref, watch, onBeforeUnmount } from "vue";
import { markRaw, shallowRef } from "vue";

// Element Plus 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

// API 服务
import { appApi } from '@/api/app';

// --- 组件映射与状态定义 ---
const viewComponents = {
  addCustomer: markRaw(AddCustomer),
  listCustomer: markRaw(ListCustomer),
  listAfterSale: markRaw(ListAfterSale),
  listCustOrder: markRaw(ListCustOrder),
  addSellJh: markRaw(AddSellJh),
  addMenus: markRaw(AddMenus),
  listSellJh: markRaw(ListSellJh),
  rolerManager: markRaw(RolerManager),
  userManager: markRaw(UserManager)
};

const views = [
  viewComponents.addCustomer,
  viewComponents.listCustomer,
  viewComponents.listAfterSale,
  viewComponents.listCustOrder,
  viewComponents.addSellJh,
  viewComponents.listSellJh,
  ,
  ,
  viewComponents.addMenus,
  viewComponents.userManager,
  viewComponents.rolerManager,
];

const currentComponent = shallowRef(views[0]);
const currentComponentIndex = ref(0);
const menus = ref([]);
const isLoading = ref(false);
const error = ref(null);

// 图标映射函数
const getIcon = (iconName) => {
  // 如果没有图标名称，返回默认图标
  if (!iconName) return ElementPlusIconsVue.Document;
  
  // 尝试获取图标组件
  const icon = ElementPlusIconsVue[iconName];
  
  // 如果图标存在则返回，否则返回默认图标
  return icon || ElementPlusIconsVue.Document;
};

// --- 方法定义 ---
const handlerSelect = async (index) => {
  try {
    error.value = null;
    const response = await appApi.getComponentIndex(index);
    const compIndex = response.data;
    if (compIndex >= 0 && compIndex < views.length) {
      currentComponentIndex.value = compIndex;
      currentComponent.value = views[compIndex];
    } else {
      console.warn(`Invalid component index received: ${compIndex}`);
      error.value = '无法加载请求的组件';
    }
  } catch (err) {
    console.error('Failed to fetch component index:', err);
    error.value = '加载组件失败，请稍后再试';
  }
};

const fetchMenus = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await appApi.getMenus();
    menus.value = response.data;
    isLoading.value = false;
  } catch (err) {
    console.error('Failed to fetch menus:', err);
    error.value = '加载菜单失败，请刷新页面重试';
    menus.value = []; // 清空旧菜单，避免显示错误数据
    isLoading.value = false;
  }
};

const hasMenus = computed(() => menus.value && menus.value.length > 0);

watch(error, (newError) => {
  if (newError) {
    setTimeout(() => {
      error.value = null;
    }, 5000);
  }
});

// 定义默认展开的菜单项
const defaultOpeneds = computed(() => {
  // 当 menus 更新时，这个计算属性会自动重新计算
  return menus.value.map(menu => menu.id.toString());
});

// --- 事件处理函数，用于响应菜单结构变化 ---
const handleMenuStructureChanged = () => {
  fetchMenus(); // 重新获取菜单
};

onMounted(() => {
  fetchMenus(); // 页面加载时获取菜单
  emitter.on('menu-structure-changed', handleMenuStructureChanged); // <--- 监听事件
});

onBeforeUnmount(() => {
  emitter.off('menu-structure-changed', handleMenuStructureChanged); // <--- 组件卸载前移除监听器，防止内存泄漏
});
</script>

<template>
  <div class="app-container">
    <el-container class="main-container">
      <!-- 顶部Header区域 -->
      <el-header class="app-header">
        <div class="header-content">
          <el-icon class="header-icon"><component :is="ElementPlusIconsVue.HomeFilled" /></el-icon>
          <h1 class="app-title">ERP管理系统</h1>
          <span class="app-subtitle">ikun小组</span>
        </div>
      </el-header>

      <el-container class="content-container">
        <!-- 左侧Aside区域 (导航菜单) -->
        <el-aside width="240px" class="app-sidebar">
          <div class="menu-header">
            <el-icon><component :is="ElementPlusIconsVue.Menu" /></el-icon>
            系统菜单
          </div>

          <!-- 加载状态 -->
          <el-skeleton :loading="isLoading && !hasMenus" animated :count="3" v-if="isLoading && !hasMenus">
            <template #template>
              <div style="padding: 12px">
                <el-skeleton-item variant="text" style="width: 90%" />
                <div style="margin-left: 24px; margin-top: 12px">
                  <el-skeleton-item variant="text" style="width: 80%" />
                  <el-skeleton-item variant="text" style="width: 80%; margin-top: 8px" />
                </div>
              </div>
            </template>
          </el-skeleton>

          <!-- 错误提示 -->
          <el-alert v-if="error && !hasMenus" :title="error" type="error" show-icon @close="error = null" />

          <!-- 菜单内容 -->
          <el-menu class="app-menu" @select="handlerSelect" v-if="hasMenus" :default-active="'1'" unique-opened :default-openeds="defaultOpeneds">
            <el-sub-menu v-for="menu in menus" :key="menu.id" :index="menu.id.toString()">
              <template #title>
                <el-icon>
                  <!-- 动态渲染主菜单图标 -->
                  <component :is="getIcon(menu.iconName)" />
                </el-icon>
                <span>{{ menu.label }}</span>
              </template>
              <el-menu-item v-for="subMenu in menu.subMenu" :key="subMenu.id" :index="subMenu.id.toString()">
                <el-icon>
                  <!-- 动态渲染子菜单图标 -->
                  <component :is="getIcon(subMenu.iconName)" />
                </el-icon>
                <span>{{ subMenu.label }}</span>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>

          <!-- 空菜单提示 -->
          <el-empty v-if="!isLoading && hasMenus === false && !error" description="暂无菜单数据">
            <el-button type="primary" :icon="Refresh" @click="fetchMenus">刷新</el-button>
          </el-empty>
        </el-aside>

        <!-- 主内容区域 -->
        <el-main class="app-main">
          <!-- 加载状态 -->
          <div v-if="isLoading" class="loading-overlay">
            <el-skeleton animated :rows="8" />
          </div>

          <!-- 错误提示 -->
          <el-alert v-if="error && currentComponent.value" :title="error" type="error" show-icon
            style="margin-bottom: 16px" @close="error = null" />

          <!-- 动态组件渲染 -->
          <div class="component-container">
            <keep-alive>
              <component :is="currentComponent"></component>
            </keep-alive>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
/* 全局布局 */
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f2f5;
}

.main-container {
  height: 100%;
  overflow: hidden;
}

.content-container {
  height: calc(100vh - 64px);
}

/* 头部样式 */
.app-header {
  height: 64px;
  background: linear-gradient(90deg, #2b5aff, #409eff);
  color: #ffffff;
  display: flex;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  font-size: 24px;
}

.app-title {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.app-subtitle {
  font-size: 0.95rem;
  font-weight: 400;
  opacity: 0.85;
}

/* 侧边栏样式 */
.app-sidebar {
  background-color: #ffffff;
  border-right: 1px solid #e8ecef;
  overflow-y: auto;
  height: 100%;
  transition: width 0.3s ease;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.app-sidebar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
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

.app-menu :deep(.el-sub-menu__title),
.app-menu :deep(.el-menu-item) {
  color: #303133;
  font-size: 0.95rem;
}

.app-menu :deep(.el-sub-menu__title:hover),
.app-menu :deep(.el-menu-item:hover) {
  background-color: #e6f0ff;
  color: #2b5aff;
}

.app-menu :deep(.el-menu-item.is-active) {
  background-color: #e6f0ff;
  color: #2b5aff;
  font-weight: 500;
}

/* 主内容区域 */
.app-main {
  background-color: #ffffff;
  padding: 24px;
  overflow-y: auto;
  height: 100%;
  position: relative;
  border-radius: 8px;
  margin: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.app-main::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.95);
  z-index: 10;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 组件容器 */
.component-container {
  width: 100%;
  height: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .app-sidebar {
    width: 200px !important;
  }

  .app-header {
    padding: 0 16px;
  }

  .app-title {
    font-size: 1.3rem;
  }

  .app-main {
    margin: 8px;
    padding: 16px;
  }
}
</style>