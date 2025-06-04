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
import StockStatistics from "@/views/statistics/StockStatistics.vue";
import CategoryManager from "@/views/commodity/CategoryManager.vue";
import ItemManager from "./views/commodity/ItemManager.vue";
import BuyListManager from "./views/commodity/BuyListManager.vue";
import InStoreList from "./views/commodity/InStoreList.vue";
import ListOutStore from "./views/commodity/ListOutStore.vue";
import ListStore from "./views/commodity/ListStore.vue";
import CustomerArea from "./views/statistics/CustomerArea.vue";

import emitter from "@/eventBus";

// Vue核心
import { computed, markRaw, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";

// Element Plus 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { Refresh } from '@element-plus/icons-vue';

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
  userManager: markRaw(UserManager),
  stockStatistics: markRaw(StockStatistics),
  categoryManager: markRaw(CategoryManager),
  itemManager: markRaw(ItemManager),
  buyListManager: markRaw(BuyListManager),
  inStoreList: markRaw(InStoreList),
  listOutStore: markRaw(ListOutStore),
  listStore: markRaw(ListStore),
  customerArea: markRaw(CustomerArea),
};

const views = [
  /* 0 */ viewComponents.addCustomer,       // 客户管理 -> 添加客户 (component=0)
  /* 1 */ viewComponents.listCustomer,      // 客户管理 -> 查询客户 (component=1)
  /* 2 */ viewComponents.listAfterSale,     // 客户管理 -> 售后服务 (component=2)
  /* 3 */ viewComponents.listCustOrder,     // 客户管理 -> 客户订单 (component=3)
  /* 4 */ viewComponents.addSellJh,         // 客户管理 -> 销售过程 (component=4)
  /* 5 */ viewComponents.customerArea,    // 数据统计 -> 客户地区分布 (component=5)
  /* 6 */ viewComponents.stockStatistics,   // 数据统计 -> 库存统计 (component=6)
  /* 7 */ viewComponents.listSellJh,        // 客户管理 -> 销售过程列表 (component=7)
  /* 8 */ viewComponents.addMenus,          // 系统管理 -> 添加菜单 (component=8)
  /* 9 */ viewComponents.userManager,       // 系统管理 -> 用户管理 (component=9)
  /* 10 */ viewComponents.rolerManager,     // 系统管理 -> 角色管理 (component=10)
  /* 11 */ null,
  /* 12 */ null,
  /* 13 */ null,
  /* 14 */ viewComponents.categoryManager,  // 商品管理 -> 商品分类 (component=14)
  /* 15 */ viewComponents.itemManager,      // 商品管理 -> 商品入库 (component=15)
  /* 19 */ viewComponents.listOutStore,     // 商品管理 -> 出库列表 (component=19)
  /* 17 */ viewComponents.buyListManager,   // 商品管理 -> 采购单管理 (component=17)
  /* 18 */ viewComponents.inStoreList,      // 商品管理 -> 入库列表 (component=18)
  /* 20 */ viewComponents.listStore,        // 商品管理 -> 仓库列表 (component=20)
];

const currentComponent = shallowRef(null); // 修改初始值，等待 onMounted 中恢复或设置
const activeMenuId = ref(null); // 新增：用于存储当前激活的菜单ID，并绑定到 el-menu 的 default-active
const menus = ref([]);
const isLoading = ref(false);
const error = ref(null);

// --- 辅助函数 ---
const findMenuById = (menusToSearch, id) => {
  if (!id || !menusToSearch) return null;
  for (const menu of menusToSearch) {
    if (menu.subMenu) {
      for (const sub of menu.subMenu) {
        if (sub.id.toString() === id) return sub;
      }
    }
  }
  return null;
};

