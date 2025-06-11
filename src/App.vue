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
import StockStatistics from "@/views/statistics/YearMonthCount.vue";
import CategoryManager from "@/views/commodity/CategoryManager.vue";
import ItemManager from "./views/commodity/ItemManager.vue";
import BuyListManager from "./views/commodity/BuyListManager.vue";
import InStoreList from "./views/commodity/InStoreList.vue";
import ListOutStore from "./views/commodity/ListOutStore.vue";
import ListStore from "./views/commodity/ListStore.vue";
import CustomerArea from "./views/statistics/CustomerArea.vue";
import EmployeeCount from "./views/statistics/EmployeeCount.vue";
import AfterSaleCount from "@/views/statistics/AfterSaleCount.vue";
import YearNumCount from "./views/statistics/YearNumCount.vue";

// 导入新创建的组件和组合式函数
import SidebarMenu from "@/components/layout/SidebarMenu.vue";
import useMenu from "@/composables/useMenu";
import { onMounted, shallowRef, ref, computed } from "vue";
import { useRoute } from 'vue-router'

// API 服务
import { appApi } from '@/api/app';

// --- 组件映射与状态定义 ---
const viewComponents = {
  addCustomer: AddCustomer,
  listCustomer: ListCustomer,
  listAfterSale: ListAfterSale,
  listCustOrder: ListCustOrder,
  addSellJh: AddSellJh,
  addMenus: AddMenus,
  listSellJh: ListSellJh,
  rolerManager: RolerManager,
  userManager: UserManager,
  stockStatistics: StockStatistics,
  categoryManager: CategoryManager,
  itemManager: ItemManager,
  buyListManager: BuyListManager,
  inStoreList: InStoreList,
  listOutStore: ListOutStore,
  listStore: ListStore,
  customerArea: CustomerArea,
  employeeCount: EmployeeCount,
  afterSaleCount: AfterSaleCount,
  yearNumCount: YearNumCount
};

const views = [
  /* 0 */ viewComponents.addCustomer,       // 客户管理 -> 添加客户 (component=0)
  /* 1 */ viewComponents.listCustomer,      // 客户管理 -> 查询客户 (component=1)
  /* 2 */ viewComponents.listAfterSale,     // 客户管理 -> 售后服务 (component=2)
  /* 3 */ viewComponents.listCustOrder,     // 客户管理 -> 客户订单 (component=3)
  /* 4 */ viewComponents.addSellJh,         // 客户管理 -> 销售过程 (component=4)
  /* 5 */ viewComponents.customerArea,      // 数据统计 -> 客户地区分布 (component=5)
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
  /* 19 */ viewComponents.listStore,        // 商品管理 -> 仓库列表 (component=19)
  /* 20 */ viewComponents.employeeCount,     // 数据统计 -> 员工信息统计 (component=20)
  /* 21 */ viewComponents.afterSaleCount,     // 数据统计 -> 售后服务统计 (component=21)
  /* 22 */ viewComponents.yearNumCount        // 数据统计 -> 年度数量统计 (component=22)
];

const currentComponent = shallowRef(null);
const error = ref(null);
const route = useRoute()

// 使用菜单组合式函数
const {
  menus,
  isLoading,
  activeMenuId,
  hasMenus,
  setActiveMenu,
  initializeMenu
} = useMenu();

// 计算属性：判断当前是否是认证页面（登录/注册）
const isAuthPage = computed(() => {
  return route.path === '/login' || route.path === '/register'
})

// --- 方法定义 ---
const handlerSelect = async (menuId) => {
  error.value = null;
  try {
    const response = await appApi.getComponentIndex(menuId);
    const compIndex = response.data;
    
    if (compIndex >= 0 && compIndex < views.length && views[compIndex]) {
      currentComponent.value = views[compIndex];
      setActiveMenu(menuId);
    } else {
      currentComponent.value = null;
      error.value = `无法找到与菜单ID ${menuId} 对应的组件。`;
      console.warn(`Invalid component index for menuId: ${menuId}, compIndex: ${compIndex}`);
    }
  } catch (err) {
    currentComponent.value = null;
    error.value = `加载菜单ID ${menuId} 对应的组件失败。`;
    console.error(`Failed to fetch component index for menuId ${menuId}:`, err);
  }
};

onMounted(async () => {
  const initialMenuId = await initializeMenu();
  if (initialMenuId) {
    await handlerSelect(initialMenuId);
  }
});
</script>

<template>
  <div class="app-container">
    <div v-if="isAuthPage">
      <router-view></router-view>
    </div>
    
    <!-- 主应用布局 -->
    <el-container v-else class="main-container">

      <!-- 顶部Header区域 -->
      <el-header class="app-header">
        <div class="header-content">
          <el-icon class="header-icon">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
              <path d="M946.5 505L534.6 93.4a31.93 31.93 0 0 0-45.2 0L77.5 505c-12 12-18.8 28.3-18.8 45.3 0 35.3 28.7 64 64 64h43.4V908c0 17.7 14.3 32 32 32H448V716h112v224h265.9c17.7 0 32-14.3 32-32V614.3h43.4c17 0 33.3-6.7 45.3-18.8 24.9-25 24.9-65.5-.1-90.5z" fill="currentColor"/>
            </svg>
          </el-icon>
          <h1 class="app-title">ERP管理系统</h1>
          <span class="app-subtitle">ikun小组</span>
        </div>
      </el-header>

      <el-container class="content-container">
        <!-- 使用新的侧边栏组件 -->
        <SidebarMenu
          :menus="menus"
          :activeMenuId="activeMenuId"
          :isLoading="isLoading"
          :error="error"
          :hasMenus="hasMenus"
          @select="handlerSelect"
          @refresh="initializeMenu"
          @clear-error="error = null"
        />

        <!-- 主内容区域 -->
        <el-main class="app-main">
          <!-- 加载状态 -->
          <div v-if="isLoading" class="loading-overlay">
            <el-skeleton :rows="8" animated />
          </div>

          <!-- 错误提示 -->
          <el-alert
            v-if="error && currentComponent"
            :title="error"
            show-icon
            style="margin-bottom: 16px"
            type="error"
            @close="error = null"
          />

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
  display: flex;
  align-items: center;
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
  -ms-overflow-style: none;
}

.app-main::-webkit-scrollbar {
  display: none;
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