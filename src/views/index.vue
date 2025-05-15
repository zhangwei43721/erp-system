<script setup>
// --- 模块导入 ---
import AddCustomer from "@/views/AddCustomer.vue";    // 导入 "添加客户" 视图组件
import ListCustomer from "@/views/ListCustomer.vue";  // 导入 "客户列表" 视图组件
import AddSellJh from "@/views/AddSellJh";            // 导入 "添加销售计划" (或其他类似功能) 视图组件
import ListSellJh from "@/views/ListSellJh";        // 导入 "销售计划列表" 视图组件
import { onMounted, ref } from "vue";                 // onMounted: 生命周期钩子, ref: 创建响应式数据
import axios from "axios";                            // 用于HTTP请求
import { markRaw, shallowRef } from "vue";          // markRaw: 标记对象不需代理, shallowRef: 创建浅层响应式ref

// --- 组件映射与状态定义 ---
// 声明数组保存所有动态组件，按后端component值顺序映射 (markRaw用于性能优化，标记组件不需深度响应)
const views = [
  markRaw(AddCustomer),
  markRaw(ListCustomer),
  markRaw(AddSellJh),
  markRaw(AddSellJh),
  markRaw(AddSellJh),
  markRaw(AddSellJh),
  markRaw(AddSellJh),
  markRaw(ListSellJh),
];

// 当前显示的组件 (shallowRef用于动态组件，只对.value的赋值响应，提高性能)
const currentComponent = shallowRef(views[0]); // 默认显示第一个组件
// 菜单数据 (响应式数组，用于存储从后端获取的菜单项)
const menus = ref([]);

// --- 方法定义 ---
/* el-menu组件选中叶子节点(菜单项)时触发的函数 */
// 参数index：被选中菜单节点的id (由el-menu-item的index属性提供)
const handlerSelect = function (index) {
  console.log("Selected index:", index); // 调试: 打印选中的菜单ID
  // 发起GET请求，根据菜单ID获取对应组件的索引
  axios
    .get("http://localhost:8080/compIndex?id=" + index)
    .then((response) => {
      console.log("Response:", response.data); // 调试: 打印后端返回的组件索引
      const componentIndex = response.data; // 后端返回的组件在views数组中的索引
      // 更新当前要显示的组件
      currentComponent.value = views[componentIndex];
    })
    .catch((error) => {
      console.log("Error:", error); // 捕获并打印请求错误
    });
};

// --- 生命周期钩子 ---
// 组件挂载完成后执行
onMounted(() => {
  // 发起GET请求，获取菜单列表数据
  axios
    .get("http://localhost:8080/listMenus")
    .then((response) => {
      menus.value = response.data; // 将获取到的菜单数据赋值给响应式变量menus
    })
    .catch((error) => {
      console.log(error); // 捕获并打印请求错误
    });
});
</script>

<template>
  <!-- 整体布局容器 (Element Plus el-container) -->
  <div class="common-layout">
    <el-container>
      <!-- 顶部Header区域 -->
      <el-header class="top">ERP-ikun小组</el-header>
      <el-container>
        <!-- 左侧Aside区域 (导航菜单) -->
        <el-aside width="240px" class="left">
          系统菜单
          <!-- Element Plus 垂直导航菜单, @select事件绑定handlerSelect方法 -->
          <el-menu class="el-menu-vertical-demo" @select="handlerSelect">
            <!-- 一级菜单 (el-sub-menu): v-for遍历menus数据, :index作为唯一标识 -->
            <el-sub-menu v-for="menu in menus" :index="menu.id.toString()">
              <!-- #title插槽: 自定义一级菜单标题 -->
              <template #title>
                <span>{{ menu.label }}</span>
              </template>
              <!-- 二级菜单项 (el-menu-item): v-for遍历一级菜单的subMenu, :index作为唯一标识 -->
              <el-menu-item
                v-for="subMenu in menu.subMenu"
                :index="subMenu.id.toString()"
              >
                {{ subMenu.label }}
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <!-- 主内容区域 (el-main) -->
        <el-main class="right">
          <!-- 动态组件渲染: :is属性绑定到currentComponent, 用于切换不同视图组件 -->
          <component :is="currentComponent"></component>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped> /* scoped样式: CSS只作用于当前组件 */
.top {
  background-color: azure;
}
.left {
  background-color: blanchedalmond;
  height: 600px; /* 固定左侧菜单高度 */
}
.right {
  background-color: cornsilk;
}
</style>