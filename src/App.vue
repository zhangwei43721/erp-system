<script setup>
// --- 模块导入 ---
// 视图组件
import AddCustomer from "@/views/AddCustomer.vue";
import ListCustomer from "@/views/ListCustomer.vue";
import AddSellJh from "@/views/AddSellJh.vue";
import ListSellJh from "@/views/ListSellJh.vue";
import ListCustOrder from "@/views/ListCustOrder.vue";
import ListAfterSale from "@/views/ListAfterSale.vue";

// Vue核心
import { computed, onMounted, ref, watch } from "vue";
import { markRaw, shallowRef } from "vue";

// HTTP客户端
import axios from "axios";

// API基础URL
const API_BASE_URL = 'http://localhost:8080';

// --- 组件映射与状态定义 ---
// 视图组件映射表
const viewComponents = {
  addCustomer: markRaw(AddCustomer),
  listCustomer: markRaw(ListCustomer),
  listAfterSale: markRaw(ListAfterSale),
  listCustOrder: markRaw(ListCustOrder),
  addSellJh: markRaw(AddSellJh),
  listSellJh: markRaw(ListSellJh)
};

// 组件索引数组
const views = [
  viewComponents.addCustomer,
  viewComponents.listCustomer,
  viewComponents.listAfterSale,
  viewComponents.listCustOrder,
  viewComponents.addSellJh,
  viewComponents.addSellJh,
  viewComponents.addSellJh,
  viewComponents.listSellJh,
];

// 应用状态
const currentComponent = shallowRef(views[0]);
const currentComponentIndex = ref(0);
const menus = ref([]);
const isLoading = ref(false);
const error = ref(null);

// --- 方法定义 ---
/**
 * 处理菜单选择事件
 * @param {string|number} index - 被选中菜单节点的ID
 */
const handlerSelect = async (index) => {
  try {
    error.value = null;
    const response = await axios.get(`${API_BASE_URL}/compIndex`, {
      params: { id: index },
      timeout: 5000
    });
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

/**
 * 加载菜单数据
 */
const fetchMenus = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    const response = await axios.get(`${API_BASE_URL}/listMenus`, {
      timeout: 5000
    });
    menus.value = response.data;
    isLoading.value = false;
  } catch (err) {
    console.error('Failed to fetch menus:', err);
    error.value = '加载菜单失败，请刷新页面重试';
    menus.value = [];
    isLoading.value = false;
  }
};

// --- 计算属性 ---
const hasMenus = computed(() => menus.value && menus.value.length > 0);

// --- 监听器 ---
watch(error, (newError) => {
  if (newError) {
    setTimeout(() => {
      error.value = null;
    }, 5000);
  }
});

// --- 生命周期钩子 ---
onMounted(() => {
  fetchMenus();
});
</script>

<template>
  <div class="app-container">
    <el-container class="main-container">
      <!-- 顶部Header区域 -->
      <el-header class="app-header">
        <div class="header-content">
          <h1 class="app-title">ERP管理系统</h1>
          <span class="app-subtitle">ikun小组</span>
        </div>
      </el-header>

      <el-container class="content-container">
        <!-- 左侧Aside区域 (导航菜单) -->
        <el-aside width="240px" class="app-sidebar">
          <div class="menu-header">系统菜单</div>

          <!-- 加载状态 -->
          <el-skeleton :loading="isLoading && !hasMenus" animated :count="3" v-if="isLoading && !hasMenus">
            <template #template>
              <div style="padding: 10px">
                <el-skeleton-item variant="text" style="width: 90%" />
                <div style="margin-left: 20px; margin-top: 10px">
                  <el-skeleton-item variant="text" style="width: 80%" />
                  <el-skeleton-item variant="text" style="width: 80%; margin-top: 5px" />
                </div>
              </div>
            </template>
          </el-skeleton>

          <!-- 错误提示 -->
          <el-alert v-if="error && !hasMenus" :title="error" type="error" show-icon @close="error = null" />

          <!-- 菜单内容 -->
          <el-menu class="app-menu" @select="handlerSelect" v-if="hasMenus" :default-active="'1'" unique-opened>
            <el-sub-menu v-for="menu in menus" :key="menu.id" :index="menu.id.toString()">
              <template #title>
                <el-icon>
                  <folder />
                </el-icon>
                <span>{{ menu.label }}</span>
              </template>

              <el-menu-item v-for="subMenu in menu.subMenu" :key="subMenu.id" :index="subMenu.id.toString()">
                <el-icon>
                  <document />
                </el-icon>
                <span>{{ subMenu.label }}</span>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>

          <!-- 空菜单提示 -->
          <el-empty v-if="!isLoading && hasMenus === false && !error" description="暂无菜单数据">
            <el-button type="primary" @click="fetchMenus">刷新</el-button>
          </el-empty>
        </el-aside>

        <!-- 主内容区域 -->
        <el-main class="app-main">
          <!-- 加载状态 -->
          <div v-if="isLoading" class="loading-overlay">
            <el-skeleton animated :rows="10" />
          </div>

          <!-- 错误提示 -->
          <el-alert v-if="error && currentComponent.value" :title="error" type="error" show-icon
            style="margin-bottom: 15px" @close="error = null" />

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
}

.main-container {
  height: 100%;
  overflow: hidden;
}

.content-container {
  height: calc(100vh - 60px);
}

/* 头部样式 */
.app-header {
  height: 60px;
  background-color: #409EFF;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
}

.app-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.app-subtitle {
  margin-left: 10px;
  font-size: 0.9rem;
  opacity: 0.8;
}

/* 侧边栏样式 */
.app-sidebar {
  background-color: #f5f7fa;
  border-right: 1px solid #e6e6e6;
  overflow-y: auto;
  height: 100%;
  transition: width 0.3s;
}

.menu-header {
  padding: 15px;
  font-weight: bold;
  font-size: 1.1rem;
  color: #606266;
  border-bottom: 1px solid #e6e6e6;
}

.app-menu {
  border-right: none;
}

/* 主内容区域 */
.app-main {
  background-color: #f5f7fa;
  padding: 20px;
  overflow-y: auto;
  height: 100%;
  position: relative;
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(245, 247, 250, 0.9);
  z-index: 10;
  padding: 20px;
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
    padding: 0 10px;
  }

  .app-title {
    font-size: 1.2rem;
  }
}
</style>