const getFirstAvailableSubMenuId = (menusToSearch) => {
  if (menusToSearch && menusToSearch.length > 0) {
    for (const menu of menusToSearch) {
      if (menu.subMenu && menu.subMenu.length > 0 && menu.subMenu[0].id != null) {
        return menu.subMenu[0].id.toString();
      }
    }
  }
  return null;
};

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
const handlerSelect = async (index) => { // index is menu id string
  error.value = null;
  try {
    const response = await appApi.getComponentIndex(index); // index is the menu item's ID
    const compIndex = response.data;
    if (compIndex >= 0 && compIndex < views.length && views[compIndex]) {
      currentComponent.value = views[compIndex];
      localStorage.setItem('selectedMenuId', index); // 保存选择到 localStorage
      activeMenuId.value = index; // 更新激活的菜单ID
    } else {
      currentComponent.value = null; // 清除组件
      error.value = `无法找到与菜单ID ${index} 对应的组件。`;
      console.warn(`Invalid component index or component not found for menuId: ${index}, compIndex: ${compIndex}`);
    }
  } catch (err) {
    currentComponent.value = null; // 清除组件
    error.value = `加载菜单ID ${index} 对应的组件失败。`;
    console.error(`Failed to fetch component index for menuId ${index}:`, err);
  }
};

const fetchMenus = async () => {
  isLoading.value = true; // 开始加载菜单
  error.value = null;
  try {
    const response = await appApi.getMenus();
    menus.value = response.data;
  } catch (err) {
    console.error('Failed to fetch menus:', err);
    error.value = '加载菜单失败，请刷新页面重试';
    menus.value = []; // 清空旧菜单，避免显示错误数据
  } finally {
    isLoading.value = false; // 加载菜单结束
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
  emitter.on('menu-structure-changed', handleMenuStructureChanged);

  const initializeApp = async () => {
    await fetchMenus(); // 等待菜单加载完成

    let initialMenuIdToLoad = null;
    const savedMenuId = localStorage.getItem('selectedMenuId');

    // 只有当菜单加载成功 (menus.value 有内容) 才尝试恢复或选择默认
    if (menus.value && menus.value.length > 0) {
      if (savedMenuId) {
        const menuItem = findMenuById(menus.value, savedMenuId);
        if (menuItem) {
          initialMenuIdToLoad = savedMenuId;
        } else {
          localStorage.removeItem('selectedMenuId'); // 无效的 ID，清除
        }
      }

      // 如果没有从 localStorage 加载，则加载第一个可用的子菜单
      if (!initialMenuIdToLoad) {
        initialMenuIdToLoad = getFirstAvailableSubMenuId(menus.value);
      }
    } // else: 菜单为空或加载失败，initialMenuIdToLoad 保持 null

    if (initialMenuIdToLoad) {
      activeMenuId.value = initialMenuIdToLoad;
      await handlerSelect(initialMenuIdToLoad); // handlerSelect 会处理组件加载的 isLoading
    } else {
      // 没有菜单项可加载 (例如，菜单为空，或第一个菜单项也无法确定)
      currentComponent.value = null;
      activeMenuId.value = null;
    }
  };

  initializeApp();
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
          <el-icon class="header-icon">
            <component :is="ElementPlusIconsVue.HomeFilled" />
          </el-icon>
          <h1 class="app-title">ERP管理系统</h1>
          <span class="app-subtitle">ikun小组</span>
        </div>
      </el-header>

      <el-container class="content-container">
        <!-- 左侧Aside区域 (导航菜单) -->
        <el-aside class="app-sidebar" width="240px">
          <div class="menu-header">
            <el-icon>
              <component :is="ElementPlusIconsVue.Menu" />
            </el-icon>
            系统菜单
          </div>

          <!-- 加载状态 -->
          <el-skeleton v-if="isLoading && !hasMenus" :count="3" :loading="isLoading && !hasMenus" animated>
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
          <el-alert v-if="error && !hasMenus" :title="error" show-icon type="error" @close="error = null" />

          <!-- 菜单内容 -->
          <el-menu v-if="hasMenus" :default-active="activeMenuId" :default-openeds="defaultOpeneds" class="app-menu"
            unique-opened @select="handlerSelect">
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
            <el-button :icon="Refresh" type="primary" @click="fetchMenus">刷新</el-button>
          </el-empty>
        </el-aside>

        <!-- 主内容区域 -->
        <el-main class="app-main">
          <!-- 加载状态 -->
          <div v-if="isLoading" class="loading-overlay">
            <el-skeleton :rows="8" animated />
          </div>

          <!-- 错误提示 -->
          <el-alert v-if="error && currentComponent.value" :title="error" show-icon style="margin-bottom: 16px"
            type="error" @close="error = null" />

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
  letter-spacing: 1px;
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
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE and Edge */
}

.app-sidebar::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari, Opera */
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
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE and Edge */
}

.app-main::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari, Opera */
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