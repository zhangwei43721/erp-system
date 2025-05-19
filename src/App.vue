<script setup>
// --- 模块导入 ---
// 视图组件
import AddCustomer from "@/views/AddCustomer.vue";
import ListCustomer from "@/views/ListCustomer.vue";
import AddSellJh from "@/views/AddSellJh.vue";  // 修正扩展名
import ListSellJh from "@/views/ListSellJh.vue";  // 修正扩展名
import ListCustOrder from "@/views/ListCustOrder.vue";  // 统一使用@别名
import ListAfterSale from "@/views/ListAfterSale.vue";

// Vue核心
import { computed, onMounted, ref, watch } from "vue";
import { markRaw, shallowRef } from "vue";

// HTTP客户端
import axios from "axios";

// API基础URL
const API_BASE_URL = 'http://localhost:8080';

// --- 组件映射与状态定义 ---
// 视图组件映射表 - 使用对象形式便于维护和查找
const viewComponents = {
  addCustomer: markRaw(AddCustomer),
  listCustomer: markRaw(ListCustomer),
  listAfterSale: markRaw(ListAfterSale),
  listCustOrder: markRaw(ListCustOrder),
  addSellJh: markRaw(AddSellJh),
  listSellJh: markRaw(ListSellJh)
};

// 组件索引数组 - 保持与后端返回的索引对应
const views = [
  viewComponents.addCustomer,
  viewComponents.listCustomer,
  viewComponents.listAfterSale,
  viewComponents.listCustOrder,
  viewComponents.addSellJh,
  viewComponents.addSellJh,  // 注意：这里有重复，可能是后端映射问题
  viewComponents.addSellJh,  // 注意：这里有重复，可能是后端映射问题
  viewComponents.listSellJh,
];

// 应用状态
const currentComponent = shallowRef(views[0]);
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
    isLoading.value = true;
    error.value = null;

    // 发起GET请求，根据菜单ID获取对应组件的索引
    const response = await axios.get(`${API_BASE_URL}/compIndex`, {
      params: { id: index },
      timeout: 5000 // 设置超时时间
    });

    const componentIndex = response.data;

    // 验证返回的索引是否有效
    if (componentIndex >= 0 && componentIndex < views.length) {
      currentComponent.value = views[componentIndex];
    } else {
      console.warn(`Invalid component index received: ${componentIndex}`);
      error.value = '无法加载请求的组件';
    }
  } catch (err) {
    console.error('Failed to fetch component index:', err);
    error.value = '加载组件失败，请稍后再试';
  } finally {
    isLoading.value = false;
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
  } catch (err) {
    console.error('Failed to fetch menus:', err);
    error.value = '加载菜单失败，请刷新页面重试';
    menus.value = []; // 确保在出错时有一个有效的空数组
  } finally {
    isLoading.value = false;
  }
};

// --- 计算属性 ---
/**
 * 检查菜单是否为空
 */
const hasMenus = computed(() => menus.value && menus.value.length > 0);

// --- 监听器 ---
/**
 * 监听错误状态，可用于自动清除错误
 */
watch(error, (newError) => {
  if (newError) {
    // 5秒后自动清除错误信息
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
          <div v-if="isLoading && !currentComponent.value" class="loading-container">
            <el-skeleton animated :rows="10" />
          </div>

          <!-- 错误提示 -->
          <el-alert v-if="error && currentComponent.value" :title="error" type="error" show-icon
            style="margin-bottom: 15px" @close="error = null" />

          <!-- 动态组件渲染 -->
          <keep-alive>
            <component :is="currentComponent"></component>
          </keep-alive>
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
}

/* 加载状态 */
.loading-container {
  padding: 20px;
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